import Router from "next/router";
import { NextAuth } from "next-auth/client";

export default ({ session, updatedData }) => {
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
