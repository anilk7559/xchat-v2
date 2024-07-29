exports.adminDashboardStats = async (req, res, next) => {
  try {
    const totalVideos = await Service.SellItem.totalVideos();
    const totalPhotos = await Service.SellItem.totalPhotos();
    const totalVideoSales = await Service.SellItem.totalVideoSales();
    const totalPhotoSales = await Service.SellItem.totalPhotoSales();
    const totalModels = await Service.User.totalModels();
    const totalFans = await Service.User.totalFans();
    const totalActiveUsers = await Service.User.countByQuery({ isActive: true });
    const totalInactiveUsers = await Service.User.countByQuery({ isActive: false });
    const totalPendingPayouts = await Service.PayoutRequest.totalPending();
    const totalIssuedPayouts = await Service.PayoutRequest.totalIssued();

    res.locals.stats = {
      totalVideos,
      totalPhotos,
      totalVideoSales,
      totalPhotoSales,
      totalModels,
      totalFans,
      totalActiveUsers,
      totalInactiveUsers,
      totalPendingPayouts,
      totalIssuedPayouts
    };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.totalPendingModels = async (req, res, next) => {
  try {
    const totalPendingModels = await Service.User.totalPendingModels();

    res.locals.stats = {
      totalPendingModels
    };
    return next();
  } catch (e) {
    return next(e);
  }
};
