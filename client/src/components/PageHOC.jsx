import React from "react";
import { useNavigate } from "react-router-dom";

import Alert from "./Alert";
import { useGlobalContext } from "../context";
import { logo, heroImg } from "../assets";
import styles from "../styles";
import FuzzyText from "./FuzzyText";
import LetterGlitch from "./LetterGlitch";

const PageHOC = (Component, title, description) => () => {
  const { showAlert } = useGlobalContext();
  const navigate = useNavigate();

  return (
    <div className={styles.hocContainer}>
      {/* {showAlert?.status && (
        <Alert type={showAlert.type} message={showAlert.message} />
      )} */}

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
