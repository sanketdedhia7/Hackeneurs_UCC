pragma solidity ^0.4.17;

contract MasterWill{

    mapping(address=>Will) public allWills;

    function MasterWill() public {
        //nothing here
    }

    function addWill(uint256 _endtime) public returns (address) {
        Will will = new Will(_endtime, msg.sender);
        allWills[msg.sender] = will;
        return address(will);
    }

    function getWill() public view returns (address) {
        return address(allWills[msg.sender]);
    }

}

contract Token {
  function balanceOf(address tokenOwner) public constant returns (uint256){}
  function transfer(address to, uint256 tokens) public returns (bool) {}
}

contract Will{

    struct Beneficiary {
        address person;
        uint256 amount;
    }

    struct Trustee {
        bool permission;
        bool vote;
    }

    uint256 public totalTokens = 0;
    uint256 public tokensUsed = 0;
    address public owner;
    uint256 public endTime;
    Beneficiary[] beneficiaries;
    mapping(address=>Trustee) trustees;
    uint8 numYes = 0;
    uint8 numTrustees = 0;



    // up to the person to give the person this contract the
    // access to their propy tokens
    address public propyToken = 0x2869b5844cc6ad66d19f3cebccf17c0062fdcd83;
    Token accessToken = Token(propyToken);

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    modifier isDead {
        require(checkDeath()==true);
        _;
    }

    // constructor
    function Will(uint256 _endTime, address _owner) public {
        endTime = _endTime;
        owner = _owner;
    }

    function getNumTokens() public constant returns (uint256) {
        totalTokens = accessToken.balanceOf(address(this));
        return totalTokens;
    }

    function setBeneficiary(address _beneficiary, uint256 _amount) onlyOwner public {
        require((totalTokens-tokensUsed-_amount) > 0);
        tokensUsed += _amount;
        beneficiaries.push(Beneficiary(_beneficiary, _amount));
    }

    function setTrustee(address _trustee) public onlyOwner {
        numTrustees += 1;
        trustees[_trustee]=Trustee(true, false);
    }

    function declareDead() public {
        require(trustees[msg.sender].permission==true);
        require(trustees[msg.sender].vote==false);
        trustees[msg.sender].vote=true;
        numYes += 1;
    }

    // conditions to check: time is more than kill switch OR
    // more than half of trustees said yes
    function checkDeath() view public returns (bool) {
        if(now > endTime) {
            return true;
        }
        if(numTrustees > 0) {
            if(numYes*2 > numTrustees) {
                return true;
            }
            return false;
        }
        return false;
    }

    function sendFunds() public isDead {
        for(uint i=0; i<beneficiaries.length; i++) {
            accessToken.transfer(beneficiaries[i].person, beneficiaries[i].amount);
        }
    }

    //use in case you want your tokens back
    function destroy() public onlyOwner {
        accessToken.transfer(owner, getNumTokens());
        selfdestruct(owner);
    }
}
