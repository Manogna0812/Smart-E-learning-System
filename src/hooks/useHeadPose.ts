export const useHeadPose = () => {
  const calculateHeadPose = (landmarks: any[]) => {
    const nose = landmarks[1];
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    const forehead = landmarks[10];
    const chin = landmarks[152];

    // YAW (left/right)
    const eyeMidX = (leftEye.x + rightEye.x) / 2;
    const yaw = nose.x - eyeMidX;

    // PITCH (up/down)
    const faceHeight = Math.abs(forehead.y - chin.y);
    const pitch = (nose.y - forehead.y) / faceHeight;

    return {
      yaw,   // negative = left, positive = right
      pitch // small = up, large = down
    };
  };

  const classifyPose = (yaw: number, pitch: number) => {
    if (Math.abs(yaw) < 0.03 && pitch > 0.45 && pitch < 0.55)
      return "FORWARD";
    if (yaw < -0.05) return "LEFT";
    if (yaw > 0.05) return "RIGHT";
    if (pitch < 0.4) return "UP";
    if (pitch > 0.6) return "DOWN";
    return "UNKNOWN";
  };

  return { calculateHeadPose, classifyPose };
};
