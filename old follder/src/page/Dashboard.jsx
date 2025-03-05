import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles";
import LetterGlitch from "../components/LetterGlitch";
import CyberBtn from "../components/CyberBtn";
import CircularText from "../components/CircularText";
import CircularGallery from "../components/CircularGallery";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("clicked");
  };

  return (
    <div className={`${styles.flexCenter} ${styles.battleContainer}`}>
      <div className={`${styles.flexCenter} flex-col`}>
        <div
          className={
            "flex-col w-screen h-screen relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.1)_50%,transparent_55%)] before:animate-glitch"
          }
        >
          <div className="relative w-full h-full">
            <div className="absolute inset-0 z-10">
              <LetterGlitch
                glitchSpeed={50}
                centerVignette={true}
                outerVignette={false}
                smooth={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
