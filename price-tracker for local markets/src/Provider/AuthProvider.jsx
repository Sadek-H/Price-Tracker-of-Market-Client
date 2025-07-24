import React, { useEffect, useState } from "react";
//import { AuthContext } from "../Context/AuthContext";
import { createUserWithEmailAndPassword, getIdToken, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { auth } from "../Pages/Auth/authconfig";
import { AuthContext } from "../context/AuthContext";

const provider = new GoogleAuthProvider();
const AuthProvider = ({ children }) => {
  const [user, setUser]  = useState(null);
  const [loading,setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const signInWithGoogle = () => {
    return signInWithPopup(auth, provider);
  }
  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, async(currentUser)=>{
      setUser(currentUser);
      setLoading(false)

      if (currentUser) {
        console.log(currentUser);
        const idToken = await getIdToken(currentUser, true); // get fresh token
        //console.log(idToken);
         localStorage.setItem("token", idToken);
        setToken(idToken);
      } else {
        setToken(null);
      }
        
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
    token,

  };

  return <AuthContext value={Authdata}>{children}</AuthContext>;
};

export default AuthProvider;
