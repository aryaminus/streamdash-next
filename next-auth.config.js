// If we want to pass a custom session store then we also need to pass an
// instance of Express Session along with it.
const expressSession = require("express-session");

// Load environment variables from a .env file if one exists
const dotenvLoad = require("dotenv-load");

const nextAuthProviders = require("./next-auth.providers");
const nextAuthFunctions = require("./next-auth.functions");

dotenvLoad();

// If no store set, NextAuth defaults to using Express Sessions in-memory
// session store (the fallback is intended as fallback for testing only).
let sessionStore;

const nextConfig = () => {
  // We connect to the User DB before we define our functions.
  // next-auth.functions.js returns an async method that does that and returns
  // an object with the functions needed for authentication.
  return nextAuthFunctions().then((functions) => {
    return new Promise((resolve, reject) => {
      // This is the config block we return, ready to be passed to NextAuth
      resolve({
        // Define a port (if none passed, will not start Express)
        port: process.env.PORT || 3000,
        // Secret used to encrypt session data on the server.
        sessionSecret: process.env.SESSION_SECRET,
        // Maximum Session Age in ms (optional, default is 7 days).
        // The expiry time for a session is reset every time a user revisits
        // the site or revalidate their session token. This is the maximum
        // idle time value.
        sessionMaxAge: 60000 * 60 * 24 * 7,
        // Session Revalidation in X ms (optional, default is 60 seconds).
        // Specifies how often a Single Page App should revalidate a session.
        // Does not impact the session life on the server, but causes clients
        // to fetch session info (even if it is in a local cache) after N
        // seconds has elapsed since it was last checked so they always display
        // state correctly.
        // If set to 0 will revalidate a session before rendering every page.
        sessionRevalidateAge: 60000,
        // Canonical URL of the server (optional, but recommended).
        // e.g. 'http://localhost:3000' or 'https://www.example.com'
        // Used in callback URLs and email sign in links. It will be auto
        // generated if not specified, which may cause problems if your site
        // uses multiple aliases (e.g. 'example.com and 'www.examples.com').
        serverUrl: process.env.SERVER_URL || null,
        // Add an Express Session store.
        expressSession: expressSession,
        sessionStore: sessionStore,
        // Define oAuth Providers
        providers: nextAuthProviders(),
        // Define functions for managing users and sending email.
        functions: functions,
      });
    });
  });
};

module.exports = nextConfig;
