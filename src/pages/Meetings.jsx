import React, { useState, useEffect } from "react";
import { AxiosCall } from "../services/AxiosCall";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Download, CheckSquare, ListTodo, AlertCircle, FileText, FileDown } from "lucide-react";

const Meetings = () => {
  const [transcripts, setTranscripts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTranscript, setSelectedTranscript] = useState(null);
  const [transcriptItems, setTranscriptItems] = useState(null);
  const [itemsLoading, setItemsLoading] = useState(false);

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

  const fetchTranscriptItems = async (transcriptId) => {
    setItemsLoading(true);

    try {
      const result = await AxiosCall(
        "GET",
        `api/transcript/${transcriptId}/items/`,
        {},
        false,
        false
      );

      if (result.status === 200) {
        setTranscriptItems(result.data);
        setSelectedTranscript(transcriptId);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to load transcript items");
    } finally {
      setItemsLoading(false);
    }
  };

  const handleExport = async (transcriptId) => {
    try {
      const result = await AxiosCall(
        "GET",
        `api/transcript/${transcriptId}/items/export/?format=csv`,
        {},
        false,
        false
      );

      if (result.status === 200) {
        const blob = new Blob([result.data], { type: "text/csv" });

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `transcript_${transcriptId}_items.csv`;

        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to export items");
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
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <h1 className="text-5xl font-extrabold uppercase tracking-[6px] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500 relative z-10">
            MEETINGS
          </h1>
          <p className="text-gray-200 text-sm mt-2 relative z-10">
            View and manage your meeting transcripts
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
        {/* Transcript List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 bg-gray-900/40 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-lg flex flex-col h-[70vh]"
        >
          <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2 sticky top-0">
            <Video size={18} className="text-cyan-400" />
            Transcripts
          </h2>

          <div className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {allTranscripts.length > 0 ? (
              allTranscripts.map((transcript, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * Math.min(index, 10) }}
                  key={transcript.id}
                  onClick={() => fetchTranscriptItems(transcript.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${selectedTranscript === transcript.id
                    ? "bg-blue-500/20 border-blue-500/50 shadow-inner"
                    : "bg-gray-800/50 hover:bg-gray-700/60 border-transparent hover:border-white/10"
                    }`}
                >
                  <p className="font-semibold text-sm truncate flex items-center gap-2">
                    <FileText size={14} className={selectedTranscript === transcript.id ? "text-blue-400" : "text-gray-400"} />
                    {transcript.file_name}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-slate-400 bg-black/20 px-2 py-1 rounded">
                      {transcript.project}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(transcript.uploaded_at).toLocaleDateString()}
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

        {/* Transcript Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-gray-900/40 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg h-[70vh] overflow-y-auto custom-scrollbar"
        >
          {selectedTranscript ? (
            itemsLoading ? (
              <div className="flex flex-col items-center justify-center h-full animate-pulse text-blue-400 gap-4">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p>Loading items...</p>
              </div>
            ) : transcriptItems ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-start border-b border-white/10 pb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-1 flex items-center gap-3">
                      {allTranscripts.find((t) => t.id === selectedTranscript)?.file_name}
                    </h2>
                    <p className="text-slate-400 text-sm flex items-center gap-2 mt-2">
                      <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs">
                        Project: {allTranscripts.find((t) => t.id === selectedTranscript)?.project}
                      </span>
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleExport(selectedTranscript)}
                    className="bg-green-600/80 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-lg transition-colors border border-green-500/50"
                  >
                    <FileDown size={16} />
                    Export CSV
                  </motion.button>
                </div>

                {/* Decisions */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-indigo-300">
                    <CheckSquare size={18} />
                    Decisions ({transcriptItems.decisions.length})
                  </h3>

                  <div className="space-y-3">
                    {transcriptItems.decisions.length > 0 ? (
                      transcriptItems.decisions.map((decision, i) => (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + (i * 0.05) }}
                          key={decision.id}
                          className="bg-gradient-to-r from-gray-800/80 to-gray-800/40 p-4 rounded-xl border-l-4 border-indigo-500 shadow-md"
                        >
                          {decision.text}
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-slate-400 italic p-4 bg-gray-800/30 rounded-xl">
                        No decisions found in this transcript.
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* Action Items */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-rose-300">
                    <ListTodo size={18} />
                    Action Items ({transcriptItems.action_items.length})
                  </h3>

                  <div className="overflow-hidden rounded-xl border border-white/10 shadow-md">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-800/80 border-b border-white/10">
                        <tr>
                          <th className="px-5 py-3 text-left font-medium text-gray-300">Task</th>
                          <th className="px-5 py-3 text-left font-medium text-gray-300">Responsible</th>
                          <th className="px-5 py-3 text-left font-medium text-gray-300">Due Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 bg-gray-900/40">
                        {transcriptItems.action_items.length > 0 ? (
                          transcriptItems.action_items.map((item, i) => (
                            <motion.tr
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 + (i * 0.05) }}
                              key={item.id}
                              className="hover:bg-gray-800/60 transition-colors"
                            >
                              <td className="px-5 py-4">{item.text}</td>
                              <td className="px-5 py-4">
                                {item.responsible ? (
                                  <span className="bg-white/10 px-3 py-1 rounded-full text-xs">{item.responsible}</span>
                                ) : "N/A"}
                              </td>
                              <td className="px-5 py-4 text-gray-400">
                                {item.due_date || "N/A"}
                              </td>
                            </motion.tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="text-center py-8 text-slate-400 italic">
                              No action items found in this transcript.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </motion.div>
            ) : null
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4 opacity-60">
              <Video size={48} className="text-gray-500" />
              <p className="text-lg">Select a transcript to view detailed decisions and action items</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Meetings;