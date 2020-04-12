import React from "react";
import { NextAuth } from "next-auth/client";

import Dashboard from "../components";

export default class extends React.Component {
  static async getInitialProps({ req }) {
    return {
      session: await NextAuth.init({ req }),
      providers: await NextAuth.providers({ req }),
    };
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
