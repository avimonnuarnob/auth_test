/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { collection, addDoc } from "firebase/firestore";

import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

import { auth, db, storage } from "../firebase/firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);
  const userCollectionRef = collection(db, "users");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signUp = (user) => {
    setMessage("");
    setError("");

    return createUserWithEmailAndPassword(auth, user.email, user.password)
      .then(async (userCredential) => {
        const storageRef = ref(storage, `/user/${userCredential.user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, user.image);
        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            alert(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (URL) => {
              await addDoc(userCollectionRef, {
                firstName: user.firstName,
                lastName: user.lastName,
                id: userCredential.user.uid,
                email: user.email,
                image: URL,
              });
            });
          }
        );
        setMessage("user created successfully");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const logIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    userData,
    signUp,
    logIn,
    logOut,

    message,
    error,
    setError,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
