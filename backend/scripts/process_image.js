const { Jimp } = require('jimp');

async function processImage() {
  try {
    const inputPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\0832fbd6-bd6c-4dbc-9674-8f9ea4edada7\\media__1775803464149.jpg';
    const outputPath = 'D:\\dacs\\public\\logo.png';

    console.log('Loading image...');
    const image = await Jimp.read(inputPath);
    
    console.log('Removing black background...');
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      // If the pixel is very dark (close to black), make it completely transparent
      if (red < 35 && green < 35 && blue < 35) {
        this.bitmap.data[idx + 3] = 0; // Alpha channel
      }
    });

    console.log('Autocropping empty transparent space...');
    // In Jimp 1.x, autocrop removes bordering pixels of the same color/transparency
    image.autocrop(); 

    console.log('Writing to ', outputPath);
    // Don't resize it in JS. Let CSS downscale it so it remains HD and crisp on all displays.
    await image.write(outputPath);
    console.log('Done!');
  } catch(e) {
    console.error(e);
  }
}

processImage();
