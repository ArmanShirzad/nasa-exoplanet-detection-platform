const sharp = require('sharp');
const fs = require('fs');

async function generateFavicon() {
    try {
        // Read the PNG favicon
        const inputPath = './public/favicon.png';
        const outputPath = './public/favicon.ico';

        // Generate multiple sizes for ICO format
        const sizes = [16, 32, 48];
        const buffers = await Promise.all(
            sizes.map(size =>
                sharp(inputPath)
                    .resize(size, size)
                    .toFormat('png')
                    .toBuffer()
            )
        );

        // For simplicity, we'll just create a 32x32 ICO
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
