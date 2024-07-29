exports.list = async (req, res, next) => {
  try {
    const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
    const take = parseInt(req.query.take, 10) || 10;
    const query = Helper.App.populateDbQuery(req.query, {
      equal: req.user.role === 'admin' ? ['userId', 'modelId', 'type', 'status'] : ['type', 'status']
    });

    if (req.user.role !== 'admin' && req.user.type === 'model') {
      query.modelId = req.user._id;
    }

    if (req.user.role !== 'admin' && req.user.type === 'user') {
      query.userId = req.user._id;
    }

    if (req.query.q) {
      const friends = await DB.User.find({
        username: { $regex: req.query.q.trim(), $options: 'i' },
        type: { $ne: req.user.type }
      });

      const friendIds = friends.map((friend) => friend._id);

      if (req.user.type === 'model') {
        query.$or = [{ userId: { $in: friendIds } }];
      }

      if (req.user.type === 'user') {
        query.$or = [{ modelId: { $in: friendIds } }];
      }
    }

    if (req.query.userId) {
      query.userId = req.query.userId;
      query.username && delete query.query.username;
    }

    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Earning.count(query);
    const items = await DB.Earning.find(query)
      .populate('user')
      .populate('model')
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();
     
      
          // Aggregation to calculate total earnings
    const totalEarningsResult = await DB.Earning.aggregate([
      { $match: { modelId: req.user._id } },
      { $group: { _id: null, totalBalance: { $sum: "$balance" } } }
    ]);

    const totalEarnings = totalEarningsResult.length > 0 ? totalEarningsResult[0].totalBalance : 0;

    res.locals.list = {
      count,
      totalEarnings,
      // todo - update it
      items: items.map((item) => {
        const data = item.toObject();
        data.user = item.user?.getPublicProfile();
        data.model = item.model?.getPublicProfile();
        return data;
      })
    };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.adminSearch = async (req, res, next) => {
  try {
    const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
    const take = parseInt(req.query.take, 10) || 10;
    if (req.user.role !== 'admin') {
      return next();
    }

    const query = {};
    query.type = 'model';

    // active or inactive model or all
    if (req.query.status) {
      query.isActive = req.query.status === 'active';
    }

    if (req.query.q) {
      query.username = { $regex: req.query.q.trim(), $options: 'i' };
    }
    if (req.query.modelId) {
      query._id = req.query.modelId;
      query.username && delete query.query.username;
    }

    const sort = Helper.App.populateDBSort(req.query);
    const models = await DB.User.find(query)
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();
    const count = await DB.User.count(query);
    const data = await models.reduce(async (results, model) => {
      const resp = await results;

      const modelEarning = await DB.Earning.find({ modelId: model._id }).exec();
      const modelPayouts = await DB.PayoutRequest.find({
        modelId: model._id,
        status: 'paid'
      }).exec();

      let totalEarning = 0;
      let totalPaid = 0;

      modelEarning.forEach((item) => {
        totalEarning += item.balance;
      });

      modelPayouts.forEach((item) => {
        totalPaid += item.tokenRequest;
      });

      resp.push({ model: model.getPublicProfile(), totalEarning, totalPaid });
      return resp;
    }, []);

    res.locals.list = {
      count,
      items: data
    };
    return next();
  } catch (e) {
    return next(e);
  }
};
