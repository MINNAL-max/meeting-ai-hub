import React, { useState, useEffect } from "react";
import { AxiosCall } from "../services/AxiosCall";

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
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Meetings</h1>
        <p className="text-slate-400">Loading meetings...</p>
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

          <h1 className="text-5xl font-extrabold uppercase tracking-[6px] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500">
            MEETINGS
          </h1>

          <p className="text-gray-200 text-sm mt-2">
            View and manage your meeting transcripts
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

        {/* Transcript List */}

        <div className="lg:col-span-1 bg-gray-900/40 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-lg">

          <h2 className="text-lg font-semibold mb-4 text-white">
            Transcripts
          </h2>

          <div className="space-y-2 max-h-96 overflow-y-auto">

            {allTranscripts.length > 0 ? (

              allTranscripts.map((transcript) => (

                <div
                  key={transcript.id}
                  onClick={() => fetchTranscriptItems(transcript.id)}
                  className={`p-3 rounded cursor-pointer transition ${selectedTranscript === transcript.id
                      ? "bg-blue-500/60"
                      : "bg-gray-800/50 hover:bg-gray-700/60"
                    }`}
                >

                  <p className="font-semibold text-sm truncate">
                    {transcript.file_name}
                  </p>

                  <p className="text-xs text-slate-400">
                    {transcript.project}
                  </p>

                  <p className="text-xs text-slate-400">
                    {new Date(transcript.uploaded_at).toLocaleDateString()}
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

        {/* Transcript Details */}

        <div className="lg:col-span-2 bg-gray-900/40 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg">

          {selectedTranscript ? (

            itemsLoading ? (

              <p className="text-slate-400">Loading items...</p>

            ) : transcriptItems ? (

              <div className="space-y-6">

                <div className="flex justify-between items-start">

                  <div>

                    <h2 className="text-xl font-semibold mb-1">
                      {allTranscripts.find(
                        (t) => t.id === selectedTranscript
                      )?.file_name}
                    </h2>

                    <p className="text-slate-400 text-sm">
                      Project:{" "}
                      {
                        allTranscripts.find(
                          (t) => t.id === selectedTranscript
                        )?.project
                      }
                    </p>

                  </div>

                  <button
                    onClick={() => handleExport(selectedTranscript)}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
                  >
                    Export CSV
                  </button>

                </div>

                {/* Decisions */}

                <div>

                  <h3 className="text-lg font-semibold mb-3">
                    Decisions ({transcriptItems.decisions.length})
                  </h3>

                  <div className="space-y-2">

                    {transcriptItems.decisions.length > 0 ? (

                      transcriptItems.decisions.map((decision) => (

                        <div
                          key={decision.id}
                          className="bg-gray-800/60 p-3 rounded"
                        >
                          {decision.text}
                        </div>

                      ))

                    ) : (

                      <p className="text-slate-400">
                        No decisions found
                      </p>

                    )}

                  </div>

                </div>

                {/* Action Items */}

                <div>

                  <h3 className="text-lg font-semibold mb-3">
                    Action Items ({transcriptItems.action_items.length})
                  </h3>

                  <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                      <thead className="bg-gray-800/60">

                        <tr>

                          <th className="px-4 py-2 text-left">Task</th>
                          <th className="px-4 py-2 text-left">Responsible</th>
                          <th className="px-4 py-2 text-left">Due Date</th>

                        </tr>

                      </thead>

                      <tbody>

                        {transcriptItems.action_items.length > 0 ? (

                          transcriptItems.action_items.map((item) => (

                            <tr
                              key={item.id}
                              className="border-t border-gray-700 hover:bg-gray-800/40"
                            >

                              <td className="px-4 py-2">{item.text}</td>

                              <td className="px-4 py-2">
                                {item.responsible || "N/A"}
                              </td>

                              <td className="px-4 py-2">
                                {item.due_date || "N/A"}
                              </td>

                            </tr>

                          ))

                        ) : (

                          <tr>

                            <td
                              colSpan="3"
                              className="text-center py-4 text-slate-400"
                            >
                              No action items found
                            </td>

                          </tr>

                        )}

                      </tbody>

                    </table>

                  </div>

                </div>

              </div>

            ) : null

          ) : (

            <div className="text-slate-400 text-center py-12">
              Select a transcript to view details
            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default Meetings;