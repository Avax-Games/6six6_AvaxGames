import React from 'react';

import styles from '../styles';
import { attackImage } from '../assets/index';
import { defenseImage } from '../assets/index';

const Alert = ({ type, message }) => {
  // Always use cyberpunk style for a reddish cyberpunk theme
  const alertStyle = 'cyberpunk';
  let alertIcon;

  if (message.includes("attack")) {
    alertIcon = attackImage.src || attackImage;
  } else if (message.includes("defense")) {
    alertIcon = defenseImage.src || defenseImage;
  }
  
  return (
    <div className={`${styles.alertContainer} ${styles.flexEnd}`}>
      <div className={`${styles.alertWrapper} ${styles[alertStyle]}`} role="alert">
        <div className="flex items-center">
          <img src={alertIcon} alt={type} className="w-8 h-8 mr-2" />
          <span className="font-glitch tracking-wider mr-2">{message}</span>
          <div className="ml-2 h-3 w-3 rounded-full bg-red-500 animate-ping"></div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
