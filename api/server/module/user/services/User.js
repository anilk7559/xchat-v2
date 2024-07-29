exports.create = async (data) => {
  const user = new DB.User(data);
  let sendMailPw = false;
  const password = Helper.String.randomString(5);
  if (!data.password && data.email && user.provider === 'local') {
    user.password = password;
    sendMailPw = true;
  }

  if (user.type === 'user') {
    user.isApproved = true;
  }

  await user.save();
  if (sendMailPw) {
    await Service.Mailer.send('user/new-password-create.html', user.email, {
      subject: 'New password has been created',
      password
    });
  }

  return user;
};

exports.verifyEmail = async (email, code) => {
  const data = await DB.VerifyCode.findOne({ code, email });
  if (!data) {
    throw new Error('This OTP is incorrect.');
  }
  await DB.User.update({ email }, { $set: { emailVerified: true, isActive: true } });
  await data.remove();
  return true;
};

exports.updateCompletedProfile = async (data) => {
  const user = await DB.User.findOne({ _id: data._id });
  if (!user.isCompletedProfile && user.username && user.bio && user.gender) {
    user.isCompletedProfile = true;
    if (user.type === 'user') {
      user.isApproved = true; // ? auto approve user account
    }
    await user.save();
    await Service.Socket.emitToUsers(user._id, 'update_completed_profile', { isCompletedProfile: true });
  }

  return { success: user.isCompletedProfile };
};

exports.increaseBalance = async (userId, increaseVal = 1) => {
  await DB.User.updateOne({ _id: userId }, {
    $inc: {
      balance: increaseVal
    }
  });

  // TODO - fire update balance event here?
  const newData = await DB.User.findOne({ _id: userId });
  await Service.Socket.emitToUsers(userId, 'balance_updated', {
    balance: newData.balance
  });
};

exports.totalFans = async (params = {}) => {
  const query = {
    ...params,
    type: 'user'
  };

  return DB.User.countDocuments(query);
};

exports.totalModels = async (params = {}) => {
  const query = {
    ...params,
    type: 'model'
  };

  return DB.User.countDocuments(query);
};

exports.countByQuery = async (query) => DB.User.countDocuments(query);

exports.totalPendingModels = async (params = {}) => {
  const query = {
    ...params,
    isApproved: false,
    type: 'model'
  };

  return DB.User.countDocuments(query);
};
