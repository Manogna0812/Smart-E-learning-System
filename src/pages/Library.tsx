import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Search, BookOpen, Clock, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

const courses = [
  {
    id: 1,
    title: "Introduction to React Hooks",
    description:
      "Master the fundamentals of React Hooks including useState, useEffect, and custom hooks.",
    duration: "45 min",
    quizzes: 3,
    exercises: 2,
    level: "Beginner",
    topic: "React",
    icon: "⚛️",
  },
  {
    id: 2,
    title: "Advanced TypeScript Patterns",
    description:
      "Deep dive into advanced TypeScript features including generics, utility types, and type guards.",
    duration: "60 min",
    quizzes: 2,
    exercises: 2,
    level: "Advanced",
    topic: "TypeScript",
    icon: "📘",
  },
  {
    id: 3,
    title: "Modern Web Design Principles",
    description:
      "Learn essential design principles for creating beautiful, user-friendly web interfaces.",
    duration: "50 min",
    quizzes: 1,
    exercises: 2,
    level: "Intermediate",
    topic: "Design",
    icon: "🎨",
  },
  {
    id: 4,
    title: "State Management with Redux",
    description:
      "Understand Redux patterns, actions, reducers, and modern Redux Toolkit approaches.",
    duration: "55 min",
    quizzes: 2,
    exercises: 3,
    level: "Intermediate",
    topic: "React",
    icon: "🔄",
  },
  {
    id: 5,
    title: "CSS Grid & Flexbox Mastery",
    description:
      "Build responsive layouts with CSS Grid and Flexbox like a professional.",
    duration: "40 min",
    quizzes: 2,
    exercises: 4,
    level: "Beginner",
    topic: "CSS",
    icon: "📐",
  },
  {
    id: 6,
    title: "API Design Best Practices",
    description:
      "Learn RESTful API design patterns and best practices for scalable backends.",
    duration: "65 min",
    quizzes: 3,
    exercises: 2,
    level: "Advanced",
    topic: "Backend",
    icon: "🔌",
  },
];

const levelColors: Record<string, string> = {
  Beginner: "bg-success/10 text-success",
  Intermediate: "bg-warning/10 text-warning",
  Advanced: "bg-info/10 text-info",
};

const Library = () => {
  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-3xl font-bold text-foreground">
            Lesson Library
          </h1>
          <p className="mt-2 text-muted-foreground">
            Explore our collection of interactive lessons, quizzes, and exercises.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 flex flex-col gap-4 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search lessons..." className="pl-10" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Topics" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              <SelectItem value="react">React</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 grid gap-4 sm:grid-cols-3"
        >
          <div className="flex items-center gap-4 rounded-lg bg-card p-4 shadow-soft">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{courses.length}</p>
              <p className="text-sm text-muted-foreground">Total Lessons</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg bg-card p-4 shadow-soft">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg bg-card p-4 shadow-soft">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
              <Clock className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">315 min</p>
              <p className="text-sm text-muted-foreground">Total Duration</p>
            </div>
          </div>
        </motion.div>

        {/* Course Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="group flex flex-col rounded-xl bg-card p-6 shadow-card transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-2xl">
                  {course.icon}
                </div>
                <Badge className={levelColors[course.level]}>{course.level}</Badge>
              </div>

              <h3 className="mt-4 font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {course.title}
              </h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                {course.description}
              </p>

              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {course.duration}
                </span>
                <span>{course.quizzes} quizzes</span>
                <span>{course.exercises} exercises</span>
              </div>

              <Button className="mt-4 w-full" variant="outline" asChild>
                <Link to="/session">Start Lesson</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Library;
