import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "video" | "music" | "graphics">("all");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  
  const projects = useQuery(api.portfolio.getProjects, { category: selectedCategory });

  const categories = [
    { id: "all", label: "All Projects", icon: "🎯" },
    { id: "video", label: "Video", icon: "🎬" },
    { id: "music", label: "Music", icon: "🎵" },
    { id: "graphics", label: "Graphics", icon: "🎨" },
  ];

  if (!projects) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <section className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            My Projects
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A showcase of my creative work across video, music, and graphic design
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 px-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as any)}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-1 sm:gap-2 text-sm sm:text-base ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white shadow-lg transform scale-105"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
              }`}
            >
              <span className="text-sm sm:text-base">{category.icon}</span>
              <span className="hidden sm:inline">{category.label}</span>
              <span className="sm:hidden">{category.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
              Projects Coming Soon
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              I'm currently working on some amazing projects. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4">
            {projects.map((project, index) => (
              <div
                key={project._id}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative group">
                  {project.thumbnailUrl ? (
                    <img
                      src={project.thumbnailUrl}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center">
                      <span className="text-4xl text-white">
                        {project.category === "video" ? "🎬" : 
                         project.category === "music" ? "🎵" : "🎨"}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 px-4 py-2 rounded-full font-semibold transform scale-90 group-hover:scale-100 transition-all duration-300"
                    >
                      View Details
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      project.category === "video" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" :
                      project.category === "music" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                    }`}>
                      {project.category.toUpperCase()}
                    </span>
                    {project.featured && (
                      <span className="text-yellow-500">⭐</span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Project Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {selectedProject.title}
                  </h2>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
                  >
                    ✕
                  </button>
                </div>
                
                {selectedProject.mediaUrl && (
                  <div className="mb-6">
                    {selectedProject.category === "video" ? (
                      <video
                        src={selectedProject.mediaUrl}
                        controls
                        className="w-full rounded-lg"
                      />
                    ) : selectedProject.category === "music" ? (
                      <audio
                        src={selectedProject.mediaUrl}
                        controls
                        className="w-full"
                      />
                    ) : (
                      <img
                        src={selectedProject.mediaUrl}
                        alt={selectedProject.title}
                        className="w-full rounded-lg"
                      />
                    )}
                  </div>
                )}
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {selectedProject.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
