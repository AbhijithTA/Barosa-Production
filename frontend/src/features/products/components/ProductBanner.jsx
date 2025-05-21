import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery, useTheme } from "@mui/material";

import Homebg3 from "../../../assets/images/img3.jpg";
// import Homebg4 from "https://res.cloudinary.com/dsfgakhl4/image/upload/v1747834076/bussiness_nguga4.jpg";
// import Homebg5 from "../../../assets/images/lady.jpg";

// Animation variants
const textAnimation = {
  hidden: { y: "100%", opacity: 0 },
  visible: { y: "0%", opacity: 1 },
};

const imageAnimation = {
  initial: { scale: 1.2, opacity: 0.8 },
  animate: { scale: 1, opacity: 1 },
  exit: { opacity: 0 },
};

const backgrounds = [
  { image: "https://res.cloudinary.com/dsfgakhl4/image/upload/v1747834076/bussiness_nguga4.jpg", heading: "DISCOVER YOUR PERFECT FIT" },
  { image: "https://res.cloudinary.com/dsfgakhl4/image/upload/v1747834291/img3_brl4xs.jpg", heading: "UNBEATABLE TRENDS, UNMATCHED PRICES" },
  { image: "https://res.cloudinary.com/dsfgakhl4/image/upload/v1747834398/2149478971_w4gart.jpg", heading: "SHOP EFFORTLESSLY SHINE ALWAYS" },
];

export const ProductBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isExtraSmall = useMediaQuery(theme.breakpoints.down(400));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  // Auto-rotate banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="relative w-full overflow-hidden "
      style={{ 
        height: isMobile ? "70vh" : isTablet ? "60vh" : "70vh",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0 bg-no-repeat bg-top bg-cover"
          style={{ 
            backgroundImage: `url(${backgrounds[currentIndex].image})`,
            backgroundPosition: "center",
          }}
          variants={imageAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 1.5 }}
        >
          {/* Dark overlay for better text visibility */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </motion.div>
      </AnimatePresence>
      
      {/* Content container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`z-10 flex flex-col 
          ${isMobile ? 'w-11/12 px-4' : isTablet ? 'w-4/5' : 'w-2/3'} 
          text-center`}>
          
          <motion.h1
            key={`heading-${currentIndex}`}
            className={`font-bold text-white mb-2 ${
              isExtraSmall ? 'text-xl' : 
              isMobile ? 'text-2xl' : 
              isTablet ? 'text-3xl' : 
              'text-5xl'
            } bona-nova-sc-bold tracking-wider`}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.8, delay: 0.3 }}
            variants={textAnimation}
          >
            {backgrounds[currentIndex].heading}
          </motion.h1>
          
          <motion.p
            className={`text-white ${
              isExtraSmall ? 'text-xs mt-1' : 
              isMobile ? 'text-sm mt-2' : 
              isTablet ? 'text-base mt-3' :
              'text-lg mt-4'
            } max-w-lg mx-auto`}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.8, delay: 0.6 }}
            variants={textAnimation}
          >
            Browse, buy, and dazzle with ease. Your next favorite dress is just a click away!
          </motion.p>
          
          {/* CTA Button */}
          <motion.button
            className={`mt-4 ${
              isExtraSmall ? 'mt-2 text-xs py-1 px-3' : 
              isMobile ? 'text-sm py-1.5 px-4 mt-3' : 
              'py-2 px-6 text-base mt-5'
            } bg-white text-black font-medium rounded-md shadow-lg mx-auto 
            hover:bg-opacity-90 transition-all duration-300 hover:shadow-xl`}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.8, delay: 0.9 }}
            variants={textAnimation}
          >
            Shop Now
          </motion.button>
        </div>
      </div>

      {/* Indicator dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 sm:gap-2">
        {backgrounds.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`${
              isExtraSmall ? 'w-2 h-2' : isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'
            } rounded-full cursor-pointer transition-all duration-300 ${
              index === currentIndex
                ? "bg-white scale-125"
                : "bg-gray-300 opacity-70 hover:opacity-100"
            }`}
            aria-label={`View slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};