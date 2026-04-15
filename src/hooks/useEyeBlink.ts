import { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";

export function useEyeBlink(
  videoRef: React.RefObject<HTMLVideoElement>
) {
  const [blinkCount, setBlinkCount] = useState(0);
  const eyeClosedRef = useRef(false);

  const EAR_THRESHOLD = 0.22;

  const calculateEAR = (eye: any[]) => {
    const v1 = Math.hypot(eye[1].x - eye[5].x, eye[1].y - eye[5].y);
    const v2 = Math.hypot(eye[2].x - eye[4].x, eye[2].y - eye[4].y);
    const h = Math.hypot(eye[0].x - eye[3].x, eye[0].y - eye[3].y);
    return (v1 + v2) / (2 * h);
  };

  useEffect(() => {
    if (!videoRef.current) return;

    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      if (!results.multiFaceLandmarks?.length) return;

      const landmarks = results.multiFaceLandmarks[0];

      const leftEye = [
        landmarks[33],
        landmarks[160],
        landmarks[158],
        landmarks[133],
        landmarks[153],
        landmarks[144],
      ];

      const ear = calculateEAR(leftEye);

      if (ear < EAR_THRESHOLD && !eyeClosedRef.current) {
        eyeClosedRef.current = true;
      }

      if (ear >= EAR_THRESHOLD && eyeClosedRef.current) {
        setBlinkCount((prev) => prev + 1);
        eyeClosedRef.current = false;
      }
    });

    let active = true;

    const process = async () => {
      if (!videoRef.current || !active) return;
      await faceMesh.send({ image: videoRef.current });
      requestAnimationFrame(process);
    };

    process();

    return () => {
      active = false;
    };
  }, [videoRef]);

  return blinkCount;
}


