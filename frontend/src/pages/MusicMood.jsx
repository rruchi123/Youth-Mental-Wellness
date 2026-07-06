import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Music,
  Sparkles,
  Loader2,
  Play,
  Heart,
  TrendingUp,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import API_BASE_URL from "@/api";

const API_URL = "${API_BASE_URL}/music";

export default function MusicMood() {
  const [songTitle, setSongTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [whyResonates, setWhyResonates] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");

  const queryClient = useQueryClient();

  const getToken = () => localStorage.getItem("token");

  const openMusic = (title, songArtist = "") => {
    const searchText = songArtist ? `${title} ${songArtist}` : title;
    const url = `https://music.youtube.com/search?q=${encodeURIComponent(
      searchText
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const { data: history = [], isLoading: isHistoryLoading } = useQuery({
    queryKey: ["musicMoods"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/history`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Unable to load music history.");
      }

      const data = await response.json();
      return data.musicMoods || [];
    },
  });

  const saveMusicMood = useMutation({
    mutationFn: async (musicMood) => {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(musicMood),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to analyze this music mood.");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["musicMoods"] });
    },
  });

  const handleAnalyze = async () => {
    if (!songTitle.trim()) {
      setError("Please enter a song title first.");
      return;
    }

    setError("");
    setAnalysis(null);

    try {
      const data = await saveMusicMood.mutateAsync({
        songTitle: songTitle.trim(),
        artist: artist.trim(),
        whyResonates: whyResonates.trim(),
      });

      setAnalysis(data.analysis);

      // Opens the entered song after analysis succeeds.
      openMusic(songTitle.trim(), artist.trim());
    } catch (requestError) {
      setError(
        requestError.message ||
        "Unable to explore this music mood right now. Please try again."
      );
    }
  };

  const moodColors = {
    melancholic: "from-blue-400 to-indigo-400",
    anxious: "from-violet-400 to-purple-400",
    calm: "from-teal-400 to-cyan-400",
    energetic: "from-amber-400 to-orange-400",
    hopeful: "from-emerald-400 to-green-400",
    nostalgic: "from-rose-400 to-pink-400",
    sad: "from-slate-400 to-gray-400",
    peaceful: "from-sky-400 to-blue-400",
    default: "from-violet-400 to-purple-400",
  };

  const getMoodColor = (mood) => {
    const key = Object.keys(moodColors).find((item) =>
      mood?.toLowerCase().includes(item)
    );

    return moodColors[key] || moodColors.default;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-slate-50 to-violet-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Link
          to={createPageUrl("Home")}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Home</span>
        </Link>

        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full mb-4">
              <Music className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">
                Music & Emotions
              </span>
            </div>

            <h1 className="text-4xl font-bold text-slate-800 mb-3">
              What's Playing in Your Heart?
            </h1>

            <p className="text-lg text-slate-600 max-w-xl mx-auto">
              The music we connect with often reflects how we feel inside. Share a
              song that resonates with you right now.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Song Title *
                    </label>
                    <Input
                      value={songTitle}
                      onChange={(event) => {
                        setSongTitle(event.target.value);
                        setError("");
                      }}
                      placeholder="e.g., Breathe Me"
                      className="h-12 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Artist (Optional)
                    </label>
                    <Input
                      value={artist}
                      onChange={(event) => setArtist(event.target.value)}
                      placeholder="e.g., Sia"
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Why does this song resonate with you? (Optional)
                  </label>
                  <Textarea
                    value={whyResonates}
                    onChange={(event) => setWhyResonates(event.target.value)}
                    placeholder="There's no right answer. Maybe it's the lyrics, the melody, or a memory it brings up..."
                    className="min-h-[100px] rounded-xl resize-none"
                  />
                </div>

                {error && <p className="text-sm text-rose-600">{error}</p>}

                <Button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={!songTitle.trim() || saveMusicMood.isPending}
                  className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl"
                >
                  {saveMusicMood.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Understanding your vibe...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Explore My Music Mood
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <Card className="overflow-hidden">
                <div
                  className={`h-2 bg-gradient-to-r ${getMoodColor(
                    analysis.detected_mood
                  )}`}
                />

                <CardContent className="p-8">
                  <div className="flex items-center justify-center mb-6">
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getMoodColor(
                        analysis.detected_mood
                      )} text-white`}
                    >
                      <Heart className="w-4 h-4" />
                      <span className="font-medium">{analysis.detected_mood}</span>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <p className="text-lg text-slate-700 leading-relaxed">
                      {analysis.insight}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => openMusic(songTitle, artist)}
                    className="mx-auto flex rounded-xl"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Play this song
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>

                  {analysis.suggestions?.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-sm font-medium text-slate-500 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        You might also like
                      </h3>

                      <div className="grid sm:grid-cols-3 gap-4">
                        {analysis.suggestions.map((song, index) => (
                          <motion.button
                            type="button"
                            key={`${song.title}-${index}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => openMusic(song.title, song.artist)}
                            className="text-left bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getMoodColor(
                                  song.mood
                                )} flex items-center justify-center`}
                              >
                                <Play className="w-4 h-4 text-white" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-700 truncate">
                                  {song.title}
                                </p>
                                <p className="text-sm text-slate-500 truncate">
                                  {song.artist}
                                </p>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {!isHistoryLoading && history.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-lg font-semibold text-slate-700 mb-4">
              Your Music Journey
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              {history.map((entry) => (
                <button
                  type="button"
                  key={entry._id}
                  onClick={() => openMusic(entry.songTitle, entry.artist)}
                  className="text-left"
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getMoodColor(
                            entry.detectedMood
                          )} flex items-center justify-center`}
                        >
                          <Music className="w-6 h-6 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-700 truncate">
                            {entry.songTitle}
                          </p>
                          {entry.artist && (
                            <p className="text-sm text-slate-500 truncate">
                              {entry.artist}
                            </p>
                          )}
                          {entry.detectedMood && (
                            <p className="text-xs text-slate-400 mt-1">
                              {entry.detectedMood}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}