/* 
Script to generate JSON from MD 
Author - Rudra Roy
Usage - It will generate a JSON file with filename has keys from all the MD files in the current directory.
*/

const fs = require('fs');
const path = require('path');

// Function to read all files in the current directory
function readFilesInDirectory(dir) {
    return fs.readdirSync(dir).filter(file => path.extname(file) === '.md');
}

// Function to read file content and convert line breaks
function readFileContent(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.replace(/\n/g, '  ');
}

// Main function to generate JSON object
function generateJsonFromMdFiles() {
    const currentDir = __dirname;
    const files = readFilesInDirectory(currentDir);
    const result = {};

    files.forEach(file => {
        const filePath = path.join(currentDir, file);
        const content = readFileContent(filePath);
        result[file] = content;
    });

    return result;
}

// Generate the JSON object
const jsonResult = generateJsonFromMdFiles();

// Write the JSON object to a file
const outputFilePath = path.join(__dirname, 'output.json');
fs.writeFileSync(outputFilePath, JSON.stringify(jsonResult, null, 2));

console.log('JSON file has been generated successfully:', outputFilePath);