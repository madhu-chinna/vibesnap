import React, { useState } from "react";
import { storage, db } from "../../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const supportedFiles = files.filter((file) =>
      ["image/jpeg", "image/png", "video/mp4"].includes(file.type)
    );
    setMediaFiles(supportedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Upload each media file to Firebase Storage and get the download URL
      const media = await Promise.all(
        mediaFiles.map(async (file) => {
          const fileRef = ref(storage, `posts/${uuidv4()}_${file.name}`);
          await uploadBytes(fileRef, file);
          const url = await getDownloadURL(fileRef);
          return {
            type: file.type.startsWith("video") ? "video" : "image",
            url,
          };
        })
      );

      // Save post to Firestore
      await addDoc(collection(db, "posts"), {
        id: uuidv4(),
        text,
        media,
        timestamp: serverTimestamp(),
      });

      // Reset form
      setText("");
      setMediaFiles([]);
      alert("Post created successfully!");
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Select Media</label>
          <input
            type="file"
            accept="image/jpeg,image/png,video/mp4"
            multiple
            onChange={handleFileChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {mediaFiles.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {mediaFiles.length} file(s) selected
            </p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 mb-2">What's on your mind?</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full btn-primary auth-button ${loading ? "opacity-50" : ""}`}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;



