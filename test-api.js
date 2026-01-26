// Using global fetch

async function testChatApi() {
    console.log("--- Testing /api/chat locally ---");
    const payload = {
        prompt: "A fun weekend in Paris",
        isHalal: false
    };

    try {
        const res = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        console.log("Status:", res.status);
        const data = await res.json();
        console.log("Data:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Test Request Failed:", err.message);
    }
}

testChatApi();
