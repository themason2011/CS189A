import React, { useState, useEffect, useRef, useCallback } from "react";
<<<<<<< HEAD
import { Row, Col, Container } from "react-bootstrap";
=======
import { Row, Col, Button, Container } from "react-bootstrap";
>>>>>>> react-app
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMehBlank,
  faGrinStars,
  faMeh,
  faTired,
  faFrownOpen,
  faSadTear,
  faLaughBeam,
  faAngry,
} from "@fortawesome/free-solid-svg-icons";

const DominantUser = ({ room }) => {
  const [videoTrackss, setVideoTrackss] = useState([]);
  const [emotion, setEmotion] = useState("-");
  const [dominant, setDominant] = useState(null);

  const videoref = useRef();

  useEffect(() => {
    const ParticipantDominantSpeaker = (user) => {
      setDominant(user);
      console.log("new dominant speaker Dominant.js");
    };
    if (room !== null) {
      room.on("dominantSpeakerChanged", ParticipantDominantSpeaker);
    }
  }, [room]);
<<<<<<< HEAD

  const test = useCallback(
    async (event) => {
      event.preventDefault();
      console.log(room);
      const getUrl =
        "/video/emotion?identity=" + dominant.identity + "&room=" + room.name;
      const data = await fetch(getUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());

      setEmotion(data);
    },
    [dominant, room]
  );
=======
>>>>>>> react-app

  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);

  useEffect(() => {
    if (dominant != null) {
      setVideoTrackss(trackpubsToTracks(dominant.videoTracks));

      const trackSubscribed = (track) => {
        if (track.kind === "video") {
          setVideoTrackss((videoTracks) => [...videoTracks, track]);
        }
      };

      const trackUnsubscribed = (track) => {
        if (track.kind === "video") {
          setVideoTrackss((videoTracks) =>
            videoTracks.filter((v) => v !== track)
          );
        }
      };

      dominant.on("trackSubscribed", trackSubscribed);
      dominant.on("trackUnsubscribed", trackUnsubscribed);

      return () => {
        setVideoTrackss([]);
        dominant.removeAllListeners();
      };
    }
  }, [dominant]);

  const takeSnapshot = (videoElement) => {
    var imageCapture = new ImageCapture(videoElement);
    imageCapture
      .grabFrame()
      .then((bitmap) => {
        console.log("bitmap :", bitmap);
        let canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        let context = canvas.getContext("2d");
<<<<<<< HEAD

        context.drawImage(bitmap, 0, 0);
        canvas.toBlob(function (blob) {
          console.log(blob);
          var reader = new FileReader();
          reader.addEventListener("loadend", () => {
            fetch(reader.result)
              .then((res) => res.blob())
              .then((blob) => {
                console.log("here is your binary: ", blob);
                const fetchUrl =
                  "/video/snapShot?identity=" +
                  dominant.identity +
                  "&room=" +
                  room.name;
                fetch(fetchUrl, {
                  method: "POST",
                  body: blob,
                  headers: {
                    "Content-Type": "application/octet-stream",
                  },
                });
              });
          });
          reader.readAsDataURL(blob);
        }, "image/jpeg");
      })
      .catch(function (error) {
        console.log("takePhoto() error: ", error);
      });
  };
  useEffect(() => {
=======

        context.drawImage(bitmap, 0, 0);
        canvas.toBlob(function (blob) {
          console.log(blob);
          var reader = new FileReader();
          reader.addEventListener("loadend", () => {
            fetch(reader.result)
              .then((res) => res.blob())
              .then((blob) => {
                console.log("here is your binary: ", blob);
                const fetchUrl =
                  "/video/snapShot?identity=" +
                  dominant.identity +
                  "&room=" +
                  room.name;
                fetch(fetchUrl, {
                  method: "POST",
                  body: blob,
                  headers: {
                    "Content-Type": "application/octet-stream",
                  },
                }).then(() => {
                  //Update the UI Sentiment to display the most up-to-date sentiment, according to backend
                  fetchVideoSentiment();
                });
              });
          });
          reader.readAsDataURL(blob);
        }, "image/jpeg");
      })
      .catch(function (error) {
        console.log("takePhoto() error: ", error);
      });
  };

  const fetchVideoSentiment = async () => {
    const getUrl =
      "/video/emotion?identity=" + dominant.identity + "&room=" + room.name;
    const data = await fetch(getUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    setEmotion(data);
  };

  //Takes a snapshot, which calls to backend API to update emotion, every time there is a change in who the Dominant User is AND every 3 seconds
  useEffect(() => {
    const snapshotInterval = setInterval(() => {
      if (dominant != null) {
        const videoTrack = videoTrackss[0];
        if (videoTrack) {
          takeSnapshot(videoTrack.mediaStreamTrack);

          return () => {
            // videoTrack.detach();
          };
        }
      }
    }, 2000);
    return () => clearInterval(snapshotInterval);
  }, [videoTrackss]);

  useEffect(() => {
>>>>>>> react-app
    if (dominant != null) {
      const videoTrack = videoTrackss[0];
      if (videoTrack) {
        videoTrack.attach(videoref.current);
<<<<<<< HEAD
        //add delay
        takeSnapshot(videoTrack.mediaStreamTrack);
=======
>>>>>>> react-app
        console.log("attach() Dominant.js");
        return () => {
          console.log("detach() Dominant.js");
          // videoTrack.detach();
        };
      }
    }
  }, [videoTrackss]);

<<<<<<< HEAD
  let emoji;
  if (emotion.emotion === "happiness") {
    emoji = (
      <i>
        <FontAwesomeIcon
          className={"dominant-emotion-happy"}
          icon={faLaughBeam}
          size="2x"
        />
      </i>
    );
  } else if (emotion.emotion === "anger") {
    emoji = (
      <i>
        <FontAwesomeIcon
          className={"dominant-emotion-angry"}
          icon={faAngry}
          size="2x"
        />
      </i>
    );
  } else if (emotion.emotion === "sadness") {
    emoji = (
      <i>
        <FontAwesomeIcon
          className={"dominant-emotion-sadness"}
          icon={faSadTear}
          size="2x"
        />
      </i>
    );
  } else if (emotion.emotion === "fear") {
    emoji = (
      <i>
        <FontAwesomeIcon
          className={"dominant-emotion-fear"}
          icon={faFrownOpen}
          size="2x"
        />
      </i>
    );
  } else if (emotion.emotion === "disgust") {
    emoji = (
      <i>
        <FontAwesomeIcon
          className={"dominant-emotion-disgust"}
          icon={faTired}
          size="2x"
        />
      </i>
    );
  } else if (emotion.emotion === "neutral") {
    emoji = (
      <i>
        <FontAwesomeIcon
          className={"dominant-emotion-neutral"}
          icon={faMeh}
          size="2x"
        />
      </i>
    );
  } else if (emotion.emotion === "surprise") {
    emoji = (
      <i>
        <FontAwesomeIcon
          className={"dominant-emotion-surprised"}
          icon={faGrinStars}
          size="2x"
        />
      </i>
    );
  } else if (emotion.emotion === "-") {
    emoji = (
      <i>
        <FontAwesomeIcon
          className={"dominant-emotion-undefined"}
          icon={faMehBlank}
          size="2x"
        />
      </i>
    );
=======
  //CAN BE UNCOMMENTED TO HAVE UI SENTIMENT REPEATEDLY FORCE REFRESH EVERY 1 SEC (DEBUG/TESTING).
  //Could also be used if we end up updating video and audio sentiment async, to ensure that the latest
  //sentiment is always being used.
  // useEffect(() => {
  //   const refreshSentimentInterval = setInterval(() => {
  //     fetchVideoSentiment();
  //   }, 1000);
  //   return () => clearInterval(refreshSentimentInterval);
  // }, [videoTrackss]);

  let emoji;
  let emotiontext;
  if (emotion.emotion === "happiness") {
    emoji = (
      // <img
      //   className="dominant-emotion-happy-img"
      //   src="https://img.icons8.com/color/48/000000/happy--v1.png"
      // />

      <FontAwesomeIcon
        className={"dominant-emotion-happy"}
        icon={faLaughBeam}
        size="2x"
      />
    );

    emotiontext = "HAPPY";
  } else if (emotion.emotion === "anger") {
    emoji = (
      <FontAwesomeIcon
        className={"dominant-emotion-angry"}
        icon={faAngry}
        size="2x"
      />
    );
    emotiontext = "ANGRY";
  } else if (emotion.emotion === "sadness") {
    emoji = (
      <FontAwesomeIcon
        className={"dominant-emotion-sadness"}
        icon={faSadTear}
        size="2x"
      />
    );
    emotiontext = "SADNESS";
  } else if (emotion.emotion === "fear") {
    emoji = (
      <FontAwesomeIcon
        className={"dominant-emotion-fear"}
        icon={faFrownOpen}
        size="2x"
      />
    );
    emotiontext = "FEAR";
  } else if (emotion.emotion === "disgust") {
    emoji = (
      <FontAwesomeIcon
        className={"dominant-emotion-disgust"}
        icon={faTired}
        size="2x"
      />
    );
    emotiontext = "DISGUST";
  } else if (emotion.emotion === "neutral") {
    emoji = (
      <FontAwesomeIcon
        className={"dominant-emotion-neutral"}
        icon={faMeh}
        size="2x"
      />
    );
    emotiontext = "NEUTRAL";
  } else if (emotion.emotion === "surprise") {
    emoji = (
      <FontAwesomeIcon
        className={"dominant-emotion-surprised"}
        icon={faGrinStars}
        size="2x"
      />
    );
    emotiontext = "SURPRISE";
  } else if (emotion.emotion === "-") {
    emoji = (
      <FontAwesomeIcon
        className={"dominant-emotion-undefined"}
        icon={faMehBlank}
        size="2x"
      />
    );
    emotiontext = "UNDEFINED";
>>>>>>> react-app
  }

  return (
    <Row className="dominant-camera">
      {/* <span className="hoverclass"> */}
      {dominant ? (
        <video
          className={"participant-video-dominant"}
          width="100%"
          height="100%"
          ref={videoref}
          autoPlay={true}
        />
      ) : (
        <div className={"default-video-dominant"}></div>
      )}
      {/* {dominant ? <h3 className="dominant-name">{dominant.identity}</h3> : ""} */}
      {/* {emoji} */}
      {/* </span> */}

<<<<<<< HEAD
      {dominant ? (
        <div className="dominant-border">
          <div className="dominant-border-name">{dominant.identity}</div>
          {/* {dominant ? (
            <button
              type="button"
              className="btn btn-dominant btn-outline-info sentimentbtn"
              onClick={test}
            >
              What Am I Feeling?
            </button>
          ) : (
            ""
          )} */}
          <div className="dominant-border-emotion">
            <div className="dominant-border-emotion-background">
              <div className="dominant-border-emotion-icon">
                <img
                  className="dominant-emotion-happy-img"
                  src="https://img.icons8.com/color/48/000000/happy--v1.png"
                />
              </div>
              <div className="dominant-border-emotion-text">Happy</div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
=======
      <div className="dominant-border-emotion-icon">
        <h3 className="dominant-border-emotion-header">Emotion</h3>
        <div className="dominant-icon">{emoji}</div>
      </div>

      <div className="dominant-border">
        {dominant ? (
          <div className="dominant-border-name">{dominant.identity}</div>
        ) : (
          ""
        )}
        <div className="dominant-border-emotion-background">
          <div className="dominant-border-emotion-text">{emotiontext}</div>
        </div>
      </div>
>>>>>>> react-app
    </Row>
  );
};

export default DominantUser;
