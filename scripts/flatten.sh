#!/usr/bin/env bash

if [ -d flats ]; then
  rm -rf flats
fi

mkdir flats

./node_modules/.bin/truffle-flattener contracts/token-factory/TokenFactoryProxy.sol > flats/TokenFactoryProxy_flat.sol
./node_modules/.bin/truffle-flattener contracts/token-factory/TokenFactory.sol > flats/TokenFactory_flat.sol

./node_modules/.bin/truffle-flattener contracts/entities/CommunityFactoryProxy.sol > flats/CommunityFactoryProxy_flat.sol
./node_modules/.bin/truffle-flattener contracts/entities/CommunityFactory.sol > flats/CommunityFactory_flat.sol
