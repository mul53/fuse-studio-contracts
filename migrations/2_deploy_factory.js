const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const writeFile = promisify(fs.writeFile)

const CommunityFactory = artifacts.require('CommunityFactory')
const CommunityFactoryProxy = artifacts.require('CommunityFactoryProxy')
const TokenFactory = artifacts.require('TokenFactory')
const TokenFactoryProxy = artifacts.require('TokenFactoryProxy')

module.exports = async function (deployer, network, [defaultAccount]) {
  const deployedContracts = []

  console.log('Deploying Community implementation contract...')
  await deployer.deploy(CommunityFactory)
  console.log(
    'Deployed CommunityFactory implementation contract at',
    CommunityFactory.address,
    '\n'
  )

  deployedContracts.push({
    contractName: 'CommunityFactory',
    address: CommunityFactory.address
  })

  console.log('Deploying Community proxy contract...')
  await deployer.deploy(CommunityFactoryProxy)
  const communityProxy = await CommunityFactoryProxy.deployed()
  console.log(
    'Deployed Community proxy contract at',
    CommunityFactoryProxy.address,
    '\n'
  )

  deployedContracts.push({
    contractName: 'CommunityFactoryProxy',
    address: CommunityFactoryProxy.address
  })

  console.log('Assigning Community implementation to Community proxy...')
  await communityProxy.upgradeTo(CommunityFactory.address)
  console.log('Done deploying Community contracts...\n')

  console.log('Deploying TokenFactory implementation contract...')
  await deployer.deploy(TokenFactory)
  console.log(
    'Deployed TokenFactory implementation contract at',
    TokenFactory.address,
    '\n'
  )

  deployedContracts.push({
    contractName: 'TokenFactory',
    address: TokenFactory.address
  })

  console.log('Deploying TokenFactory proxy contract...')
  await deployer.deploy(TokenFactoryProxy)
  const tokenProxy = await TokenFactoryProxy.deployed()
  console.log(
    'Deployed TokenFactory proxy contract at',
    TokenFactoryProxy.address,
    '\n'
  )

  deployedContracts.push({
    contractName: 'TokenFactoryProxy',
    address: TokenFactoryProxy.address
  })

  console.log('Assigning TokenFactory implementation to TokenFactory proxy...')
  await tokenProxy.upgradeTo(TokenFactory.address)
  console.log('Done deploying TokenFactory contracts...\n')

  console.log('Done deploying contracts')

  await writeFile(
    path.join(__dirname, '..', 'deployedContracts.json'),
    JSON.stringify(deployedContracts)
  )
}
