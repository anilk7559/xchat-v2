const path = require('path');
const config = require('./config');
const Queue = require('../../kernel/services/queue');

const mediaQ = Queue.create(`media_${process.env.LOCAL_ID}`);
const Video = require('./components/video');

mediaQ.process(async (job, done) => {
  const data = job.data.data;
  const command = job.data.command;
  try {
    if (command === 'convert-mp4') {
      const canPlay = await Video.canPlayInBrowser(data.filePath);
      if (!canPlay) {
        await DB.Media.update({ _id: data.mediaId }, { $set: { convertStatus: 'processing' } });
        const convertFileName = await Video.toMp4({ filePath: data.filePath });
        const thumbPath = await Video.getScreenshot({
          filePath: data.filePath,
          imageTempFolder: config.photoDir
        });
        await DB.Media.update(
          { _id: data.mediaId },
          {
            $set: {
              filePath: path.join(config.protectVideoDir, convertFileName),
              mimeType: 'video/mp4',
              convertStatus: 'done',
              thumbPath
            }
          }
        );
        // TODO - remove original file
      } else {
        const thumbPath = await Video.getScreenshot({
          filePath: data.filePath,
          imageTempFolder: config.photoDir
        });
        await DB.Media.update({ _id: data.mediaId }, { $set: { convertStatus: 'done', thumbPath } });
      }
    }

    done();
  } catch (e) {
    if (command === 'convert-mp4') {
      await DB.Media.update({ _id: data.mediaId }, { $set: { convertStatus: 'failed' } });
    }
    await Service.Logger.create({
      level: 'error',
      error: e,
      path: 'media-error'
    });
    done();
  }
});

exports.convertVideo = async (video) => mediaQ
  .createJob({
    command: 'convert-mp4',
    data: {
      _id: video._id,
      type: 'video',
      mediaId: video._id,
      filePath: video.filePath,
      originalPath: video.originalPath,
      uploaded: video.uploaded
    }
  })
  .save();
