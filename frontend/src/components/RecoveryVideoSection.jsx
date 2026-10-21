import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import './RecoveryVideoSection.css';

const CHAPTERS = [
  { id: 1, time: 0, title: 'The Shadows', desc: 'Feeling disconnected & alone' },
  { id: 2, time: 5, title: 'The Turning Point', desc: 'Choosing to pause and let go' },
  { id: 3, time: 10, title: 'Compassionate Care', desc: 'Empathetic medical support' },
  { id: 4, time: 15, title: 'Life Renewed', desc: 'Dignity restored in sunlight' },
];

export const RecoveryVideoSection = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(20);
  const [activeChapter, setActiveChapter] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideControlsTimer = useRef(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const vid = videoRef.current;
    if (vid) {
      if (!prefersReducedMotion) {
        // Attempt muted autoplay for ambient cinematic experience
        const playPromise = vid.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => {
              // Browser blocked autoplay; remain paused awaiting user interaction
              setIsPlaying(false);
            });
        }
      }
    }
  }, []);

  // Time & progress update
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 20;
    setCurrentTime(cur);
    setDuration(dur);
    setProgress((cur / dur) * 100);

    // Update active chapter
    if (cur >= 15) setActiveChapter(3);
    else if (cur >= 10) setActiveChapter(2);
    else if (cur >= 5) setActiveChapter(1);
    else setActiveChapter(0);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuteState = !videoRef.current.muted;
    videoRef.current.muted = newMuteState;
    setIsMuted(newMuteState);
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    videoRef.current.currentTime = newTime;
    setProgress(pos * 100);
  };

  const seekToChapter = (chapterTime) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = chapterTime;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true));
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setControlsVisible(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    if (isPlaying) {
      hideControlsTimer.current = setTimeout(() => {
        setControlsVisible(false);
      }, 2600);
    }
  };

  return (
    <section className="recovery-video-section section-padding bg-mesh" id="recovery-story">
      {/* Ambient Radial Blue Lighting */}
      <div className="video-ambient-glow video-glow-left" />
      <div className="video-ambient-glow video-glow-right" />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Editorial Section Header */}
        <div className="video-section-header">
          <div className="video-badge-wrap">
            <span className="glow-badge">
              <span className="pulse-dot" />
              Hope, Healing & Transformation
            </span>
            <span className="video-tag-sub">Short Film • 4-Part Recovery Story</span>
          </div>

          <h2 className="video-section-title">
            From the Shadows to the Sunlight
          </h2>

          <p className="video-section-desc">
            Addiction is an isolating struggle, but it does not have to be the end of your story.
            Watch a depiction of the pivotal moment when seeking compassionate care changes everything.
          </p>
        </div>

        {/* Cinematic Theater Glass Container */}
        <div
          ref={containerRef}
          className={`cinema-theater-box ${controlsVisible ? 'controls-shown' : 'controls-hidden'}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setControlsVisible(false)}
        >
          {/* Top Theater Header Bar */}
          <div className="cinema-header-strip">
            <div className="cinema-branding">
              <span className="cinema-live-indicator" />
              <span className="cinema-title-text">Khyber Rehabilitation Center Film Initiative</span>
            </div>
            <div className="cinema-badge">
              <span>HD 1080p • Cinematic Narrative</span>
            </div>
          </div>

          {/* Actual HTML5 Video Element */}
          <div className="video-media-wrapper" onClick={togglePlay}>
            <video
              ref={videoRef}
              src="/videos/recovery-journey.mp4"
              poster="/videos/recovery-journey-poster.jpg"
              playsInline
              muted={isMuted}
              loop
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              onError={() => setHasError(true)}
              className="recovery-video-el"
              aria-label="Cinematic recovery story video showing a journey from isolation to hope"
            >
              Your browser does not support the video tag.
            </video>

            {/* Error Fallback */}
            {hasError && (
              <div className="video-error-overlay">
                <img
                  src="/videos/recovery-journey-poster.jpg"
                  alt="Recovery Journey Poster"
                  className="video-error-poster"
                />
                <div className="video-error-content">
                  <span style={{ fontSize: '24px' }}>🛡️</span>
                  <h3>Hope & Recovery Video Story</h3>
                  <p>Every recovery journey begins with a courageous decision. Our clinical admissions team in Peshawar is ready to support you 24/7.</p>
                  <Link to="/contact">
                    <Button variant="primary" size="md" className="btn-pill">
                      Call 24/7 Confidential Helpline
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Giant Center Play/Pause Overlay Icon */}
            {!isPlaying && !hasError && (
              <button
                type="button"
                className="cinema-center-play-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                aria-label="Play Video"
              >
                <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            )}
          </div>

          {/* Custom Glassmorphism Player Control Bar */}
          <div className="cinema-controls-bar">
            {/* Timeline Scrubber */}
            <div
              className="cinema-progress-track"
              onClick={handleSeek}
              role="slider"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={progress}
              tabIndex="0"
            >
              <div className="cinema-progress-fill" style={{ width: `${progress}%` }}>
                <span className="cinema-progress-handle" />
              </div>
            </div>

            {/* Controls Row */}
            <div className="cinema-controls-row">
              <div className="cinema-controls-left">
                {/* Play / Pause Toggle */}
                <button
                  type="button"
                  className="cinema-ctrl-btn"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                {/* Audio Mute / Unmute */}
                <button
                  type="button"
                  className="cinema-ctrl-btn"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isMuted ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  )}
                </button>

                {/* Time Display */}
                <span className="cinema-time-label">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="cinema-controls-right">
                {/* Active Chapter Indicator */}
                <span className="cinema-chapter-indicator">
                  {CHAPTERS[activeChapter]?.title}
                </span>

                {/* Fullscreen Toggle */}
                <button
                  type="button"
                  className="cinema-ctrl-btn"
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Interactive Chapter Selector */}
        <div className="video-chapters-grid">
          {CHAPTERS.map((ch, idx) => (
            <button
              key={ch.id}
              type="button"
              className={`chapter-card ${activeChapter === idx ? 'is-active' : ''}`}
              onClick={() => seekToChapter(ch.time)}
            >
              <div className="chapter-header">
                <span className="chapter-num">0{ch.id}</span>
                <span className="chapter-name">{ch.title}</span>
              </div>
              <p className="chapter-desc">{ch.desc}</p>
              <span className="chapter-timestamp">Jump to {formatTime(ch.time)} →</span>
            </button>
          ))}
        </div>

        {/* Compassionate Support & Admission Reassurance Card */}
        <div className="recovery-reassurance-card">
          <div className="reassurance-icon-box">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="reassurance-content">
            <h4 className="reassurance-title">
              Recovery is a Courageous Journey — You Are Not Alone
            </h4>
            <p className="reassurance-text">
              At Khyber Rehabilitation Center in Peshawar, we provide dignified, 24/7 medically supervised detoxification,
              psychotherapy, and vocational skills training. Confidential consultations are always free of judgment.
            </p>
          </div>
          <div className="reassurance-actions">
            <Link to="/contact">
              <Button variant="primary" size="md" className="btn-pill btn-magnetic">
                Contact Admissions Coordinator
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
