import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-50 to-gray-100">
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <p className="text-gray-600 font-medium">Loading...</p>
    </motion.div>
  </div>
);
