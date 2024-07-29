exports.search = async (req, res, next) => {
  try {
    const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
    const take = parseInt(req.query.take, 10) || 10;

    const query = Helper.App.populateDbQuery(req.query, {
      equal: req.user.role === 'admin' ? ['userId', 'type'] : ['type']
    });

    if (req.user.role !== 'admin') {
      query.userId = req.user._id;
    }

    if (req.query.q) {
      const price = Number(req.query.q);
      query.$or = [{ price }, { description: { $regex: req.query.q.trim(), $options: 'i' } }];
    }

    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Invoice.count(query);
    const items = await DB.Invoice.find(query)
      .populate('user')
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();

    res.locals.search = { count, items };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.itemId;
    if (!id) {
      return next(PopulateResponse.notFound());
    }

    const invoice = await DB.Invoice.findOne({ _id: id }).populate('user');

    res.locals.findOne = invoice;
    return next();
  } catch (e) {
    return next(e);
  }
};
