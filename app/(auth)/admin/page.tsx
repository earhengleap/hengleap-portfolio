//app/(auth)/admin/page

"use client";

import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import AboutSection from "../../(root)/about/page";
import SkillsSection from "../../(root)/skills/page";
import ServicesPage from "../../(root)/services/page";
import ContactPage from "../../(root)/contact/page";
import PortfolioPage from "@/app/(root)/porfolio/page";
import { AnimatedSection } from "@/components/animated-section";
import { LoadingSpinner } from "@/components/loading-spinner";
import ScrollToTop from "@/components/scroll-to-top";
import { SocialLinks } from "@/components/social-links";
import toast from "react-hot-toast";

const AdminPage = () => {
  const { user, isLoading, isAuthenticated } = useKindeAuth();
  const [coverImage, setCoverImage] = useState("/profile.jpg");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirect("/api/auth/login");
    }
  }, [isLoading, isAuthenticated]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    if (file.size > maxSize) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      if (data.secure_url) {
        setCoverImage(data.secure_url);
        toast.success("Image uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const profileVariants: Variants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  if (isLoading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center"
        >
          <h1 className="text-3xl font-bold mb-4">Admin Access Required</h1>
          <p className="mb-6 text-gray-700">
            Please log in to access the admin dashboard.
          </p>
          <LoginLink>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-500 transition-colors duration-200">
              Log In
            </button>
          </LoginLink>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="flex flex-col">
      <section
        id="adminHomeSection"
        className="min-h-screen relative flex items-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
      >
        <div className="max-w-7xl mx-auto px-8 w-full">
          <motion.div
            variants={profileVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center space-y-8"
          >
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={coverImage}
                alt="Cover Image"
                fill
                style={{ objectFit: "cover" }}
                className="w-full h-full rounded-2xl transition-transform duration-300 hover:scale-105"
                priority
              />
              <div className="absolute bottom-4 left-4 p-2 bg-white bg-opacity-90 backdrop-blur-sm rounded-md shadow-sm">
                <label className="relative inline-block">
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="text-sm file:mr-2 file:py-2 file:px-4 file:rounded-full file:border-0 
                             file:text-sm file:bg-blue-500 file:text-white hover:file:bg-blue-600 
                             cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {isUploading && (
                    <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-blue-500" />
                  )}
                </label>
              </div>
              <SocialLinks />
            </div>
          </motion.div>
        </div>
      </section>

      {[
        { id: "aboutSection", component: <AboutSection />, direction: "left" },
        {
          id: "skillsSection",
          component: <SkillsSection />,
          direction: "right",
        },
        {
          id: "servicesSection",
          component: <ServicesPage />,
          direction: "left",
        },
        {
          id: "portfolioSection",
          component: <PortfolioPage />,
          direction: "right",
        },
        { id: "contactSection", component: <ContactPage />, direction: "left" },
      ].map((section, index) => (
        <section key={section.id} id={section.id} className="min-h-screen">
          <AnimatedSection
            direction={section.direction as "left" | "right"}
            delay={index * 0.1}
          >
            {section.component}
          </AnimatedSection>
        </section>
      ))}

      <ScrollToTop />
    </main>
  );
};

export default AdminPage;
