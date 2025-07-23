import React, { useEffect, useState } from "react";
//import { AuthContext } from "../Context/AuthContext";
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { auth } from "../Pages/Auth/authconfig";
import { AuthContext } from "../context/AuthContext";

const provider = new GoogleAuthProvider();
const AuthProvider = ({ children }) => {
  const [user, setUser]  = useState(null);
  const [loading,setLoading] = useState(true);
  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const signInWithGoogle = () => {
    return signInWithPopup(auth, provider);
  }
  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth,(currentUser)=>{
      setUser(currentUser);
      setLoading(false)
    });
    return () => {
      unsubscribe();
    }
  },[]);

  const signInUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  }
  
  const profile = (updateuser) => {
  return updateProfile(auth.currentUser,updateuser);
  }
  const signout =()=>{
    return signOut(auth);
  }
  const Authdata = {
    createUser,
    signInUser,
    signout,
    setUser,
    user,
    profile,
    signInWithGoogle,
    loading,

  };

  return <AuthContext value={Authdata}>{children}</AuthContext>;
};

export default AuthProvider;
