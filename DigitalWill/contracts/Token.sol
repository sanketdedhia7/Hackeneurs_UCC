pragma solidity ^0.4.17;

contract Token {

     // Balances for each account
     mapping(address => uint256) public balances;

     // Get the token balance for account `tokenOwner`
     function balanceOf(address tokenOwner) public constant returns (uint balance) {
         return balances[tokenOwner];
     }

    function Token() {
        // hi
    }

     // Transfer the balance from owner's account to another account
     function transfer(address to, uint tokens) public returns (bool success) {
         balances[msg.sender] -= tokens;
         balances[to] += tokens;
         return true;
     }

     function init(address to) public returns (bool) {
         balances[to] = 1000;
         return true;
     }



 }
