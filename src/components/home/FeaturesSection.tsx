import { motion } from "framer-motion";
import { Brain, Target, BarChart3, Lightbulb, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Emotion Recognition",
    description:
      "Advanced AI detects your emotional state through facial expressions in real-time.",
  },
  {
    icon: Target,
    title: "Adaptive Pacing",
    description:
      "Content speed automatically adjusts based on your confusion or engagement levels.",
  },
  {
    icon: Lightbulb,
    title: "Smart Hints",
    description:
      "Get contextual help and suggestions when frustration or confusion is detected.",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description:
      "Track your learning patterns, engagement trends, and emotional states over time.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "All processing happens locally. No video is stored, only anonymized metrics.",
  },
  {
    icon: Zap,
    title: "Real-time Feedback",
    description:
      "Instant engagement scores and recommendations to optimize your study sessions.",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            How LearnFlow Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered system monitors your engagement and adapts the learning
            experience to maximize understanding and retention.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group rounded-xl bg-card p-6 shadow-card transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
