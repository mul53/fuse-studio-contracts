const truffleAssert = require('truffle-assertions')
const { nullAccount } = require('../helpers')

const CommunityFactory = artifacts.require('CommunityFactory')
const CommunityFactoryProxy = artifacts.require('CommunityFactoryProxy')

contract('CommunityFactoryProxy', (accounts) => {
  const proxyOwner = accounts[0]
  const bot = accounts[1]
  let factory
  let proxy

  beforeEach(async () => {
    factory = await CommunityFactory.new()
    proxy = await CommunityFactoryProxy.new()
  })

  it('should switch proxyOwnership if proxy owner', async () => {
    await proxy.transferProxyOwnership(bot, { from: proxyOwner })

    assert.equal(await proxy.proxyOwner(), bot)
  })

  it('should fail to switch proxyOwnership if not proxy owner', async () => {
    await truffleAssert.reverts(
      proxy.transferProxyOwnership(bot, { from: bot })
    )

    assert.equal(await proxy.proxyOwner(), proxyOwner)
  })

  it('should upgrade to contract address', async () => {
    await proxy.upgradeTo(factory.address)

    assert.equal(await proxy.implementation(), factory.address)
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
})
