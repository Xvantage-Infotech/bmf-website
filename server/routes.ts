import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import authRoutes from "./routes/auth";
import farmRoutes from "./routes/farms";
import bookingRoutes from "./routes/bookings";
import reviewRoutes from "./routes/reviews";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register API routes with /api prefix
  app.use('/api/auth', authRoutes);
  app.use('/api/farms', farmRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/reviews', reviewRoutes);

  // Add a simple health check endpoint
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
