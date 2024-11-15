import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Loader() {
  const [loadingText, setLoadingText] = useState("Loading");

  useEffect(() => {
    async function getLoader() {
      const { jellyTriangle } = await import("ldrs");
      jellyTriangle.register();
    }
    getLoader();

    const interval = setInterval(() => {
      setLoadingText((prevText) => {
        const dots = prevText.split(".").length - 1;
        return dots < 3 ? `${prevText}.` : "Loading";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const loadingVariants = {
    start: { opacity: 0, y: -20 },
    end: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="relative flex flex-col items-center gap-2">
        <l-jelly-triangle
          size="30"
          speed="1.5"
          color="white"
        ></l-jelly-triangle>
        <motion.span
          className="text-white text-sm font-medium font-sans"
          variants={loadingVariants}
          initial="start"
          animate="end"
          exit="start"
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 1,
          }}
        >
          {loadingText}
        </motion.span>
      </div>
    </div>
  );
}
