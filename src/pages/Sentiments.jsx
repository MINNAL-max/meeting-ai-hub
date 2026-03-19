import React, { useState, useEffect } from "react";
import { AxiosCall } from "../services/AxiosCall";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Activity, Users, AlertTriangle, MessageSquare, AlertCircle, FileText } from "lucide-react";

const Sentiments = () => {

  const [transcripts, setTranscripts] = useState({});
  const [selectedTranscript, setSelectedTranscript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTranscripts();
  }, []);

  const fetchTranscripts = async () => {

    setLoading(true);
    setError("");

    try {

      const result = await AxiosCall("GET", "api/list/", {}, false, false);

      if (result.status === 200) {
        setTranscripts(result.data);
      } else {
        setError("Failed to load transcripts");
      }

    } catch (error) {

      console.log(error);
      setError("Error loading transcripts");

    } finally {

      setLoading(false);

    }

  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex justify-end">
          <div className="h-24 bg-gray-800 rounded-2xl w-1/3 border border-white/5"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 h-96 bg-gray-800 rounded-xl border border-white/5"></div>
          <div className="lg:col-span-2 h-[600px] bg-gray-800 rounded-xl border border-white/5"></div>
        </div>
      </div>
    );
  }

  const allTranscripts = [];

  Object.keys(transcripts).forEach((project) => {
    transcripts[project].forEach((t) => {
      allTranscripts.push({ ...t, project });
    });
  });

  return (
    <div className="space-y-8">

      {/* Header */}

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-end"
      >
        <div className="text-right bg-gray-900/50 backdrop-blur-xl px-10 py-6 rounded-2xl border border-white/20 shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <h1 className="text-5xl font-extrabold uppercase tracking-[6px] text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-400 to-indigo-500 relative z-10">
            SENTIMENTS
          </h1>
          <p className="text-gray-200 text-sm mt-2 relative z-10">
            Analyze sentiment patterns in your meetings
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-end"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-900/40 backdrop-blur-md border border-red-400/30 text-red-300 text-sm shadow-lg">
              <AlertCircle size={16} /> {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Meeting List */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 bg-gray-900/40 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-lg flex flex-col h-[70vh]"
        >
          <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2 sticky top-0">
            <Heart size={18} className="text-pink-400" />
            Select a Meeting
          </h2>

          <div className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar">

            {allTranscripts.length > 0 ? (

              allTranscripts.map((transcript, index) => (

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * Math.min(index, 10) }}
                  key={transcript.id}
                  onClick={() => setSelectedTranscript(transcript.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${selectedTranscript === transcript.id
                      ? "bg-purple-500/20 border-purple-500/50 shadow-inner"
                      : "bg-gray-800/50 hover:bg-gray-700/60 border-transparent hover:border-white/10"
                    }`}
                >

                  <p className="font-semibold text-sm truncate flex items-center gap-2">
                    <FileText size={14} className={selectedTranscript === transcript.id ? "text-purple-400" : "text-gray-400"} />
                    {transcript.file_name}
                  </p>

                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-slate-400 bg-black/20 px-2 py-1 rounded">
                      {transcript.project}
                    </p>
                  </div>

                </motion.div>

              ))

            ) : (

              <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3 opacity-50">
                <FileText size={32} />
                <p>No transcripts found</p>
              </div>

            )}

          </div>

        </motion.div>

        {/* Sentiment Panel */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-gray-900/40 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg h-[70vh] overflow-y-auto custom-scrollbar"
        >

          {selectedTranscript ? (

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >

              <div className="border-b border-white/10 pb-6">
                <h3 className="text-2xl font-bold mb-2">
                  {allTranscripts.find((t) => t.id === selectedTranscript)?.file_name}
                </h3>
                <p className="text-slate-400 text-sm">
                  Sentiment insights for this meeting
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="p-5 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl border border-white/10 shadow-lg"
                >
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-indigo-300">
                    <Activity size={18} />
                    Sentiment Timeline Chart
                  </h4>
                  <p className="text-slate-400 text-xs italic opacity-70">
                    Endpoint: /api/transcript/{selectedTranscript}/sentiment/
                  </p>
                  <div className="h-32 mt-4 flex items-center justify-center border border-dashed border-indigo-500/30 rounded-lg bg-indigo-500/5 text-indigo-400/50">
                    [Chart Placeholder]
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-5 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl border border-white/10 shadow-lg"
                >
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-pink-300">
                    <Users size={18} />
                    Speaker Sentiment Breakdown
                  </h4>
                  <p className="text-slate-400 text-xs italic opacity-70">
                    Endpoint: /api/transcript/{selectedTranscript}/speaker-sentiment/
                  </p>
                  <div className="h-32 mt-4 flex items-center justify-center border border-dashed border-pink-500/30 rounded-lg bg-pink-500/5 text-pink-400/50">
                    [Pie Chart Placeholder]
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="p-5 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl border border-white/10 shadow-lg"
                >
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-orange-300">
                    <AlertTriangle size={18} />
                    Flagged Sections
                  </h4>
                  <p className="text-slate-400 text-xs italic opacity-70">
                    Endpoint: /api/transcript/{selectedTranscript}/flagged-sections/
                  </p>
                  <div className="h-24 mt-4 flex items-center justify-center border border-dashed border-orange-500/30 rounded-lg bg-orange-500/5 text-orange-400/50">
                    [List Placeholder]
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="p-5 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl border border-white/10 shadow-lg"
                >
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-300">
                    <MessageSquare size={18} />
                    Chat Interface
                  </h4>
                  <p className="text-slate-400 text-xs italic opacity-70">
                    Endpoint: /api/transcript/{selectedTranscript}/chat/
                  </p>
                  <div className="h-24 mt-4 flex items-center justify-center border border-dashed border-blue-500/30 rounded-lg bg-blue-500/5 text-blue-400/50">
                    [Chat Placeholder]
                  </div>
                </motion.div>

              </div>

            </motion.div>

          ) : (

            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4 opacity-60">
              <Heart size={48} className="text-gray-500" />
              <p className="text-lg">Select a transcript to view sentiment analysis</p>
            </div>

          )}

        </motion.div>

      </div>

    </div>
  );
};

export default Sentiments;