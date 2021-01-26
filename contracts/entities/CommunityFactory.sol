pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Community.sol";

contract CommunityFactory is Ownable {
  event CommunityCreated(address indexed community, string name);
  event TokenRegistered(address indexed community, address token);

  function registerCommunity(address _community) public onlyOwner {
    Community community = Community(_community);

    emit CommunityCreated(address(community), community.name());
  }

  function registerToken(address _community, address _token) public onlyOwner {
    emit TokenRegistered(_community, _token);
  }
}