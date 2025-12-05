<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

A full-featured **Movie Catalog REST API** built as a personal project to improve skills in NestJS and MongoDB. This application provides a complete backend system for managing movies, user authentication, and movie reviews with data seeded from The Movie Database (TMDB) API.

### 🎯 Project Goals
- Learn and implement NestJS best practices
- Master MongoDB with Mongoose ODM
- Understand JWT authentication and authorization
- Practice building RESTful APIs with proper architecture
- Implement real-world features like pagination, filtering, and search

### ✨ Key Features

#### 🎬 Movie Management
- Browse movies with pagination, search, and filtering by genre
- Sort by title, rating, or release date
- View detailed movie information with reviews
- Admin-only movie creation, updates, and deletion
- Auto-populate database with popular movies from TMDB API

#### 👤 User Authentication & Authorization
- JWT-based authentication with secure password hashing (bcrypt)
- User registration and login
- Role-based access control (Admin/User roles)
- Protected routes with authentication guards

#### ⭐ Review System
- Users can leave reviews for movies (rating 1-5 + comment)
- One review per user per movie (enforced by compound index)
- Update and delete own reviews
- View reviews by movie or by user
- Admins can delete any review
- Reviews automatically populated when fetching movie details

#### 🔧 Additional Features
- TMDB API integration for automatic movie data seeding
- Flexible review inclusion (optional population for performance)
- Global validation with DTOs and class-validator
- Consistent error handling and response format
- CORS enabled for frontend integration
- Environment-based configuration

### 🛠️ Tech Stack

**Backend Framework:**
- **NestJS** - Progressive Node.js framework with TypeScript
- **TypeScript** - Type-safe development

**Database:**
- **MongoDB** - NoSQL document database
- **Mongoose** - Elegant MongoDB object modeling

**Authentication:**
- **JWT (JSON Web Tokens)** - Secure authentication
- **Passport.js** - Authentication middleware
- **bcrypt** - Password hashing

**Validation & Transformation:**
- **class-validator** - Decorator-based validation
- **class-transformer** - Object transformation

**External APIs:**
- **TMDB API** - The Movie Database for movie data
- **Axios** - HTTP client for API requests

**Development Tools:**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework

### 📁 Project Structure
```
src/
├── auth/              # Authentication & authorization
│   ├── guards/        # JWT & roles guards
│   ├── decorators/    # Custom decorators (@CurrentUser, @Roles)
│   └── strategies/    # Passport JWT strategy
├── users/             # User management
├── movies/            # Movie CRUD operations
│   ├── seeder/        # TMDB data seeding
│   └── tmdb.service/  # TMDB API integration
├── reviews/           # Review system
└── database/          # Database configurations
```

### 🚀 API Endpoints

**Authentication:**
- `POST /auth/register` - Create new user account
- `POST /auth/login` - Login and get JWT token

**Movies:**
- `GET /movies` - Browse movies (pagination, search, filter, sort)
- `GET /movies/:id` - Get movie details with reviews
- `POST /movies` - Create movie (admin only)
- `PATCH /movies/:id` - Update movie (admin only)
- `DELETE /movies/:id` - Delete movie (admin only)

**Reviews:**
- `POST /reviews` - Create review (authenticated users)
- `GET /reviews` - Get all reviews (optional movieId filter)
- `GET /reviews/my-reviews` - Get current user's reviews
- `GET /reviews/:id` - Get specific review
- `PATCH /reviews/:id` - Update own review
- `DELETE /reviews/:id` - Delete own review (or admin deletes any)

### 🌱 Database Seeding
```bash
# Seed 5 pages of popular movies from TMDB
npm run seed

# Clear all movies
npm run seed:clear

# Clear and reseed
npm run seed:reseed
```

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```