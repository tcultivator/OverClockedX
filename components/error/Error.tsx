"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuX } from "react-icons/lu";
import { useAlertNotification } from "@/stores/alertNotificationStore";

const Error = () => {

    const errorMessageDisplay = useAlertNotification((state) => state.errorMessageDisplay)
    const setErrorMessageDisplay = useAlertNotification((state) => state.setErrorMessageDisplay)



    return (
        <AnimatePresence>
            {errorMessageDisplay.display && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 font-sans">


                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setErrorMessageDisplay({
                            display: false,
                            title: '',
                            message: ''
                        })}
                        className="absolute inset-0 bg-black/20 backdrop-blur-[10px]"
                    />


                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className="relative w-full max-w-[380px] bg-white rounded-sm shadow-xl p-4 flex flex-col items-center"
                    >

                        <button
                            onClick={() => setErrorMessageDisplay({
                                display: false,
                                title: '',
                                message: ''
                            })}
                            className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <div className="border-[1.5px] border-gray-300 rounded-full p-[2px]">
                                <LuX size={14} strokeWidth={3} />
                            </div>
                        </button>


                        <div className="mt-4 mb-5">
                            <svg
                                width="80"
                                height="80"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >

                                <path
                                    d="M10.29 3.86L1.82 18C1.64554 18.3024 1.55296 18.6455 1.55196 18.9945C1.55096 19.3434 1.64158 19.6869 1.81442 19.9905C1.98727 20.2941 2.23635 20.5467 2.53676 20.7225C2.83718 20.8983 3.17845 20.9912 3.526 20.99H20.474C20.8216 20.9912 21.1628 20.8983 21.4632 20.7225C21.7637 20.5467 22.0127 20.2941 22.1856 19.9905C22.3584 19.6869 22.449 19.3434 22.448 18.9945C22.447 18.6455 22.3545 18.3024 22.18 18L13.71 3.86C13.5317 3.56613 13.2807 3.32314 12.9813 3.15451C12.6819 2.98587 12.3442 2.89728 12 2.89728C11.6558 2.89728 11.3181 2.98587 11.0187 3.15451C10.7193 3.32314 10.4683 3.56613 10.29 3.86Z"
                                    stroke="#EF4444"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                <path
                                    d="M12 9V13"
                                    stroke="#EF4444"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M12 17H12.01"
                                    stroke="#EF4444"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>


                        <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center items-center tracking-tight">
                            {errorMessageDisplay.title}
                        </h3>
                        <p className="text-[15px] text-slate-500 text-center leading-relaxed mb-8 px-2">
                            {errorMessageDisplay.message}
                        </p>


                        <button
                            onClick={() => setErrorMessageDisplay({
                                display: false,
                                title: '',
                                message: ''
                            })}
                            className="w-auto min-w-[140px] py-2.5 px-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 text-sm font-medium rounded-full transition-all active:scale-95"
                        >
                            Close
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Error;