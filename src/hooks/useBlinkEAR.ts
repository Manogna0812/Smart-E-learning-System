import { useRef } from "react";

export const useBlinkEAR = () => {
  const blinkCount = useRef(0);
  const lastBlinkTime = useRef(0);

  const distance = (a: any, b: any) =>
    Math.hypot(a.x - b.x, a.y - b.y);

  const calculateEAR = (landmarks: any[]) => {
    const p1 = landmarks[33];
    const p2 = landmarks[160];
    const p3 = landmarks[158];
    const p4 = landmarks[133];
    const p5 = landmarks[153];
    const p6 = landmarks[144];

    const vertical =
      distance(p2, p6) + distance(p3, p5);
    const horizontal = 2 * distance(p1, p4);

    return vertical / horizontal;
  };

  const detectBlink = (landmarks: any[]) => {
    const EAR = calculateEAR(landmarks);
    const now = Date.now();

    // Thresholds (tested + standard)
    if (EAR < 0.18 && now - lastBlinkTime.current > 300) {
      blinkCount.current += 1;
      lastBlinkTime.current = now;
    }

    return {
      EAR,
      blinkCount: blinkCount.current,
    };
  };

  return { detectBlink };
};
