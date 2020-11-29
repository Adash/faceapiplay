import { useState, useEffect, useRef } from 'react';
import './VideoZone.css';
import * as faceapi from 'face-api.js';

const models = 'https://simhub.github.io/avatar-face-expression/models';

export const VideoZone = () => {
  const [videoOn, setVideoOn] = useState(false);
  const [animationID, setAnimationID] = useState(false);
  const videoRef = useRef();
  const outputRef = useRef();
  const emotionRef = useRef();

  async function initVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    videoRef.current.srcObject = stream;
    setVideoOn(true);
  }

  function startStopVideo() {
    if (videoRef.current.srcObject === null) {
      // initVideo();
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(models),
        faceapi.nets.faceExpressionNet.loadFromUri(models),
      ]).then(initVideo);
    } else {
      videoRef.current.srcObject = null;
      setVideoOn(false);
    }
  }

  async function onPlay() {
    // TODO get faceDetectorOptions
    const options = new faceapi.TinyFaceDetectorOptions();
    const result = await faceapi
      .detectSingleFace(videoRef.current, options)
      .withFaceExpressions();

    if (result) {
      const dimensions = faceapi.matchDimensions(
        outputRef.current,
        videoRef.current,
        true
      );
      const faceLocation = {
        x: result.detection._box._x,
        y: result.detection._box._y,
        width: result.detection._box._width,
        height: result.detection._box._height,
      };
      const emotions = {
        happy: '😀',
        angry: '😡',
        disgusted: '🤢',
        fearful: '😱',
        neutral: '😐',
        surprised: '😳',
      };
      const currentEmotion = result.expressions.asSortedArray()[0].expression;
      emotionRef.current.innerText = emotions[currentEmotion] || currentEmotion;
      emotionRef.current.style.cssText = `
        top: ${faceLocation.y - faceLocation.height / 2}px;
        left: ${faceLocation.x + 30 /*- faceLocation.width / 4*/}px;
        width: ${faceLocation.width}px;
        font-size: ${faceLocation.width * 0.6}px;
      `;
      // faceapi.draw.drawDetections(outputRef.current, faceapi.resizeResults(result, dimensions));
    }

    requestAnimationFrame(onPlay);
  }

  return (
    <div className="videozone-wrapper">
      <div className="videobox-wrapper">
        <video
          onLoadedMetadata={() => onPlay(this)}
          autoPlay
          muted
          playsInline
          ref={videoRef}
        />
        <canvas id="overlay" ref={outputRef} />
        <div id="emotion" ref={emotionRef}></div>
      </div>
      <button className="booton" onClick={startStopVideo}>
        {!videoOn ? 'Video On' : 'Video Off'}
      </button>
    </div>
  );
};
