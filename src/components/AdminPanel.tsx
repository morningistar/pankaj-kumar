import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isUploading, setIsUploading] = useState(false);

  const profile = useQuery(api.portfolio.getProfile);
  const projects = useQuery(api.portfolio.getProjects, { category: "all" });
  const messages = useQuery(api.portfolio.getContactMessages);
  
  const updateProfile = useMutation(api.portfolio.updateProfile);
  const addProject = useMutation(api.portfolio.addProject);
  const generateUploadUrl = useMutation(api.portfolio.generateUploadUrl);

  const [profileForm, setProfileForm] = useState({
    name: "",
    location: "",
    profession: "",
    bio: "",
    contactNumber: "",
    fatherName: "",
    profileImageId: null as string | null,
    socialLinks: {
      whatsapp: "",
      instagram: "",
      youtube: "",
    },
  });

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    category: "video" as "video" | "music" | "graphics",
    tags: "",
    featured: false,
    thumbnailId: null as string | null,
    mediaId: null as string | null,
  });

  const [selectedFiles, setSelectedFiles] = useState({
    profileImage: null as File | null,
    thumbnail: null as File | null,
    media: null as File | null,
  });

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name || "",
        location: profile.location || "",
        profession: profile.profession || "",
        bio: profile.bio || "",
        contactNumber: profile.contactNumber || "",
        fatherName: profile.fatherName || "",
        profileImageId: profile.profileImageId || null,
        socialLinks: {
          whatsapp: profile.socialLinks?.whatsapp || "",
          instagram: profile.socialLinks?.instagram || "",
          youtube: profile.socialLinks?.youtube || "",
        },
      });
    }
  }, [profile]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let profileImageId = profileForm.profileImageId;
      
      // Upload profile image if selected
      if (selectedFiles.profileImage) {
        profileImageId = await handleFileUpload(selectedFiles.profileImage, "profile");
      }

      await updateProfile({
        ...profileForm,
        profileImageId: profileImageId as Id<"_storage"> | undefined,
      });
      toast.success("Profile updated successfully!");
      setSelectedFiles({ ...selectedFiles, profileImage: null });
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let thumbnailId = projectForm.thumbnailId;
      let mediaId = projectForm.mediaId;

      // Upload files if selected
      if (selectedFiles.thumbnail) {
        thumbnailId = await handleFileUpload(selectedFiles.thumbnail, "thumbnail");
      }
      if (selectedFiles.media) {
        mediaId = await handleFileUpload(selectedFiles.media, "media");
      }

      await addProject({
        ...projectForm,
        thumbnailId: thumbnailId as Id<"_storage"> | undefined,
        mediaId: mediaId as Id<"_storage"> | undefined,
        tags: projectForm.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      });
      
      toast.success("Project added successfully!");
      resetProjectForm();
    } catch (error) {
      toast.error("Failed to add project");
    }
  };

  const resetProjectForm = () => {
    setProjectForm({
      title: "",
      description: "",
      category: "video",
      tags: "",
      featured: false,
      thumbnailId: null,
      mediaId: null,
    });
    setSelectedFiles({
      profileImage: null,
      thumbnail: null,
      media: null,
    });
  };

  const handleFileUpload = async (file: File, type: "thumbnail" | "media" | "profile") => {
    setIsUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      if (!result.ok) {
        throw new Error("Upload failed");
      }
      
      const { storageId } = await result.json();
      toast.success(`${type} uploaded successfully!`);
      return storageId;
    } catch (error) {
      toast.error(`Failed to upload ${type}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "projects", label: "Projects", icon: "💼" },
    { id: "messages", label: "Messages", icon: "📧" },
  ];

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your portfolio content</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
                {tab.id === "messages" && messages && messages.filter(m => !m.read).length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {messages.filter(m => !m.read).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit Profile</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profession
                </label>
                <input
                  type="text"
                  value={profileForm.profession}
                  onChange={(e) => setProfileForm({ ...profileForm, profession: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  rows={4}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={profileForm.contactNumber}
                    onChange={(e) => setProfileForm({ ...profileForm, contactNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Father's Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.fatherName}
                    onChange={(e) => setProfileForm({ ...profileForm, fatherName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      WhatsApp
                    </label>
                    <input
                      type="url"
                      value={profileForm.socialLinks.whatsapp}
                      onChange={(e) => setProfileForm({
                        ...profileForm,
                        socialLinks: { ...profileForm.socialLinks, whatsapp: e.target.value }
                      })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="https://wa.me/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={profileForm.socialLinks.instagram}
                      onChange={(e) => setProfileForm({
                        ...profileForm,
                        socialLinks: { ...profileForm.socialLinks, instagram: e.target.value }
                      })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      YouTube
                    </label>
                    <input
                      type="url"
                      value={profileForm.socialLinks.youtube}
                      onChange={(e) => setProfileForm({
                        ...profileForm,
                        socialLinks: { ...profileForm.socialLinks, youtube: e.target.value }
                      })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFiles({
                    ...selectedFiles,
                    profileImage: e.target.files?.[0] || null
                  })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isUploading ? "Uploading..." : "Update Profile"}
              </button>
            </form>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Add New Project</h2>
              <form onSubmit={handleProjectSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as any })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="video">Video</option>
                      <option value="music">Music</option>
                      <option value="graphics">Graphics</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={projectForm.tags}
                    onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="creative, professional, modern"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={projectForm.featured}
                    onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Featured Project
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isUploading ? "Uploading..." : "Add Project"}
                </button>
              </form>
            </div>

            {/* Existing Projects */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Existing Projects</h2>
              {projects && projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <div key={project._id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{project.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{project.category}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
                        {project.description}
                      </p>
                      {project.featured && (
                        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mt-2">
                          Featured
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No projects yet. Add your first project above!</p>
              )}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Contact Messages</h2>
            {messages && messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`border rounded-lg p-4 ${
                      message.read
                        ? "border-gray-200 dark:border-gray-600"
                        : "border-blue-200 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{message.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{message.email}</p>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{message.message}</p>
                    {!message.read && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
                        New
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No messages yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
