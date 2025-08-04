import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const slideVariants = {
  initial: {
    y: "100%",
    opacity: 0,
    position: "absolute",
  },
  animate: {
    y: "0%",
    opacity: 1,
    position: "absolute",
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
  exit: {
    y: "-100%",
    opacity: 0,
    position: "absolute",
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

const HeroTextRotator = ({
  texts,
  interval = 4000,
}: {
  texts: string[];
  interval?: number;
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, interval);

    return () => clearTimeout(timer);
  }, [index, interval]);

  return (
    <div className="relative h-14 md:h-20 w-full flex items-center justify-center overflow-hidden text-inherit font-inherit">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full text-center bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent"
        >
          {texts[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HeroTextRotator;
