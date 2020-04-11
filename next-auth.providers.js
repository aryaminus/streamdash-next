// Load environment variables from a .env file if one exists
const dotenvLoad = require("dotenv-load");

dotenvLoad();

module.exports = () => {
  let providers = [];

  if (process.env.GOOGLE_ID && process.env.GOOGLE_SECRET) {
    providers.push({
      providerName: "Google",
      providerOptions: {
        scope: [
          "https://www.googleapis.com/auth/youtube",
          "https://www.googleapis.com/auth/youtube.readonly",
        ],
      },
      Strategy: require("passport-youtube-v3").Strategy,
      strategyOptions: {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
      },
      getProfile(profile) {
        return profile;
      },
    });
  }

  return providers;
};
