const fs = require('fs-extra');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// Define paths to the images with rarity
const layersPath = {
    Backgrounds: {
        path: './assets/Backgrounds',
        rarity: [50, 30, 10, 5, 3, 1, 1, 1, 1, 1] // Rarity for each background
    },
    Fur: {
        path: './assets/Fur',
        rarity: [30, 25, 20, 10, 10, 5, 1, 1, 1] // Lower rarity for None.png
    },
    Clothes: {
        path: './assets/Clothes',
        rarity: [10, 40, 30, 20] // Higher rarity for None.png
    },
    NeckWear: {
        path: './assets/NeckWear',
        rarity: [10, 25, 40, 10, 10, 5] // Higher rarity for None.png
    },
    Face: {
        path: './assets/Face',
        rarity: [20, 20, 15, 10, 10, 10, 5, 5, 3, 2] // All rarities as before
    },
    EyeWear: {
        path: './assets/EyeWear',
        rarity: [10, 25, 40, 15, 10] // Higher rarity for None.png
    },
    HeadWear: {
        path: './assets/HeadWear',
        rarity: [10, 25, 20, 15, 40, 1] // Higher rarity for None.png
    }
};

const outputPath = './output'; // Where to save the generated NFTs
const numNFTs = 2222; // Total number of NFTs to generate
const imageSize = { width: 2048, height: 2048 }; // Image dimensions

// Function to get random image based on rarity
const getRandomImage = (layer) => {
    const images = fs.readdirSync(layer.path);
    const weightedImages = [];

    images.forEach((image, index) => {
        const weight = layer.rarity[index] || 1; // Default weight if not specified
        for (let i = 0; i < weight; i++) {
            weightedImages.push(image);
        }
    });

    return weightedImages[Math.floor(Math.random() * weightedImages.length)];
};

// Function to generate NFTs
const generateNFTs = async () => {
    fs.ensureDirSync(outputPath); // Ensure output directory exists

    for (let i = 0; i < numNFTs; i++) {
        const nft = {};
        const canvas = createCanvas(imageSize.width, imageSize.height);
        const ctx = canvas.getContext('2d');

        // Load images from each layer
        for (const [layer, { path: layerPath, rarity }] of Object.entries(layersPath)) {
            const imageName = getRandomImage(layersPath[layer]);
            const imagePath = path.join(layerPath, imageName); // Correctly construct the image path

            nft[layer] = imageName;

            try {
                const image = await loadImage(imagePath);
                ctx.drawImage(image, 0, 0, imageSize.width, imageSize.height);
            } catch (err) {
                console.error(`Failed to load image ${imagePath}:`, err);
            }
        }

        // Save generated NFT image
        const imageOutputPath = path.join(outputPath, `pesto_penguin_${i + 1}.png`);
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(imageOutputPath, buffer);

        // Save metadata
        const metadataOutputPath = path.join(outputPath, `pesto_penguin_${i + 1}.json`);
        fs.writeFileSync(metadataOutputPath, JSON.stringify(nft, null, 2));

        console.log(`Generated NFT ${i + 1}:`, nft);
    }
};

generateNFTs().catch(console.error);
