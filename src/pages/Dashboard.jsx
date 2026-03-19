import React, { useState, useEffect } from "react";
import { AxiosCall } from "../services/AxiosCall";
import { motion } from "framer-motion";
import { Users, Folder, Video } from "lucide-react";

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

    function StatCard({ title, value, index, icon }) {

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-xl bg-gray-900/50 backdrop-blur-xl border border-white/20 shadow-lg hover:bg-gray-900/60 transition relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 -mr-4 -mt-4 p-8 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500 z-0 pointer-events-none"></div>

                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <p className="text-gray-300 text-sm font-medium tracking-wide">{title}</p>
                        <motion.h3
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: (index * 0.1) + 0.2, type: "spring" }}
                            className="text-4xl font-black text-white mt-2"
                        >
                            {value || "0"}
                        </motion.h3>
                    </div>
                    <div className="text-blue-400 p-3 bg-white/5 rounded-xl border border-white/10 group-hover:scale-110 transition-transform duration-300">
                        {icon}
                    </div>
                </div>

            </motion.div>
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

                {/* Skeleton Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-gray-800/50 rounded-xl border border-white/10"></div>
                    ))}
                </div>

                {/* Skeleton Table */}
                <div className="h-64 bg-gray-800/50 rounded-xl border border-white/10 animate-pulse mt-8"></div>
            </div>
        );
    }

    /* ---------- UI ---------- */

    return (

        <div className="space-y-8">

            {/* Header */}

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-end"
            >

                <div className="text-right bg-gray-900/50 backdrop-blur-xl px-10 py-6 rounded-2xl border border-white/20 shadow-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                    <h1 className="text-5xl font-extrabold uppercase tracking-[6px] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 relative z-10">
                        DASHBOARD
                    </h1>

                    <p className="text-gray-200 text-sm mt-2 tracking-wide relative z-10">
                        Overview of your meetings and insights
                    </p>

                </div>

            </motion.div>

            {error && <p className="text-red-400">{error}</p>}

            {/* Stats */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                <StatCard
                    title="Total Meetings"
                    value={stats.totalMeetings}
                    index={0}
                    icon={<Video size={28} />}
                />

                <StatCard
                    title="Total Projects"
                    value={Object.keys(transcripts).length}
                    index={1}
                    icon={<Folder size={28} />}
                />

                <StatCard
                    title="Recent Upload"
                    value={
                        recentMeetings.length > 0
                            ? new Date(recentMeetings[0].uploaded_at).toLocaleDateString()
                            : "N/A"
                    }
                    index={2}
                    icon={<Users size={28} />}
                />

            </div>

            {/* Recent Meetings */}

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-gray-900/50 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-xl"
            >

                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <Video size={20} className="text-blue-400" />
                    Recent Meetings
                </h2>

                <div className="overflow-x-auto">

                    <table className="w-full text-sm text-gray-200">

                        <thead className="bg-gray-800/70 text-gray-300 rounded-t-lg">

                            <tr>

                                <th className="px-4 py-4 text-left font-medium first:rounded-tl-lg">File Name</th>
                                <th className="px-4 py-4 text-left font-medium">Project</th>
                                <th className="px-4 py-4 text-left font-medium">Meeting Date</th>
                                <th className="px-4 py-4 text-left font-medium">Speakers</th>
                                <th className="px-4 py-4 text-left font-medium">Words</th>
                                <th className="px-4 py-4 text-left font-medium last:rounded-tr-lg">Uploaded</th>

                            </tr>

                        </thead>

                        <tbody>

                            {recentMeetings.length > 0 ? (

                                recentMeetings.map((meeting, index) => (

                                    <motion.tr
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + (index * 0.1) }}
                                        key={index}
                                        className="border-t border-gray-700/50 hover:bg-white/5 transition duration-200 group"
                                    >

                                        <td className="px-4 py-4 group-hover:text-blue-400 transition-colors">
                                            {meeting.file_name}
                                        </td>

                                        <td className="px-4 py-4">
                                            <span className="px-3 py-1 bg-gray-800 rounded-full text-xs border border-gray-700">
                                                {Object.keys(transcripts).find((project) =>
                                                    transcripts[project].some((t) => t.id === meeting.id)
                                                )}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 text-gray-400">
                                            {meeting.meeting_date || "N/A"}
                                        </td>

                                        <td className="px-4 py-4">
                                            <span className="font-semibold">{meeting.speaker_count}</span>
                                        </td>

                                        <td className="px-4 py-4">
                                            {meeting.word_count?.toLocaleString() || "0"}
                                        </td>

                                        <td className="px-4 py-4 text-gray-400">
                                            {new Date(meeting.uploaded_at).toLocaleDateString()}
                                        </td>

                                    </motion.tr>

                                ))

                            ) : (

                                <tr>

                                    <td colSpan="6" className="text-center py-10 text-gray-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <Folder size={40} className="text-gray-600" />
                                            <span>No meetings yet. Upload a transcript to get started.</span>
                                        </div>
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </motion.div>

        </div>
    );
};

export default Dashboard;