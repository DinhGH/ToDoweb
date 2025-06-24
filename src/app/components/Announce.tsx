import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Params = {
  title: string;
  mess: string;
};

export default function Announce({ title, mess }: Params) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.6 }}
          className="
            z-50
            max-sm:w-8/10 w-full max-w-2xl max-sm:left-1/3
            p-3 mx-auto my-2
            text-black
            bg-gradient-to-r from-blue-200 to-blue-400
            rounded-2xl border-l-4 border-blue-600
            shadow-md
            absolute top-0 left-2/3
          "
        >
          <h1
            className={`
              mb-2
              text-2xl font-bold
              ${title === "Success" ? "text-green-600" : "text-red-600"}
            `}
          >
            {title}
          </h1>
          <p
            className="
              text-md text-gray-800
            "
          >
            {mess}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
