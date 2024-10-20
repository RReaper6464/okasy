require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_API_URL, // Use the variable name from your .env file
      accounts: [`0x${process.env.PRIVATE_KEY}`], // Ensure the variable name matches your .env file
    },
  },
};
