const fs = require('fs');
const path = require('path');

const targetDir = 'd:/TELEGRAM BOT STOR1/frontend/public/flags';
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Check the two media files
const srcEn = 'C:/Users/hakis/.gemini/antigravity-ide/brain/0f6630e5-72ad-4b9f-9eb9-33d50694790a/media__1785000298068.png';
const srcKm = 'C:/Users/hakis/.gemini/antigravity-ide/brain/0f6630e5-72ad-4b9f-9eb9-33d50694790a/media__1785000298111.png';

fs.copyFileSync(srcEn, path.join(targetDir, 'en.png'));
fs.copyFileSync(srcKm, path.join(targetDir, 'km.png'));

console.log('Flag PNGs copied successfully!');
