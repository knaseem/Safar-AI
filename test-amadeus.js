require('dotenv').config({ path: '.env.local' });
const Amadeus = require('amadeus');

const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET,
    hostname: process.env.AMADEUS_HOSTNAME || 'test'
});

async function test() {
    try {
        console.log('Testing Amadeus Flight Search...');
        console.log('Client ID:', process.env.AMADEUS_CLIENT_ID);

        const response = await amadeus.shopping.flightOffersSearch.get({
            originLocationCode: 'SYD',
            destinationLocationCode: 'BKK',
            departureDate: '2026-06-01',
            adults: '1',
            max: 1
        });
        console.log('Success! Found', response.data.length, 'flight offers.');
    } catch (error) {
        console.error('Error:', error.response ? error.response.body : error.message);
    }
}

test();
