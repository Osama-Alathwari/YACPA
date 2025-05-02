// src/components/auth/AnimatedLoginBackground.js
import React from 'react';

const AnimatedLoginBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900"></div>

            {/* Animated shape elements */}
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            <div className="absolute -bottom-10 left-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 right-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-6000"></div>

            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-10">
                <div className="h-full w-full bg-grid-white-100/[0.2]"></div>
            </div>
        </div>
    );
};

export default AnimatedLoginBackground;

// Add this CSS to your global stylesheet or a separate file
// You'll need to import this where your app initializes

/*
@keyframes blob {
    0% {
        transform: translate(0px, 0px) scale(1);
    }
    33% {
        transform: translate(30px, -50px) scale(1.1);
    }
    66% {
        transform: translate(-20px, 20px) scale(0.9);
    }
    100% {
        transform: translate(0px, 0px) scale(1);
    }
}

.animate-blob {
    animation: blob 10s infinite;
}

.animation-delay-2000 {
    animation-delay: 2s;
}

.animation-delay-4000 {
    animation-delay: 4s;
}

.animation-delay-6000 {
    animation-delay: 6s;
}

.bg-grid-white-100 {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}
*/