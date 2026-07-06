import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Heart,
  Calendar,
  Music,
  Shield,
  TrendingUp,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const API_BASE_URL = "http://localhost:5000/api";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [bookingCount, setBookingCount] = useState(0);
  const [moodCount, setMoodCount] = useState(0);
  const [musicMoodCount, setMusicMoodCount] = useState(0);
  const [latestMood, setLatestMood] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      navigate("/Login");
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch (error) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/Login");
    }
  }, [navigate]);

  useEffect(() => {
    const loadProfileData = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const [bookingsResponse, moodsResponse, musicResponse] =
          await Promise.all([
            fetch(`${API_BASE_URL}/experts/bookings/my`, { headers }),
            fetch(`${API_BASE_URL}/moods`, { headers }),
            fetch(`${API_BASE_URL}/music/history`, { headers }),
          ]);

        const [bookingsData, moodsData, musicData] = await Promise.all([
          bookingsResponse.json(),
          moodsResponse.json(),
          musicResponse.json(),
        ]);

        if (bookingsResponse.ok) {
          setBookingCount(
            bookingsData.count ?? bookingsData.bookings?.length ?? 0
          );
        }

        if (moodsResponse.ok) {
          const entries = moodsData.moodEntries || [];
          setMoodCount(moodsData.count ?? entries.length ?? 0);
          setLatestMood(entries[0] || null);
        }

        if (musicResponse.ok) {
          setMusicMoodCount(
            musicData.count ?? musicData.musicMoods?.length ?? 0
          );
        }
      } catch (error) {
        console.error("Unable to load profile data:", error);
      }
    };

    loadProfileData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChanged"));
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Link
          to={createPageUrl("Home")}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Home</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-violet-400 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  {user.fullName || "Your Space"}
                </h1>
                <p className="text-slate-500">{user.email}</p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="rounded-xl"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="w-5 h-5 text-rose-500" />
                  Your Mood Journey
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-slate-200 mx-auto mb-3" />

                  {latestMood ? (
                    <>
                      <p className="text-slate-700 font-medium">
                        Latest mood: {latestMood.mood}
                      </p>
                      <p className="text-sm text-slate-500 mt-1 break-words">
                        {latestMood.note || "No note added for this check-in."}
                      </p>
                      <p className="text-xs text-slate-400 mt-2">
                        {new Date(latestMood.createdAt).toLocaleString()}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-slate-500">No mood entries yet</p>
                      <p className="text-sm text-slate-400">
                        Start your first check-in to track your journey
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-teal-500" />
                  Your Activity
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <ActivityRow
                  icon={<Heart className="w-5 h-5 text-rose-500" />}
                  label="Mood Check-ins"
                  count={moodCount}
                  background="bg-rose-100"
                />

                <ActivityRow
                  icon={<Calendar className="w-5 h-5 text-blue-500" />}
                  label="Sessions Booked"
                  count={bookingCount}
                  background="bg-blue-100"
                />

                <ActivityRow
                  icon={<Music className="w-5 h-5 text-amber-500" />}
                  label="Music Moods"
                  count={musicMoodCount}
                  background="bg-amber-100"
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5 text-teal-500" />
                  Privacy & Preferences
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <PreferenceRow
                  title="Anonymous in Community"
                  description="Your posts will show a random name"
                  defaultChecked
                />
                <PreferenceRow
                  title="Daily Check-in Reminders"
                  description="Gentle reminders to check in with yourself"
                />
                <PreferenceRow
                  title="Data Analytics"
                  description="Help improve the app with anonymous usage data"
                  defaultChecked
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ActivityRow({ icon, label, count, background }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${background}`}
        >
          {icon}
        </div>
        <span className="text-slate-700">{label}</span>
      </div>
      <span className="font-semibold text-slate-800">{count}</span>
    </div>
  );
}

function PreferenceRow({ title, description, defaultChecked = false }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
      <div>
        <p className="font-medium text-slate-700">{title}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}