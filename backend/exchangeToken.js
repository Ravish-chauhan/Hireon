const { google } = require("googleapis");
require("dotenv").config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Paste the code you copied from the redirect URL
const code = "4/0AVGzR1CJ3tagN_QCbL0FZE9eakL_g1DJpoV_I7f8vQ-scSw4iIbKl0-9nUwGh376abbm1Q&scope=https://www.googleapis.com/auth/calendar";

async function getTokens() {
  const { tokens } = await oauth2Client.getToken(code);
  console.log("🎟️ Tokens received:\n", tokens);
}



getTokens();
