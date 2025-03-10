import { useState } from "react";
import "./CyberBtn.css";

const CyberBtn = ({ onSelect }) => {
  const [selectedValue, setSelectedValue] = useState("value-2"); // Default checked value

  const handleChange = (e) => {
    setSelectedValue(e.target.id);
    if (onSelect) {
      onSelect(e.target.id);
    }
  };

  return (
    <div class="container">
      <div class="radio-wrapper">
        <input class="input" name="btn" id="value-1" type="radio" />
        <div class="btn">
      <span aria-hidden="">_</span>Cyber
      <span class="btn__glitch" aria-hidden="">_Cyber🦾</span>
      <label class="number">r1</label>
    </div>
  </div>
  <div class="radio-wrapper">
    <input class="input" name="btn" id="value-2" checked="true" type="radio" />
    <div class="btn">
      _Radio<span aria-hidden="">_</span>
      <span class="btn__glitch" aria-hidden="">_R_a_d_i_o_</span>
      <label class="number">r2</label>
    </div>
  </div>
  <div class="radio-wrapper">
    <input class="input" name="btn" id="value-3" type="radio" />
    <div class="btn">
      Buttons<span aria-hidden=""></span>
      <span class="btn__glitch" aria-hidden="">Buttons_</span>
      <label class="number">r3</label>
    </div> 
    </div>



    </div>
  );
};

export default CyberBtn;
