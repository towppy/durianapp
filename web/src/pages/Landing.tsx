import React, { useState } from 'react';
import '../css/Landing.css';

export default function Landing() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="landing-container">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('/images/durian-bg.jpg')`,
        }}
      />

      {/* Content */}
      <div className="landing-content">
        {/* Left - Title */}
        <div className="flex-1 max-w-xl">
          <h1 className="landing-title">
            <div className="line1">KNOW YOUR</div>
            <div className="line2">DURIAN!</div>
          </h1>
          <div className="w-48 h-1 bg-white mt-4"></div>
        </div>

        {/* Right - Card */}
        <div className="landing-card">
          {!showLogin ? (
            <>
              {/* Landing card content */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full border-4 border-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl">🌰</div>
                    <div className="text-xs font-bold mt-1">DURIANOSTICS</div>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-b-2 border-gray-800 py-6 mb-6">
                <p className="text-gray-800 text-center leading-relaxed text-base">
                  Durianostics uses AI to check durian quality instantly—detecting damage, disease, and export-grade readiness—so farmers and sellers can make fast, accurate decisions and reduce waste.
                </p>
              </div>

              {/* LOG IN Button */}
              <button
                className="landing-button"
                onClick={() => setShowLogin(true)}
              >
                LOG IN
              </button>

              <p className="landing-signup">
                No account yet? <a href="#">Install our mobile app</a>
              </p>
            </>
          ) : (
            <>
              {/* Login Form */}
              <h2 className="text-center text-2xl font-bold mb-6">Login</h2>
              <form className="flex flex-col gap-4">
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
                <button type="submit" className="landing-button">
                  LOG IN
                </button>
              </form>
              <p className="landing-signup mt-4">
                Don't have an account? <a href="#">Install our mobile app</a>
              </p>
              <button
                className="text-gray-500 mt-4 underline"
                onClick={() => setShowLogin(false)}
              >
                Back
              </button>
            </>
          )}
        </div>
      </div>

      {/* Durian overlays */}
      <div className="durian-overlay">
        <div className="blur-circle"></div>
        <div className="solid-circle"></div>
      </div>
    </div>
  );
}
