"use client";


import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VideoPlayer({
  video,
  autoplay = true,
  muted = true,
  loop = true,
  className = ''
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(muted);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && autoplay) {
            videoElement.play().catch(console.error);
            setIsPlaying(true);
          } else {
            videoElement.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(videoElement);

    return () => {
      observer.disconnect();
    };
  }, [autoplay]);

  const togglePlay = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  const handleMouseEnter = () => {
    setShowControls(true);
    const videoElement = videoRef.current;
    if (videoElement && !isPlaying) {
      videoElement.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    setShowControls(false);
  };

  return (
    <div 
      className={`video-player relative rounded-2xl overflow-hidden bg-neutral-100 aspect-[4/5] ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted={isMuted}
        loop={loop}
        playsInline
        onEnded={handleVideoEnd}
        poster={video.thumbnailUrl}
      >
        <source src={video.videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div 
        className={`
          video-controls absolute inset-0 flex items-center justify-center 
          bg-black/30 transition-opacity duration-300
          ${showControls ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <div className="flex items-center space-x-4">
          <Button
            size="icon"
            variant="secondary"
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </Button>
          
          <Button
            size="icon"
            variant="secondary"
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0"
            onClick={toggleMute}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 text-white">
        <h3 className="font-semibold mb-1">{video.title}</h3>
        <p className="text-sm opacity-90">{video.duration}</p>
      </div>

      <div className="absolute top-4 right-4">
        <span className="bg-primary/80 text-white px-2 py-1 rounded text-xs font-medium capitalize">
          {video.category}
        </span>
      </div>
    </div>
  );
}
