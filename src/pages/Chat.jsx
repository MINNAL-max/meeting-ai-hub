import React, { useState, useEffect, useRef } from "react";
import { AxiosCall } from "../services/AxiosCall";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, MessageSquare, Loader2, AlertCircle } from "lucide-react";

const Chat = () => {
    const [messages, setMessages] = useState([
        {
            id: "welcome",
            type: "assistant",
            content:
                "Hello! I'm your meeting intelligence chatbot. I can answer questions across all your meeting transcripts. Ask about decisions, action items, speakers, or anything discussed in your meetings.",
            sources: [],
        },
    ]);

    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedProject, setSelectedProject] = useState("");
    const [projects, setProjects] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchProjects = async () => {
        try {
            const result = await AxiosCall("GET", "api/list/", null, false, false);
            if (result.status === 200) {
                setProjects(Object.keys(result.data));
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!inputValue.trim()) return;

        const userMessage = {
            id: `user-${Date.now()}`,
            type: "user",
            content: inputValue,
            sources: [],
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setLoading(true);
        setError("");

        try {
            const queryData = {
                query: inputValue,
                ...(selectedProject && { project: selectedProject }),
            };

            const result = await AxiosCall("POST", "api/query/", queryData, true, false);

            if (result.status === 200) {
                const assistantMessage = {
                    id: `assistant-${Date.now()}`,
                    type: "assistant",
                    content: result.data.answer,
                    sources: result.data.sources || [],
                };

                setMessages((prev) => [...prev, assistantMessage]);
            } else {
                setError("Failed to get response.");
            }
        } catch (err) {
            console.log(err);
            setError("Error communicating with chatbot.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 flex flex-col h-[calc(100vh-8rem)]">

            {/* Header */}

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-end shrink-0"
            >

                <div className="text-right bg-gray-900/50 backdrop-blur-xl px-10 py-6 rounded-2xl border border-white/20 shadow-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                    <h1 className="text-5xl font-extrabold uppercase tracking-[6px] text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-purple-500 relative z-10">
                        CHAT
                    </h1>

                    <p className="text-gray-200 text-sm mt-2 relative z-10">
                        Ask questions across your meeting transcripts
                    </p>

                </div>

            </motion.div>

            {/* Chat Container */}

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-900/40 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg flex flex-col flex-1 min-h-0 overflow-hidden"
            >

                {/* Top Controls */}

                <div className="border-b border-white/10 p-4 flex items-center justify-between bg-black/20 shrink-0">

                    <div className="flex items-center gap-4">
                        <MessageSquare className="text-blue-400" size={20} />
                        <span className="text-sm font-semibold text-gray-200">Chat Session</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">Filter Project:</span>

                        <select
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                            className="bg-gray-800 text-white px-3 py-1.5 rounded-lg border border-gray-700 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        >
                            <option value="">All Projects</option>
                            {projects.map((project) => (
                                <option key={project} value={project}>
                                    {project}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>

                {/* Messages */}

                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth">
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (

                            <motion.div
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                key={msg.id}
                                className={`flex gap-4 ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                            >

                                {msg.type === "assistant" && (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shrink-0">
                                        <Bot size={20} className="text-white" />
                                    </div>
                                )}

                                <div
                                    className={`max-w-2xl rounded-2xl p-5 shadow-md ${msg.type === "user"
                                        ? "bg-blue-600 text-white rounded-tr-sm"
                                        : "bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-sm"
                                        }`}
                                >

                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                                    {msg.sources && msg.sources.length > 0 && (

                                        <div className="mt-4 border-t border-gray-600/50 pt-3">

                                            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-semibold flex items-center gap-1">
                                                <AlertCircle size={12} /> Sources
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                {msg.sources.map((s, i) => (
                                                    <div key={i} className="bg-gray-900/50 p-2.5 rounded-lg text-xs border border-gray-700 w-full sm:w-auto">
                                                        <p className="font-medium text-blue-300">{s.file_name}</p>
                                                        <p className="text-gray-500 mt-1 flex items-center justify-between gap-4">
                                                            <span>{s.project}</span>
                                                            <span>{s.meeting_date || "N/A"}</span>
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>

                                    )}

                                </div>

                                {msg.type === "user" && (
                                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center shadow-lg shrink-0 border border-gray-600">
                                        <User size={20} className="text-gray-300" />
                                    </div>
                                )}

                            </motion.div>

                        ))}

                        {loading && (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-start gap-4"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shrink-0">
                                    <Bot size={20} className="text-white" />
                                </div>
                                <div className="bg-gray-800 text-gray-200 border border-gray-700 rounded-2xl rounded-tl-sm p-4 flex items-center gap-3">
                                    <Loader2 className="animate-spin text-blue-400" size={20} />
                                    <span className="text-sm font-medium">Analyzing transcripts...</span>
                                </div>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-400 text-sm p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-center mx-14"
                            >
                                {error}
                            </motion.div>
                        )}

                    </AnimatePresence>
                    <div ref={messagesEndRef} className="h-1"></div>
                </div>

                {/* Input */}

                <div className="border-t border-white/10 p-5 bg-black/20 shrink-0">

                    <form onSubmit={handleSendMessage} className="flex gap-3 max-w-5xl mx-auto">

                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask something about your meetings..."
                            disabled={loading}
                            className="flex-1 bg-gray-800/80 text-white px-5 py-3.5 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner text-sm disabled:opacity-50"
                        />

                        <motion.button
                            whileHover={!loading && inputValue.trim() ? { scale: 1.05 } : {}}
                            whileTap={!loading && inputValue.trim() ? { scale: 0.95 } : {}}
                            type="submit"
                            disabled={loading || !inputValue.trim()}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none flex items-center gap-2 font-medium"
                        >
                            <Send size={18} />
                            <span className="hidden sm:inline">Send</span>
                        </motion.button>

                    </form>

                    <p className="text-xs text-gray-500 mt-3 text-center">
                        Example: "What decisions were made?" or "What tasks does John have?"
                    </p>

                </div>

            </motion.div>

        </div>
    );
};

export default Chat;