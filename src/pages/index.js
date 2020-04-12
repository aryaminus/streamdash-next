import React from "react";
import { NextAuth } from "next-auth/client";
import styled, { keyframes } from "styled-components";

import Page from "../components/page";
import Dashboard from "../components/dashboard";

import YouTube from "../utils/youtubeEvents";

const yt = new YouTube("UCbvFlYuA3NsIAkXRNApO-lw", process.env.GOOGLE_API_KEY);

export default class extends React.Component {
  state = {
    updatedData: undefined,
  };

  constructor(props) {
    super(props);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
  }

  static async getInitialProps({ req }) {
    return {
      session: await NextAuth.init({ req }),
      providers: await NextAuth.providers({ req }),
    };
  }

  toggleFullscreen() {
    if (
      document.fullscreenEnabled ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
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
  }

  render() {
    yt.on("ready", () => {
      console.log("ready!");
      yt.listen(10000);
    });

    yt.on("message", (data) => {
      this.setState({ updatedData: data });
    });

    yt.on("error", (error) => {
      console.error(error);
    });

    return (
      <Page title="StreamDash">
        <Background />
        <Grid id="dash">
          <FullScreen>
            <button
              onClick={this.toggleFullscreen}
              style={{ backgroundColor: "#ff000059", fontSize: "18px" }}
            >
              Full Screen
            </button>
          </FullScreen>
          <Main>
            {this.props.session.user ? (
              <Dashboard {...this.props} {...this.state} />
            ) : (
              <>
                <Heading>StreamDash</Heading>
                <SignIn href={this.props.providers["Google"].signin}>
                  Continue with Google
                </SignIn>
              </>
            )}
          </Main>
        </Grid>
      </Page>
    );
  }
}

const FadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(100px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ScaleRight = keyframes`
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
`;

const FadeRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(-100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const ScaleLeft = keyframes`
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
`;

const Background = styled.div`
  position: absolute;
  z-index: -1;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: linear-gradient(
      ${(props) => props.theme.colors.one},
      transparent
    ),
    linear-gradient(
      to top left,
      ${(props) => props.theme.colors.four},
      transparent
    ),
    linear-gradient(
      to top right,
      ${(props) => props.theme.colors.five},
      transparent
    );
  background-blend-mode: screen;
  background-size: cover;
`;

const FullScreen = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  width: 80px;
  height: 50px;
  opacity: 0.5;
  transition-property: opacity;
  transition-duration: 250ms;
  &:hover {
    opacity: 1;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 5% 1fr 35%;
  grid-template-rows: repeat(3, 1fr);
  width: 100%;
  height: 100vh;
`;

const Main = styled.main`
  grid-area: 2/2;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  animation-name: ${FadeUp};
  animation-direction: forwards;
  animation-duration: 500ms;
`;

const Heading = styled.h1`
  font-size: 4em;
  font-weight: lighter;
  margin-top: 0;
  opacity: 0;
  animation-name: ${FadeRight};
  animation-fill-mode: forwards;
  animation-duration: 1000ms;
  animation-timing-function: ease-out;
  @media (${(props) => props.theme.breakpoint}) {
    font-size: 3em;
  }
`;

const SignIn = styled.a`
  font-size: 1.5em;
  display: block;
  margin-left: auto;
  opacity: 0.7;
  color: white;
  text-decoration: none;
  transition: opacity 250ms;
  position: relative;
  opacity: 0;
  animation-name: ${FadeRight};
  animation-fill-mode: forwards;
  animation-duration: 1000ms;
  animation-delay: 1000ms;
  animation-timing-function: ease-out;
  &::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -10px;
    height: 2px;
    background: ${(props) => props.theme.colors.three};
    transform-origin: left;
    animation: ${ScaleLeft} 300ms normal forwards;
    pointer-events: none;
  }
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -10px;
    height: 2px;
    background: ${(props) => props.theme.colors.three};
    opacity: 0.2;
    pointer-events: none;
  }
  &:hover {
    &::before {
      animation: ${ScaleRight} 300ms normal forwards;
    }
  }
  @media (${(props) => props.theme.breakpoint}) {
    font-size: 1.2em;
  }
`;
