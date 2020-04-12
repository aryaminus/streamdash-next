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

  const toggleFullscreen = () => {
    if (
      (document.fullscreenEnabled ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement)
    ) {
      const i = document.getElementById("dash");
      if (i.requestFullscreen) {
        i.requestFullscreen();
      } else if (i.webkitRequestFullscreen) {
        i.webkitRequestFullscreen();
      } else if (i.mozRequestFullScreen) {
        i.mozRequestFullScreen();
      } else if (i.msRequestFullscreen) {
        i.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  return (
    <div id="dash" className="container">
      <div className="text-center">
        <h1 className="display-4 mt-3 mb-3">StreamDash</h1>
        <button
          onClick={() => {
            toggleFullscreen();
          }}
          className="btn"
          type="button"
        >
          <span>Full Screen</span>
        </button>
        <div className="hero-movieicon">
          <img src="https://i.imgur.com/NNUKJ4y.png" />
        </div>
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
      <div className="footer">
        <p className="love">
          Made with{" "}
          <img src="/static/heart.png" height="14px" width="14px" alt="love" />{" "}
          by Jens de Rond |
          <a
            href="//github.com/Jensderond/movie-time"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Github</span>
          </a>{" "}
          |
          <a
            href="//twitter.com/Jensderond/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Twitter</span>
          </a>
        </p>
      </div>
    </div>
  );
};
