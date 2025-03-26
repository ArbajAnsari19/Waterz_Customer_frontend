import React from 'react';
import googleIcon from "../../assets/icons/google.svg";
import styles from "../../styles/LoginSignup/Auth.module.css";

interface GoogleAuthButtonProps {
  text?: string;
  onClick: () => void;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ 
  text = "Continue with Google",
  onClick 
}) => {
  return (
    <button 
      type="button" 
      className={styles.googleButton}
      onClick={onClick}
    >
      <img src={googleIcon} alt="Google" className={styles.googleIcon} />
      {text}
    </button>
  );
};

export default GoogleAuthButton;