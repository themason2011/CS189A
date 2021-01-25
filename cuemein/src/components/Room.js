import React, { useState, useEffect, useCallback } from "react";
import Video from "twilio-video";
import User from "./User";
import DominantUser from "./DominantUser";
import { Container, Row, Col, Button, Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faVideoSlash,
  faMicrophoneSlash,
  faMicrophone,
  faDesktop,
  faVideo,
  faHeadphones,
<<<<<<< HEAD
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
=======
} from "@fortawesome/free-solid-svg-icons";
import { CIcon } from "@coreui/icons-react";
>>>>>>> react-app

const helpers = require("./helpers");
const muteYourAudio = helpers.muteYourAudio;
const unmuteYourAudio = helpers.unmuteYourAudio;

const Room = ({ meetingname, token, emotion, logout, test }) => {
  const [room, setRoom] = useState(null);
  const [user, setUser] = useState([]);
  //create user array here
  //implement
<<<<<<< HEAD
  const [newDomName, setNewDomName] = useState("no-one");
=======
  const [newDomName, setNewDomName] = useState("");
>>>>>>> react-app
  const [mute, setMute] = useState(false);
  const [videomute, setVideomute] = useState(false);
  const [deafenmute, setDeafenmute] = useState(false);
  var intervalID;
  var sentiment_intervalID;
  console.log("Room.js render");

  const takeSnapshot = (room, users) => {
    if (!room.localParticipant.videoTracks.entries().next()) {
      var videoElement = room.localParticipant.videoTracks.entries().next()
        .value[1].track.mediaStreamTrack;
      var imageCapture = new ImageCapture(videoElement);
      imageCapture
        .grabFrame()
        .then((bitmap) => {
          console.log("bitmap :", bitmap);
          let canvas = document.createElement("canvas");
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          let context = canvas.getContext("2d");

          context.drawImage(bitmap, 0, 0);
          canvas.toBlob(function (blob) {
            console.log(blob);
            var reader = new FileReader();
            reader.addEventListener("loadend", () => {
              fetch(reader.result)
                .then((res) => res.blob())
                .then((blob) => {
                  console.log("here is your binary: ", blob);
                  fetch(
                    "/video/snapShot?identity=" +
                      room.localParticipant.identity +
                      "&room=" +
                      room.name,
                    {
                      method: "POST",
                      body: blob,
                      headers: {
                        "Content-Type": "application/octet-stream",
                      },
                    }
                  );
                });
            });
            reader.readAsDataURL(blob);
          }, "image/jpeg");
        })
        .catch(function (error) {
          console.log("takePhoto() error: ", error);
        });
    }
  };

  //passing array here
  //user state = array for rendering
  const updateUserSentiments = (users) => {
    console.log(users);
    users.forEach((u) => {
      fetch("/video/emotion?identity=" + u.identity + "&room=" + room.name, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        u.emotion = res.body.emotion;
      });
    });
  };

  const restartSentiment = (user) => {
    if (sentiment_intervalID) {
      window.clearInterval(sentiment_intervalID);
    }
    sentiment_intervalID = window.setInterval(
      updateUserSentiments,
      10000,
      user
    );
  };

  useEffect(() => {
    console.log("dominant speacjer Room.js effect");
    const participantConnected = (new_user) => {
      console.log("Room.js - particiapnt connected", new_user);
      //add user to array
      setUser((prevusers) => [...prevusers, new_user]);
      restartSentiment(user);
    };

    const participantDisconnected = (gone_user) => {
      console.log("Room.js - particiapnt disconnected", gone_user);
      //remove user from array
      setUser((prevusers) => prevusers.filter((p) => p !== gone_user));
      restartSentiment(user);
    };

    const ParticipantNewDominantSpeaker = (user) => {
      if (user !== null) {
        console.log("dominant speacjjer Room.js");
        setNewDomName(user.identity);
      } else if (user === null) {
        console.log("dominant speacker Room.js");
        setNewDomName(null);
      }
    };

    const participantRemoteVideoMuted = (track, user) => {
      console.log("Room.js - Track disable", track, user);
    };

<<<<<<< HEAD
    // const participantRemotedAudioMuted = (track,user)  => {

    // }
=======
    const participantRemotedAudioMuted = (track, user) => {};
>>>>>>> react-app

    Video.connect(token, {
      name: meetingname,
      dominantSpeaker: true,
      audio: true,
      video: true,
    }).then((room) => {
      console.log("Room.js - line 59 - video.connect", room);
      setRoom(room);
      //intervalID = window.setInterval(takeSnapshot, 10000, room,user);
      room.on("participantConnected", participantConnected);
      room.on("participantDisconnected", participantDisconnected);
      room.on("dominantSpeakerChanged", ParticipantNewDominantSpeaker);
      room.on("trackDisabled", participantRemoteVideoMuted);
      room.participants.forEach(participantConnected);
      intervalID = window.setInterval(takeSnapshot, 10000, room, user);
      console.log("testing - line 61!!!!!!", room);
    });

    return () => {
      if (intervalID) {
        window.clearInterval(intervalID);
      }
      setRoom((currentRoom) => {
        console.log("testing - line 65!!!!!!", currentRoom);
        if (currentRoom && currentRoom.localParticipant.state === "connected") {
          currentRoom.localParticipant.tracks.forEach(function (
            trackPublication
          ) {
            trackPublication.track.stop();
          });
          console.log("disconnect!!!!!!");
          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, [meetingname, token]);

  const mutecallback = useCallback(() => {
    console.log("called mutecallback, button pressed");
    if (mute === false && room !== null) {
      muteYourAudio(room);
      setMute(true);
    } else if (mute === true && room !== null) {
      unmuteYourAudio(room);
      setMute(false);
    }
  }, [mute, room]);

  const mutevideocallback = useCallback(() => {
    console.log("called mutevideocallback, button pressed");
    if (videomute === false && room !== null) {
      helpers.muteYourVideo(room);
      setVideomute(true);
    } else if (videomute === true && room !== null) {
      helpers.unmuteYourVideo(room);
      setVideomute(false);
    }
  }, [videomute, room]);

  const defeancallback = useCallback(() => {
    console.log("called deafencallback, button pressed");
    if (deafenmute === false && room !== null) {
      muteYourAudio(room);
      setDeafenmute(true);
    } else if (deafenmute === true && room != null) {
      unmuteYourAudio(room);
      setDeafenmute(false);
    }
  }, [room, deafenmute]);

  const logoutcallback = useCallback(() => {
    console.log("testing - line 125!!!!!!", room);
    if (room && room.localParticipant.state === "connected") {
      room.localParticipant.tracks.forEach(function (trackPublication) {
        trackPublication.track.stop();
      });
      console.log("Room.js disconnect!!!!!! - line 132");
      room.disconnect();
    }
    logout();
  }, [room]);

  const remoteParticipants = user.map((user, index) => (
    <User key={index} user={user} mute={deafenmute} />
  ));

  return (
    <div className="room">
<<<<<<< HEAD
=======
      {/* <Nav className="navbar navbar-inverse">
        <div className="container-fluid">
          <Nav.Item className="mr-auto">
            <Navbar.Brand>Talking: {newDomName}</Navbar.Brand>
          </Nav.Item>
          <Nav.Item className="mx-auto">
            <Navbar.Brand>Room Name: {meetingname}</Navbar.Brand>
          </Nav.Item>
          <Nav.Item className="ml-auto">
            <Button variant="danger" onClick={logoutcallback}>
              LOG OUT
            </Button>
          </Nav.Item>
        </div>
      </Nav> */}
>>>>>>> react-app
      <Container className="cameras" fluid="true">
        <Row className="cameras-row">
          <Col sm={2} className="local-participant">
            {room ? (
              <div className="local-participant-camera">
                <User
                  key={room.localParticipant.sid}
                  user={room.localParticipant}
                  mute={deafenmute}
                  local={"i"}
                />
              </div>
            ) : (
              ""
            )}
            <div className="remote-participants">{remoteParticipants}</div>
          </Col>
          <Col sm={10} className="dominant">
            <DominantUser
              className="dominant-user"
              key={"dominant"}
              room={room}
            />
            <div className="dominant-header-bg">
              <div className="dominant-header">
                <div className="dominant-header-room">
                  Room Name: {meetingname}
                </div>
                <div className="dominant-header-speaker">
                  Talking: {newDomName}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Container fluid="true">
<<<<<<< HEAD
        <div className = "logoutbutton">
          <Row className = "logoutbtn">
          <Col>
              <Button variant="danger" onClick={logoutcallback} style={{float: 'right'}}>
                LOG OUT
              </Button>
            </Col>
          </Row>
        </div>
        <div className="toolbar">
          <Row className="toolbar-items">
=======
        <div className="toolbar">
          <Row className="toolbar-items">
            <Col>
              <Button variant="danger" onClick={logoutcallback}>
                LOG OUT
              </Button>
            </Col>
>>>>>>> react-app
            <Col>
              {mute ? (
                <Button
                  type="button"
<<<<<<< HEAD
                  className="btn btn-basic btn-rounded btn-xl"
                  onClick={mutecallback}
                >
                  UNMUTE

=======
                  className="btn btn-info btn-circle btn-xl"
                  onClick={mutecallback}
                >
>>>>>>> react-app
                  <FontAwesomeIcon icon={faMicrophoneSlash} />
                </Button>
              ) : (
                <Button
                  type="button"
<<<<<<< HEAD
                  className="btn btn-basic btn-rounded btn-xl"
                  onClick={mutecallback}
                >
                  MUTE ME

=======
                  className="btn btn-info btn-circle btn-xl"
                  onClick={mutecallback}
                >
>>>>>>> react-app
                  <FontAwesomeIcon icon={faMicrophone} />
                </Button>
              )}
            </Col>
            <Col>
              {videomute ? (
                <Button
                  type="button"
<<<<<<< HEAD
                  className="btn btn-basic btn-rounded btn-xl"
                  onClick={mutevideocallback}
                >
                  CAMERA
=======
                  className="btn btn-info btn-circle btn-xl"
                  onClick={mutevideocallback}
                >
>>>>>>> react-app
                  <FontAwesomeIcon icon={faVideoSlash} />
                </Button>
              ) : (
                <Button
                  type="button"
<<<<<<< HEAD
                  className="btn btn-basic btn-rounded btn-xl far"
                  onClick={mutevideocallback}
                >
                  CAMERA 
=======
                  className="btn btn-info btn-circle btn-xl far"
                  onClick={mutevideocallback}
                >
>>>>>>> react-app
                  <FontAwesomeIcon icon={faVideo} />
                </Button>
              )}
            </Col>
            <Col>
              {deafenmute ? (
                <Button
                  type="button"
<<<<<<< HEAD
                  className="btn btn-basic btn-rounded btn-xl"
                  onClick={defeancallback}
                >
                  SILENCE 
=======
                  className="btn btn-info btn-circle btn-xl"
                  onClick={defeancallback}
                >
>>>>>>> react-app
                  <FontAwesomeIcon icon={faTimes} />
                </Button>
              ) : (
                <Button
                  type="button"
<<<<<<< HEAD
                  className="btn btn-basic btn-rounded btn-xl"
                  onClick={defeancallback}
                >
                  SILENCE 
=======
                  className="btn btn-info btn-circle btn-xl"
                  onClick={defeancallback}
                >
>>>>>>> react-app
                  <FontAwesomeIcon icon={faHeadphones} />
                </Button>
              )}
            </Col>
            <Col>
<<<<<<< HEAD
              <Button type="button" className="btn btn-basic btn-rounded btn-xl">
=======
              <Button type="button" className="btn btn-info btn-circle btn-xl">
>>>>>>> react-app
                <FontAwesomeIcon icon={faDesktop} />
              </Button>
            </Col>
          </Row>
        </div>
<<<<<<< HEAD
        <div className = "reactionsbutton">
          <Row className = "reactions">
          <Col>
              <Button type="button" className="btn btn-basic btn-circle btn-xl">
                REACTIONS
                <FontAwesomeIcon icon={faThumbsUp} />
              </Button>
            </Col>
          </Row>
              </div>
=======
>>>>>>> react-app
      </Container>
    </div>
  );
};

export default Room;
