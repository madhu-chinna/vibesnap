// src/contexts/PostContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  startAfter,
  getDocs,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const PostContext = createContext();

export function usePosts() {
  return useContext(PostContext);
}

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchPosts(isInitial = false) {
    try {
        console.log("coming to fetchposts")
      setLoading(true);
      let postsQuery;

      if (isInitial) {
        postsQuery = query(
          collection(db, 'posts'),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
      } else {
        if (!lastDoc) return;
        postsQuery = query(
          collection(db, 'posts'),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(20)
        );
      }

      const snapshot = await getDocs(postsQuery);
      const newPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (isInitial) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  }

  async function createPost(postData, files) {
    try {
      const mediaUrls = [];
      
      // Upload files if any
      if (files && files.length > 0) {
        for (const file of files) {
          const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`);
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          mediaUrls.push({
            url,
            type: file.type.startsWith('video/') ? 'video' : 'image'
          });
        }
      }

      const newPost = {
        ...postData,
        media: mediaUrls,
        createdAt: serverTimestamp(),
        likes: 0,
        comments: []
      };

      const docRef = await addDoc(collection(db, 'posts'), newPost);
      return { id: docRef.id, ...newPost };
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    fetchPosts(true);
  }, []);

  const value = {
    posts,
    loading,
    fetchPosts,
    createPost
  };

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
}