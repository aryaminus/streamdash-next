import React, { Component } from "react";
import SpeechRecognition from "react-speech-recognition";

const Dictaphone = ({
  shownToast,
  transcript,
  setShownToast,
  resetTranscript,
  browserSupportsSpeechRecognition,
}) => {
  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  if (transcript) {
    let lcaseTranscript = transcript.toLowerCase();
    if (lcaseTranscript.includes("dash")) {
      const dashValue = lcaseTranscript.split("dash")[1];
      let word = undefined;
      if (dashValue.includes("clear")) {
        resetTranscript();
      }
      if (dashValue.includes("superchat") || dashValue.includes("super chat"))
        word = "sc";
      if (dashValue.includes("sponsor") || dashValue.includes("sponsors"))
        word = "sp";
      if (dashValue.includes("mod") || dashValue.includes("moderator"))
        word = "mod";
      if (word && dashValue.includes("stop")) {
        setShownToast(shownToast.filter((f) => f !== word));
        resetTranscript();
      }
      if (word && dashValue.includes("start")) {
        setShownToast(shownToast.filter((f) => f !== word).concat([word]));
        resetTranscript();
      }
    }
  }

  return (
    <div>
      <button onClick={resetTranscript}>Reset</button>
      <span>{transcript}</span>
    </div>
  );
};

export default SpeechRecognition(Dictaphone);
