const truffleAssert = require('truffle-assertions')
const { encodeCall, nullAccount } = require('../helpers')

const TokenFactory = artifacts.require("TokenFactory")
const TokenFactoryProxy = artifacts.require("TokenFactoryProxy")

contract('TokenFactoryProxy', (accounts) => {
  let proxyOwner = accounts[0]
  let bot = accounts[1]
  let factory
  let proxy

  beforeEach(async () => {
    factory = await TokenFactory.new();
    proxy = await TokenFactoryProxy.new();
  })

  it('should switch proxyOwnership if proxy owner', async () => {
    await proxy.transferProxyOwnership(bot, { from: proxyOwner });

    assert.equal(await proxy.proxyOwner(), bot);
  })

  it('should fail to switch proxyOwnership if not proxy owner', async () => {
    await truffleAssert.reverts(
      proxy.transferProxyOwnership(bot, { from: bot })
    );

    assert.equal(await proxy.proxyOwner(), proxyOwner);
  })

  it('should upgrade to contract address', async () => {
    await proxy.upgradeTo(factory.address);

    assert.equal(await proxy.implementation(), factory.address);
  })

  it('should fail to upgrade to null contract address', async () => {
    await truffleAssert.reverts(
      proxy.upgradeTo(nullAccount, { from: proxyOwner })
    )
  })
  
  it('should fail to call upgradeTo if not proxy owner', async () => {
    await truffleAssert.reverts(
      proxy.upgradeTo(factory.address, { from: bot })
    )
  })

  it('should upgradeToAndCall to contract address')

  it('should fail to upgradeToAndCall to null contract address', async () => {
    const initializeData = encodeCall('pauser', [], [])
    await truffleAssert.reverts(
      proxy.upgradeToAndCall(nullAccount, initializeData, {
        from: proxyOwner
      })
    )
  })


  it('should fail to call upgradeToAndCall if not proxy owner', async () => {
    const initializeData = encodeCall('pauser', [], [])
    await truffleAssert.reverts(
      proxy.upgradeToAndCall(factory.address, initializeData, {
        from: bot
      })
    )
  })
})