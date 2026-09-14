import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import {
  Play,
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
  onRefresh?: () => void;
}

export const SbobetLiveStreamPlayer: React.FC<Props> = ({
  streamSource,
  arenaName,
  matchNumber,
  phase,
  isGateLocked,
  onRefresh
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const hlsRef = useRef<Hls | null>(null);

  // Setup HLS / Video stream on source change
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');

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
          video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
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
                setErrorMessage('Không thể tải luồng video HLS trực tiếp.');
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
          video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
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

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setIsMuted(false);
        videoRef.current!.muted = false;
      }).catch(err => {
        console.warn('Autoplay prevented:', err);
      });
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

  // Determine effective embed URL
  const getEmbedUrl = () => {
    if (streamSource.type === 'proxy_iframe') {
      return `/api/stream/embed-proxy?url=${encodeURIComponent(streamSource.url)}`;
    }
    return streamSource.url;
  };

  const [viewMode, setViewMode] = useState<'video' | 'radar'>('video');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
      ctx.arc(14, -14, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.arc(12, -8, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(19, -8);
      ctx.lineTo(27, -5);
      ctx.lineTo(19, -2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-18, -4);
      ctx.quadraticCurveTo(-35, -20 + bounce * 0.5, -28, -28);
      ctx.stroke();
      ctx.restore();

      // Wala (Blue Rooster)
      ctx.save();
      ctx.translate(walaX, walaY);
      ctx.fillStyle = '#1d4ed8';
      ctx.beginPath();
      ctx.ellipse(0, 0, 24, 16, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(-14, -14, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e40af';
      ctx.beginPath();
      ctx.arc(-12, -8, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(-19, -8);
      ctx.lineTo(-27, -5);
      ctx.lineTo(-19, -2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(18, -4);
      ctx.quadraticCurveTo(35, -20 + bounce * 0.5, 28, -28);
      ctx.stroke();
      ctx.restore();

      if (isFighting && frame % 4 === 0) {
        ctx.fillStyle = 'rgba(255, 220, 150, 0.8)';
        ctx.beginPath();
        ctx.arc((meronX + walaX) / 2 + (Math.random() - 0.5) * 20, h * 0.6 + (Math.random() - 0.5) * 20, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [viewMode, phase]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video max-h-[460px] bg-slate-950 rounded-xl overflow-hidden border border-amber-900/40 shadow-2xl flex items-center justify-center group select-none"
    >
      {/* View Switcher: 3D Radar Canvas vs Video */}
      {viewMode === 'radar' ? (
        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          className="w-full h-full object-cover block"
        />
      ) : streamSource.type === 'iframe' || streamSource.type === 'proxy_iframe' ? (
        /* 1. Direct Webview / Proxy Iframe Mode */
        <div className="relative w-full h-full bg-slate-950 flex flex-col">
          <iframe
            src={getEmbedUrl()}
            title={streamSource.name}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : (
        /* 2. Native HLS / Video Mode */
        <div className="relative w-full h-full flex items-center justify-center">
          <video
            ref={videoRef}
            playsInline
            muted={isMuted}
            autoPlay
            loop
            className="w-full h-full object-cover"
          />

          {/* Fallback Simulation when error or loading */}
          {hasError && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
              <AlertCircle className="w-12 h-12 text-amber-500 mb-3 animate-pulse" />
              <h4 className="text-white font-bold text-base mb-1">Đang Kết Nối Luồng Bồ Gà {arenaName}</h4>
              <p className="text-slate-400 text-xs max-w-md mb-4">{errorMessage || 'Đang đồng bộ hóa dữ liệu trực tiếp từ sới Thomo / Pasay...'}</p>
              <button
                onClick={onRefresh}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-lg shadow-amber-600/30"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Tải lại luồng trực tiếp
              </button>
            </div>
          )}

          {/* Big Center Play Button Overlay for Autoplay permissions */}
          {!isPlaying && !isLoading && !hasError && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center z-20 transition-all">
              <button
                onClick={handlePlayClick}
                className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 hover:from-amber-500 hover:to-amber-300 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/50 transform hover:scale-110 active:scale-95 transition-all duration-300 group-hover:ring-8 ring-amber-500/20"
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

      {/* Top Header Overlay: Arena Name, Match #, Camera Toggle, Live Badge */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-2">
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
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Camera View Switcher Button */}
          <div className="flex items-center bg-slate-900/90 backdrop-blur-md border border-slate-700 p-0.5 rounded-lg text-[10px] font-bold">
            <button
              onClick={() => setViewMode('video')}
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

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-slate-950/80 backdrop-blur-md border border-slate-800/80 rounded-lg px-3 py-1.5 text-slate-300 z-20 opacity-90 group-hover:opacity-100 transition-opacity">
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
          <button
            onClick={toggleMute}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-md transition"
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-md transition"
            title="Toàn màn hình"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
