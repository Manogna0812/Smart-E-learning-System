import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { TrendingUp, Clock, Calendar, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Link } from "react-router-dom";

const engagementData = [
  { day: "Mon", engagement: 75 },
  { day: "Tue", engagement: 82 },
  { day: "Wed", engagement: 68 },
  { day: "Thu", engagement: 88 },
  { day: "Fri", engagement: 72 },
  { day: "Sat", engagement: 90 },
  { day: "Sun", engagement: 85 },
];

const durationData = [
  { day: "Mon", minutes: 45 },
  { day: "Tue", minutes: 60 },
  { day: "Wed", minutes: 35 },
  { day: "Thu", minutes: 55 },
  { day: "Fri", minutes: 40 },
  { day: "Sat", minutes: 70 },
  { day: "Sun", minutes: 50 },
];

const emotionStats = [
  { emotion: "Happy", percentage: 45, color: "bg-success" },
  { emotion: "Neutral", percentage: 30, color: "bg-muted-foreground" },
  { emotion: "Confused", percentage: 15, color: "bg-warning" },
  { emotion: "Frustrated", percentage: 10, color: "bg-destructive" },
];

const Dashboard = () => {
  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Welcome back, Student!
            </h1>
            <p className="mt-1 text-muted-foreground">
              Track your learning progress and start new sessions.
            </p>
          </div>
          <Button asChild>
            <Link to="/session">Start New Session</Link>
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                  <Target className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">89%</p>
                  <p className="text-sm text-muted-foreground">Avg Engagement</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">12.5h</p>
                  <p className="text-sm text-muted-foreground">Total Study Time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/10">
                  <Calendar className="h-6 w-6 text-info" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">7</p>
                  <p className="text-sm text-muted-foreground">Sessions This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">+15%</p>
                  <p className="text-sm text-muted-foreground">Progress This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-display">Weekly Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="day"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        domain={[0, 100]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="engagement"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-display">Study Duration (minutes)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={durationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="day"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="minutes"
                        fill="hsl(var(--info))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Emotion Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-display">Emotion Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {emotionStats.map((stat) => (
                  <div key={stat.emotion} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {stat.emotion}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {stat.percentage}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${stat.color}`}
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;
