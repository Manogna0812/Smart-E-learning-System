import { motion } from "framer-motion";
import { Pause, Zap, HelpCircle, Coffee, AlertTriangle } from "lucide-react";

export type LearnerState =
  | "ENGAGED"
  | "CONFUSED"
  | "BORED"
  | "FRUSTRATED"
  | "PAUSED";

interface AdaptiveMessageProps {
  state: LearnerState;
}

const messages: Record<
  LearnerState,
  { text: string; icon: React.ReactNode; className: string }
> = {
  ENGAGED: {
    text: "Great focus! Keep going 🎯",
    icon: <Zap className="h-4 w-4" />,
    className: "bg-success/10 border-success/20 text-success",
  },
  CONFUSED: {
    text: "Looks tricky — slowing things down to help you 👍",
    icon: <HelpCircle className="h-4 w-4" />,
    className: "bg-warning/10 border-warning/20 text-warning",
  },
  BORED: {
    text: "Let’s make this more interactive ⚡",
    icon: <Coffee className="h-4 w-4" />,
    className: "bg-info/10 border-info/20 text-info",
  },
  FRUSTRATED: {
    text: "Take a breath — we’ll solve this together 💙",
    icon: <AlertTriangle className="h-4 w-4" />,
    className: "bg-destructive/10 border-destructive/20 text-destructive",
  },
  PAUSED: {
    text: "Session paused — please face the camera",
    icon: <Pause className="h-4 w-4" />,
    className: "bg-muted/10 border-muted/20 text-muted-foreground",
  },
};

export const AdaptiveMessage = ({ state }: AdaptiveMessageProps) => {
  const message = messages[state];

  if (!message) return null; // 🔒 safety guard

  const { text, icon, className } = message;

  return (
    <motion.div
      key={state}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`rounded-lg border p-4 text-sm flex items-center justify-center gap-2 ${className}`}
    >
      {icon}
      {text}
    </motion.div>
  );
};

export default AdaptiveMessage;

