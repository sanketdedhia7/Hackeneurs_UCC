App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    console.log('Loaded.');
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      //App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
      App.web3Provider = new Web3.providers.HttpProvider('https://mainnet.infura.io/GjyHpPqLZffsizIx6ieH');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Will.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var WillArtifact = data;
      App.contracts.Will = TruffleContract(WillArtifact);


      // Set the provider for our contract.
      App.contracts.Will.setProvider(App.web3Provider);
      return App.getAddress(), App.trustcheck();
      //add return values
    });
    return App.bindEvents();
  },

  // the following is probably the ugliest code i've ever written; be warned.

  bindEvents: function() {
    $(document).on('click', '#buyTicket1', App.addWill);
    $(document).on('click', '#getwill', App.getWill);
    $(document).on('click', '#addBeneficiary', App.addBeneficiary);
    $(document).on('click', '#addTrustee', App.addTrustee);
    $(document).on('click', '#confirm', App.confirm);
    $(document).on('click', '#update', App.trustcheck);


  },


  getAddress: function() {
    console.log('Getting will address');
    App.contracts.Will.deployed().then(function(instance) {
        Will = instance;
        console.log(Will);
        $('#willAddress').text(instance.address);
      });
  },

  addBeneficiary: function send() {
    var address = $('#f1').val();
    var amount = $('#f2').val();
    App.contracts.Will.deployed().then(function(instance) {
        Will = instance;
        // console.log(Will.totalTokens());
        $('#willAddress').text(instance.address);

        Will.setBeneficiary(address, amount, {
          from: web3.eth.coinbase,
          to: instance.address,
          gas: 170000

        });
      });
  },

  addTrustee: function send() {
    var address = $('#t1').val();
    App.contracts.Will.deployed().then(function(instance) {
        Will = instance;
        Will.setTrustee(address, {
          from: web3.eth.coinbase,
          to: instance.address,
          gas: 170000

        });
      });
  },

  confirm: function send() {
    var address = $('#t1').val();
    App.contracts.Will.deployed().then(function(instance) {
        Will = instance;
        Will.declareDead({
          from: web3.eth.coinbase,
          to: instance.address,
          gas: 170000

        });
      });
      App.trustcheck();
  },

  trustcheck: function() {
    App.contracts.Will.deployed().then(function(instance) {
        console.log('hi');
        Will = instance;
        instance.numYes().then(function(result){
          $('#trustconfirm').text(result);
        });
        instance.numTrustees().then(function(result){
          $('#trustTotal').text(result);
        })
      });
  },


  addWill: function send() {
    App.contracts.Will.deployed().then(function(instance) {
      Will = instance;
      var WillContractAddress = Will.address;
      console.log(WillContractAddress);
      Will.addWill().then(function(address){
        console.log(address);
        App.getWill();
        return App.initWillContract();
      });
      })
  },




};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
