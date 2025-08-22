const GeoPattern = require('geopattern');
const { createCanvas, Image } = require('canvas');
const fs = require('fs');
const path = require('path');

const generateBanners = () => {
    const outputDir = path.join(__dirname, '..', 'public', 'banners');
    const bannerSeeds = Array.from({ length: 15 }, (_, i) => `banner-${i}-biyashara`);
    const width = 1200;
    const height = 400;

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log(`Generating ${bannerSeeds.length} banners...`);

    bannerSeeds.forEach(seed => {
        // Note: Background color is hardcoded for server-side generation.
        // You can change '#f0f2f5' to your desired default background.
        const pattern = GeoPattern.generate(seed, { backgroundColor: '#f0f2f5' });

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        const img = new Image();

        const outputPath = path.join(outputDir, `${seed}.png`);

        if (fs.existsSync(outputPath)) {
            console.log(` -> Skipping ${outputPath} (already exists)`);
            return; // Passe à la bannière suivante
        }

        img.onload = () => {
            ctx.drawImage(img, 0, 0, width, height);
            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(outputPath, buffer);
            console.log(` -> Saved ${outputPath}`);
        };

        img.onerror = err => {
            console.error(`Error loading SVG for seed ${seed}:`, err);
        };

        img.src = pattern.toDataUri();
    });

    console.log('\nBanner generation complete.');
};

generateBanners();
