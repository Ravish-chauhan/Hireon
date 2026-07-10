const { google } = require("googleapis");
require("dotenv").config();

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Scopes: what permissions your app needs
const SCOPES = ["https://www.googleapis.com/auth/calendar"];

// Generate consent URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline", // ensures we get a refresh_token
  prompt: "consent",
  scope: SCOPES,
});

console.log("👉 Authorize this app by visiting this URL:\n");
console.log(authUrl);
