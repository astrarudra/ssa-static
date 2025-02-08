// run in console of imgur.com

// generate array [1,2,3,4, ....n]
const images = Array.from({ length: 86 }, (_, i) => (i + 1) + '.jpg');
const BASE = 'https://astrarudra.github.io/ssa-static/prod/assets/albums/guruji/';

// Function to get image dimensions
async function getImageDimensions(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = url;
  });
}

// Function to generate thumbnail URL
function generateThumbnailUrl(url) {
  const [key, ext] = url.split('.');
  return `${BASE}${key}t.${ext}`;
}

// Asynchronous function to fetch dimensions for all images
async function fetchImageDimensions(images) {
  const dimensions = [];
  const pool = []
  for (const image of images) {
    const thumbnailUrl = generateThumbnailUrl(image);
    pool.push(getImageDimensions(thumbnailUrl))
  }
  const output = await Promise.all(pool)
  for (const [i, image] of images.entries()) {
    const { width, height } = output[i];
    dimensions.push({ i: image, h: height, w: width });
  }
  return dimensions;
}

// Usage
fetchImageDimensions(images)
  .then(dimensions => {
    console.log(dimensions);
    console.log("OUTPUT")
    console.log(JSON.stringify(dimensions))
    // You can use 'dimensions' array here
  })
  .catch(error => console.error('Error fetching image dimensions:', error));