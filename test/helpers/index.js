const abi = require('ethereumjs-abi')

const nullAccount = "0x0000000000000000000000000000000000000000";

function encodeCall(name, args, values) {
  const methodId = abi.methodID(name, args).toString('hex');
  const params = abi.rawEncode(args, values).toString('hex');
  return '0x' + methodId + params;
}

module.exports = {
  nullAccount,
  encodeCall
}