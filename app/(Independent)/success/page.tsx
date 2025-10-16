import React from 'react';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa'; // React Icons

const SuccessPayment = () => {
    return (
        <div className="z-40 bg-black flex justify-center items-center min-h-screen w-full px-4 py-8 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 lg:p-10 w-full max-w-md text-center">
                
                {/* React Icon */}
                <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-3">
                    Payment Successful 🎉
                </h1>
                
                <p className="text-base sm:text-lg text-gray-700 mb-6">
                    Thank you for your purchase! Your transaction was completed successfully.
                </p>

                <Link
                    href="/"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-6 py-2 text-sm sm:text-base transition duration-300"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
};

export default SuccessPayment;
