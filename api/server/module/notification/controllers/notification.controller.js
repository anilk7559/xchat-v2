exports.listUnread = async (req, res, next) => {
  try {
    const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
    const take = parseInt(req.query.take, 10) || 10;
    const offset = page * take;
    const items = await Service.Notification.getUnreadListByUser(req.user._id, offset, take);
    res.locals.list = items.map((item) => ({ ...item.toObject(), user: item?.createdBy?.getPublicProfile() }));
    next();
  } catch (e) {
    next(e);
  }
};

exports.list = async (req, res, next) => {
  try {
    const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
    const take = parseInt(req.query.take, 10) || 10;
    const offset = page * take;
    const result = await Service.Notification.getListByUser(req.user._id, offset, take);
    res.locals.list = { items: result.items.map((item) => ({ ...item.toObject(), user: item?.createdBy?.getPublicProfile() })), count: result.count };
    next();
  } catch (e) {
    next(e);
  }
};

exports.countUnread = async (req, res, next) => {
  try {
    const count = await Service.Notification.countUnread(req.user._id);

    res.locals.count = { count };
    next();
  } catch (e) {
    next(e);
  }
};

exports.readAll = async (req, res, next) => {
  try {
    await Service.Notification.readAll(req.user._id);
    res.locals.read = { read: true };
    next();
  } catch (e) {
    next(e);
  }
};

exports.read = async (req, res, next) => {
  try {
    await Service.Notification.read(req.user._id, req.params.id);
    res.locals.read = { read: true };
    next();
  } catch (e) {
    next(e);
  }
};
