import { useState, useEffect, useRef, useCallback } from "react";

interface UseWebcamOptions {
  autoStart?: boolean;
  facingMode?: "user" | "environment";
  width?: number;
  height?: number;
}

interface UseWebcamReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | null;
  isLoading: boolean;
  error: string | null;
  isActive: boolean;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
}

export const useWebcam = (options: UseWebcamOptions = {}): UseWebcamReturn => {
  const {
    autoStart = false,
    facingMode = "user",
    width = 640,
    height = 480,
  } = options;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: width },
          height: { ideal: height },
        },
        audio: false,
      });

      setStream(mediaStream);
      setIsActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to access camera";
      
      if (errorMessage.includes("NotAllowedError") || errorMessage.includes("Permission denied")) {
        setError("Camera permission denied. Please allow camera access.");
      } else if (errorMessage.includes("NotFoundError")) {
        setError("No camera found. Please connect a camera.");
      } else if (errorMessage.includes("NotReadableError")) {
        setError("Camera is in use by another application.");
      } else {
        setError(errorMessage);
      }
      
      setIsActive(false);
    } finally {
      setIsLoading(false);
    }
  }, [facingMode, width, height]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  }, [stream]);

  // Auto-start camera if enabled
  useEffect(() => {
    if (autoStart) {
      startCamera();
    }

    // Cleanup on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [autoStart]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    videoRef,
    stream,
    isLoading,
    error,
    isActive,
    startCamera,
    stopCamera,
  };
};
