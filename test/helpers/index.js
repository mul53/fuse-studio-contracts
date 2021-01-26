const abi = require('ethereumjs-abi')

const nullAccount = '0x0000000000000000000000000000000000000000'

function encodeCall (name, args, values) {
  const methodId = abi.methodID(name, args).toString('hex')
  const params = abi.rawEncode(args, values).toString('hex')
  return '0x' + methodId + params
}

function itIf (condition, description, func) {
  if (condition) it(description, func)
}

function isBasicToken (name) {
  return name === 'basic'
}

function isMintableBurnable (name) {
  return name === 'mintableBurnable'
}

module.exports = {
  nullAccount,
  encodeCall,
  itIf,
  isBasicToken,
  isMintableBurnable
}
