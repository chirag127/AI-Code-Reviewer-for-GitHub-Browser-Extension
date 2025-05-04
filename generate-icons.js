/**
 * AI Code Reviewer for GitHub - Icon Generator
 * 
 * This script generates icon files for the extension in different sizes.
 * It requires the Sharp library to be installed:
 * npm install sharp
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'extension', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// SVG icon source
const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <circle cx="12" cy="12" r="10" fill="#2ea44f" />
  <path d="M7 12l3 3 7-7" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M12 7v2M12 15v2M7 12H5M19 12h-2" stroke="white" stroke-width="1" fill="none" stroke-linecap="round" />
</svg>
`;

// Save SVG file
fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgIcon);

// Icon sizes to generate
const sizes = [16, 48, 128];

// Generate PNG icons in different sizes
async function generateIcons() {
  try {
    for (const size of sizes) {
      await sharp(Buffer.from(svgIcon))
        .resize(size, size)
        .png()
        .toFile(path.join(iconsDir, `icon${size}.png`));
      
      console.log(`Generated icon${size}.png`);
    }
    
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
