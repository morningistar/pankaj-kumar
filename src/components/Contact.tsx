import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface ContactProps {
  profile: {
    socialLinks: {
      whatsapp?: string;
      instagram?: string;
      youtube?: string;
    };
  };
}

export function Contact({ profile }: ContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitMessage = useMutation(api.portfolio.submitContactMessage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitMessage(formData);
      toast.success("Message sent successfully! I'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const socialLinks = [
    {
      name: "WhatsApp",
      icon: "💬",
      url: profile.socialLinks.whatsapp,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      name: "Instagram",
      icon: "📸",
      url: profile.socialLinks.instagram,
      color: "bg-pink-500 hover:bg-pink-600",
    },
    {
      name: "YouTube",
      icon: "📺",
      url: profile.socialLinks.youtube,
      color: "bg-red-500 hover:bg-red-600",
    },
  ];

  return (
    <section className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have a project in mind? Let's collaborate and create something amazing together!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
              Send Me a Message
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Tell me about your project or just say hello!"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending...
                  </span>
                ) : (
                  "Send Message ✨"
                )}
              </button>
            </form>
          </div>

          {/* Contact Info & Social Links */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Let's Connect!</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="opacity-90">Available 24/7</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <div className="font-semibold">Location</div>
                    <div className="opacity-90">Panchkula, Haryana</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <div className="font-semibold">Response Time</div>
                    <div className="opacity-90">Within 24 hours</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                Follow Me
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${social.color} text-white p-4 rounded-xl flex items-center gap-4 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                      !social.url ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={(e) => {
                      if (!social.url) {
                        e.preventDefault();
                        toast.info(`${social.name} link not configured yet`);
                      }
                    }}
                  >
                    <span className="text-2xl">{social.icon}</span>
                    <div>
                      <div className="font-semibold">{social.name}</div>
                      <div className="text-sm opacity-90">
                        {social.url ? "Click to connect" : "Coming soon"}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* WhatsApp Direct Chat */}
            <div className="bg-green-500 rounded-2xl p-6 text-white text-center">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="text-xl font-bold mb-2">Quick Chat</h3>
              <p className="mb-4 opacity-90">Need immediate assistance? Let's chat on WhatsApp!</p>
              <button
                onClick={() => {
                  if (profile.socialLinks.whatsapp) {
                    window.open(profile.socialLinks.whatsapp, "_blank");
                  } else {
                    toast.info("WhatsApp link not configured yet");
                  }
                }}
                className="bg-white text-green-500 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                Start WhatsApp Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
