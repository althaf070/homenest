/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import Loader from "../components/Loader";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Set initial loading to true

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Set loading to false once we know the user state
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  const registerUser = async (email, pswd) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, pswd);
      setUser(auth.currentUser);
      navigate("/");
    } catch (error) {
      console.error("Error registering user:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setUser(auth.currentUser);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  const contextData = {
    user,
    loading,
    registerUser,
    signInWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? (
       <Loader/>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthContext;
