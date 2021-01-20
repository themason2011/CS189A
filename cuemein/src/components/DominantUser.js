import React, { useState, useEffect, useRef, useCallback } from "react";
import { Row,Col, Button,Container} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faMehBlank,faGrinStars,faMeh,faTired,faFrownOpen,faSadTear, faLaughBeam,faAngry} from '@fortawesome/free-solid-svg-icons'


const DominantUser = ({ room }) => {
  const [videoTrackss, setVideoTrackss] = useState([]);
  const [audioTrackss, setAudioTrackss] = useState([]);
  const [emotion, setEmotion] = useState("-");
  const [emotion_style, setEmotion_Style] = useState("participant-video");
  const [dominant, setDominant] = useState(null);


  const videoref = useRef();
  const audioref = useRef();

  useEffect(() => {
    const ParticipantDominantSpeaker = user => {
      setDominant(user);
      console.log("new dominant speaker Dominant.js");
    }
    if(room!==null){
      room.on('dominantSpeakerChanged', ParticipantDominantSpeaker);
    }
  },[room]);

  const test = useCallback(
    async event => {
      event.preventDefault();
      console.log(room);
      const getUrl = '/video/emotion?identity=' + dominant.identity + '&room=' + room.name;
      const data = await fetch(getUrl, {
        method: 'GET',
        headers: {
          'Content-Type':'application/json'
        }
      }).then(res => res.json());

      setEmotion(data);
    },[dominant]);

  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);

  useEffect(() => {
    if( dominant != null){
      setVideoTrackss(trackpubsToTracks(dominant.videoTracks));
      setAudioTrackss(trackpubsToTracks(dominant.audioTracks));
      const trackSubscribed = (track) => {
       if (track.kind === "video") {
          setVideoTrackss((videoTracks) => [...videoTracks, track]);
        }
        else if (track.kind === "audio") {
          setAudioTrackss((audioTracks) => [...audioTracks, track]);
        }
      };

      const trackUnsubscribed = (track) => {
       if (track.kind === "video") {
          setVideoTrackss((videoTracks) => videoTracks.filter((v) => v !== track));
        }
        else if (track.kind === "audio"){
          setAudioTrackss((audioTracks) => audioTracks.filter((v) => v !== track));
        }
      };

     dominant.on("trackSubscribed", trackSubscribed);
     dominant.on("trackUnsubscribed", trackUnsubscribed);

      return () => {
        setVideoTrackss([]);
        setAudioTrackss([]);
        dominant.removeAllListeners();
      };
    }
    }, [dominant ]);
  
  const takeSnapshot = (videoElement) => {
    
    var imageCapture = new ImageCapture(videoElement);
    imageCapture.grabFrame().then(bitmap => {
      console.log('bitmap :', bitmap)
      let canvas = document.createElement('canvas')
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      let context = canvas.getContext('2d')
      
      context.drawImage(bitmap, 0, 0)
      canvas.toBlob(function(blob) {
        console.log(blob);
        var reader = new FileReader();
        reader.addEventListener('loadend',() => {
          
          fetch(reader.result)
          .then(res => res.blob())
          .then(blob => {
          console.log("here is your binary: ", blob);
          const fetchUrl = '/video/snapShot?identity=' + dominant.identity + '&room=' + room.name;
          fetch(fetchUrl, {
            method: 'POST',
            body: blob,
            headers: {
              'Content-Type':'application/octet-stream'
            }
          });  
          });

        });
        reader.readAsDataURL(blob);
      }, 'image/jpeg')
    }).catch(function(error) {
      console.log('takePhoto() error: ', error);
    }); 
  }
  function wait(delayInMS) {
    return new Promise(resolve => setTimeout(resolve, delayInMS));
  }
  
  function stop(stream) {
    stream.getTracks().forEach(track => track.stop());
    console.log("Recording stopped");
  }

  const startRecording = (audioElement) => {
   
   let recorder = new MediaRecorder(audioElement);
   let data = [];
   let lengthInMS = 10000;

    recorder.ondataavailable = event => data.push(event.data);
    recorder.start();
    console.log(recorder.state + " for " + (lengthInMS/1000) + " seconds...");

    let stopped = new Promise((resolve, reject) => {
      recorder.onstop = resolve;
      recorder.onerror = event => reject(event.name);
    });

    let recorded = wait(lengthInMS).then(
      () => recorder.state == "recording" && recorder.stop()
    );


    return Promise.all([
      stopped,
      recorded
    ])
    .then(() => data);

    
    }

  const recordAudio = (audioElement) => {
    const MediaStreamer = new MediaStream();
    MediaStreamer.addTrack(audioElement);
    const recorder = new MediaRecorder(MediaStreamer);
    navigator.mediaDevices.getUserMedia({
      audio: true
    }).then(() => startRecording(MediaStreamer, 10000))
    .then (recordedChunks => {
      let recordedBlob = new Blob(recordedChunks, { type: "application/octet-stream" });
      

  
      console.log("Successfully recorded " + recordedBlob.size + " bytes of " +
          recordedBlob.type + " media.");
      console.log(recordedBlob);
      var reader = new FileReader();
        reader.addEventListener('loadend',() => {
          
          fetch(reader.result)
          .then(res => res.blob())
          .then(recordedBlob => {
          console.log("here is your binary: ", recordedBlob);
          const fetchUrl = '/audio/snapShot?identity=' + dominant.identity + '&room=' + room.name;
          fetch(fetchUrl, {
            method: 'POST',
            body: recordedBlob,
            headers: {
              'Content-Type':'application/octet-stream'
            }
          });  
          });

        });
        reader.readAsDataURL(recordedBlob);
    })
  }

  useEffect(() => {
    if(dominant != null){
      const videoTrack = videoTrackss[0];
      if (videoTrack) {
        videoTrack.attach(videoref.current);
        //add delay 
        takeSnapshot(videoTrack.mediaStreamTrack);
        console.log('video track');
        console.log(videoTrack.mediaStreamTrack);
        console.log("attach() Dominant.js");
        return () => {
          console.log("detach() Dominant.js");
          // videoTrack.detach();
        };
      }
    }
  }, [videoTrackss]);

  useEffect(() => {
    if(dominant != null){
      const audioTrack = audioTrackss[0];
      if (audioTrack) {
        audioTrack.attach(audioref.current);
        //add delay 
        console.log('here is audio track');
        console.log(audioTrack.mediaStreamTrack);

        //takeAudioChunk(audioTrack.mediaStreamTrack);
        recordAudio(audioTrack.mediaStreamTrack);
        //stop(audioTrack);
        
        return () => {
          console.log("detach() Dominant.js");
          // videoTrack.detach();
        };
      }
    }
  }, [audioTrackss]);

  //This refreshEmotion thing fixes this in a janky way
  function refreshEmotion() {
    if(dominant != null){
      const videoTrack = videoTrackss[0];
      if (videoTrack) {
        videoTrack.attach(videoref.current);
        //add delay 
        takeSnapshot(videoTrack.mediaStreamTrack);
        console.log("hey this is repeating itself");
        return () => {
          // videoTrack.detach();
        };
      }
    }
    // setTimeout(refreshEmotion, 1000);
  }

  refreshEmotion();

  let emoji;
  if (emotion.emotion === "happiness"){
    emoji = <i><FontAwesomeIcon className={"dominant-emotion-happy"} icon={faLaughBeam} size='2x'/></i>
  } else if (emotion.emotion === "anger"){
    emoji = <i><FontAwesomeIcon className={"dominant-emotion-angry"} icon={faAngry} size='2x'/></i>
  } else if (emotion.emotion === "sadness"){
    emoji = <i><FontAwesomeIcon className={"dominant-emotion-sadness"} icon ={faSadTear} size='2x'/></i>
  } else if (emotion.emotion === "fear"){
    emoji = <i><FontAwesomeIcon className={"dominant-emotion-fear"} icon={faFrownOpen} size='2x'/></i>
  } else if (emotion.emotion === "disgust"){
    emoji = <i><FontAwesomeIcon className={"dominant-emotion-disgust"} icon = {faTired} size = '2x'/></i>
  } else if (emotion.emotion === "neutral"){
    emoji = <i><FontAwesomeIcon className={"dominant-emotion-neutral"} icon = {faMeh} size = '2x'/></i>
  } else if(emotion.emotion ==="surprise"){
    emoji = <i><FontAwesomeIcon className={"dominant-emotion-surprised"} icon = {faGrinStars} size = '2x'/></i>
  } else if(emotion.emotion ==="-"){
    emoji = <i><FontAwesomeIcon className={"dominant-emotion-undefined"} icon = {faMehBlank} size = '2x'/></i>
  }

  return (
    <Col className="i" fluid="true" md={9} style={{position:'relative'}}>
      <Row className="dominant-camera">
        <span className="hoverclass">
        {dominant ? (
        <video className={"participant-video-dominant"} height="100%" ref={videoref} autoPlay={true} />
        ) : (
          <Container className={"default-video-dominant"}></Container>
        )
        }
        {dominant ? (
        <h3 className="dominant-name">{dominant.identity}</h3>
        ) : (
          ''
        )
        }
          {emoji}
        </span>

        {dominant ? (
          <button type="button" className="btn btn-outline-info sentimentbtn" onClick={test}>What Am I Feeling?</button>
          ) : (
            ''
          )
        }
     

      </Row>

    </Col>
  );
};

export default DominantUser;