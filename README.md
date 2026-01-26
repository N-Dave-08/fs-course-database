# Full Stack Course: Database

Master PostgreSQL and Prisma for modern database development.

## Overview

This course teaches you database fundamentals, PostgreSQL, and Prisma ORM. You'll learn schema design, relationships, migrations, queries, and optimization.

## Prerequisites

- Node.js 22+ LTS
- pnpm package manager
- PostgreSQL 16+ (or Docker)
- Basic understanding of databases

## Course Structure

This course consists of **6 progressive levels**:

1. **Level 1: Database Fundamentals** - Introduction, relational concepts, SQL basics
2. **Level 2: Prisma Basics** - Prisma introduction, schema definition, basic models
3. **Level 3: Relationships** - One-to-one, one-to-many, many-to-many
4. **Level 4: Queries and Operations** - CRUD operations, filtering, sorting, aggregations
5. **Level 5: Migrations** - Migration concepts, creating migrations, strategies
6. **Level 6: Advanced Schema** - Indexes, constraints, optimization

## Getting Started

1. **Read the Setup Guide**: Start with [LEARNING-GUIDE.md](./LEARNING-GUIDE.md)
2. **Follow Setup Instructions**: Install Prisma and configure database
3. **Start Learning**: Begin with Level 1

## Tech Stack

- **PostgreSQL**: 16+ (database)
- **Prisma**: 7.3.0+ (ORM)
- **Node.js**: 22+ LTS

## Related Courses

- **fs-course-backend** - Use Prisma in Express.js APIs
- **fs-course-typescript** - TypeScript knowledge helpful (recommended)
- **fs-course-infrastructure** - Deploy PostgreSQL with RDS

## Cross-Repository Integration

This database course provides the data foundation for the full stack:

- **Used by**: `fs-course-backend` (Prisma schemas and queries)
- **Deployed with**: `fs-course-infrastructure` (RDS setup and migrations)
- **Tested with**: `fs-course-testing` (database testing strategies)

### Integration Points

1. **Backend Integration**:
   - Backend uses Prisma schemas from this course
   - Connection string: `DATABASE_URL` environment variable
   - Migrations run before backend deployment

2. **Infrastructure Integration**:
   - PostgreSQL deployed via RDS (Level 4)
   - Database migrations in CI/CD pipeline (Level 5)
   - Backup strategies for production (Level 6)

3. **Testing Integration**:
   - Test databases for integration tests
   - Database seeding for test data
   - Migration testing strategies

### Environment Variables

```env
# Database connection (used by backend)
DATABASE_URL=postgresql://user:password@localhost:5432/mydb

# Test database (used by testing course)
TEST_DATABASE_URL=postgresql://user:password@localhost:5432/testdb
```
