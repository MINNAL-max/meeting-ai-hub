import React, { useState, useEffect } from "react";
import { AxiosCall } from "../services/AxiosCall";

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
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Sentiment Analysis</h1>
        <p className="text-slate-400">Loading transcripts...</p>
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

      <div className="flex justify-end">

        <div className="text-right bg-gray-900/50 backdrop-blur-xl px-10 py-6 rounded-2xl border border-white/20 shadow-xl">

          <h1 className="text-5xl font-extrabold uppercase tracking-[6px] text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-400 to-indigo-500">
            SENTIMENTS
          </h1>

          <p className="text-gray-200 text-sm mt-2">
            Analyze sentiment patterns in your meetings
          </p>

        </div>

      </div>

      {error && (
        <div className="flex justify-end">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-900/40 backdrop-blur-md border border-red-400/30 text-red-300 text-sm shadow-lg">
            ⚠ {error}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Meeting List */}

        <div className="lg:col-span-1 bg-gray-900/40 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-lg">

          <h2 className="text-lg font-semibold mb-4 text-white">
            Select a Meeting
          </h2>

          <div className="space-y-2 max-h-96 overflow-y-auto">

            {allTranscripts.length > 0 ? (

              allTranscripts.map((transcript) => (

                <div
                  key={transcript.id}
                  onClick={() => setSelectedTranscript(transcript.id)}
                  className={`p-3 rounded cursor-pointer transition ${selectedTranscript === transcript.id
                      ? "bg-purple-500/60"
                      : "bg-gray-800/50 hover:bg-gray-700/60"
                    }`}
                >

                  <p className="font-semibold text-sm truncate">
                    {transcript.file_name}
                  </p>

                  <p className="text-xs text-slate-400">
                    {transcript.project}
                  </p>

                </div>

              ))

            ) : (

              <p className="text-slate-400">
                No transcripts found
              </p>

            )}

          </div>

        </div>

        {/* Sentiment Panel */}

        <div className="lg:col-span-2 bg-gray-900/40 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg">

          {selectedTranscript ? (

            <div className="space-y-6">

              <div>

                <h3 className="text-xl font-semibold mb-2">
                  {
                    allTranscripts.find(
                      (t) => t.id === selectedTranscript
                    )?.file_name
                  }
                </h3>

                <p className="text-slate-400 text-sm">
                  Sentiment insights for this meeting
                </p>

              </div>

              <div className="space-y-4">

                <div className="p-4 bg-gray-800/60 rounded-lg">
                  <h4 className="font-semibold mb-1">
                    Sentiment Timeline Chart
                  </h4>
                  <p className="text-slate-400 text-sm">
                    Requires backend endpoint:
                    /api/transcript/{selectedTranscript}/sentiment/
                  </p>
                </div>

                <div className="p-4 bg-gray-800/60 rounded-lg">
                  <h4 className="font-semibold mb-1">
                    Speaker Sentiment Breakdown
                  </h4>
                  <p className="text-slate-400 text-sm">
                    Requires backend endpoint:
                    /api/transcript/{selectedTranscript}/speaker-sentiment/
                  </p>
                </div>

                <div className="p-4 bg-gray-800/60 rounded-lg">
                  <h4 className="font-semibold mb-1">
                    Flagged Sections
                  </h4>
                  <p className="text-slate-400 text-sm">
                    Requires backend endpoint:
                    /api/transcript/{selectedTranscript}/flagged-sections/
                  </p>
                </div>

                <div className="p-4 bg-gray-800/60 rounded-lg">
                  <h4 className="font-semibold mb-1">
                    Chat Interface
                  </h4>
                  <p className="text-slate-400 text-sm">
                    Requires backend endpoint:
                    /api/transcript/{selectedTranscript}/chat/
                  </p>
                </div>

              </div>

            </div>

          ) : (

            <div className="text-slate-400 text-center py-16">
              Select a transcript to view sentiment analysis
            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default Sentiments;