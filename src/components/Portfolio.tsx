import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Skills } from "./Skills";
import { Projects } from "./Projects";
import { About } from "./About";
import { Contact } from "./Contact";
import { DarkModeToggle } from "./DarkModeToggle";

export function Portfolio() {
  const [activeSection, setActiveSection] = useState("home");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const profile = useQuery(api.portfolio.getProfile);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="fixed top-4 right-4 z-40">
        <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>

      <main>
        {activeSection === "home" && <Hero profile={profile} />}
        {activeSection === "skills" && <Skills />}
        {activeSection === "projects" && <Projects />}
        {activeSection === "about" && <About profile={profile} />}
        {activeSection === "contact" && <Contact profile={profile} />}
      </main>
    </div>
  );
}
