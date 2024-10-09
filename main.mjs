import fs from 'fs';
import https from 'https';
import path from 'path';
import open from 'open'; // Import the open package

const options = {
    method: 'POST',
    hostname: 'terabox-downloader-direct-download-link-generator.p.rapidapi.com',
    port: null,
    path: '/fetch',
    headers: {
        'x-rapidapi-key': '85e5ce0958mshc3dd2e4b8600408p1ef230jsncba0cc13c7f3',
        'x-rapidapi-host': 'terabox-downloader-direct-download-link-generator.p.rapidapi.com',
        'Content-Type': 'application/json'
    }
};

// Function to fetch dlink for a given URL
const fetchDLink = (url) => {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            const chunks = [];

            res.on('data', (chunk) => {
                chunks.push(chunk);
            });

            res.on('end', () => {
                const body = Buffer.concat(chunks).toString();
                try {
                    const jsonResponse = JSON.parse(body);
                    if (jsonResponse.error) {
                        console.error("API returned error:", jsonResponse.error);
                        reject("Invalid response from API.");
                        return;
                    }

                    if (Array.isArray(jsonResponse) && jsonResponse.length > 0) {
                        const dlink = jsonResponse[0].dlink; // Get the dlink from the first item
                        if (dlink) {
                            resolve(dlink); // Resolve the dlink
                        } else {
                            reject("dlink not found in response.");
                        }
                    } else {
                        console.log("Full response body:", body); // Log the full response for debugging
                        reject("Invalid response format.");
                    }
                } catch (error) {
                    console.log("Full response body:", body); // Log the full response for debugging
                    reject("Error parsing JSON response: " + error.message);
                }
            });
        });

        req.on('error', (error) => {
            reject("Error with the request: " + error.message);
        });

        console.log(`Sending request for URL: ${url}`); // Log the URL being sent
        req.write(JSON.stringify({ url }));
        req.end();
    });
};

// Read URLs from the input file
fs.readFile('urls.txt', 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading the file:", err);
        return;
    }

    const urls = data.split('\n').filter(url => url.trim() !== ''); // Split and filter out empty lines

    const promises = urls.map(url => fetchDLink(url.trim())); // Use the original URL directly

    Promise.all(promises)
        .then(results => {
            results.forEach((dlink) => {
                console.log(`Opening URL: ${dlink}`);
                open(dlink); // Open the direct download URL in the default browser
            });
        })
        .catch(error => {
            console.error("Error fetching dlink:", error);
        });
});
