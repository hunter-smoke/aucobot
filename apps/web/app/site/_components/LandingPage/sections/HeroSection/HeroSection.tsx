"use client";
import { useEffect, useRef, useState } from "react";
import { WaitlistForm } from "../WaitlistForm/WaitlistForm";
import "./HeroSection.css";

interface HeroSectionProps {
  showToast: () => void;
}

export function HeroSection({ showToast }: HeroSectionProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handlePlayPause = () => {
    const iframe = iframeRef.current;
    const iframeWindow = iframe?.contentWindow;
    if (!iframeWindow) return;

    const win = iframeWindow as any;

    if (typeof win.isFinished === "function" && win.isFinished()) {
      if (typeof win.resetSimulation === "function") {
        win.resetSimulation();
        setIsPlaying(true);
      }
    } else if (typeof win.isPaused === "function" && win.isPaused()) {
      if (typeof win.resumeSimulation === "function") {
        win.resumeSimulation();
        setIsPlaying(true);
      }
    } else {
      if (typeof win.pauseSimulation === "function") {
        win.pauseSimulation();
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    const win = window as any;
    win.onSimulationFinished = () => setIsPlaying(false);
    win.onSimulationReset = () => setIsPlaying(true);
    win.onSimulationPaused = () => setIsPlaying(false);
    win.onSimulationResumed = () => setIsPlaying(true);

    return () => {
      delete win.onSimulationFinished;
      delete win.onSimulationReset;
      delete win.onSimulationPaused;
      delete win.onSimulationResumed;
    };
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <span className="section-tag">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Aucobot AI
        </span>
        <h1 className="hero-title">
          Xây dựng <span className="hero-title-accent">Phòng Marketing AI</span> của riêng bạn
        </h1>
        <p className="hero-subtitle">
          Không phải một chatbot. Một phòng marketing AI thật sự — nghiên cứu,
          viết nội dung, lên lịch và đăng bài thay bạn trên Facebook & TikTok.
        </p>

        <div className="hero-form-container">
          <WaitlistForm showToast={showToast} />
          <p className="form-tip">
            Để lại email — nhận thông báo khi MVP mở, và là người trải nghiệm đầu tiên.
          </p>
        </div>
      </div>
      <div className="hero-visual" id="demo">
        <div className="mockup-header">
          <div className="macbook-dots">
            <span className="dot-red"></span>
            <span className="dot-yellow"></span>
            <span className="dot-green"></span>
          </div>
          <div className="mockup-title">Chat Simulator</div>
          <button className="play-pause-btn" onClick={handlePlayPause} aria-label="Play or Pause Simulation">
            <svg className={`icon-play ${isPlaying ? "hidden" : ""}`} width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <svg className={`icon-pause ${!isPlaying ? "hidden" : ""}`} width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          </button>
        </div>
        <iframe ref={iframeRef}
          src="/chat-simulator/index.html"
          id="simulator-iframe"
          className="simulator-frame border-none"
          scrolling="no"
        ></iframe>
      </div>
    </section>
  );
}
