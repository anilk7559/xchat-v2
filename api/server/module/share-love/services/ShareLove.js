exports.createShareLove = async (options) => {
  const user = await DB.User.findOne({ _id: options.userId });
  if (!user) {
    throw new Error('Fan is not found');
  }
  if (user.balance < options.token) {
    throw new Error("You don't have enough tokens to share tip!");
  }
  const shareLove = new DB.ShareLove({
    userId: options.userId,
    token: options.token,
    modelId: options.modelId
  });
  await shareLove.save();

  // upgrade share love count of model
  const model = await DB.User.findOne({ _id: options.modelId });
  if (!model) {
    throw new Error('Model is not found');
  }
  model.shareLove += 1;
  await model.save();

  await Service.Notification.tipToModel(shareLove);

  return shareLove;
};
