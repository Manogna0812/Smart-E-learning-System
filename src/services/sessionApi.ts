export type SessionLogPayload = {
  duration: number;
  emotion: string;
  eyeContact: number;
  blinkRate: number;
  headPose: number;
  faceVisible: boolean;
  endedAt: Date | string;
};

const LOCAL_SESSION_STORAGE_KEY = "learnflow-session-history";

export const saveSessionLocally = (data: SessionLogPayload) => {
  if (typeof window === "undefined") return;

  const existingSessions = window.localStorage.getItem(LOCAL_SESSION_STORAGE_KEY);
  const parsedSessions = existingSessions ? JSON.parse(existingSessions) : [];

  parsedSessions.unshift({
    ...data,
    endedAt:
      data.endedAt instanceof Date ? data.endedAt.toISOString() : data.endedAt,
  });

  window.localStorage.setItem(
    LOCAL_SESSION_STORAGE_KEY,
    JSON.stringify(parsedSessions.slice(0, 20)),
  );
};

export const logSession = async (data: SessionLogPayload) => {
  const response = await fetch("http://localhost:5000/api/session/log", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to log session");
  }

  return response.json();
};
