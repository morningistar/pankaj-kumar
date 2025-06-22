import { useState, useEffect } from "react";

interface HeroProps {
  profile: {
    name: string;
    location: string;
    profession: string;
    bio: string;
    profileImageUrl?: string | null;
  };
}

export function Hero({ profile }: HeroProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = profile.profession;

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  return (
    <section className="min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-6 sm:mb-8 relative">
          <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto rounded-full overflow-hidden border-4 border-blue-600 shadow-2xl animate-pulse-slow">
            {profile.profileImageUrl ? (
              <img
                src={profile.profileImageUrl}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center">
                <span className="text-3xl sm:text-4xl md:text-6xl text-white font-bold">
                  {profile.name.split(" ").map(n => n[0]).join("")}
                </span>
              </div>
            )}
          </div>
          <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full border-2 sm:border-4 border-white dark:border-gray-900 animate-bounce"></div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent animate-fade-in text-center">
          {profile.name}
        </h1>

        <div className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-2 flex items-center justify-center gap-2">
          <span>📍</span>
          <span className="text-center">{profile.location}</span>
        </div>

        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-6 sm:mb-8 min-h-[3rem] sm:min-h-[3.5rem] flex items-center justify-center px-4">
          <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent text-center">
            {displayText}
            <span className="animate-blink">|</span>
          </span>
        </div>

        <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4 text-center">
          {profile.bio}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
          <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-full font-semibold text-base sm:text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-bounce-slow">
            View My Work ✨
          </button>
          <button className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-full font-semibold text-base sm:text-lg hover:bg-blue-600 hover:text-white transition-all duration-300">
            Get In Touch 📞
          </button>
        </div>

        <div className="mt-12 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-sm sm:max-w-md mx-auto px-4">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">50+</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-teal-600">5+</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Years</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600">100%</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
}
