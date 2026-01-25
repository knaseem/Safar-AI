const https = require('https');

const HALAL_HERO_IMAGES = [
    // Mecca (User ID: W0FhhtnMd8k)
    // Using the /photo-ID endpoint which usually works for finding the real one.
    "https://images.unsplash.com/photo-W0FhhtnMd8k?q=80&w=2600&auto=format&fit=crop",

    // Medina (User ID: jQUB81i93po)
    "https://images.unsplash.com/photo-jQUB81i93po?q=80&w=2600&auto=format&fit=crop"
];

function checkUrl(url, index) {
    https.get(url, (res) => {
        console.log(`[${index}] Status: ${res.statusCode} - ${url.substring(0, 40)}...`);
        if (res.statusCode === 302 || res.statusCode === 301) {
            console.log(`[${index}] Redirects OK`);
        } else if (res.statusCode !== 200) {
            console.error(`--> BROKEN: ${url} (Status: ${res.statusCode})`);
        }
    }).on('error', (e) => {
        console.error(`[${index}] Error: ${e.message}`);
    });
}

console.log("Checking Unsplash IDs...");
HALAL_HERO_IMAGES.forEach((url, i) => checkUrl(url, i));
