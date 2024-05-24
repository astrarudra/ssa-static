/* 
Script to generate MD from JSON 
Author - Rudra Roy
Usage - It will generate MD files with keys from all the JSON files in the current directory.
*/

/* USER INPUT */
const keys = ["ashramShort", "satsangShort", "ashram", "satsang", "gallery"];
const file = 'output.json';

/* Script Begin */
const fs = require('fs');
const path = require('path');

// Function to replace double spaces with line breaks
function convertToMarkdown(content) {
    return content.replace(/\\n/g, '\n');
}

// Main function to generate Markdown files from JSON input
function generateMdFilesFromJson(jsonFilePath) {
    // Read and parse the JSON file
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

    // Iterate over each key-value pair in the JSON object
    for (const [key, value] of Object.entries(jsonData)) {
        // if(keys && !keys.includes(key)) continue;
        // Generate the Markdown content
        const markdownContent = convertToMarkdown(value);

        // Create the file name with ".md" extension
        const fileName = `${key}.md`;

        // Write the Markdown content to the file
        fs.writeFileSync(path.join(__dirname, fileName), markdownContent);
    }

    console.log('Markdown files have been generated successfully.');
}

// Input JSON file path
const inputJsonFilePath = path.join(__dirname, file);

// Generate Markdown files
generateMdFilesFromJson(inputJsonFilePath);
