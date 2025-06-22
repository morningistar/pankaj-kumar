interface AboutProps {
  profile: {
    name: string;
    location: string;
    profession: string;
    bio: string;
    contactNumber?: string;
    fatherName?: string;
    profileImageUrl?: string | null;
  };
}

export function About({ profile }: AboutProps) {
  return (
    <section className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            About Me
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Get to know the person behind the creativity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                My Journey
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {profile.bio}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                Personal Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-blue-600">👤</span>
                  <span className="font-semibold">Name:</span>
                  <span className="text-gray-700 dark:text-gray-300">{profile.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-blue-600">📍</span>
                  <span className="font-semibold">Location:</span>
                  <span className="text-gray-700 dark:text-gray-300">{profile.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-blue-600">💼</span>
                  <span className="font-semibold">Profession:</span>
                  <span className="text-gray-700 dark:text-gray-300">{profile.profession}</span>
                </div>
                {profile.contactNumber && (
                  <div className="flex items-center gap-3">
                    <span className="text-blue-600">📞</span>
                    <span className="font-semibold">Contact:</span>
                    <span className="text-gray-700 dark:text-gray-300">{profile.contactNumber}</span>
                  </div>
                )}
                {profile.fatherName && (
                  <div className="flex items-center gap-3">
                    <span className="text-blue-600">👨‍👦</span>
                    <span className="font-semibold">Father's Name:</span>
                    <span className="text-gray-700 dark:text-gray-300">{profile.fatherName}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">My Philosophy</h3>
              <p className="leading-relaxed opacity-90">
                "Creativity is not just about making something beautiful; it's about telling a story, 
                evoking emotions, and connecting with people on a deeper level. Every project I work on 
                is an opportunity to create something meaningful."
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-2xl">
                {profile.profileImageUrl ? (
                  <img
                    src={profile.profileImageUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center">
                    <span className="text-8xl text-white font-bold">
                      {profile.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg">
                <span className="text-2xl">✨</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-2xl font-bold text-blue-600">50+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Projects Completed</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-2xl mb-2">⭐</div>
                <div className="text-2xl font-bold text-teal-600">5+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-2xl mb-2">😊</div>
                <div className="text-2xl font-bold text-purple-600">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Client Satisfaction</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-2xl mb-2">🚀</div>
                <div className="text-2xl font-bold text-red-600">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Availability</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
