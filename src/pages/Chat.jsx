import React, { useState, useEffect, useRef } from "react";
import { AxiosCall } from "../services/AxiosCall";

const Chat = () => {

    const [messages, setMessages] = useState([
        {
            id: "welcome",
            type: "assistant",
            content:
                "Hello! I'm your meeting intelligence chatbot. Ask me about decisions, action items, speakers, or anything discussed in your meetings.",
            sources: []
        }
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
            sources: []
        };

        setMessages(prev => [...prev, userMessage]);

        setInputValue("");
        setLoading(true);
        setError("");

        try {

            const queryData = {
                query: inputValue,
                ...(selectedProject && { project: selectedProject })
            };

            const result = await AxiosCall("POST", "api/query/", queryData, true, false);

            if (result.status === 200) {

                const assistantMessage = {
                    id: `assistant-${Date.now()}`,
                    type: "assistant",
                    content: result.data.answer,
                    sources: result.data.sources || []
                };

                setMessages(prev => [...prev, assistantMessage]);

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

        <div className="space-y-8">

            {/* HEADER */}

            <div className="flex justify-end">

                <div className="text-right bg-gray-900/50 backdrop-blur-xl px-10 py-6 rounded-2xl border border-white/20 shadow-xl">

                    <h1 className="text-5xl font-extrabold uppercase tracking-[6px] text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-purple-500">
                        CHAT
                    </h1>

                    <p className="text-gray-200 text-sm mt-2">
                        Ask questions across your meeting transcripts
                    </p>

                </div>

            </div>

            {/* CHAT CONTAINER */}

            <div className="bg-gray-900/40 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg flex flex-col h-[70vh]">

                {/* PROJECT FILTER */}

                <div className="border-b border-white/10 p-4 flex items-center gap-4">

                    <span className="text-sm text-gray-300">Filter Project:</span>

                    <select
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                        className="bg-gray-800 text-white px-3 py-1 rounded border border-gray-700 text-sm"
                    >
                        <option value="">All Projects</option>

                        {projects.map(project => (

                            <option key={project} value={project}>
                                {project}
                            </option>

                        ))}

                    </select>

                </div>

                {/* MESSAGES */}

                <div className="flex-1 overflow-y-auto p-6 space-y-4">

                    {messages.map(msg => (

                        <div
                            key={msg.id}
                            className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                        >

                            <div
                                className={`max-w-xl rounded-xl p-4 ${msg.type === "user"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-800/70 text-gray-200 border border-gray-700"
                                    }`}
                            >

                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>

                                {msg.sources && msg.sources.length > 0 && (

                                    <div className="mt-3 border-t border-gray-600 pt-3">

                                        <p className="text-xs text-gray-400 mb-2">
                                            Sources
                                        </p>

                                        {msg.sources.map((s, i) => (

                                            <div
                                                key={i}
                                                className="bg-gray-700 p-2 rounded text-xs mb-1"
                                            >

                                                <p className="font-semibold">{s.file_name}</p>

                                                <p className="text-gray-400">
                                                    {s.project} | {s.meeting_date || "N/A"}
                                                </p>

                                            </div>

                                        ))}

                                    </div>

                                )}

                            </div>

                        </div>

                    ))}

                    {loading && (

                        <div className="flex items-center gap-2 text-gray-300">

                            <div className="animate-spin rounded-full h-4 w-4 border-b border-r border-blue-500"></div>

                            <span className="text-sm">Analyzing transcripts...</span>

                        </div>

                    )}

                    {error && (

                        <div className="text-red-400 text-sm">
                            {error}
                        </div>

                    )}

                    <div ref={messagesEndRef}></div>

                </div>

                {/* INPUT */}

                <div className="border-t border-white/10 p-4">

                    <form onSubmit={handleSendMessage} className="flex gap-3">

                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask something about your meetings..."
                            disabled={loading}
                            className="flex-1 bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:outline-none focus:border-blue-400"
                        />

                        <button
                            type="submit"
                            disabled={loading || !inputValue.trim()}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition disabled:opacity-50"
                        >
                            Send
                        </button>

                    </form>

                    <p className="text-xs text-gray-400 mt-2">
                        Try asking: “What decisions were made?” or “What tasks does John have?”
                    </p>

                </div>

            </div>

        </div>

    );

};

export default Chat;