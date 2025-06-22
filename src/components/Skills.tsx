import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";

export function Skills() {
  const skills = useQuery(api.portfolio.getSkills);
  const [animatedSkills, setAnimatedSkills] = useState<Record<string, number>>({});

  useEffect(() => {
    if (skills) {
      const timer = setTimeout(() => {
        const animated: Record<string, number> = {};
        skills.forEach((skill) => {
          animated[skill.name] = skill.level;
        });
        setAnimatedSkills(animated);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [skills]);

  if (!skills) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const categories = [...new Set(skills.map(skill => skill.category))];

  return (
    <section className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            My Skills
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Expertise across creative and technical domains, honed through years of passionate work
          </p>
        </div>

        {categories.map((category, categoryIndex) => (
          <div key={category} className="mb-12">
            <h3 className="text-2xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200">
              {category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {skills
                .filter(skill => skill.category === category)
                .map((skill, index) => (
                  <div
                    key={skill.name}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700"
                    style={{
                      animationDelay: `${categoryIndex * 200 + index * 100}ms`,
                    }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="text-3xl mr-3">{skill.icon}</div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {skill.name}
                      </h4>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {skill.description}
                    </p>
                    
                    <div className="relative">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Proficiency
                        </span>
                        <span className="text-sm font-bold text-blue-600">
                          {animatedSkills[skill.name] || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-teal-600 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${animatedSkills[skill.name] || 0}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Always Learning</h3>
            <p className="text-lg opacity-90">
              I'm constantly exploring new technologies and techniques to stay at the forefront of creative innovation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
