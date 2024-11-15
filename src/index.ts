import dotenv from "dotenv";
import { KiteConnect } from "kiteconnect";

// Load environment variables from .env file
dotenv.config();

const apiKey = process.env.API_KEY as string;
const apiSecret = process.env.API_SECRET as string;

if (!apiKey || !apiSecret) {
  throw new Error("API_KEY and API_SECRET must be defined in .env file");
}

const kc = new KiteConnect({ api_key: apiKey });

// Function to start the Kite Connect session
async function startKiteSession() {
  try {
    // Step 1: Generate and log the Login URL
    const loginUrl = kc.getLoginURL();
    console.log("1. Open this URL in your browser and login:", loginUrl);

    // After logging in, you’ll get the request_token from the redirected URL.
    const requestToken = "Q682agRIYabJ2ToWE1UNyHuD3ynkpkya"; // Replace this with the actual request token after login.

    // Step 2: Exchange the request token for an access token
    const session = await kc.generateSession(requestToken, apiSecret);
    console.log("2. Access Token:", session.access_token);

    // Step 3: Set the access token for future API calls
    kc.setAccessToken(session.access_token);

    // Step 4: Fetch and display user profile
    const profile = await kc.getProfile();
    console.log("User Profile:", profile);

    // Step 5: Fetch and display market quotes for specific instruments
    const instruments = ["NSE:RELIANCE", "NSE:TCS"];
    const quotes = await kc.getQuote(instruments);
    console.log("Market Quotes:", quotes);
  } catch (error) {
    console.error("Error:", (error as Error).message);
  }
}

// Start the Kite Connect session
startKiteSession();