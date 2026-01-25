const https = require('https');

const HALAL_HERO_IMAGES = [
    // Mecca (User provided Unsplash ID: W0FhhtnMd8k)
    // The redirect URL is often reliable, let's test it, but for production we want the final URL.
    // I'll use the ID-based endpoint which usually redirects to the full one. 
    "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=2600&auto=format&fit=crop" // Known ID for W0FhhtnMd8k is actually different. 
    // Let's try the source url directly to see if it works 200 (it typically 302s).
    // "https://source.unsplash.com/W0FhhtnMd8k" 
];

// Actually, let's just Try to hit the Unsplash API via the source URL pattern which is valid for embedding.
// Or better, let's use the explicit Photo URL if I can guess it.
// The photo "people in stadium..." W0FhhtnMd8k is actually:
// https://images.unsplash.com/photo-1564769662533-4f00a87b4056?q=80&w=2600
// Wait, W0FhhtnMd8k maps to https://unsplash.com/photos/W0FhhtnMd8k 
// which is "People in stadium during daytime".
// Let's try to fetch this specific ID via a utility that resolves it, or just use the source link.
// I will use a known reliable Mecca Crowd shot if I can't resolve it, but the user gave a specific one.
// Let's try to resolve it by just running a script that follows the redirect.

// "https://source.unsplash.com/W0FhhtnMd8k" is the best way to get the real URL.
const target = "https://source.unsplash.com/W0FhhtnMd8k";

function checkUrl(url) {
    https.get(url, (res) => {
        console.log(`Status: ${res.statusCode}`);
        if (res.statusCode === 302 || res.statusCode === 301) {
            console.log(`Redirects to: ${res.headers.location}`);
        }
    }).on('error', (e) => {
        console.error(`Error: ${e.message}`);
    });
}
checkUrl(target);
