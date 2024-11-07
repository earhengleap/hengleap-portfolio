// app/(root)/(home)/page.tsx
"use client";

import { Instagram, Dribbble, Github } from "lucide-react";
import Link from "next/link";
import AboutSection from "../about/page";
import SkillsSection from "../skills/page";
import Navbar from "@/components/navbar";
import ServicesPage from "../services/page";
import PortfolioPage from "../porfolio/page";
import ContactPage from "../contact/page";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <main className="flex flex-col">
        {/* Hero Section */}
        <section
          id="homeSection"
          className="min-h-screen relative flex items-center"
        >
          <div className="max-w-7xl mx-auto px-8 w-full">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col space-y-6">
                <div className="space-y-4">
                  {[
                    { icon: Instagram, href: "#" },
                    { icon: Dribbble, href: "#" },
                    { icon: Github, href: "#" },
                  ].map((social, index) => (
                    <Link
                      key={index}
                      href={social.href}
                      className="block w-fit hover:text-gray-600 transition-colors"
                    >
                      <social.icon className="h-6 w-6" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex flex-col space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold">
                  Ear HengLeap <span className="text-4xl">👋</span>
                </h1>
                <p className="text-2xl text-gray-600">Sofware Engineer</p>
                <p className="text-gray-600 max-w-md">
                  I&apos;m Software Engineer based in Cambodia, and I&apos;m
                  very passionate and dedicated to my work.
                </p>
                <button className="bg-gray-900 text-white px-6 py-3 rounded-full w-fit hover:bg-gray-800 transition-colors">
                  Say Hello
                </button>
              </div>
            </div>
          </div>

          {/* Scroll Down Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2">
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center pt-2">
              <div className="w-1 h-2 bg-gray-400 rounded-full animate-bounce" />
            </div>
            <span className="text-sm text-gray-400">Scroll down</span>
          </div>
        </section>

        {/* About Section */}
        <section id="aboutSection" className="min-h-screen">
          <AboutSection />
        </section>

        {/* Skills Section */}
        <section id="skillsSection" className="min-h-screen">
          <SkillsSection />
        </section>

        {/* Services Section */}
        <section id="servicesSection" className="min-h-screen">
          <ServicesPage />
        </section>

        {/* Portfolio Section */}
        <section id="portfolioSection" className="min-h-screen">
          <PortfolioPage />
        </section>

        {/* Contact Section */}
        <section id="contactSection" className="min-h-screen">
          <ContactPage />
        </section>
      </main>
    </>
  );
};

export default HomePage;
