import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const staticVideos = [
  {
    id: 1,
    title: "Green Valley Farm Tour",
    thumbnail: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    videoUrl: "/01.mp4",
    duration: "2:30",
    views: "12.5K"
  },
  {
    id: 2,
    title: "Sunrise Villa Experience",
    thumbnail: "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
    videoUrl: "/02.mp4",
    duration: "3:15",
    views: "8.2K"
  },
  {
    id: 3,
    title: "Mountain Resort Adventure",
    thumbnail: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9",
    videoUrl: "/03.mp4",
    duration: "4:20",
    views: "15.7K"
  }
];

export default function VideoGallery() {
  const [activeVideo, setActiveVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleVideoPlay = (video) => {
    setActiveVideo(video);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Experience Farm Life
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Take a virtual tour of our premium farm stays and see what makes each property special
        </p>
      </div>

      {activeVideo ? (
        <div className="mb-8">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              src={activeVideo.videoUrl}
              poster={activeVideo.thumbnail}
              controls={false}
              autoPlay
              muted={isMuted}
              className="w-full h-64 md:h-96 object-cover"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <div className="flex space-x-4">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={togglePlay}
                  className="bg-white bg-opacity-90 hover:bg-opacity-100"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={toggleMute}
                  className="bg-white bg-opacity-90 hover:bg-opacity-100"
                >
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </Button>
              </div>
            </div>
            
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-lg font-semibold">{activeVideo.title}</h3>
              <p className="text-sm opacity-90">{activeVideo.views} views</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staticVideos.map(video => (
          <div 
            key={video.id} 
            className="relative group cursor-pointer"
            onClick={() => handleVideoPlay(video)}
          >
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-colors flex items-center justify-center">
                <div className="bg-white bg-opacity-90 rounded-full p-4 group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-gray-900" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>
            
            <div className="mt-3">
              <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                {video.title}
              </h3>
              <p className="text-sm text-gray-600">{video.views} views</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
          View All Videos
        </Button>
      </div>
    </div>
  );
}