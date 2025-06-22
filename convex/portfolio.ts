import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Profile queries and mutations
export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const profile = await ctx.db.query("profile").first();
    if (!profile) {
      // Return default profile if none exists
      return {
        name: "Pankaj Kumar",
        location: "Panchkula, Haryana",
        profession: "Video Editor, Music Producer & Graphic Designer",
        bio: "Creative professional passionate about visual storytelling, music production, and graphic design. I bring ideas to life through innovative digital content.",
        profileImageId: null,
        contactNumber: "",
        fatherName: "",
        socialLinks: {
          whatsapp: "",
          instagram: "",
          youtube: "",
        },
      };
    }
    
    let profileImageUrl = null;
    if (profile.profileImageId) {
      profileImageUrl = await ctx.storage.getUrl(profile.profileImageId);
    }
    
    return {
      ...profile,
      profileImageUrl,
    };
  },
});

export const updateProfile = mutation({
  args: {
    name: v.string(),
    location: v.string(),
    profession: v.string(),
    bio: v.string(),
    contactNumber: v.optional(v.string()),
    fatherName: v.optional(v.string()),
    profileImageId: v.optional(v.id("_storage")),
    socialLinks: v.object({
      whatsapp: v.optional(v.string()),
      instagram: v.optional(v.string()),
      youtube: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const existingProfile = await ctx.db.query("profile").first();
    
    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, args);
    } else {
      await ctx.db.insert("profile", args);
    }
  },
});

// Skills queries and mutations
export const getSkills = query({
  args: {},
  handler: async (ctx) => {
    const skills = await ctx.db.query("skills").collect();
    if (skills.length === 0) {
      // Return default skills if none exist
      return [
        {
          name: "Video Editing",
          category: "Creative",
          level: 95,
          icon: "🎬",
          description: "Professional video editing with advanced techniques",
        },
        {
          name: "Music Production",
          category: "Audio",
          level: 90,
          icon: "🎵",
          description: "Music composition and audio production",
        },
        {
          name: "Graphic Design",
          category: "Design",
          level: 85,
          icon: "🎨",
          description: "Visual design and brand identity creation",
        },
        {
          name: "Adobe Premiere Pro",
          category: "Software",
          level: 95,
          icon: "🔧",
          description: "Advanced video editing and post-production",
        },
        {
          name: "After Effects",
          category: "Software",
          level: 80,
          icon: "✨",
          description: "Motion graphics and visual effects",
        },
        {
          name: "Photoshop",
          category: "Software",
          level: 85,
          icon: "🖼️",
          description: "Photo editing and digital art creation",
        },
      ];
    }
    return skills;
  },
});

// Projects queries and mutations
export const getProjects = query({
  args: {
    category: v.optional(v.union(v.literal("video"), v.literal("music"), v.literal("graphics"), v.literal("all"))),
  },
  handler: async (ctx, args) => {
    if (args.category && args.category !== "all") {
      const projects = await ctx.db
        .query("projects")
        .withIndex("by_category", (q) => q.eq("category", args.category as "video" | "music" | "graphics"))
        .order("desc")
        .collect();
      
      return Promise.all(
        projects.map(async (project) => ({
          ...project,
          thumbnailUrl: project.thumbnailId ? await ctx.storage.getUrl(project.thumbnailId) : null,
          mediaUrl: project.mediaId ? await ctx.storage.getUrl(project.mediaId) : null,
        }))
      );
    }
    
    const projects = await ctx.db.query("projects").order("desc").collect();
    
    return Promise.all(
      projects.map(async (project) => ({
        ...project,
        thumbnailUrl: project.thumbnailId ? await ctx.storage.getUrl(project.thumbnailId) : null,
        mediaUrl: project.mediaId ? await ctx.storage.getUrl(project.mediaId) : null,
      }))
    );
  },
});

export const getFeaturedProjects = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .order("desc")
      .take(6);
    
    return Promise.all(
      projects.map(async (project) => ({
        ...project,
        thumbnailUrl: project.thumbnailId ? await ctx.storage.getUrl(project.thumbnailId) : null,
        mediaUrl: project.mediaId ? await ctx.storage.getUrl(project.mediaId) : null,
      }))
    );
  },
});

export const addProject = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.union(v.literal("video"), v.literal("music"), v.literal("graphics")),
    thumbnailId: v.optional(v.id("_storage")),
    mediaId: v.optional(v.id("_storage")),
    tags: v.array(v.string()),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("projects", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Contact form
export const submitContactMessage = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contactMessages", {
      ...args,
      read: false,
      createdAt: Date.now(),
    });
  },
});

export const getContactMessages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("contactMessages").order("desc").collect();
  },
});

export const deleteProject = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);
    if (!project) {
      throw new Error("Project not found");
    }
    
    // Delete associated files from storage
    if (project.thumbnailId) {
      await ctx.storage.delete(project.thumbnailId);
    }
    if (project.mediaId) {
      await ctx.storage.delete(project.mediaId);
    }
    
    await ctx.db.delete(args.id);
  },
});

// File upload utilities
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
