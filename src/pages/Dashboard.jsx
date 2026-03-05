import React, { useState, useEffect } from "react";
import { AxiosCall } from "../services/AxiosCall";

const Dashboard = () => {

    const [transcripts, setTranscripts] = useState({});
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

            if (result && result.status === 200) {
                setTranscripts(result.data || {});
            } else {
                setError("Failed to load transcripts");
            }

        } catch (err) {
            console.log(err);
            setError("Error loading transcripts");
        } finally {
            setLoading(false);
        }
    };

    /* ---------- Stats ---------- */

    const calculateStats = () => {

        let totalMeetings = 0;
        let allTranscriptsList = [];

        Object.keys(transcripts).forEach((project) => {

            const projectTranscripts = transcripts[project];

            totalMeetings += projectTranscripts.length;

            allTranscriptsList = [...allTranscriptsList, ...projectTranscripts];

        });

        return {
            totalMeetings,
            allTranscriptsList,
        };

    };

    const stats = calculateStats();

    const recentMeetings = stats.allTranscriptsList
        .slice(0, 5)
        .sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at));

    /* ---------- Glass Card ---------- */

    function StatCard({ title, value }) {

        return (
            <div className="p-6 rounded-xl bg-gray-900/50 backdrop-blur-xl border border-white/20 shadow-lg hover:bg-gray-900/60 transition">

                <p className="text-gray-300 text-sm">{title}</p>

                <h3 className="text-3xl font-bold text-white mt-2">
                    {value || "0"}
                </h3>

            </div>
        );
    }

    /* ---------- Loading ---------- */

    if (loading) {

        return (
            <div className="space-y-8">

                <div className="flex justify-end">

                    <div className="text-right bg-gray-900/50 backdrop-blur-xl px-10 py-6 rounded-2xl border border-white/20 shadow-xl">

                        <h1 className="text-5xl font-extrabold uppercase tracking-[6px] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
                            DASHBOARD
                        </h1>

                        <p className="text-gray-200 text-sm mt-2">
                            Loading dashboard...
                        </p>

                    </div>

                </div>

            </div>
        );
    }

    /* ---------- UI ---------- */

    return (

        <div className="space-y-8">

            {/* Header */}

            <div className="flex justify-end">

                <div className="text-right bg-gray-900/50 backdrop-blur-xl px-10 py-6 rounded-2xl border border-white/20 shadow-xl">

                    <h1 className="text-5xl font-extrabold uppercase tracking-[6px] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
                        DASHBOARD
                    </h1>

                    <p className="text-gray-200 text-sm mt-2 tracking-wide">
                        Overview of your meetings and insights
                    </p>

                </div>

            </div>

            {error && <p className="text-red-400">{error}</p>}

            {/* Stats */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <StatCard title="Total Meetings" value={stats.totalMeetings} />

                <StatCard
                    title="Total Projects"
                    value={Object.keys(transcripts).length}
                />

                <StatCard
                    title="Recent Upload"
                    value={
                        recentMeetings.length > 0
                            ? new Date(recentMeetings[0].uploaded_at).toLocaleDateString()
                            : "N/A"
                    }
                />

            </div>

            {/* Recent Meetings */}

            <div className="bg-gray-900/50 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-xl">

                <h2 className="text-xl font-semibold text-white mb-4">
                    Recent Meetings
                </h2>

                <div className="overflow-x-auto">

                    <table className="w-full text-sm text-gray-200">

                        <thead className="bg-gray-800/70">

                            <tr>

                                <th className="px-4 py-3 text-left">File Name</th>
                                <th className="px-4 py-3 text-left">Project</th>
                                <th className="px-4 py-3 text-left">Meeting Date</th>
                                <th className="px-4 py-3 text-left">Speakers</th>
                                <th className="px-4 py-3 text-left">Words</th>
                                <th className="px-4 py-3 text-left">Uploaded</th>

                            </tr>

                        </thead>

                        <tbody>

                            {recentMeetings.length > 0 ? (

                                recentMeetings.map((meeting, index) => (

                                    <tr
                                        key={index}
                                        className="border-t border-gray-700 hover:bg-gray-800/40"
                                    >

                                        <td className="px-4 py-3">{meeting.file_name}</td>

                                        <td className="px-4 py-3">
                                            {Object.keys(transcripts).find((project) =>
                                                transcripts[project].some((t) => t.id === meeting.id)
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            {meeting.meeting_date || "N/A"}
                                        </td>

                                        <td className="px-4 py-3">{meeting.speaker_count}</td>

                                        <td className="px-4 py-3">{meeting.word_count}</td>

                                        <td className="px-4 py-3">
                                            {new Date(meeting.uploaded_at).toLocaleDateString()}
                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td colSpan="6" className="text-center py-6 text-gray-400">
                                        No meetings yet. Upload a transcript to get started.
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};

export default Dashboard;