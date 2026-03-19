import React, { useState } from 'react'
import { AxiosCall } from '../services/AxiosCall';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const Upload = () => {
    const [uploadedFile, setUploadedFile] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleUploadOfFiles = async () => {
        setLoading(true)
        setError("")
        try {
            const formData = new FormData();
            formData.append("project", "Client Onboarding Project");
            Array.from(uploadedFile).forEach((file) => {
                formData.append("files", file);
            });
            const result = await AxiosCall('POST', 'api/upload/', formData, true, true)
            if (result.status === 200) {
                setUploadedFile([])
                setError("")
                toast.success(`Successfully uploaded ${result.data.files.length} file(s)`)
                console.log(result.data);
            } else {
                setError("Upload failed. Please try again.")
            }

        } catch (error) {
            setError("Error uploading files. Please try again.")
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        processFiles(files);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        processFiles(files);
    };

    const processFiles = (files) => {
        const invalidFile = files.find(file => {
            const ext = file.name.split(".").pop().toLowerCase();
            return ext !== "txt" && ext !== "vtt";
        });
        if (invalidFile) {
            setError("Only .txt and .vtt files are allowed.");
            setUploadedFile([]);
            return;
        }

        setError("");
        setUploadedFile(files);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
        >
            <div className="flex justify-end">
                <div className="text-right bg-gray-900/50 backdrop-blur-xl px-10 py-6 rounded-2xl border border-white/20 shadow-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <h1 className="text-5xl font-extrabold uppercase tracking-[6px] text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-rose-300 to-indigo-400 relative z-10">
                        UPLOAD
                    </h1>
                    <p className="text-gray-200 text-sm mt-2 tracking-wide relative z-10">
                        Import new meeting transcripts
                    </p>
                </div>
            </div>

            <div className="bg-gray-900/40 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
                {/* Drag & Drop Upload Area */}
                <label
                    htmlFor='uploaded-file'
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        animate={{
                            borderColor: isDragging ? '#3b82f6' : 'rgba(255,255,255,0.2)',
                            backgroundColor: isDragging ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                        }}
                        className={`border-2 border-dashed mt-4 rounded-2xl p-12 text-center transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[300px]`}
                    >
                        <motion.div
                            animate={{ y: isDragging ? -10 : 0 }}
                            className="bg-white/5 p-6 rounded-full text-blue-400 shadow-xl mb-6"
                        >
                            <UploadCloud size={48} />
                        </motion.div>

                        <p className="mb-2 text-xl text-white font-semibold">
                            Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-gray-400 mb-8 max-w-sm">
                            Supported formats: .txt, .vtt. Securely upload your meeting transcripts for AI analysis.
                        </p>

                        <AnimatePresence>
                            {uploadedFile.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex flex-wrap gap-3 justify-center"
                                >
                                    {uploadedFile.map((item, index) => (
                                        <div key={index} className='flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-lg border border-green-500/20 shadow-lg'>
                                            <FileText size={16} />
                                            <span className='text-sm font-medium'>{item.name}</span>
                                            <CheckCircle2 size={16} />
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className='flex items-center gap-2 text-red-400 bg-red-500/10 px-4 py-2 rounded-lg mt-6'
                                >
                                    <AlertCircle size={18} />
                                    <p className='text-sm font-medium'>{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </label>

                <input
                    id='uploaded-file'
                    hidden
                    type="file"
                    onChange={handleFileChange}
                    multiple={true}
                    accept=".txt,.vtt"
                />

                <div className='flex justify-end mt-8 border-t border-white/10 pt-6'>
                    <motion.button
                        whileHover={uploadedFile.length > 0 && !loading ? { scale: 1.05 } : {}}
                        whileTap={uploadedFile.length > 0 && !loading ? { scale: 0.95 } : {}}
                        disabled={uploadedFile.length === 0 || loading}
                        onClick={handleUploadOfFiles}
                        className={`px-8 py-3 rounded-xl flex justify-center items-center gap-2 font-semibold shadow-lg transition-all duration-300 ${uploadedFile.length === 0 || loading
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/25 text-white'
                            }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <>
                                <UploadCloud size={20} />
                                <span>Process Files</span>
                            </>
                        )}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}

export default Upload