const md5 = require('md5');
const SYSTEM_CONST = require('../../system/constants');

exports.createCCBillSinglePayment = async (options) => {
  const transaction = new DB.Transaction({
    userId: options.userId,
    type: options.type,
    price: options.price,
    description: options.description,
    products: options.products || [
      {
        id: options.itemId,
        price: options.price,
        description: options.description
      }
    ],
    gateway: options.gateway,
    meta: options.meta,
    itemId: options.itemId,
    status: 'pending'
  });

  await transaction.save();

  const ccbillInfo = await DB.Config.find({ group: 'ccbill' });
  const subAccount = ccbillInfo.find((item) => item.key === SYSTEM_CONST.CCBILL_SUB_ACCOUNT);
  const flexformId = ccbillInfo.find((item) => item.key === SYSTEM_CONST.CCBILL_FLEXFORM_ID);
  const salt = ccbillInfo.find((item) => item.key === SYSTEM_CONST.CCBILL_SALT);
  const code = ccbillInfo.find((item) => item.key === SYSTEM_CONST.CCBILL_CURRENCY_CODE);
  if (
    !subAccount?.value
    || !flexformId.value
    || !salt.value
  ) {
    throw new Error('Missing ccbill config!');
  }
  const currencyCode = code.value || '840'; // usd
  const initialPeriod = 30;
  const initialPrice = transaction.price.toFixed(2);
  const formDigest = md5(initialPrice + initialPeriod + currencyCode + salt.value);
  const url = `https://api.ccbill.com/wap-frontflex/flexforms/${flexformId.value}?type=${transaction.type}&transactionId=${transaction._id}&userId=${transaction.userId}&itemId=${transaction.itemId}&initialPrice=${initialPrice}&initialPeriod=${initialPeriod}&clientSubacc=${subAccount.value}&currencyCode=${currencyCode}&formDigest=${formDigest}`;

  return url;
};

exports.createSinglePayment = async (options) => {
  if (options.gateway === 'ccbill') {
    return this.createCCBillSinglePayment(options);
  }

  throw new Error('Not support other gateway yet');
};
/**
 *
 * @param {*} options = {service, itemId}
 */
exports.getProduct = async (options) => {
  if (options.service === 'token_package') {
    const tokenPackage = await DB.TokenPackage.findOne({ _id: options.itemId });
    if (!tokenPackage) {
      throw new Error('Package not found!');
    }
    return tokenPackage;
  }
  // todo - other service

  throw new Error('Not support other service yet');
};
