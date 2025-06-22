import { getFeaturedVideos } from '@/data/staticVideos';
import VideoPlayer from './VideoPlayer';

export default function VideoGallery() {
  const videos = getFeaturedVideos();

  return (
    <section className="section-padding bg-neutral-50">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">Experience Our Farms</h2>
          <p className="text-lg text-neutral-600">Watch virtual tours of our premium farmhouse properties</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoPlayer 
              key={video.id} 
              video={video}
              className="animate-card-hover cursor-pointer"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
