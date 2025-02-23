import React from "react";
import { useNavigate } from "react-router-dom";

import Alert from "./Alert";
import { useGlobalContext } from "../context";
import { logo, heroImg } from "../assets";
import styles from "../styles";
import FuzzyText from "./FuzzyText";
import LetterGlitch from "./LetterGlitch";
import CircularText from "./CircularText";
const PageHOC = (Component, title, description) => () => {
  const { showAlert } = useGlobalContext();
  const navigate = useNavigate();

  const handleHover = () => {
    const timer = setTimeout(() => {
      console.log("Navigating to dashboard...");
      navigate("/dashboard");
    }, 2000);

    // Cleanup timeout on mouse leave
    return () => clearTimeout(timer);
  };

  return (
    <div className={styles.hocContainer}>
      {/* {showAlert?.status && (
        <Alert type={showAlert.type} message={showAlert.message} />
      )} */}
      <div
        onMouseEnter={handleHover}
        className="absolute top-2 right-2 scale-50"
      >
        <CircularText
          text="6 six 6 six 6 six 6 six "
          spinDuration={15}
          className="custom-class cursor-pointer"
        />
      </div>

      <div className="absolute top-4 left-4">
        <button className="bg-white text-black px-4 py-2 rounded-md">
          Sign in
        </button>
      </div>

      <div
        className={
          "flex-col w-[40%] h-screen relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.1)_50%,transparent_55%)] before:animate-glitch"
        }
      >
        <LetterGlitch
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
        />
      </div>

      <div className="">
        <img
          src={
            "https://pbs.twimg.com/media/GkV_PQPX0AERaXO?format=jpg&name=large"
          }
          alt="hero-img"
          className="w-full xl:h-full object-cover"
        />
      </div>
    </div>
  );
};

export default PageHOC;

// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// import Alert from './Alert';
// import { useGlobalContext } from '../context';
// import { logo, heroImg } from '../assets';
// import styles from '../styles';

// const PageHOC = (Component, title, description) => () => {
//   const { showAlert } = useGlobalContext();
//   const navigate = useNavigate();

//   return (
//     <div className={styles.hocContainer}>
//       {showAlert?.status && <Alert type={showAlert.type} message={showAlert.message} />}

//       <div className={styles.hocContentBox}>
//         <img src={logo} alt="logo" className={styles.hocLogo} onClick={() => navigate('/')} />

//         <div className={styles.hocBodyWrapper}>
//           <div className="flex flex-row w-full">
//             <h1 className={`flex ${styles.headText} head-text`}>{title}</h1>
//           </div>

//           <p className={`${styles.normalText} my-10`}>{description}</p>

//           <Component />
//         </div>

//         <p className={styles.footerText}>Made with 💜 by JavaScript Mastery</p>
//       </div>

//       <div className="flex flex-1">
//         <img src={heroImg} alt="hero-img" className="w-full xl:h-full object-cover" />
//       </div>
//     </div>
//   );
// };

// export default PageHOC;
