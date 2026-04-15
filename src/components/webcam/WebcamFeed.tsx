import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import { motion } from "framer-motion";
import { Video, VideoOff, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWebcam } from "@/hooks/useWebcam";

export interface FaceMetrics {
  eyeContact: number;
  blinkRate: number;
  headPose: number;
  faceVisible: boolean;
}

export interface WebcamFeedHandle {
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  isActive: boolean;
  captureFrame: () => Promise<Blob>;
  getFaceMetrics: () => FaceMetrics;
}

export const WebcamFeed = forwardRef<WebcamFeedHandle>((_, ref) => {
  const { videoRef, isLoading, error, isActive, startCamera, stopCamera } =
    useWebcam({ autoStart: true });

  const metricsRef = useRef<FaceMetrics>({
    eyeContact: 0,
    blinkRate: 0,
    headPose: 0,
    faceVisible: false,
  });

  const blinkCount = useRef(0);
  const blinkStart = useRef(Date.now());

  useEffect(()=>{
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
      if (!results.multiFaceLandmarks?.length) {
        metricsRef.current.faceVisible = false;
        return;
      }

      metricsRef.current.faceVisible = true;
      const lm = results.multiFaceLandmarks[0];

      // Head pose (yaw)
      const nose = lm[1];
      const leftEye = lm[33];
      const rightEye = lm[263];
      const centerX = (leftEye.x + rightEye.x) / 2;
      const yaw = Math.abs(nose.x - centerX);

      metricsRef.current.headPose = Math.max(
        0,
        Math.min(100, 100 - yaw * 350)
      );

      // Eye contact
      metricsRef.current.eyeContact =
        yaw < 0.03 ? 95 : yaw < 0.06 ? 70 : 40;

      // Blink (EAR)
      const upper = lm[159];
      const lower = lm[145];
      const ear = Math.abs(upper.y - lower.y);

      if (ear < 0.008) {
        blinkCount.current++;
        const mins = (Date.now() - blinkStart.current) / 60000;
        metricsRef.current.blinkRate = Math.round(
          blinkCount.current / Math.max(mins, 0.1)
        );
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await faceMesh.send({ image: videoRef.current! });
      },
      width: 640,
      height: 480,
    });

    camera.start();
    return () => camera.stop();
  }, []);

  useImperativeHandle(ref, () => ({
    startCamera,
    stopCamera,
    isActive,
    captureFrame: async () => {
      const canvas = document.createElement("canvas");
      const v = videoRef.current!;
      canvas.width = v.videoWidth;
      canvas.height = v.videoHeight;
      canvas.getContext("2d")!.drawImage(v, 0, 0);
      return new Promise((res) =>
        canvas.toBlob((b) => res(b!), "image/jpeg")
      );
    },
    getFaceMetrics: () => metricsRef.current,
  }));

  return (
    <div className="relative aspect-video bg-muted overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
        style={{ transform: "scaleX(-1)" }}
      />

      {isLoading && (
        <motion.div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </motion.div>
      )}

      {error && (
        <motion.div className="absolute inset-0 flex items-center justify-center">
          <AlertCircle />
        </motion.div>
      )}

      {isActive && (
        <div className="absolute top-3 right-3">
          <Badge className="bg-success text-white">Live</Badge>
        </div>
      )}
    </div>
  );
});

WebcamFeed.displayName = "WebcamFeed";
