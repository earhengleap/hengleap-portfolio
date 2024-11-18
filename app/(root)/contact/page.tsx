// app/(root)/contact/page.tsx

"use client";

import { Mail, Phone, MapPin, Send } from "lucide-react";
import { motion, useAnimation, Variants } from "framer-motion";
import { useEffect, useState, FormEvent } from "react";
import { useInView } from "react-intersection-observer";
import toast from "react-hot-toast";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      });

      if (response.ok) {
        toast.success("Message sent successfully!");
        // Reset form
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }

    setIsSubmitting(false);
  };

  const headerVariants: Variants = {
    hidden: {
      opacity: 0,
      y: -30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  const contactInfoVariants: Variants = {
    hidden: {
      opacity: 0,
      x: -50,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
        staggerChildren: 0.1,
      },
    },
  };

  const formVariants: Variants = {
    hidden: {
      opacity: 0,
      x: 50,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-20" ref={ref}>
      <motion.div
        initial="hidden"
        animate={controls}
        variants={headerVariants}
        className="text-center mb-16"
      >
        <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "5rem" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-1.5 bg-gray-900 rounded-full mx-auto mb-4"
        />
        <p className="text-gray-600 max-w-2xl mx-auto">
          Feel free to reach out if you want to collaborate with me, or simply
          have a chat
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={contactInfoVariants}
          className="space-y-8"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-start space-x-4"
          >
            <Mail className="h-6 w-6 mt-1 text-gray-900" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-600">hengleap70@gmail.com</p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-start space-x-4"
          >
            <Phone className="h-6 w-6 mt-1 text-gray-900" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-gray-600">+855 78 231 215</p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-start space-x-4"
          >
            <MapPin className="h-6 w-6 mt-1 text-gray-900" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Location</h3>
              <p className="text-gray-600">Phnom Penh City, Cambodia</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial="hidden"
          animate={controls}
          variants={formVariants}
          className="space-y-6"
        >
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </motion.div>
          <motion.input
            variants={itemVariants}
            whileFocus={{ scale: 1.02 }}
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <motion.textarea
            variants={itemVariants}
            whileFocus={{ scale: 1.02 }}
            placeholder="Message"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSubmitting}
            className="bg-gray-900 text-white px-8 py-3 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
            <Send className="h-4 w-4" />
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};

export default ContactPage;
