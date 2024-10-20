import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
    // Get the contract factory
    const PestoPenguins = await ethers.getContractFactory("PestoPenguins");

    // Set the base URI you want to use
    const initialBaseURI = "https://your-metadata-base-url.com/";

    // Deploy the contract
    const pestoPenguins = await PestoPenguins.deploy(initialBaseURI);

    // Wait for the deployment transaction to be mined
    await pestoPenguins.waitForDeployment();

    // Log the deployed contract address
    console.log("NFT Contract deployed to:", pestoPenguins.target);
}

// Run the main function and handle errors
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
