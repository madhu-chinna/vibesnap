import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "../../firebase/config";
import { formatDistanceToNow } from "date-fns";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (isLoadMore = false) => {
    setLoading(true);
    try {
      let postQuery;
      if (isLoadMore && lastDoc) {
        postQuery = query(
          collection(db, "posts"),
          orderBy("timestamp", "desc"),
          startAfter(lastDoc),
          limit(20)
        );
      } else {
        postQuery = query(
          collection(db, "posts"),
          orderBy("timestamp", "desc"),
          limit(20)
        );
      }

      const snapshot = await getDocs(postQuery);
      const postList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || null, // Convert Firestore timestamp
      }));

      if (snapshot.docs.length < 20) {
        setHasMore(false); // No more posts to load
      }

      setPosts((prev) => (isLoadMore ? [...prev, ...postList] : postList));
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const loadMorePosts = () => {
    if (hasMore) {
      fetchPosts(true);
    }
  };

  return (
    <div className="feed max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
      <div className="my-posts mt-8">
        <h3 className="text-xl font-bold mb-4">My Posts</h3>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post mb-4 border rounded p-4">
              <p className="text-gray-800">{post.text}</p>
              <div className="media-container mt-4 space-y-2">
                {post.media?.map((media, index) => (
                  <div key={index} className="media-item">
                    {media.type === "image" ? (
                      <img
                        src={media.url}
                        alt="Post Media"
                        className="rounded-lg w-full"
                        loading="lazy"
                      />
                    ) : (
                      <video
                        src={media.url}
                        className="rounded-lg w-full"
                        controls
                        muted
                        playsInline
                      />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {post.timestamp
                  ? `Posted ${formatDistanceToNow(post.timestamp, { addSuffix: true })}`
                  : "Timestamp unavailable"}
              </p>
            </div>
          ))
        ) : (
          <p>No posts yet.</p>
        )}
      </div>

      {loading && <p>Loading...</p>}
      {hasMore && !loading && (
        <button
          onClick={loadMorePosts}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default Feed;


