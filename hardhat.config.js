require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ganache");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
			forking: {
				url: "https://eth-goerli.g.alchemy.com/v2/Ha8QNWLcgaj-X4AhjxF8-EAmMi422x8C",
				blockNumber: 7997784
			},
		},
    ganache: {
      gasLimit: 30000000,
      defaultBalanceEther: 100,
      url:"http://127.0.0.1:6545"
    },
    goerli: {
      gasLimit: 30000000,
      url:"https://eth-goerli.g.alchemy.com/v2/aUTJSEeyzFepmJawdDnrGMvKyy7FK_ek",
      accounts: [`37402e6a9b498a084f30a8c29cdce3724714b775f7041f665c22a9787fb668b6`]
    },
    LY: {
      gasLimit: 30000000,
      defaultBalanceEther: 100,
      url:"http://127.0.0.1:8545",
      accounts: [`37402e6a9b498a084f30a8c29cdce3724714b775f7041f665c22a9787fb668b6`]
    },
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
};