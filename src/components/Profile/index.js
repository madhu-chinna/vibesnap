// src/components/Profile.js
import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../../firebase/config";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, collection, query, getDocs,orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { getDocs, query, , limit, startAfter } from "firebase/firestore";

const Profile = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  const fetchProfileData = async () => {
    try {
      const userDoc = doc(db, "users", auth.currentUser.uid);
      const userData = await getDoc(userDoc);

      if (userData.exists()) {
        const { bio, profilePicUrl } = userData.data();
        setBio(bio || "");
        setProfilePicUrl(profilePicUrl || "");
      }
      setName(auth.currentUser.displayName || "");
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    }
  };

  const fetchUserPosts = async (isLoadMore = false) => {
    try {
          let postQuery;
            postQuery = query(
              collection(db, "posts"),
              orderBy("timestamp", "desc"),
              // startAfter(lastDoc),
              // limit(20)
            );
          
    
          const snapshot = await getDocs(postQuery);
          const postList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || null, // Convert Firestore timestamp
          }));
    
          // if (snapshot.docs.length < 20) {
          //   setHasMore(false); // No more posts to load
          // }
    
          setPosts((postList));
          // setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        } catch (error) {
          console.error("Failed to fetch posts:", error);
        }

    // try {
    //       let postQuery;
    //       postQuery = query(
    //         collection(db, "posts"),
    //         orderBy("timestamp", "desc"),
            
    //       );
    
    //       const snapshot = await getDocs(postQuery);
    //       console.log('snapshot-- ',snapshot.docs)
    //       const postList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    //       console.log('postList--- ',postList)
    
    //       // if (snapshot.docs.length < 20) {
    //       //   setHasMore(false); // No more posts to load
    //       // }
    
    //       setPosts((prev) => (isLoadMore ? [...prev, ...postList] : postList));
    //       // setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    //     } catch (error) {
    //       console.error("Failed to fetch posts:", error);
    //     }



    // try {
    //   const postsQuery = query(
    //     collection(db, "posts"),
    //     where("userId", "==", auth.currentUser.uid)
    //   );
    //   const postSnapshots = await getDocs(postsQuery);
    //   const userPosts = postSnapshots.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    //   setPosts(userPosts);
    // } catch (error) {
    //   console.error("Failed to fetch user posts:", error);
    // }
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      let newProfilePicUrl = profilePicUrl;

      if (profilePic) {
        const picRef = ref(storage, `profiles/${auth.currentUser.uid}`);
        await uploadBytes(picRef, profilePic);
        newProfilePicUrl = await getDownloadURL(picRef);
      }

      await updateProfile(auth.currentUser, { displayName: name });
      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        { bio, profilePicUrl: newProfilePicUrl },
        { merge: true }
      );

      setProfilePicUrl(newProfilePicUrl);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Error updating profile. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfileData();
    fetchUserPosts();
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>

      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <img
            src={profilePicUrl || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border border-gray-300"
          />
          <label className="absolute bottom-0 right-0 bg-blue-500 text-white px-2 py-1 text-sm rounded-full cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePic(e.target.files[0])}
              className="hidden"
            />
            Edit
          </label>
        </div>

        <div className="w-full">
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="w-full">
          <label className="block text-gray-700 mb-2">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us something about yourself"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          onClick={handleProfileUpdate}
          disabled={loading}
          className={`w-full btn-primary ${
            loading ? "opacity-50" : ""
          } bg-green-500 text-white px-4 py-2 rounded`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

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
                    {/* <p className="text-sm text-gray-500 mt-2">
                      {post.timestamp
                        ? `Posted ${formatDistanceToNow(post.timestamp, { addSuffix: true })}`
                        : "Timestamp unavailable"}
                    </p> */}
                  </div>
                ))
              ) : (
                <p>No posts yet.</p>
              )}
            </div>
    </div>
  );
};

export default Profile;





