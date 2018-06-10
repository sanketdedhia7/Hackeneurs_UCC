const MasterWill = artifacts.require('MasterWill')


module.exports = function(deployer) {
  // Use deployer to state migration tasks.
    deployer.deploy(MasterWill)

};
