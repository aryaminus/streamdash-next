// NeDB is an in-memory only database intended here for testing.
const NeDB = require("nedb");

// Load environment variables from a .env file if one exists
const dotenvLoad = require("dotenv-load");

dotenvLoad();

module.exports = () => {
  return new Promise((resolve, reject) => {
    // NeDB is not persistent and is intended for testing only.
    let collection = new NeDB({ autoload: true });
    collection.loadDatabase((err) => {
      if (err) return reject(err);
      resolve(collection);
    });
  }).then((usersCollection) => {
    return Promise.resolve({
      // If a user is not found find() should return null (with no error).
      find: ({ id, email, emailToken, provider } = {}) => {
        let query = {};

        // Find needs to support looking up a user by ID
        if (id) {
          query = { _id: id };
        }

        return new Promise((resolve, reject) => {
          usersCollection.findOne(query, (err, user) => {
            if (err) return reject(err);

            return resolve(user);
          });
        });
      },
      // The user parameter contains a basic user object to be added to the DB.
      // The oAuthProfile parameter is passed when signing in via oAuth.
      //
      // The optional oAuthProfile parameter contains all properties associated
      // with the users account on the oAuth service they are signing in with.
      //
      // You can use this to capture profile.avatar, profile.location, etc.
      insert: (user, oAuthProfile) => {
        user._id = user.google.id;
        user.name = oAuthProfile.displayName;
        return new Promise((resolve, reject) => {
          usersCollection.insert(user, (err, response) => {
            if (err) return reject(err);
            return resolve(user);
          });
        });
      },
      // The user parameter contains a basic user object to be added to the DB.
      // The oAuthProfile parameter is passed when signing in via oAuth.
      //
      // The optional oAuthProfile parameter contains all properties associated
      // with the users account on the oAuth service they are signing in with.
      //
      // You can use this to capture profile.avatar, profile.location, etc.
      update: (user, profile) => {
        return new Promise((resolve, reject) => {
          return resolve(user);
        });
      },
      // The remove parameter is passed the ID of a user account to delete.
      //
      // This method is not used in the current version of next-auth but will
      // be in a future release, to provide an endpoint for account deletion.
      remove: (id) => {
        return new Promise((resolve, reject) => {
          return resolve(true);
        });
      },
      // Serialize turns the value of the ID key from a User object
      serialize: (user) => {
        // Supports serialization from Mongo Object *and* deserialize() object
        if (user.id) {
          // Handle responses from deserialize()
          return Promise.resolve(user.id);
        } else if (user._id) {
          // Handle responses from find(), insert(), update()
          return Promise.resolve(user._id);
        } else {
          return Promise.reject(new Error("Unable to serialize user"));
        }
      },
      // Deserialize turns a User ID into a normalized User object that is
      // exported to clients. It should not return private/sensitive fields,
      // only fields you want to expose via the user interface.
      deserialize: (id) => {
        return new Promise((resolve, reject) => {
          usersCollection.findOne({ _id: id }, (err, user) => {
            if (err) return reject(err);

            // If user not found (e.g. account deleted) return null object
            if (!user) return resolve(null);

            return resolve({
              id: user._id,
              name: user.name,
              email: user.email,
            });
          });
        });
      },
    });
  });
};
