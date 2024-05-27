const fs = require('fs');
const path = require('path');

// Paths
const artifactPath = path.join(__dirname, '../out/AuthorizeContract.sol/AuthorizeContract.json');
const uiPath = path.join(__dirname, '../../ui/src/abi');
const destPath = path.join(uiPath, 'AuthorizeContract.json');

// Ensure the destination directory exists
if (!fs.existsSync(uiPath)) {
    fs.mkdirSync(uiPath, { recursive: true });
}

// Read the artifact JSON file
fs.readFile(artifactPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the artifact file:', err);
        return;
    }

    // Parse the JSON data
    const artifact = JSON.parse(data);

    // Extract the ABI
    const abi = artifact.abi;

    // Write the ABI to the destination file
    fs.writeFile(destPath, JSON.stringify(abi, null, 2), (err) => {
        if (err) {
            console.error('Error writing the ABI to the destination file:', err);
        } else {
            console.log('ABI successfully copied to:', destPath);
        }
    });
});
