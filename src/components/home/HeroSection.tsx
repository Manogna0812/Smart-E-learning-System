import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Play, Sparkles, Eye, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-info/5 py-20 md:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-info/10 blur-3xl" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
          >
            <Sparkles className="h-4 w-4" />
            AI-Powered Adaptive Learning
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
          >
            Learn Smarter with{" "}
            <span className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
              Real-Time Engagement
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground md:text-xl"
          >
            Experience personalized learning that adapts to your attention, confusion,
            and engagement in real-time using advanced face detection and AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button size="lg" className="gap-2" asChild>
              <Link to="/calibration">
                Start Learning
                <Play className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <Link to="/library">
                <Eye className="h-4 w-4" />
                View Courses
              </Link>
            </Button>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-4"
          >
            {[
              { icon: Eye, label: "Real-time emotion detection" },
              { icon: TrendingUp, label: "Adaptive content pacing" },
              { icon: Sparkles, label: "Personalized hints" },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm text-muted-foreground shadow-soft"
              >
                <feature.icon className="h-4 w-4 text-primary" />
                {feature.label}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
