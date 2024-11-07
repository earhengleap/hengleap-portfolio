// app/(root)/about/page.tsx
const AboutPage = () => {
  return (
    <div className="min-h-screen pt-32 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="space-y-4 mb-16">
          <h1 className="text-5xl font-bold">About Me</h1>
          <div className="w-20 h-1.5 bg-blue-600 rounded-full" />
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-16">
          {/* Left Column - Image */}
          <div className="relative h-[600px] rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
            {/* Replace with your image */}
            <div className="w-full h-full bg-gray-200">
              {/* Add your image here */}
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold">
                Web Developer & Visual Designer
              </h2>
              <p className="text-gray-600 leading-relaxed">
                I&apos;m a web developer and designer with a passion for
                creating beautiful, functional, and user-centered digital
                experiences. With 4 years of experience in the field, I am
                always looking forward to improving my skills and learning new
                technologies.
              </p>
            </div>

            {/* Personal Info */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Personal Info</h3>
                <ul className="space-y-4">
                  <li>
                    <span className="text-gray-600">Name:</span>
                    <p className="font-medium">John Smith</p>
                  </li>
                  <li>
                    <span className="text-gray-600">Age:</span>
                    <p className="font-medium">25 Years</p>
                  </li>
                  <li>
                    <span className="text-gray-600">Location:</span>
                    <p className="font-medium">New York, USA</p>
                  </li>
                  <li>
                    <span className="text-gray-600">Experience:</span>
                    <p className="font-medium">4 Years</p>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Interests</h3>
                <ul className="space-y-4">
                  <li>
                    <span className="text-gray-600">UI/UX</span>
                  </li>
                  <li>
                    <span className="text-gray-600">Web Development</span>
                  </li>
                  <li>
                    <span className="text-gray-600">Mobile Design</span>
                  </li>
                  <li>
                    <span className="text-gray-600">Photography</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA Button */}
            <button className="bg-gray-900 text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-colors">
              Download CV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
