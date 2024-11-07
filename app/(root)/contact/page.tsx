// app/(root)/contact/page.tsx
"use client";

import { Mail, Phone, MapPin, Send } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Feel free to reach out if you want to collaborate with me, or simply
          have a chat
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-8">
          <div className="flex items-start space-x-4">
            <Mail className="h-6 w-6 mt-1 text-gray-900" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-600">hello@example.com</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Phone className="h-6 w-6 mt-1 text-gray-900" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-gray-600">+1 (123) 456-7890</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <MapPin className="h-6 w-6 mt-1 text-gray-900" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Location</h3>
              <p className="text-gray-600">New York City, USA</p>
            </div>
          </div>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <input
            type="text"
            placeholder="Subject"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <textarea
            placeholder="Message"
            rows={6}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <button
            type="submit"
            className="bg-gray-900 text-white px-8 py-3 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors"
          >
            <span>Send Message</span>
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
