import React from 'react';
import { useNavigate } from 'react-router-dom';

import Alert from './Alert';
import { useGlobalContext } from '../context';
import { logo, heroImg } from '../assets';
import styles from '../styles';
import LetterGlitch from './LetterGlitch';

const PageHOC = (Component, title, description) => () => {
  const { showAlert } = useGlobalContext();
  const navigate = useNavigate();

  return (
    <div className={`${styles.hocContainer} relative`}>
      {showAlert?.status && <Alert type={showAlert.type} message={showAlert.message} />}

      <div className="absolute inset-0 z-0">
        <LetterGlitch
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
        />
      </div>

      <div className={`${styles.hocContentBox} relative z-10`}>
        <img src={logo} alt="logo" className={styles.hocLogo} onClick={() => navigate('/')} />

        <div className={styles.hocBodyWrapper}>
          <div className="flex flex-row w-full">
            <h1 className={`flex ${styles.headText} head-text`}>{title}</h1>
          </div>

          <p className={`${styles.normalText} my-10`}>{description}</p>

          <Component />
        </div>

        <p className={styles.footerText}>Made with 💜 by JavaScript Mastery</p>
      </div>

      <div className="flex flex-1 relative z-10">
        <img src={heroImg} alt="hero-img" className="w-full xl:h-full object-cover" />
      </div>
    </div>
  );
};

export default PageHOC;
