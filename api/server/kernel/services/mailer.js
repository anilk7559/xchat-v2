const path = require('path');
const nconf = require('nconf');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const { isEmpty } = require('lodash');
const Queue = require('./queue');
const SYSTEM_CONST = require('../../module/system/constants');

const swig = require('./template-engine').getSwigEngine();

const viewsPath = path.join(__dirname, '..', '..', 'emails');
const emailQ = Queue.create('email');

function Mailer(options) {
  this.transport = nodemailer.createTransport(options);
}

Mailer.prototype.render = function render(template, options) {
  return swig.renderFile(path.join(viewsPath, template), options || {});
};

Mailer.prototype.renderFromString = function renderFromString(str, options) {
  return swig.render(str, {
    locals: options || {}
  });
};

Mailer.prototype.send = async function send(opts) {
  try {
    const options = opts || {};
    return this.transport.sendMail(options);
  } catch (e) {
    // TODO - log here
    return console.log('Send mail error', e);
  }
};

function checkSystemConfig(siteName, siteLogo, baseUrl, senderEmail) {
  if (!siteName || !siteName.value) {
    throw new Error('Missing site name!');
  }
  if (!siteLogo || !siteLogo.value) {
    throw new Error('Missing site logo!');
  }
  if (!baseUrl) {
    throw new Error('Missing base url!');
  }
  if (!senderEmail || !senderEmail.value) {
    throw new Error('Missing sender email!');
  }
}
Mailer.prototype.sendMail = async function sendMail(template, emails, options) {
  const siteName = await DB.Config.findOne({ key: SYSTEM_CONST.SITE_NAME });
  const siteLogo = await DB.Config.findOne({ key: SYSTEM_CONST.SITE_LOGO });
  const baseUrl = nconf.get('baseUrl');
  const senderEmail = await DB.Config.findOne({ key: SYSTEM_CONST.SENDER_EMAIL });

  await checkSystemConfig(siteName, siteLogo, baseUrl, senderEmail);

  const newOptions = Object.assign(options, {
    appConfig: {
      baseUrl,
      logoUrl: siteLogo?.value,
      siteName: siteName?.value
    }
  });

  const output = options.renderFromString && options.renderTemplateContent
    ? this.renderFromString(options.renderTemplateContent, newOptions)
    : this.render(template, newOptions);
  const resp = await this.send({
    to: emails,
    from: options.from || senderEmail.value,
    subject: options.subject,
    html: output
  });
  return resp;
};

Mailer.prototype.close = () => this.transport.close();

emailQ.process(async (job, done) => {
  try {
    const smtpInfo = await DB.Config.find({
      group: 'smtp'
    });
    // TODO - fix me
    const empty = smtpInfo.find((info) => isEmpty(info.value));
    if (empty) return;

    const host = smtpInfo.find((info) => info.key === SYSTEM_CONST.SMTP_HOST);
    const port = smtpInfo.find((info) => info.key === SYSTEM_CONST.SMTP_PORT);
    const username = smtpInfo.find((info) => info.key === SYSTEM_CONST.SMTP_USERNAME);
    const password = smtpInfo.find((info) => info.key === SYSTEM_CONST.SMTP_PASSWORD);
    const mailer = new Mailer(smtpTransport({
      host: host.value,
      port: Number(port.value),
      secure: Number(port.value) === 465,
      auth: {
        user: username.value,
        pass: password.value
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
      }
    }));

    await mailer.sendMail(job.data.template, job.data.emails, job.data.options);
  } catch (e) {
    // TODO - log error here
    console.log('Send email error', e);
  }

  done();
});

module.exports = {
  send(template, emails, options) {
    emailQ.createJob({ template, emails, options }).save();
  }
};
