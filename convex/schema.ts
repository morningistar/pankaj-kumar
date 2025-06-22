import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  projects: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.union(v.literal("video"), v.literal("music"), v.literal("graphics")),
    thumbnailId: v.optional(v.id("_storage")),
    mediaId: v.optional(v.id("_storage")),
    tags: v.array(v.string()),
    featured: v.boolean(),
    createdAt: v.number(),
  }).index("by_category", ["category"])
    .index("by_featured", ["featured"])
    .index("by_created_at", ["createdAt"]),

  contactMessages: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    read: v.boolean(),
    createdAt: v.number(),
  }).index("by_read", ["read"])
    .index("by_created_at", ["createdAt"]),

  profile: defineTable({
    name: v.string(),
    location: v.string(),
    profession: v.string(),
    bio: v.string(),
    profileImageId: v.optional(v.id("_storage")),
    contactNumber: v.optional(v.string()),
    fatherName: v.optional(v.string()),
    socialLinks: v.object({
      whatsapp: v.optional(v.string()),
      instagram: v.optional(v.string()),
      youtube: v.optional(v.string()),
    }),
  }),

  skills: defineTable({
    name: v.string(),
    category: v.string(),
    level: v.number(), // 0-100
    icon: v.string(),
    description: v.string(),
  }).index("by_category", ["category"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
