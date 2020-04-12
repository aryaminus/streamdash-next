import Router from "next/router";
import { NextAuth } from "next-auth/client";

import YouTube from "../utils/youtubeEvents";

const yt = new YouTube(
  "UCRj_BU95SebaRi2FziXEoTg",
  "AIzaSyDVHXCesT5Rg8zzztYXaKurVy0fns9KJwo"
);

// export async function getServerSideProps(props) {
//   console.log(props);
//   return {};
// }

export default ({ session }) => {
  const handleSignOutSubmit = (event) => {
    event.preventDefault();
    NextAuth.signout()
      .then(() => {
        Router.push("/auth/callback");
      })
      .catch((err) => {
        Router.push("/auth/error?action=signout");
      });
  };

  yt.on("ready", () => {
    console.log("ready!");
    yt.listen(1000);
  });

  yt.on("message", (data) => {
    console.log(data.snippet.displayMessage);
  });

  yt.on("error", (error) => {
    console.error(error);
  });

  return (
    <div className="container">
      <div className="text-center">
        <h1 className="display-4 mt-3 mb-3">StreamDash</h1>
        <form
          id="signout"
          method="post"
          action="/auth/signout"
          onSubmit={handleSignOutSubmit}
        >
          <input name="_csrf" type="hidden" value={session.csrfToken} />
          <button type="submit" className="btn btn-outline-secondary">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
};
