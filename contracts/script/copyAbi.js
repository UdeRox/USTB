const fs = require('fs');
const path = require('path');

// Paths
const outDir = path.join(__dirname, '../out');
const uiPath = path.join(__dirname, '../../ui/src/abi');

// Ensure the destination directory exists
if (!fs.existsSync(uiPath)) {
    fs.mkdirSync(uiPath, { recursive: true });
}

// Array of file names to copy
const filesToCopy = ['AuthorizeContract.sol/AuthorizeContract.json', 'MockUSDC.sol/MockUSDC.json'];

// Loop through each file
filesToCopy.forEach(filePath => {
    const artifactPath = path.join(outDir, filePath);
    const destPath = path.join(uiPath, path.basename(filePath));

    // Read the artifact JSON file
    fs.readFile(artifactPath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading the artifact file ${filePath}:`, err);
            return;
        }

        // Parse the JSON data
        const artifact = JSON.parse(data);

        // Extract the ABI
        const abi = artifact.abi;

        // Write the ABI to the destination file
        fs.writeFile(destPath, JSON.stringify(abi, null, 2), (err) => {
            if (err) {
                console.error(`Error writing the ABI to the destination file ${destPath}:`, err);
            } else {
                console.log(`ABI successfully copied to: ${destPath}`);
            }
        });
    });
});