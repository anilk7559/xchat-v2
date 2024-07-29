/* Twilio sms */
const Twilio = require('twilio');
const Queue = require('../../../kernel/services/queue');
const SYSTEM_CONST = require('../../system/constants');

const smsQ = Queue.create('sms');

exports.send = (body) => smsQ.createJob(body).save();

smsQ.process(async (job, done) => {
  try {
    const twillioInfo = await DB.Config.findOne({ key: SYSTEM_CONST.TWILLIO_INFO });
    if (
      !twillioInfo
      || !twillioInfo.value
      || !twillioInfo.value.sid
      || !twillioInfo.value.authToken
      || !twillioInfo.value.phoneNumber
    ) {
      return PopulateResponse.serverError({ msg: 'Missing twillio info!' });
    }
    const client = new Twilio(twillioInfo.value.sid, twillioInfo.value.authToken);
    const body = job.data;
    await client.messages.create({
      body: body.text,
      to: body.to, // Text this number
      from: twillioInfo.value.phoneNumber // From a valid Twilio number
    });
  } catch (e) {
    await Service.Logger.create({
      level: 'error',
      error: e,
      path: 'sms',
      req: {
        body: job.data
      }
    });
  }

  return done();
});
