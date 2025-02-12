import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const AnimatedNumber = ({ value }) => {
  const prevValueRef = useRef(value); // Store previous value
  const [color, setColor] = useState("white"); // Default color

  useEffect(() => {
    if (value > prevValueRef.current) {
      setColor("#16C784"); // ✅ Green if number goes up
    } else if (value < prevValueRef.current) {
      setColor("#ea3943"); // ✅ Red if number goes down
    }
    prevValueRef.current = value; // ✅ Update previous value
  }, [value]);

  const formattedValue = value.toFixed(2); // Ensure two decimal places
  const digits = formattedValue.split("");

  return (
    <span style={{ display: "inline-flex", gap: "0px", fontVariantNumeric: "tabular-nums", color }}>
      {digits.map((digit, index) => (
        <span key={index} style={{ display: "inline-block", overflow: "hidden", height: "1em" }}>
          <motion.span
            key={`${digit}-${index}`} // Forces re-animation when digit changes
            layout
            initial={{ y: "100%" }} // Start below
            animate={{ y: "0%" }} // Scroll into place
            exit={{ y: "-100%" }} // Scroll out above
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ display: "inline-block", position: "relative" }}
          >
            {digit}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

export default AnimatedNumber