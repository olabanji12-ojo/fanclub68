import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Radio,
  Tv,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { API_BASE_URL } from '../services/api';

export interface StreamSource {
  id: string;
  name: string;
  url: string;
  type: 'hls' | 'iframe' | 'proxy_iframe' | 'mp4';
}

interface Props {
  streamSource: StreamSource;
  arenaName: string;
  matchNumber: number;
  phase: string;
  isGateLocked: boolean;
  failoverActive?: boolean;
  activeSourceInfo?: { name: string; status: string };
  onRefresh?: () => void;
  onSwitchToRadar?: () => void;
  onSwitchToTestStream?: () => void;
}

export const SbobetLiveStreamPlayer: React.FC<Props> = ({
  streamSource,
  arenaName,
  matchNumber,
  phase,
  isGateLocked,
  failoverActive = false,
  activeSourceInfo,
  onRefresh,
  onSwitchToRadar,
  onSwitchToTestStream
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isInvalidVideoUrl, setIsInvalidVideoUrl] = useState<boolean>(false);
  const [isIframeActivated, setIsIframeActivated] = useState<boolean>(false);
  const hlsRef = useRef<Hls | null>(null);
  const [viewMode, setViewMode] = useState<'video' | 'radar'>('video');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Check whether a stream source URL is a legitimate video stream link
  const isDirectVideoOrHls = (url: string) => {
    if (!url) return false;
    const u = url.toLowerCase();
    return u.includes('.m3u8') || u.endsWith('.mp4') || u.endsWith('.webm') || u.endsWith('.ts');
  };

  const isEmbedPlayer = (url: string) => {
    if (!url) return false;
    const u = url.toLowerCase();
    return (
      u.includes('player.videosv388.com') ||
      u.includes('youtube.com/embed') ||
      u.includes('youtu.be') ||
      u.includes('twitch.tv') ||
      u.includes('vimeo.com')
    );
  };

  // Setup HLS / Video stream on source change
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');
    setIsInvalidVideoUrl(false);
    setIsIframeActivated(false);

    const url = (streamSource.url || '').trim();

    // Check if the link is a full website portal (like bj988.com/vn/vn) instead of a direct video stream
    if (!url) {
      setIsInvalidVideoUrl(true);
      setHasError(true);
      setErrorMessage('No stream link provided. Please input a live stream URL.');
      setIsLoading(false);
      return;
    }

    if (!isDirectVideoOrHls(url) && !isEmbedPlayer(url)) {
      setIsInvalidVideoUrl(true);
      setHasError(true);
      setErrorMessage('This link cannot be displayed because it is not a direct video stream link. Please provide a direct HLS (.m3u8) video stream URL, direct MP4 link, or embeddable player feed.');
      setIsLoading(false);
      return;
    }

    if (streamSource.type === 'iframe' || streamSource.type === 'proxy_iframe') {
      setIsLoading(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const isHlsStream = streamSource.url.includes('.m3u8') || streamSource.type === 'hls';

    if (isHlsStream) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 30
        });
        hlsRef.current = hls;

        hls.loadSource(streamSource.url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
          safePlayVideo(video);
        });

        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                setHasError(true);
                setErrorMessage('Không thể tải luồng video HLS trực tiếp. Đang chuẩn bị chuyển sang nguồn dự phòng.');
                setIsLoading(false);
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native Safari HLS
        video.src = streamSource.url;
        video.addEventListener('loadedmetadata', () => {
          setIsLoading(false);
          safePlayVideo(video);
        });
      }
    } else {
      // Direct MP4
      video.src = streamSource.url;
      video.load();
      video.oncanplay = () => {
        setIsLoading(false);
      };
      video.onerror = () => {
        setHasError(true);
        setErrorMessage('Không thể phát video trực tiếp.');
        setIsLoading(false);
      };
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [streamSource]);

  const safePlayVideo = (video: HTMLVideoElement) => {
    try {
      const p = video.play();
      if (p !== undefined) {
        p.then(() => {
          setIsPlaying(true);
        }).catch(err => {
          if (err.name !== 'AbortError') {
            console.warn('Autoplay prevented or paused:', err);
          }
          setIsPlaying(false);
        });
      }
    } catch {
      // Ignore synchronous play interruptions
    }
  };

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      setIsMuted(false);
      safePlayVideo(videoRef.current);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Determine effective embed URL with safety checks
  const getEmbedUrl = () => {
    if (streamSource.type === 'proxy_iframe') {
      const base = API_BASE_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://game-bet-backend.onrender.com');
      return `${base}/api/stream/embed-proxy?url=${encodeURIComponent(streamSource.url)}`;
    }
    return streamSource.url;
  };



  // 60FPS 3D Cockfight Arena Physics Simulation
  useEffect(() => {
    if (viewMode !== 'radar') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const render = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      // Dark Broadcast Arena Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#0a0d14');
      bgGrad.addColorStop(0.5, '#161b26');
      bgGrad.addColorStop(1, '#0e121a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Arena Sand Ring Pit (Perspective Oval)
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(w / 2, h * 0.65, w * 0.42, h * 0.28, 0, 0, Math.PI * 2);
      const sandGrad = ctx.createRadialGradient(w / 2, h * 0.65, 10, w / 2, h * 0.65, w * 0.42);
      sandGrad.addColorStop(0, '#c29b63');
      sandGrad.addColorStop(0.7, '#8f6834');
      sandGrad.addColorStop(1, '#543b1c');
      ctx.fillStyle = sandGrad;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#dfba7f';
      ctx.stroke();
      ctx.restore();

      // Spotlight Beam
      ctx.save();
      const spotGrad = ctx.createRadialGradient(w / 2, h * 0.6, 20, w / 2, h * 0.6, w * 0.35);
      spotGrad.addColorStop(0, 'rgba(255, 255, 230, 0.25)');
      spotGrad.addColorStop(1, 'rgba(255, 255, 230, 0)');
      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.ellipse(w / 2, h * 0.6, w * 0.35, h * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Dynamic Fighter Roosters Positioning
      const isFighting = phase === 'FIGHTING';
      const bounce = Math.sin(frame * 0.12) * (isFighting ? 14 : 4);
      const lunge = isFighting ? Math.cos(frame * 0.2) * 25 : Math.sin(frame * 0.05) * 8;

      const meronX = w * 0.38 + lunge;
      const meronY = h * 0.63 - Math.abs(bounce);
      const walaX = w * 0.62 - lunge;
      const walaY = h * 0.63 - Math.abs(Math.cos(frame * 0.12) * (isFighting ? 14 : 4));
    
      // Shadows
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(meronX, h * 0.68, 22, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(walaX, h * 0.68, 22, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Meron (Red Rooster)
      ctx.save();
      ctx.translate(meronX, meronY);
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.ellipse(0, 0, 24, 16, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.ellipse(14, -8, 11, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      // Comb
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(16, -18, 6, 0, Math.PI * 2);
      ctx.fill();
      // Beak
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(23, -8);
      ctx.lineTo(31, -5);
      ctx.lineTo(23, -2);
      ctx.closePath();
      ctx.fill();
      // Tail feathers
      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-18, 2);
      ctx.quadraticCurveTo(-38, -14, -34, -28);
      ctx.stroke();
      ctx.restore();

      // Wala (Blue Rooster)
      ctx.save();
      ctx.translate(walaX, walaY);
      ctx.fillStyle = '#1d4ed8';
      ctx.beginPath();
      ctx.ellipse(0, 0, 24, 16, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.ellipse(-14, -8, 11, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      // Comb
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(-16, -18, 6, 0, Math.PI * 2);
      ctx.fill();
      // Beak
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(-23, -8);
      ctx.lineTo(-31, -5);
      ctx.lineTo(-23, -2);
      ctx.closePath();
      ctx.fill();
      // Tail feathers
      ctx.strokeStyle = '#1e3a8a';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(18, 2);
      ctx.quadraticCurveTo(38, -14, 34, -28);
      ctx.stroke();
      ctx.restore();

      // Clash sparks if fighting
      if (isFighting && Math.sin(frame * 0.3) > 0.4) {
        ctx.fillStyle = '#fef08a';
        for (let i = 0; i < 5; i++) {
          const spX = (meronX + walaX) / 2 + (Math.random() - 0.5) * 30;
          const spY = h * 0.6 + (Math.random() - 0.5) * 20;
          ctx.beginPath();
          ctx.arc(spX, spY, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // HUD Arena & Phase Overlay on Canvas
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(10, 10, 220, 48);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(10, 10, 220, 48);
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`⚡ 3D RADAR: ${arenaName}`, 20, 28);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '10px monospace';
      ctx.fillText(`TRẬN #${matchNumber} | TRẠNG THÁI: ${phase}`, 20, 46);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [viewMode, phase, arenaName, matchNumber]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video max-h-[480px] bg-slate-950 rounded-xl overflow-hidden border border-amber-900/40 shadow-2xl flex items-center justify-center group select-none"
    >
      {/* 1. Invalid Video URL or Error Screen */}
      {hasError || isInvalidVideoUrl ? (
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3">
            <AlertCircle className="w-8 h-8 text-amber-500 animate-pulse" />
          </div>
          <h4 className="text-white font-black text-sm sm:text-base mb-1.5 uppercase tracking-wide">
            {isInvalidVideoUrl ? '⚠️ Non-Direct Video Link / Không Phải Luồng Video Trực Tiếp' : `Kết Nối Luồng Bồ Gà ${arenaName}`}
          </h4>
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 max-w-lg mb-4 text-left">
            <p className="text-amber-300 font-semibold text-xs mb-1">
              {errorMessage || 'This link cannot be displayed because it is not a direct video stream link.'}
            </p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              💡 <strong>Lưu ý kỹ thuật:</strong> Các liên kết trang web nguyên bản (như <code className="text-amber-400 bg-slate-950 px-1 py-0.5 rounded">bj988.com</code>, <code className="text-amber-400 bg-slate-950 px-1 py-0.5 rounded">ga6789.com</code>) chứa giao diện đăng nhập và bảo mật riêng nên không thể nhúng trực tiếp vào khung phát. Vui lòng nhập link luồng video <strong>HLS (.m3u8)</strong> hoặc sử dụng mô phỏng 3D Radar.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => {
                setViewMode('radar');
                if (onSwitchToRadar) onSwitchToRadar();
              }}
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-xs rounded-lg transition shadow-lg shadow-amber-600/30 flex items-center gap-1.5 cursor-pointer"
            >
              <span>🎯 Xem Mô Phỏng 3D Radar (60FPS)</span>
            </button>

            {onSwitchToTestStream && (
              <button
                onClick={onSwitchToTestStream}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-blue-300 font-bold text-xs rounded-lg border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>⚡ Luồng Thử Nghiệm HLS (.m3u8)</span>
              </button>
            )}

            {onRefresh && (
              <button
                onClick={onRefresh}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-lg border border-slate-800 transition flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Thử Lại</span>
              </button>
            )}
          </div>
        </div>
      ) : null}

      {/* 2. View Switcher: 3D Radar Canvas vs Video */}
      {viewMode === 'radar' ? (
        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          className="w-full h-full object-cover block"
        />
      ) : streamSource.type === 'iframe' || streamSource.type === 'proxy_iframe' ? (
        /* Direct Webview / Proxy Iframe Mode with Anti-Nesting Protection & Play Overlay */
        <div className="relative w-full h-full bg-slate-950 flex flex-col">
          <iframe
            ref={iframeRef}
            src={getEmbedUrl()}
            title={streamSource.name}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
            allow="accelerometer; autoplay *; clipboard-write; encrypted-media *; gyroscope; picture-in-picture *; web-share; fullscreen *"
            allowFullScreen
            onError={() => {
              setHasError(true);
              setErrorMessage('Cổng phát ngoài từ chối kết nối hoặc bị chặn bởi máy chủ nguồn.');
            }}
          />

          {/* Big Center Play Overlay for Iframe Embeds (to guarantee user gesture for autoplay) */}
          {!isIframeActivated && !hasError && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center z-20 transition-all">
              <button
                onClick={() => setIsIframeActivated(true)}
                className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 hover:from-amber-500 hover:to-amber-300 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/50 transform hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-amber-500/30 cursor-pointer"
              >
                <Play className="w-9 h-9 fill-current ml-1" />
              </button>
              <p className="text-amber-200 font-bold text-xs uppercase tracking-widest mt-4 drop-shadow">
                Nhấp để phát luồng SV388 / Click to Play
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Native HLS / Direct Video Mode */
        <div className="relative w-full h-full flex items-center justify-center">
          <video
            ref={videoRef}
            playsInline
            muted={isMuted}
            autoPlay
            loop
            className="w-full h-full object-cover"
          />

          {/* Big Center Play Button Overlay for Autoplay permissions */}
          {!isPlaying && !isLoading && !hasError && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center z-20 transition-all">
              <button
                onClick={handlePlayClick}
                className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 hover:from-amber-500 hover:to-amber-300 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/50 transform hover:scale-110 active:scale-95 transition-all duration-300 group-hover:ring-8 ring-amber-500/20 cursor-pointer"
              >
                <Play className="w-9 h-9 fill-current ml-1" />
              </button>
              <p className="text-amber-200 font-bold text-xs uppercase tracking-widest mt-4 drop-shadow">
                Nhấp để xem trực tiếp sới {arenaName}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Top Header Overlay: Arena Name, Match #, Failover Badge, Camera Toggle, Live Badge */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-2 flex-wrap">
          {streamSource.url ? (
            <div className="flex items-center gap-1.5 bg-red-600/90 text-white text-[11px] font-black uppercase px-2.5 py-1 rounded-md shadow-lg shadow-red-600/40 tracking-wider">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <Radio className="w-3.5 h-3.5" />
              LIVE FEED
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-slate-800 text-slate-300 text-[11px] font-bold px-2.5 py-1 rounded-md border border-slate-700">
              No live stream connected
            </div>
          )}

          <div className="bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-amber-300 font-black text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-lg">
            <span>{arenaName}</span>
            <span className="text-slate-500">•</span>
            <span className="text-white">TRẬN #{matchNumber}</span>
          </div>

          {failoverActive && (
            <div className="bg-emerald-600/90 text-white font-black text-[10px] px-2 py-1 rounded-md shadow-md animate-pulse flex items-center gap-1">
              <span>⚡ Line 2: Tự Động Chuyển Nguồn ({activeSourceInfo?.name || 'Dự Phòng'})</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Camera View Switcher Button */}
          <div className="flex items-center bg-slate-900/90 backdrop-blur-md border border-slate-700 p-0.5 rounded-lg text-[10px] font-bold">
            <button
              onClick={() => {
                setViewMode('video');
                setHasError(false);
              }}
              className={`px-2 py-0.5 rounded transition ${viewMode === 'video' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
            >
              🎥 Video
            </button>
            <button
              onClick={() => setViewMode('radar')}
              className={`px-2 py-0.5 rounded transition ${viewMode === 'radar' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
            >
              🎯 3D Radar
            </button>
          </div>

          {isGateLocked && (
            <div className="flex items-center gap-1 bg-red-500/95 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded shadow-lg animate-pulse">
              KHÓA KÈO
            </div>
          )}
        </div>
      </div>

      {/* Bottom Floating Control Bar with Play/Pause, Sound, Reload, and Fullscreen */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-slate-950/85 backdrop-blur-md border border-slate-800/80 rounded-lg px-3 py-1.5 text-slate-300 z-20 opacity-90 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2 text-xs">
          <Tv className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-white text-[12px] truncate max-w-[180px] sm:max-w-[280px]">
            {streamSource.name}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 font-mono text-[11px] uppercase tracking-wide">
            {phase === 'WEIGHING' ? '⚖️ GHÉP GÀ & CÂN KÝ' : phase === 'BETTING_OPEN' ? '🟢 MỞ KÈO CƯỢC' : phase === 'GATE_LOCKED' ? '🔒 KHÓA CỔNG' : '⚔️ GIAO ĐẤU'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Play / Pause Toggle Button */}
          {streamSource.type !== 'iframe' && streamSource.type !== 'proxy_iframe' && (
            <button
              onClick={() => {
                if (videoRef.current) {
                  if (isPlaying) {
                    videoRef.current.pause();
                    setIsPlaying(false);
                  } else {
                    handlePlayClick();
                  }
                }
              }}
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-md transition cursor-pointer"
              title={isPlaying ? 'Tạm dừng (Pause)' : 'Phát video (Play)'}
            >
              {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-amber-400 fill-current" />}
            </button>
          )}

          {/* Quick Reload Stream Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-md transition cursor-pointer"
              title="Tải lại luồng phát (Reload Stream)"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Mute / Unmute Toggle */}
          <button
            onClick={toggleMute}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-md transition cursor-pointer"
            title={isMuted ? 'Bật âm thanh (Unmute)' : 'Tắt âm thanh (Mute)'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-md transition cursor-pointer"
            title="Toàn màn hình (Fullscreen)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

