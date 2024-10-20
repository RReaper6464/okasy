import { ethers } from 'ethers'; // Import ethers
import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Load your contract ABI
const contractABI = JSON.parse(fs.readFileSync('./artifacts/contracts/PestoPenguins.sol/PestoPenguins.json')); // Update with the correct path to your ABI

// Replace with your contract address
const contractAddress = '0x30ECA245AD8D0348D287E0E7D42D417668CC7098';

// Configure your provider and signer (Make sure to add your Alchemy API URL and your private key)
const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_API_URL); // Updated for ethers 6.x
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Connect to the contract
const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

// Metadata and image generation setup
const layersPath = {
    Backgrounds: './assets/Backgrounds',
    Fur: './assets/Fur',
    Clothes: './assets/Clothes',
    NeckWear: './assets/NeckWear',
    Face: './assets/Face',
    EyeWear: './assets/EyeWear',
    HeadWear: './assets/HeadWear',
};

const outputPath = './output'; // Where to save the generated NFTs
const numNFTs = 2222; // Change this to how many NFTs you want to generate

const getRandomImage = (layer, rarity) => {
    const images = fs.readdirSync(layer);
    const randomNum = Math.random();

    // Increase the chance of "None.png" appearing for layers that contain it
    if (rarity === 'low' && images.includes('None.png') && randomNum < 0.5) {
        return 'None.png';
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];
    return randomImage;
};

// Function to generate NFTs
const generateNFTs = async () => {
    fs.ensureDirSync(outputPath); // Ensure output directory exists

    for (let i = 0; i < numNFTs; i++) {
        const nft = {};

        // Get random images from each layer
        for (const [key, value] of Object.entries(layersPath)) {
            let rarity = 'normal'; // Default rarity
            if (key === 'Clothes' || key === 'NeckWear' || key === 'EyeWear' || key === 'HeadWear') {
                rarity = 'low'; // Adjust rarity for certain layers
            }
            nft[key] = getRandomImage(value, rarity);
        }

        // Save generated NFT metadata
        fs.writeFileSync(path.join(outputPath, `Pesto Penguin #${i + 1}.json`), JSON.stringify(nft, null, 2));

        // Mint NFT
        const imageFilePath = path.join(outputPath, `Pesto Penguin #${i + 1}.png`); // Assuming you have a function to create the image
        await mintNFT(nft, imageFilePath); // Function to mint NFT
    }
};

// Function to mint an NFT
const mintNFT = async (metadata, imagePath) => {
    // Prepare your metadata URI (e.g., IPFS or local)
    const metadataURI = `ipfs://your-ipfs-hash-or-local-path/Pesto Penguin #${i + 1}.json`; // Update with your actual URI logic

    try {
        const tx = await contract.mint(metadataURI);
        console.log(`Minting NFT with tx: ${tx.hash}`);
        await tx.wait(); // Wait for the transaction to be mined
        console.log(`Successfully minted NFT: ${metadata.name}`);
    } catch (error) {
        console.error('Error minting NFT:', error);
    }
};

// Start generating and minting NFTs
generateNFTs().catch(console.error);
