import React, { useState, useEffect } from "react";
import { AxiosCall } from "../services/AxiosCall";

const Sentiments = () => {

  const [transcripts, setTranscripts] = useState({});
  const [selectedTranscript, setSelectedTranscript] = useState(null);

  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [error, setError] = useState("");

  const [sentimentData, setSentimentData] = useState(null);
  const [speakerData, setSpeakerData] = useState(null);
  const [flaggedSections, setFlaggedSections] = useState(null);

  useEffect(() => {
    fetchTranscripts();
  }, []);

  useEffect(() => {
    if (selectedTranscript) {
      fetchSentimentData();
    }
  }, [selectedTranscript]);

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

  const fetchSentimentData = async () => {

    setAnalysisLoading(true);

    try {

      const sentiment = await AxiosCall(
        "GET",
        `api/transcript/${selectedTranscript}/sentiment/`,
        {},
        false,
        false
      );

      const speaker = await AxiosCall(
        "GET",
        `api/transcript/${selectedTranscript}/speaker-sentiment/`,
        {},
        false,
        false
      );

      const flagged = await AxiosCall(
        "GET",
        `api/transcript/${selectedTranscript}/flagged-sections/`,
        {},
        false,
        false
      );

      if (sentiment.status === 200) setSentimentData(sentiment.data);
      if (speaker.status === 200) setSpeakerData(speaker.data);
      if (flagged.status === 200) setFlaggedSections(flagged.data);

    } catch (error) {
      console.log(error);
      setError("Failed to analyze sentiment");
    } finally {
      setAnalysisLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-semibold">Sentiment Analysis</h1>
        <p className="text-slate-400">Loading transcripts...</p>
      </div>
    );
  }

  const allTranscripts = [];

  Object.keys(transcripts).forEach(project => {
    transcripts[project].forEach(t => {
      allTranscripts.push({ ...t, project });
    });
  });

  return (

    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex justify-end">

        <div className="text-right bg-gray-900/40 backdrop-blur-xl px-10 py-6 rounded-2xl border border-white/20 shadow-xl">

          <h1 className="text-5xl font-extrabold uppercase tracking-[6px] text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-400 to-indigo-500">
            SENTIMENTS
          </h1>

          <p className="text-gray-200 text-sm mt-2">
            Analyze sentiment patterns in your meetings
          </p>

        </div>

      </div>

      {error && (
        <div className="text-red-400">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT PANEL */}

        <div className="bg-gray-900/40 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-lg">

          <h2 className="text-lg font-semibold mb-4 text-white">
            Select a Meeting
          </h2>

          <div className="space-y-2 max-h-96 overflow-y-auto">

            {allTranscripts.length > 0 ? (

              allTranscripts.map((t) => (

                <div
                  key={t.id}
                  onClick={() => setSelectedTranscript(t.id)}
                  className={`p-3 rounded cursor-pointer transition ${selectedTranscript === t.id
                      ? "bg-purple-500/60"
                      : "bg-gray-800/50 hover:bg-gray-700/60"
                    }`}
                >

                  <p className="font-semibold text-sm truncate">
                    {t.file_name}
                  </p>

                  <p className="text-xs text-slate-400">
                    {t.project}
                  </p>

                </div>

              ))

            ) : (

              <p className="text-slate-400">No transcripts found</p>

            )}

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="lg:col-span-2 bg-gray-900/40 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg">

          {!selectedTranscript && (
            <div className="text-center text-slate-400 py-16">
              Select a transcript to analyze sentiment
            </div>
          )}

          {analysisLoading && (
            <div className="text-center py-10 text-slate-300">
              Analyzing meeting sentiment...
            </div>
          )}

          {sentimentData && sentimentData.timeline && (

            <div className="space-y-4">

              <h3 className="text-xl font-semibold">
                Sentiment Timeline
              </h3>

              {sentimentData.timeline.map((segment, index) => (

                <div
                  key={index}
                  className="p-3 bg-gray-800/60 rounded-lg"
                >

                  <div className="text-sm text-gray-300">
                    {segment.time}
                  </div>

                  <div className="text-xs text-gray-400">
                    {segment.segment_text}
                  </div>

                </div>

              ))}

            </div>

          )}

          {speakerData && speakerData.speakers && (

            <div className="mt-8">

              <h3 className="text-xl font-semibold mb-4">
                Speaker Sentiment
              </h3>

              <div className="grid grid-cols-2 gap-4">

                {speakerData.speakers.map((speaker, i) => (

                  <div key={i} className="bg-gray-800/60 p-4 rounded-lg">

                    <p className="font-semibold">{speaker.speaker}</p>

                    <p className="text-xs text-gray-400">
                      {speaker.sentiment}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          )}

          {flaggedSections && flaggedSections.flagged_sections && (

            <div className="mt-8">

              <h3 className="text-xl font-semibold mb-4">
                Flagged Sections
              </h3>

              {flaggedSections.flagged_sections.map((section, i) => (

                <div key={i} className="bg-gray-800/60 p-4 rounded-lg mb-2">

                  <p className="text-xs text-gray-400">{section.time}</p>

                  <p className="text-sm">{section.text_preview}</p>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>

  );

};

export default Sentiments;