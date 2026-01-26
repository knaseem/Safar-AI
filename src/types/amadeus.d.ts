declare module 'amadeus' {
    class Amadeus {
        constructor(options: { clientId: string; clientSecret: string; hostname?: string });
        location: {
            analytics: {
                categoryRatedAreas: {
                    get(params: { latitude: number; longitude: number }): Promise<any>;
                };
            };
        };
        safety: {
            safetyRatedLocations: {
                get(params: { latitude: number; longitude: number }): Promise<any>;
            };
        };
        ereputation: {
            hotelSentiments: {
                get(params: { hotelIds: string }): Promise<any>;
            };
        };
    }
    export default Amadeus;
}
