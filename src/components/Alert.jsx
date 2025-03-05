import React from 'react';

import { alertIcon } from '../assetsDqn/index.js';
import styles from '../styles';

const Alert = ({ type, message }) => (
  <div className={`${styles.alertContainer} ${styles.flexCenter}`}>
    <div className={`${styles.alertWrapper} ${styles[type]}`} role="alert">
      <img src={alertIcon} alt={type} className="w-5 h-5 mr-2" /> {message}
    </div>
  </div>
);

export default Alert;
