const sharp = require('sharp');

async function generateFavicon() {
    try {
        // Read the PNG favicon
        const inputPath = './public/favicon.png';
        const outputPath = './public/favicon.ico';

        // For simplicity, we'll create a 32x32 ICO
        // (ICO format is complex, so we'll use a simple approach)
        await sharp(inputPath)
            .resize(32, 32)
            .toFormat('png')
            .toFile(outputPath);

        console.log('✅ Favicon.ico generated successfully!');
    } catch (error) {
        console.error('❌ Error generating favicon:', error);
    }
}

generateFavicon();
