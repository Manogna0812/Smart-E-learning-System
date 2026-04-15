import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  Zap,
  HelpCircle,
  Coffee,
  CheckCircle,
  X,
  Trophy,
  BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

/* =========================
   TYPES
========================= */

type Emotion = "HAPPY" | "NEUTRAL" | "CONFUSED" | "BORED" | "FRUSTRATED";

interface AdaptiveContentProps {
  emotion: Emotion;
  onDismiss: () => void;
}

/* =========================
   BONUS CHALLENGE (ENGAGED)
========================= */

const BonusChallenge = ({ onDismiss }: { onDismiss: () => void }) => {
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState("");
  const correct = "b";

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Trophy className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <h4 className="font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4" /> Bonus Challenge
            </h4>

            <p className="mt-2 text-sm">
              What happens if you call setState twice in the same event?
            </p>

            {!answered ? (
              <>
                <RadioGroup
                  value={selected}
                  onValueChange={setSelected}
                  className="mt-3 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="a" id="a" />
                    <Label htmlFor="a">State updates twice</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="b" id="b" />
                    <Label htmlFor="b">State updates once (batching)</Label>
                  </div>
                </RadioGroup>

                <Button
                  size="sm"
                  className="mt-3"
                  onClick={() => setAnswered(true)}
                  disabled={!selected}
                >
                  Submit
                </Button>
              </>
            ) : (
              <div
                className={`mt-3 p-2 rounded ${
                  selected === correct
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {selected === correct
                  ? "Correct! React batches updates."
                  : "Not quite. React batches updates."}
              </div>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onDismiss}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

/* =========================
   HINT PANEL (CONFUSED)
========================= */

const HintPanel = ({ onDismiss }: { onDismiss: () => void }) => {
  const [simpler, setSimpler] = useState(false);

  return (
    <Card className="border-warning/20 bg-warning/5">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Lightbulb className="h-5 w-5 text-warning" />
          <div className="flex-1">
            <h4 className="font-semibold">Need some help?</h4>

            <p className="mt-2 text-sm">
              <strong>useState</strong> stores a value and updates the UI when
              it changes.
            </p>

            {!simpler ? (
              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={() => setSimpler(true)}
              >
                <BookOpen className="h-4 w-4 mr-1" />
                Even simpler explanation
              </Button>
            ) : (
              <p className="mt-3 text-sm bg-background p-2 rounded border">
                Think of it like a scoreboard: change score → display updates.
              </p>
            )}

            <Button size="sm" className="mt-3" onClick={onDismiss}>
              Got it
            </Button>
          </div>
          <Button variant="ghost" size="icon" onClick={onDismiss}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

/* =========================
   QUICK QUIZ (BORED)
========================= */

const QuickQuiz = ({ onDismiss }: { onDismiss: () => void }) => {
  const [done, setDone] = useState(false);

  return (
    <Card className="border-info/20 bg-info/5">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <HelpCircle className="h-5 w-5 text-info" />
          <div className="flex-1">
            <h4 className="font-semibold">Quick Check</h4>
            <p className="text-sm mt-2">
              Which hook manages state in React?
            </p>

            {!done ? (
              <Button size="sm" className="mt-3" onClick={() => setDone(true)}>
                useState
              </Button>
            ) : (
              <p className="mt-3 text-success">Correct! 👍</p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onDismiss}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

/* =========================
   BREAK / FRUSTRATION
========================= */

const BreakSuggestion = ({ onDismiss }: { onDismiss: () => void }) => (
  <Card className="border-destructive/20 bg-destructive/5">
    <CardContent className="p-4">
      <div className="flex gap-3">
        <Coffee className="h-5 w-5 text-destructive" />
        <div className="flex-1">
          <p className="text-sm">
            Looks like this is getting frustrating. Take a short break.
          </p>
          <Button size="sm" className="mt-3" onClick={onDismiss}>
            Continue
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

/* =========================
   MAIN SWITCH
========================= */

export const AdaptiveContent = ({ emotion, onDismiss }: AdaptiveContentProps) => {
  const renderContent = () => {
    switch (emotion) {
      case "HAPPY":
      case "NEUTRAL":
        return <BonusChallenge onDismiss={onDismiss} />;
      case "CONFUSED":
        return <HintPanel onDismiss={onDismiss} />;
      case "BORED":
        return <QuickQuiz onDismiss={onDismiss} />;
      case "FRUSTRATED":
        return <BreakSuggestion onDismiss={onDismiss} />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={emotion}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
      >
        {renderContent()}
      </motion.div>
    </AnimatePresence>
  );
};

export default AdaptiveContent;