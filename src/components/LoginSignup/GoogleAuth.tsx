// src/components/LoginSignup/GoogleAuth.tsx
import React from 'react';
import googleIcon from "../../assets/LoginSignUp/google.svg";
import styles from "../../styles/LoginSignup/Login.module.css";

const GoogleAuth: React.FC = () => {
  const handleGoogleLogin = () => {
    // Redirect to backend Google auth route
    window.location.href = 'https://backend.wavezgoa.com/auth/google';
  };

  return (
    <button 
      type="button" 
      className={styles.googleButton}
      onClick={handleGoogleLogin}
    >
      <img src={googleIcon} alt="Google" />
      Sign in with Google
    </button>
  );
};

export default GoogleAuth;