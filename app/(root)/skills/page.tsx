// app/(root)/skills/page.tsx
const SkillsPage = () => {
  const skills = [
    {
      category: "Frontend Development",
      items: [
        { name: "HTML/CSS", level: 90 },
        { name: "JavaScript", level: 85 },
        { name: "React.js", level: 80 },
        { name: "Next.js", level: 75 },
      ],
    },
    {
      category: "Backend Development",
      items: [
        { name: "Node.js", level: 75 },
        { name: "Python", level: 70 },
        { name: "MongoDB", level: 65 },
        { name: "PostgreSQL", level: 60 },
      ],
    },
    {
      category: "Design",
      items: [
        { name: "Figma", level: 85 },
        { name: "Adobe XD", level: 80 },
        { name: "Photoshop", level: 75 },
        { name: "Illustrator", level: 70 },
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-32 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="space-y-4 mb-16">
          <h1 className="text-5xl font-bold">My Skills</h1>
          <div className="w-20 h-1.5 bg-blue-600 rounded-full" />
          <p className="text-gray-600 max-w-2xl">
            I&apos;ve spent several years improving my skills in both
            development and design. Here&apos;s an overview of my main technical
            skill sets and tools I use.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {skills.map((skillSet, index) => (
            <div key={index} className="space-y-6">
              <h2 className="text-2xl font-semibold">{skillSet.category}</h2>
              <div className="space-y-6">
                {skillSet.items.map((skill, skillIndex) => (
                  <div key={skillIndex} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-gray-600">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-300"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Skills */}
        <div className="mt-20">
          <h2 className="text-2xl font-semibold mb-8">Other Skills</h2>
          <div className="flex flex-wrap gap-4">
            {[
              "Git",
              "RESTful APIs",
              "Responsive Design",
              "SEO",
              "UI/UX Design",
              "Agile",
              "Problem Solving",
              "Team Collaboration",
            ].map((skill, index) => (
              <span
                key={index}
                className="px-6 py-3 bg-gray-100 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsPage;
