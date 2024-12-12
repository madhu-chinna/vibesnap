// src/components/posts/Post.js
import { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

function Post({ post }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef();
  const { currentUser } = useAuth();

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (videoRef.current) {
          videoRef.current.play();
          setPlaying(true);
        }
      } else {
        if (videoRef.current) {
          videoRef.current.pause();
          setPlaying(false);
        }
      }
    }, options);

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  async function handleShare() {
    try {
      await navigator.share({
        title: post.text,
        text: post.text,
        url: window.location.href,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <img
            src={post.author.photoURL || '/default-avatar.png'}
            alt={post.author.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="ml-3">
            <div className="font-semibold">{post.author.name}</div>
            <div className="text-gray-500 text-sm">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </div>
          </div>
        </div>
        <p className="text-gray-800 mb-4">{post.text}</p>
        <div className="space-y-4">
          {post.media?.map((media, index) => (
            <div key={index}>
              {media.type === 'image' ? (
                <img
                  src={media.url}
                  alt=""
                  className="rounded-lg w-full"
                  loading="lazy"
                />
              ) : (
                <video
                  ref={videoRef}
                  src={media.url}
                  className="rounded-lg w-full"
                  controls={false}
                  loop
                  muted
                  playsInline
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center space-x-4">
          <button className="text-gray-500 hover:text-indigo-600">
            <span>{post.likes} Likes</span>
          </button>
          <button
            onClick={handleShare}
            className="text-gray-500 hover:text-indigo-600"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

export default Post;


