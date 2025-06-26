import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique(),
  email: text("email").unique(),
  password: text("password"),
  name: text("name"),
  mobileNumber: text("mobile_number").unique(),
  address: text("address"),
  location: text("location"),
  dateOfBirth: text("date_of_birth"),
  profileImage: text("profile_image"),
  firebaseUid: text("firebase_uid").unique(),
  role: text("role").notNull().default("guest"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const farms = pgTable("farms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pricePerNight: decimal("price_per_night", { precision: 10, scale: 2 }).notNull(),
  bedrooms: integer("bedrooms").notNull(),
  maxGuests: integer("max_guests").notNull(),
  images: text("images").array().notNull(),
  amenities: text("amenities").array().notNull(),
  category: text("category").notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0.0"),
  reviewCount: integer("review_count").default(0),
  ownerId: integer("owner_id").references(() => users.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  farmId: integer("farm_id").references(() => farms.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  checkIn: timestamp("check_in").notNull(),
  checkOut: timestamp("check_out").notNull(),
  adults: integer("adults").notNull(),
  children: integer("children").default(0),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  farmId: integer("farm_id").references(() => farms.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  farmId: integer("farm_id").references(() => farms.id),
  title: text("title").notNull(),
  description: text("description"),
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  duration: text("duration"),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
}).extend({
  username: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  name: z.string().optional(),
  mobileNumber: z.string().optional(),
  address: z.string().optional(),
  location: z.string().optional(),
  dateOfBirth: z.string().optional(),
  profileImage: z.string().optional(),
  firebaseUid: z.string().optional(),
});

export const insertFarmSchema = createInsertSchema(farms).omit({
  id: true,
  rating: true,
  reviewCount: true,
  createdAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
});

