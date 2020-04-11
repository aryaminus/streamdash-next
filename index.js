const next = require("next");
const nextAuth = require("next-auth");

const dotenvLoad = require("dotenv-load");

const nextAuthConfig = require("./next-auth.config");

dotenvLoad();

// Initialize Next.js
const nextApp = next({
  dir: ".",
  dev: process.env.NODE_ENV === "development",
});

// Add next-auth to next app
nextApp
  .prepare()
  .then(async () => {
    // Load configuration and return config object
    const nextAuthOptions = await nextAuthConfig();

    // Pass Next.js App instance and NextAuth options to NextAuth
    const nextAuthApp = await nextAuth(nextApp, nextAuthOptions);

    console.log(`Ready on http://localhost:${process.env.PORT || 3000}`);
  })
  .catch((err) => {
    console.log("An error occurred, unable to start the server");
    console.log(err);
  });
