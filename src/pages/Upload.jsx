import React, { useState } from "react";
import { AxiosCall } from "../services/AxiosCall";
import { toast } from "react-toastify";

const Upload = () => {

    const [uploadedFile, setUploadedFile] = useState([]);
    const [projectName, setProjectName] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [isDragging, setIsDragging] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);

    const validateFiles = (files) => {

        const invalidFile = files.find(file => {
            const ext = file.name.split(".").pop().toLowerCase();
            return ext !== "txt" && ext !== "vtt";
        });

        if (invalidFile) {
            setError("Only .txt and .vtt files are allowed.");
            setUploadedFile([]);
            return false;
        }

        setError("");
        setUploadedFile(files);
        return true;

    };

    const handleUploadOfFiles = async () => {

        setLoading(true);
        setError("");

        try {

            const formData = new FormData();

            formData.append("project", projectName);

            uploadedFile.forEach(file => {
                formData.append("files", file);
            });

            const result = await AxiosCall(
                "POST",
                "api/upload/",
                formData,
                true,
                true
            );

            if (result.status === 200) {

                setUploadResult(result.data);
                setUploadedFile([]);
                setProjectName("");

                toast.success(
                    `Successfully uploaded ${result.data.files.length} file(s)`
                );

            } else {

                setError("Upload failed. Please try again.");

            }

        } catch (error) {

            console.log(error);
            setError("Error uploading files.");

        } finally {

            setLoading(false);

        }

    };

    const handleDragOver = (e) => {

        e.preventDefault();
        setIsDragging(true);

    };

    const handleDragLeave = () => {

        setIsDragging(false);

    };

    const handleDrop = (e) => {

        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);

        validateFiles(files);

    };

    return (

        <div className="space-y-8">

            {/* HEADER */}

            <div className="flex justify-end">

                <div className="text-right bg-gray-900/50 backdrop-blur-xl px-10 py-6 rounded-2xl border border-white/20 shadow-xl">

                    <h1 className="text-5xl font-extrabold uppercase tracking-[6px] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500">
                        UPLOAD
                    </h1>

                    <p className="text-gray-200 text-sm mt-2">
                        Upload meeting transcripts
                    </p>

                </div>

            </div>

            {/* PROJECT NAME */}

            <div>

                <label className="text-sm text-gray-300 mb-2 block">
                    Project Name
                </label>

                <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name"
                    className="w-full bg-gray-900/40 backdrop-blur-xl border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                />

            </div>

            {/* DRAG DROP BOX */}

            <label htmlFor="uploaded-file">

                <div
                    className={`rounded-xl p-10 text-center border border-white/30 bg-white/10 backdrop-blur-xl shadow-2xl cursor-pointer transition ${
                        isDragging ? "bg-white/20 border-blue-400" : ""
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >

                    <i className="fa-solid fa-file-arrow-up fa-2xl text-white"></i>

                    <p className="mt-4 text-white font-semibold">
                        Click to upload or drag and drop
                    </p>

                    <p className="text-sm text-gray-300">
                        Supported formats .txt .vtt
                    </p>

                    {uploadedFile.length > 0 && (

                        <div className="mt-4">

                            {uploadedFile.map((file, index) => (

                                <p
                                    key={index}
                                    className="text-green-400 text-sm"
                                >
                                    {file.name}
                                </p>

                            ))}

                        </div>

                    )}

                    {error && (

                        <p className="text-red-400 text-sm mt-3">
                            {error}
                        </p>

                    )}

                </div>

            </label>

            <input
                id="uploaded-file"
                hidden
                type="file"
                multiple
                onChange={(e) =>
                    validateFiles(Array.from(e.target.files))
                }
            />

            {/* UPLOAD BUTTON */}

            <div className="flex justify-center">

                <button
                    disabled={
                        uploadedFile.length === 0 ||
                        loading ||
                        !projectName.trim()
                    }
                    onClick={handleUploadOfFiles}
                    className="bg-blue-600 hover:bg-blue-700 border border-white/20 rounded-lg px-8 py-2 text-white flex items-center disabled:bg-blue-400"
                >

                    Upload

                    {loading && (

                        <div className="animate-spin rounded-full h-4 w-4 border-b border-r border-white ml-2"></div>

                    )}

                </button>

            </div>

            {/* UPLOAD SUMMARY */}

            {uploadResult && uploadResult.files && (

                <div>

                    <h3 className="text-xl font-semibold text-white mb-4">
                        Upload Summary for '{uploadResult.project}'
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {uploadResult.files.map((file, idx) => (

                            <div
                                key={idx}
                                className="bg-gray-900/40 backdrop-blur-xl border border-white/20 p-4 rounded-lg"
                            >

                                <h4 className="text-blue-400 font-semibold truncate">
                                    {file.file_name}
                                </h4>

                                <div className="text-sm text-gray-300 mt-2 space-y-1">

                                    <p>Meeting Date: {file.meeting_date || "Unknown"}</p>

                                    <p>Speakers: {file.speaker_count}</p>

                                    <p>Word Count: {file.word_count}</p>

                                    <p>Decisions: {file.decisions?.length || 0}</p>

                                    <p>Action Items: {file.action_items?.length || 0}</p>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            )}

        </div>

    );

};

export default Upload;