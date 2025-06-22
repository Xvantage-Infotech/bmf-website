# BookMyFarm - Premium Farmhouse Rental Platform

## Overview

BookMyFarm is a full-stack web application for booking premium farmhouse rentals. The platform allows users to browse, search, and book farmhouse properties while providing owners with a dashboard to manage their listings. Built with React, Express, and PostgreSQL using modern web development practices.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API design with `/api` prefix
- **Middleware**: Express middleware for logging, JSON parsing, and error handling

### Data Architecture
- **Database**: PostgreSQL with Drizzle ORM
- **Schema**: Shared schema definition between client and server
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development
- **Migrations**: Drizzle Kit for database schema management

## Key Components

### Database Schema
The application uses a comprehensive schema for farmhouse rentals:
- **Users**: Authentication and user roles (guest, owner, admin)
- **Farms**: Property listings with location, pricing, amenities
- **Bookings**: Reservation system with status tracking
- **Reviews**: Customer feedback and ratings system

### UI Components
- Comprehensive component library using shadcn/ui
- Responsive design with mobile-first approach
- Custom animations and transitions
- Accessible components following ARIA standards

### Pages and Features
- **Home**: Search, filtering, and featured farm listings
- **Farm Detail**: Detailed property views with booking functionality
- **Owner Dashboard**: Property management interface
- **Video Gallery**: Virtual tours and property showcases
- **Reviews System**: Customer feedback display

## Data Flow

1. **Client Requests**: React components use TanStack Query for data fetching
2. **API Layer**: Express routes handle business logic and data validation
3. **Storage Layer**: Abstracted interface allows for different storage implementations
4. **Database**: PostgreSQL stores persistent data with Drizzle ORM
5. **Response**: JSON API responses consumed by React components

## External Dependencies

### Production Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/**: Accessible UI component primitives
- **wouter**: Lightweight routing library
- **date-fns**: Date manipulation utilities

### Development Dependencies
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing pipeline

### Authentication
Currently using in-memory storage with plans for session-based authentication using `connect-pg-simple` for PostgreSQL session store.

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with Replit integration
- **Database**: PostgreSQL 16 module
- **Hot Reload**: Vite development server with HMR
- **Port Configuration**: Port 5000 for development, port 80 for production

### Production Build
- **Frontend**: Static assets built with Vite to `dist/public`
- **Backend**: Server bundle created with esbuild to `dist/index.js`
- **Deployment Target**: Autoscale deployment on Replit

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment identifier (development/production)

## Changelog

- June 22, 2025: Initial setup and basic components
- June 22, 2025: Implemented prioritized features:
  - Live autocomplete search bar with farm navigation
  - Enhanced date picker with calendar component
  - Numeric guest input field
  - Property category tabs (Farms, Villas, Resorts)
  - New pages: Happy Customers, Contact, How It Works
  - Complete property registration form with validation
  - Legal pages: Terms, Privacy Policy, FAQ
  - Updated routing and navigation structure

## User Preferences

Preferred communication style: Simple, everyday language.