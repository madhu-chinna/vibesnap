// src/contexts/ProfileContext.js
import { createContext, useContext, useState } from 'react';
import { db, storage } from '../firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from './AuthContext';

const ProfileContext = createContext();

export function useProfile() {
  return useContext(ProfileContext);
}

export function ProfileProvider({ children }) {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchProfile(userId = currentUser?.uid) {
    if (!userId) return;
    
    try {
      setLoading(true);
      const docRef = doc(db, 'profiles', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  }

  async function updateProfile(profileData, profilePicture) {
    if (!currentUser) return;

    try {
      let photoURL = profileData.photoURL;

      if (profilePicture) {
        const storageRef = ref(storage, `profiles/${currentUser.uid}`);
        await uploadBytes(storageRef, profilePicture);
        photoURL = await getDownloadURL(storageRef);
      }

      const updatedProfile = {
        ...profileData,
        photoURL,
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'profiles', currentUser.uid), updatedProfile, { merge: true });
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      throw error;
    }
  }

  const value = {
    profile,
    loading,
    fetchProfile,
    updateProfile
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}