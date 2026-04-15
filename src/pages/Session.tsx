import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Brain, Clock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import {
  WebcamFeed,
  WebcamFeedHandle,
} from "@/components/webcam/WebcamFeed";

import { detectEmotion } from "@/services/emotionApi";
import { AdaptiveContent } from "@/components/session/AdaptiveContent";
import { AdaptiveMessage } from "@/components/session/AdaptiveMessage";
import { toast } from "@/components/ui/use-toast";
import { logSession, saveSessionLocally } from "@/services/sessionApi";

type Emotion =
  | "HAPPY"
  | "NEUTRAL"
  | "CONFUSED"
  | "BORED"
  | "FRUSTRATED";

type LearnerState =
  | "ENGAGED"
  | "CONFUSED"
  | "BORED"
  | "FRUSTRATED"
  | "PAUSED";

const Session = () => {
  const webcamRef = useRef<WebcamFeedHandle>(null);
  const navigate = useNavigate();

  const [time, setTime] = useState(0);
  const [emotion, setEmotion] = useState<Emotion>("NEUTRAL");
  const [learnerState, setLearnerState] =
    useState<LearnerState>("PAUSED");

  const [showAdaptive, setShowAdaptive] = useState(false);
  const [isEndingSession, setIsEndingSession] = useState(false);

  const [metrics, setMetrics] = useState({
    eyeContact: 0,
    blinkRate: 0,
    headPose: 0,
    faceVisible: false,
  });

  // ================= TIMER =================
  useEffect(() => {
    const t = setInterval(() => setTime((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // ================= DECISION LOGIC =================
  const decideLearnerState = () => {
    if (!metrics.faceVisible) return "PAUSED";

    if (emotion === "FRUSTRATED") return "FRUSTRATED";

    if (
      ["CONFUSED"].includes(emotion) ||
      ["Sad", "Fear", "Surprise"].includes(emotion)
    ) {
      return "CONFUSED";
    }

    if (
      metrics.eyeContact < 50 ||
      metrics.blinkRate > 25
    ) {
      return "BORED";
    }

    return "ENGAGED";
  };

  // ================= EMOTION + METRICS =================
  const fetchEmotion = async () => {
    if (!webcamRef.current?.isActive) return;

    const face = webcamRef.current.getFaceMetrics();

    if (!face.faceVisible) {
      setMetrics({
        eyeContact: 0,
        blinkRate: 0,
        headPose: 0,
        faceVisible: false,
      });
      setEmotion("NEUTRAL");
      setLearnerState("PAUSED");
      setShowAdaptive(false);
      return;
    }

    setMetrics(face);

    const frame = await webcamRef.current.captureFrame();
    const res = await detectEmotion(frame);

    const mappedEmotion: Emotion =
      res.emotion === "Angry"
        ? "FRUSTRATED"
        : res.emotion === "Sad" || res.emotion === "Fear"
        ? "CONFUSED"
        : res.emotion === "Surprise"
        ? "CONFUSED"
        : "HAPPY";

    setEmotion(mappedEmotion);
  };

  useEffect(() => {
    const i = setInterval(fetchEmotion, 3000);
    return () => clearInterval(i);
  }, []);

  // ================= STATE UPDATE =================
  useEffect(() => {
    const state = decideLearnerState();
    setLearnerState(state);

    if (
      state === "CONFUSED" ||
      state === "BORED" ||
      state === "FRUSTRATED"
    ) {
      setShowAdaptive(true);
    } else {
      setShowAdaptive(false);
    }
  }, [emotion, metrics]);

  // ================= END SESSION =================
  const handleEndSession = async () => {
    if (isEndingSession) return;

    setIsEndingSession(true);

    const sessionSummary = {
      duration: time,
      emotion,
      ...metrics,
      endedAt: new Date(),
    };

    try {
      await logSession(sessionSummary);
      toast({
        title: "Session ended",
        description: "Your session was saved successfully.",
      });
    } catch (error) {
      console.error("Failed to save session to API, storing locally instead.", error);
      saveSessionLocally(sessionSummary);
      toast({
        title: "Session ended",
        description: "The server was unavailable, so the session was saved locally.",
      });
    } finally {
      navigate("/");
    }
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex justify-between py-3 items-center">
          <Link to="/" className="flex gap-2 items-center">
            <Brain />
            <span className="font-semibold">LearnFlow</span>
          </Link>

          <div className="flex items-center gap-4">
            <Clock />
            {Math.floor(time / 60)}:
            {String(time % 60).padStart(2, "0")}
            <button
              onClick={handleEndSession}
              disabled={isEndingSession}
              className="px-4 py-1.5 rounded-md bg-destructive text-white text-sm"
            >
              {isEndingSession ? "Ending..." : "End Session"}
            </button>
          </div>
        </div>
      </header>

      <div className="container grid lg:grid-cols-3 gap-6 py-6">
        <div className="lg:col-span-2 space-y-6">
          <AdaptiveMessage state={learnerState} />

          {learnerState === "PAUSED" && (
            <motion.div className="p-4 bg-destructive/10 border border-destructive/20 text-center text-destructive rounded-lg">
              Please face the camera to continue.
            </motion.div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Lesson: Introduction to React State</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <video controls className="w-full aspect-video bg-black">
                <source src="/sample-lesson.mp4" />
              </video>
            </CardContent>
          </Card>

          {showAdaptive && (
            <AdaptiveContent
              state={learnerState}
              onDismiss={() => setShowAdaptive(false)}
            />
          )}
        </div>

        <div className="space-y-6">
          <WebcamFeed ref={webcamRef} />

          <Card>
            <CardContent className="p-4">
              Emotion: <strong>{emotion}</strong>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              Eye Contact {metrics.eyeContact}%
              <Progress value={metrics.eyeContact} />
              Blink Rate: {metrics.blinkRate}/min
              <br />
              Head Pose: {metrics.headPose}%
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Session;
