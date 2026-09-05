# NOMEC Backend Setup Guide

## Overview

This document provides step-by-step instructions for setting up the backend infrastructure that powers the Student Portal, Parent Portal, and Teacher Portal for the Nosakhare Model Education Centre website.

## Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Database**: PostgreSQL 15+ (production) / SQLite (development)
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **API Style**: RESTful JSON API

---

## Step 1: Environment Preparation

### Prerequisites

Ensure the following are installed on your server or local machine:

1. Node.js version 18.17.0 or higher
2. PostgreSQL version 15 or higher
3. Git (for version control)

### Verify Installation

Open your terminal and run:

    node --version
    npm --version
    psql --version

All commands should return version numbers. If any are missing, install them before proceeding.

---

## Step 2: Project Initialization

### 2.1 Create Project Directory

    mkdir nomec-backend
    cd nomec-backend

### 2.2 Initialize Node.js Project

    npm init -y

### 2.3 Install Core Dependencies

    npm install express cors dotenv bcryptjs jsonwebtoken
    npm install prisma @prisma/client
    npm install -D nodemon @types/node typescript ts-node

### 2.4 Initialize TypeScript

    npx tsc --init

Edit `tsconfig.json` to include:

    {
      "compilerOptions": {
        "target": "ES2020",
        "module": "commonjs",
        "strict": true,
        "esModuleInterop": true,
        "outDir": "./dist",
        "rootDir": "./src"
      }
    }

---

## Step 3: Database Configuration

### 3.1 Initialize Prisma

    npx prisma init

### 3.2 Configure Database Connection

Edit the `.env` file created by Prisma:

    DATABASE_URL="postgresql://username:password@localhost:5432/nomec_db?schema=public"
    JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"
    PORT=5000

Replace `username` and `password` with your PostgreSQL credentials.

### 3.3 Define Data Models

Create or edit `prisma/schema.prisma`:

    generator client {
      provider = "prisma-client-js"
    }

    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }

    model User {
      id        Int      @id @default(autoincrement())
      email     String   @unique
      password  String
      role      Role
      profile   Profile?
      createdAt DateTime @default(now())
      updatedAt DateTime @updatedAt
    }

    model Profile {
      id        Int    @id @default(autoincrement())
      userId    Int    @unique
      firstName String
      lastName  String
      phone     String?
      user      User   @relation(fields: [userId], references: [id])
    }

    model Student {
      id          Int      @id @default(autoincrement())
      matricNo    String   @unique
      userId      Int      @unique
      classLevel  String
      house       String
      results     Result[]
      attendance  Attendance[]
    }

    model Result {
      id        Int    @id @default(autoincrement())
      studentId Int
      subject   String
      caScore   Int
      examScore Int
      term      String
      session   String
      student   Student @relation(fields: [studentId], references: [id])
    }

    model Attendance {
      id        Int      @id @default(autoincrement())
      studentId Int
      date      DateTime
      status    String
      student   Student  @relation(fields: [studentId], references: [id])
    }

    model Fee {
      id          Int    @id @default(autoincrement())
      studentId   Int
      item        String
      amount      Int
      status      String
      dueDate     DateTime
      paidDate    DateTime?
    }

    enum Role {
      STUDENT
      PARENT
      TEACHER
      ADMIN
    }

### 3.4 Run Database Migration

    npx prisma migrate dev --name init

This command creates the database tables based on your schema.

### 3.5 Generate Prisma Client

    npx prisma generate

---

## Step 4: Server Implementation

### 4.1 Create Directory Structure

    mkdir src
    mkdir src/routes
    mkdir src/middleware
    mkdir src/controllers

### 4.2 Main Server File (`src/index.ts`)

    import express from 'express';
    import cors from 'cors';
    import dotenv from 'dotenv';
    import authRoutes from './routes/auth';
    import studentRoutes from './routes/student';
    import teacherRoutes from './routes/teacher';
    import parentRoutes from './routes/parent';

    dotenv.config();

    const app = express();
    const PORT = process.env.PORT || 5000;

    app.use(cors());
    app.use(express.json());

    app.use('/api/auth', authRoutes);
    app.use('/api/student', studentRoutes);
    app.use('/api/teacher', teacherRoutes);
    app.use('/api/parent', parentRoutes);

    app.get('/api/health', (req, res) => {
      res.json({ status: 'operational', timestamp: new Date().toISOString() });
    });

    app.listen(PORT, () => {
      console.log(`NOMEC Backend Server running on port ${PORT}`);
    });

### 4.3 Authentication Middleware (`src/middleware/auth.ts`)

    import { Request, Response, NextFunction } from 'express';
    import jwt from 'jsonwebtoken';

    export const authenticate = (req: Request, res: Response, next: NextFunction) => {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = decoded;
        next();
      } catch (error) {
        res.status(400).json({ error: 'Invalid token.' });
      }
    };

    export const authorize = (roles: string[]) => {
      return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes((req as any).user.role)) {
          return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
        }
        next();
      };
    };

### 4.4 Auth Routes (`src/routes/auth.ts`)

    import { Router } from 'express';
    import bcrypt from 'bcryptjs';
    import jwt from 'jsonwebtoken';
    import { PrismaClient } from '@prisma/client';

    const router = Router();
    const prisma = new PrismaClient();

    router.post('/login', async (req, res) => {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(400).json({ error: 'Invalid credentials.' });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(400).json({ error: 'Invalid credentials.' });

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
      );

      res.json({ token, role: user.role });
    });

    export default router;

### 4.5 Student Routes (`src/routes/student.ts`)

    import { Router } from 'express';
    import { authenticate, authorize } from '../middleware/auth';
    import { PrismaClient } from '@prisma/client';

    const router = Router();
    const prisma = new PrismaClient();

    router.get('/results', authenticate, authorize(['STUDENT']), async (req, res) => {
      const userId = (req as any).user.userId;
      const student = await prisma.student.findUnique({
        where: { userId },
        include: { results: true }
      });
      res.json(student?.results || []);
    });

    router.get('/attendance', authenticate, authorize(['STUDENT']), async (req, res) => {
      const userId = (req as any).user.userId;
      const student = await prisma.student.findUnique({
        where: { userId },
        include: { attendance: true }
      });
      res.json(student?.attendance || []);
    });

    export default router;

---

## Step 5: Running the Backend

### 5.1 Development Mode

Add to `package.json` scripts:

    "scripts": {
      "dev": "nodemon src/index.ts",
      "build": "tsc",
      "start": "node dist/index.js"
    }

Run in development:

    npm run dev

### 5.2 Production Build

    npm run build
    npm start

---

## Step 6: API Integration with Frontend

Update your Next.js frontend to communicate with the backend:

1. Create `lib/api.ts` in your Next.js project
2. Use `fetch` or `axios` to make authenticated requests
3. Store JWT tokens in `httpOnly` cookies or secure localStorage
4. Implement route guards for portal pages

Example API call:

    const response = await fetch('http://localhost:5000/api/student/results', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();

---

## Step 7: Deployment Checklist

Before deploying to production:

1. Change default JWT_SECRET to a cryptographically secure random string
2. Enable SSL/TLS on your server
3. Configure CORS to allow only your frontend domain
4. Set up automated database backups
5. Implement rate limiting on authentication endpoints
6. Use environment variables for all sensitive configuration
7. Set up logging with Winston or similar library

---

## Support

For technical support regarding the backend infrastructure, contact the ICT Department at Nosakhare Model Education Centre.
