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
        `api/transcript/${transcriptId}/items/export/?export_format=csv`,
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

  const handleDelete = async (transcriptId) => {

    if (!window.confirm("Delete this transcript permanently?")) return;

    try {

      const result = await AxiosCall(
        "DELETE",
        `api/transcript/${transcriptId}/delete/`,
        {},
        false,
        false
      );

      if (result.status === 200) {

        setSelectedTranscript(null);
        setTranscriptItems(null);

        fetchTranscripts();

      }

    } catch (error) {

      console.log(error);
      setError("Failed to delete transcript");

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

  Object.keys(transcripts).forEach(project => {
    transcripts[project].forEach(t => {
      allTranscripts.push({ ...t, project });
    });
  });

  allTranscripts.sort(
    (a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at)
  );

  return (

    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex justify-end">

        <div className="text-right bg-gray-900/50 backdrop-blur-xl px-10 py-6 rounded-2xl border border-white/20 shadow-xl">

          <h1 className="text-5xl font-extrabold uppercase tracking-[6px] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500">
            MEETINGS
          </h1>

          <p className="text-gray-200 text-sm mt-2">
            Manage your meeting transcripts
          </p>

          <p className="text-xs text-gray-300 mt-1">
            Total transcripts: {allTranscripts.length}
          </p>

        </div>

      </div>

      {error && (
        <div className="flex justify-end">
          <div className="px-4 py-2 rounded-lg bg-red-900/40 border border-red-400/30 text-red-300 text-sm">
            ⚠ {error}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT PANEL */}

        <div className="bg-gray-900/40 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-lg">

          <h2 className="text-lg font-semibold mb-4 text-white">
            Transcripts
          </h2>

          <div className="space-y-2 max-h-96 overflow-y-auto">

            {allTranscripts.map((t, index) => (

              <div
                key={t.id}
                onClick={() => fetchTranscriptItems(t.id)}
                className={`p-3 rounded cursor-pointer transition ${selectedTranscript === t.id
                  ? "bg-blue-500/60"
                  : "bg-gray-800/50 hover:bg-gray-700/60"
                  }`}
              >

                <p className="font-semibold text-sm truncate">
                  {index + 1}. {t.file_name}
                </p>

                <p className="text-xs text-slate-400">
                  {t.project}
                </p>

                <p className="text-xs text-slate-400">
                  {new Date(t.uploaded_at).toLocaleDateString()}
                </p>

              </div>

            ))}

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="lg:col-span-2 bg-gray-900/40 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg">

          {!selectedTranscript && (
            <div className="text-slate-400 text-center py-12">
              Select a transcript to view details
            </div>
          )}

          {itemsLoading && (
            <p className="text-slate-400">
              Loading items...
            </p>
          )}

          {transcriptItems && !itemsLoading && (

            <div className="space-y-6">

              {/* HEADER */}

              <div className="flex justify-between">

                <div>

                  <h2 className="text-xl font-semibold">
                    {
                      allTranscripts.find(
                        t => t.id === selectedTranscript
                      )?.file_name
                    }
                  </h2>

                  <p className="text-sm text-slate-400">
                    Project: {
                      allTranscripts.find(
                        t => t.id === selectedTranscript
                      )?.project
                    }
                  </p>

                </div>

                <div className="flex gap-2">

                  <button
                    onClick={() => handleExport(selectedTranscript)}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
                  >
                    Export CSV
                  </button>

                  <button
                    onClick={() => handleDelete(selectedTranscript)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
                  >
                    Delete
                  </button>

                </div>

              </div>

              {/* DECISIONS */}

              <div>

                <h3 className="text-lg font-semibold mb-3">
                  Decisions ({transcriptItems.decisions.length})
                </h3>

                <div className="space-y-2">

                  {transcriptItems.decisions.map(d => (

                    <div key={d.id} className="bg-gray-800/60 p-3 rounded">

                      {d.text}

                    </div>

                  ))}

                </div>

              </div>

              {/* ACTION ITEMS */}

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

                      {transcriptItems.action_items.map(item => (

                        <tr
                          key={item.id}
                          className="border-t border-gray-700 hover:bg-gray-800/40"
                        >

                          <td className="px-4 py-2">{item.text}</td>
                          <td className="px-4 py-2">{item.responsible || "N/A"}</td>
                          <td className="px-4 py-2">{item.due_date || "N/A"}</td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>

  );

};

export default Meetings;