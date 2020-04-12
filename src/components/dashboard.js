import React, { useState, useEffect, useContext } from "react";
import Router from "next/router";
import { toast } from "react-toastify";
import styled from "styled-components";
import { NextAuth } from "next-auth/client";

import { timeString, timeDiff } from "../utils/time";

const currentTime = new Date();

export default ({ session, updatedData }) => {
  const [time, setTime] = useState(timeString(timeDiff(currentTime)));

  useEffect(() => {
    setTime(timeString(timeDiff(currentTime)));

    const timerInterval = setInterval(() => {
      const timeCurrent = timeString(timeDiff(currentTime));
      setTime(timeCurrent);
    }, 1000);
    return () => {
      clearInterval(timerInterval);
    };
  });

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
    <>
      <SignOut>
        <form
          id="signout"
          method="post"
          action="/auth/signout"
          onSubmit={handleSignOutSubmit}
        >
          <input name="_csrf" type="hidden" value={session.csrfToken} />
          <button
            type="submit"
            style={{ backgroundColor: "#ff000059", fontSize: "18px" }}
          >
            Sign out
          </button>
        </form>
      </SignOut>
      <Time>{time}</Time>
    </>
  );
};

const SignOut = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 80px;
  height: 50px;
  opacity: 0.5;
  transition-property: opacity;
  transition-duration: 250ms;
  &:hover {
    opacity: 1;
  }
`;

const Time = styled.div`
  font-size: 10em;
  text-align: center;
  font-weight: lighter;
  font-variant-numeric: tabular-nums;
  @media (${(props) => props.theme.breakpoint}) {
    font-size: 4em;
  }
`;