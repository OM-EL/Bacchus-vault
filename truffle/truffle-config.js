require('dotenv').config();
const mnemonic = process.env["MNEMONIC"];
const infuraProjectId = process.env["INFURA_PROJECT_ID"];
const mumbaiProjectId = process.env["MUMBAI_PROJECT_ID"];
const coinMarketCapApiKey = process.env["COINMARKETCAP_API"];

const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  contracts_build_directory: "../client/src/contracts",
  networks: {

    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    goerli: {
      provider: () => new HDWalletProvider(mnemonic, `https://goerli.infura.io/v3/${infuraProjectId}`),
      network_id: 5,       // Goerli's network id
      // chain_id: 5,         // Goerli's chain id
      // gas: 5500000,        // Gas limit used for deploys.
      // confirmations: 2,    // # of confirmations to wait between deployments. (default: 0)
      // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      // skipDryRun: true     // Skip dry run before migrations? (default: false for public nets)
    },
    mumbai: {
      provider: () => new HDWalletProvider(mnemonic, `https://polygon-mumbai.g.alchemy.com/v2/${mumbaiProjectId}`),
      network_id: 80001,
    }
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions: {
      currency: 'USD',
      coinmarketcap: coinMarketCapApiKey,
      token: 'MATIC',
      gasPriceApi: 'https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice'
    }
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.17",      // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200
        },
        //  evmVersion: "byzantium"
      }
    }
  },
}
