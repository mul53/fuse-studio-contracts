#!/usr/bin/env bash

if [ -d abis ]; then
  rm -rf abis
fi

mkdir abis

./node_modules/node-jq/bin/jq '.abi' build/contracts/TokenFactoryProxy.json > abis/TokenFactoryProxy.abi.json
./node_modules/node-jq/bin/jq '.abi' build/contracts/TokenFactory.json > abis/TokenFactory.abi.json

./node_modules/node-jq/bin/jq '.abi' build/contracts/CommunityFactoryProxy.json > abis/CommunityFactoryProxy.abi.json
./node_modules/node-jq/bin/jq '.abi' build/contracts/CommunityFactory.json > abis/CommunityFactory.abi.json