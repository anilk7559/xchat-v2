exports.totalPending = async () => DB.PayoutRequest.countDocuments({
  status: 'pending'
});

exports.totalIssued = async () => DB.PayoutRequest.countDocuments({
  status: {
    $ne: 'pending'
  }
});
