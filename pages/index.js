import React from "react";
import Router from "next/router";
import Link from "next/link";
import { NextAuth } from "next-auth/client";

// export async function getStaticProps({}) {
//   return {
//     props: {},
//   };
// }

export default class extends React.Component {
  static async getInitialProps({ req }) {
    return {
      session: await NextAuth.init({ req }),
      providers: await NextAuth.providers({ req }),
    };
  }

  constructor(props) {
    super(props);
    this.handleSignOutSubmit = this.handleSignOutSubmit.bind(this);
  }

  handleSignOutSubmit(event) {
    event.preventDefault();
    NextAuth.signout()
      .then(() => {
        Router.push("/auth/callback");
      })
      .catch((err) => {
        Router.push("/auth/error?action=signout");
      });
  }

  render() {
    if (this.props.session.user) {
      return <Dashboard {...this.props} />;
    }
    return (
      <div className="container">
        <div className="text-center">
          <h1 className="display-4 mt-3 mb-3">StreamDash</h1>
          <p className="lead mt-3 mb-3">
            Having tough time going through all the messages while Streaming?
          </p>
          <p className="lead mt-3 mb-3">
            Try StreamDash - Realtime Streaming Dashboard
          </p>
          <p>
            <a
              className="btn btn-block btn-outline-secondary"
              href={this.props.providers["Google"].signin}
            >
              Continue with Google
            </a>
          </p>
        </div>
      </div>
    );
  }
}

export class Dashboard extends React.Component {
  render() {
    return (
      <React.Fragment>
        <p>
          <Link href="/auth">
            <a className="btn btn-secondary">Manage Account</a>
          </Link>
        </p>
        <form
          id="signout"
          method="post"
          action="/auth/signout"
          onSubmit={this.handleSignOutSubmit}
        >
          <input
            name="_csrf"
            type="hidden"
            value={this.props.session.csrfToken}
          />
          <button type="submit" className="btn btn-outline-secondary">
            Sign out
          </button>
        </form>
      </React.Fragment>
    );
  }
}
