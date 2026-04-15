import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Brain,
  CheckCircle,
  Camera,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

/* =========================
   TYPES
========================= */

type CalibrationStep =
  | "intro"
  | "neutral"
  | "left"
  | "right"
  | "up"
  | "down"
  | "complete";

/* =========================
   STEP TEXT
========================= */

const stepText: Record<CalibrationStep, string> = {
  intro: "Prepare for calibration",
  neutral: "Look straight at the camera",
  left: "Turn your head LEFT",
  right: "Turn your head RIGHT",
  up: "Tilt your head UP",
  down: "Tilt your head DOWN",
  complete: "Calibration complete!",
};

const stepOrder: CalibrationStep[] = [
  "neutral",
  "left",
  "right",
  "up",
  "down",
  "complete",
];

const REQUIRED_HOLD_FRAMES = 30; // ~1 second at 30fps

/* =========================
   COMPONENT
========================= */

const Calibration = () => {
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const holdFramesRef = useRef(0);

  const [step, setStep] = useState<CalibrationStep>("intro");
  const [faceDetected, setFaceDetected] = useState(false);

  const progress =
    step === "intro"
      ? 0
      : (stepOrder.indexOf(step) / (stepOrder.length - 1)) * 100;

  /* =========================
     INIT MEDIAPIPE
  ========================= */

  useEffect(() => {
    const init = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm"
      );

      faceLandmarkerRef.current =
        await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numFaces: 1,
        });
    };

    init();
  }, []);

  /* =========================
     CAMERA START
  ========================= */

  const startCalibration = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false,
    });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    setStep("neutral");
  };

  /* =========================
     HEAD POSE LOGIC (FROM YOUR CODE)
  ========================= */

  const calculateHeadPose = (landmarks: any[]) => {
    const nose = landmarks[1];
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    const chin = landmarks[152];
    const forehead = landmarks[10];

    const eyeDist = Math.abs(leftEye.x - rightEye.x);
    const horizontal =
      (Math.abs(nose.x - leftEye.x) - Math.abs(nose.x - rightEye.x)) /
      eyeDist;

    const verticalRange = Math.abs(forehead.y - chin.y);
    const vertical = (nose.y - forehead.y) / verticalRange;

    return { horizontal, vertical };
  };

  const isCorrectForStep = (
    pose: { horizontal: number; vertical: number },
    step: CalibrationStep
  ) => {
    switch (step) {
      case "neutral":
        return (
          Math.abs(pose.horizontal) < 0.12 &&
          pose.vertical > 0.42 &&
          pose.vertical < 0.58
        );
      case "left":
        return pose.horizontal > 0.25; // mirrored camera
      case "right":
        return pose.horizontal < -0.25;
      case "up":
        return pose.vertical < 0.38;
      case "down":
        return pose.vertical > 0.62;
      default:
        return false;
    }
  };

  /* =========================
     DETECTION LOOP
  ========================= */

  useEffect(() => {
    if (!videoRef.current || !faceLandmarkerRef.current) return;
    if (step === "intro" || step === "complete") return;

    let rafId: number;

    const detect = () => {
      const video = videoRef.current!;
      const landmarker = faceLandmarkerRef.current!;

      if (video.readyState === 4) {
        const res = landmarker.detectForVideo(
          video,
          performance.now()
        );

        if (res.faceLandmarks?.length) {
          setFaceDetected(true);
          const pose = calculateHeadPose(res.faceLandmarks[0]);
          const valid = isCorrectForStep(pose, step);

          if (valid) {
            holdFramesRef.current += 1;
          } else {
            holdFramesRef.current = 0;
          }

          if (holdFramesRef.current >= REQUIRED_HOLD_FRAMES) {
            holdFramesRef.current = 0;
            setStep((prev) => {
              const idx = stepOrder.indexOf(prev);
              return stepOrder[idx + 1] ?? prev;
            });
          }
        } else {
          setFaceDetected(false);
          holdFramesRef.current = 0;
        }
      }

      rafId = requestAnimationFrame(detect);
    };

    detect();
    return () => cancelAnimationFrame(rafId);
  }, [step]);

  /* =========================
     UI
  ========================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-info/5">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">LearnFlow</span>
        </div>
      </header>

      <div className="container py-12 max-w-2xl mx-auto">
        <Card className="shadow-card overflow-hidden">
          <div className="relative aspect-video bg-muted">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />

            {faceDetected && step !== "intro" && step !== "complete" && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-success/90 px-4 py-2 rounded-full text-success-foreground">
                <CheckCircle className="h-4 w-4" />
                Hold position…
              </div>
            )}
          </div>

          <CardContent className="p-6 space-y-6 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h2 className="text-xl font-semibold">
                  {stepText[step]}
                </h2>
              </motion.div>
            </AnimatePresence>

            {step !== "intro" && step !== "complete" && (
              <Progress value={progress} />
            )}

            {step === "intro" && (
              <Button className="w-full gap-2" onClick={startCalibration}>
                Start Calibration <ArrowRight className="h-4 w-4" />
              </Button>
            )}

            {step === "complete" && (
              <Button
                className="w-full gap-2"
                onClick={() => navigate("/session")}
              >
                Continue to Session
              </Button>
            )}

            {step !== "complete" && (
              <Button variant="link" asChild>
                <Link to="/session">Skip calibration</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calibration;
