pragma solidity ^0.5.2;

import "../upgradeability/OwnedUpgradeabilityProxy.sol";

contract TokenFactoryProxy is OwnedUpgradeabilityProxy {
  constructor() public {}
}