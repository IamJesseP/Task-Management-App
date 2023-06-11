/* eslint-disable react/prop-types */

import React, { useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [currentName, setCurrentName] = useState();
  const [userPhotoURL, setUserPhotoURL] = useState(null);
  // Firebase takes time to communicate with backend, user is null
  // loading tracks this period of comms
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function logout() {
    return signOut(auth);
  }
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentName(user.displayName ? user.displayName : user.email);
        console.log(user.photoURL);
        setUserPhotoURL(user.photoURL);
      }
      setCurrentUser(user);
      //sets to false upon loading
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    currentName,
    userPhotoURL,
    signup,
    login,
    logout,
    resetPassword
  };
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
