const async = require('async');
const nconf = require('nconf');
const Queue = require('../../../kernel/services/queue');

const newsletterQ = Queue.create('newsletter');
const inviteUser = Queue.create('inviteUser');

newsletterQ.process(async (job, done) => {
  try {
    const data = job.data;
    const query = {};
    if (data.userType && data.userType !== 'newsletter') {
      query.type = data.userType;
    }

    let count = 0;
    const limit = 10;
    const totalUser = data.userType === 'newsletter' ? await DB.Contact.count() : await DB.User.count(query);
    if (!totalUser) {
      return done();
    }

    // async lib does not work with async. await. we must change it!
    return async.during(
      (cb) => cb(null, totalUser > count),
      (cb) => {
        async.waterfall(
          [
            function doQuery(queryCb) {
              if (data.userType === 'newsletter') {
                DB.Contact.find(query).skip(count).limit(limit).exec(queryCb);
              } else {
                DB.User.find(query).skip(count).limit(limit).exec(queryCb);
              }
            }
          ],
          (err, users) => {
            count += limit;
            if (err) {
              return cb(err);
            }

            return Promise.all(
              users.map((user) => Service.Mailer.send('newsletter/default.html', user.email, {
                subject: data.subject,
                // TODO - filter content like replace username, etc...
                content: data.content
              }))
            )
              .then(() => {
                cb();
              })
              .catch(cb);
          }
        );
      },
      () => {
        done();
      }
    );
  } catch (e) {
    return done();
  }
});

exports.sendMail = async (data) => newsletterQ.createJob(data).save();

inviteUser.process((job, done) => {
  try {
    const data = job.data;
    let content = '';
    if (data.type === 'model') {
      content = `Hey! I'm using ${data.siteName}! Nice app to earn real good money without disclosing your personal details. Set up your account now:`;
    } else {
      content = `Hey! I'm using ${data.siteName} and Sexting with different models everyday. Engage in hot and erotic conversation to see webcam models, who'll deeply engaged with you. Set up your account now:`;
    }
    return Promise.all(
      data.emails.map((email) => Service.Mailer.send('invite-user.html', email, {
        subject: 'Invite User',
        content,
        siteName: data.siteName,
        siteUrl: nconf.get('siteUrl')
      }))
    ).then(() => done());
  } catch (e) {
    return done();
  }
});

exports.inviteUser = async (data) => inviteUser.createJob(data).save();
