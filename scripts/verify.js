const path = require('path')
const fs = require('fs')
const axios = require('axios')
const queryString = require('querystring')
const promiseRetry = require('promise-retry')
const { promisify } = require('util')

const flatsPath = path.join(__dirname, '..', 'flats')
const buildContractsPath = path.join(__dirname, '..', 'build', 'contracts')
const basePath = path.join(__dirname, '..')

const EXPLORER_URL = 'https://explorer.fuse.io/api'

const REQUEST_STATUS = {
  OK: 'OK'
}

const DEPLOYED_DATA_FILENAME = 'deployedContracts.json'

const readFile = promisify(fs.readFile)

async function getFlatContract (contractName) {
  const flatName = contractName + '_flat.sol'
  const flatFilePath = path.join(flatsPath, flatName)
  const file = await readFile(flatFilePath, { encoding: 'utf-8' })
  return file.toString()
}

async function getContractArtifact (contractName) {
  const artifactName = contractName + '.json'
  const artifactFilePath = path.join(buildContractsPath, artifactName)
  const file = await readFile(artifactFilePath, { encoding: 'utf-8' })
  return JSON.parse(file)
}

const request = (url, queries) =>
  axios.post(url, queryString.stringify(queries))

function sendVerifyRequestBlockscout (flat, options) {
  const postQueries = {
    module: 'contract',
    action: 'verify',
    addressHash: options.address,
    contractSourceCode: flat,
    name: options.contractName,
    compilerVersion: options.compiler,
    optimization: options.optimizationUsed,
    optimizationRuns: options.runs,
    evmVersion: options.evmVersion
  }

  return request(EXPLORER_URL, postQueries)
}

async function sendVerifyRequest (flat, params) {
  try {
    const result = await sendVerifyRequestBlockscout(flat, params)
    console.log(result.data.message)

    if (result.data.message === REQUEST_STATUS.OK) {
      console.log(`${params.address} verified`)
      return true
    }
  } catch (e) {
    return false
  }
  return false
}

async function verifyContract (contractName, address) {
  const flat = await getFlatContract(contractName)
  const artifact = await getContractArtifact(contractName)

  let metadata
  try {
    metadata = JSON.parse(artifact.metadata)
  } catch (e) {
    console.log('Error on decoding values from artifact')
  }

  const params = {
    address,
    contractName,
    compiler: `v${artifact.compiler.version.replace('.Emscripten.clang', '')}`,
    optimizationUsed: metadata.settings.optimizer.enabled,
    runs: metadata.settings.optimizer.runs,
    evmVersion: metadata.settings.evmVersion
  }

  try {
    await promiseRetry(async (retry) => {
      const verified = await sendVerifyRequest(flat, params)
      if (!verified) {
        retry()
      }
    })
  } catch (e) {
    console.log(`Couldn't verify ${address}`)
  }
}

async function main () {
  const dataPath = path.join(basePath, DEPLOYED_DATA_FILENAME)

  let deployedContracts
  try {
    deployedContracts = await readFile(dataPath, { encoding: 'utf-8' })
    deployedContracts = JSON.parse(deployedContracts)
  } catch (e) {
    console.error(
      `Contract deployment data not provided at ${dataPath.toString()}`,
      e
    )
    process.exit(0)
  }

  for (const deployedContract of deployedContracts) {
    await verifyContract(
      deployedContract.contractName,
      deployedContract.address
    )
  }

  console.log('Done verifying contracts')
}

main()
