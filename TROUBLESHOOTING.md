# Zodii Troubleshooting Guide

## Common Issues and Solutions

### 1. "Network error. Please try again." during signup

This error typically indicates a database connection issue.

**Steps to diagnose:**

1. **Check database connection:**
   \`\`\`bash
   npm run verify-setup
   \`\`\`

2. **Test health endpoint:**
   \`\`\`bash
   curl http://localhost:3000/api/health
   \`\`\`

3. **Check environment variables:**
   \`\`\`bash
   echo $DATABASE_URL
   \`\`\`

**Common solutions:**

- **Missing DATABASE_URL:** Create \`.env.local\` file with your database URL
- **Database not running:** Start PostgreSQL service
- **Database doesn't exist:** Create the database: \`createdb zodii\`
- **Tables not created:** Run \`npm run init-db\`

### 2. Database Connection Issues

**Error:** \`ECONNREFUSED\` or connection timeout

**Solutions:**
1. Check if PostgreSQL is running: \`pg_ctl status\`
2. Verify connection string format: \`postgresql://user:password@host:port/database\`
3. Test manual connection: \`psql $DATABASE_URL\`

### 3. Table Does Not Exist

**Error:** \`relation "users" does not exist\`

**Solution:**
\`\`\`bash
npm run init-db
\`\`\`

### 4. User Already Exists

**Error:** \`User already exists\` during signup

**Solutions:**
- Use a different email address
- Check existing users in database
- Reset database: \`npm run reset-db\`

### 5. Invalid Token Errors

**Error:** \`Invalid or expired token\` when calling API

**Solutions:**
1. Verify token is correct (check for extra spaces)
2. Ensure token is included in request: \`?token=YOUR_TOKEN\`
3. Check if user is active in database

## Environment Setup

### Required Environment Variables

Create \`.env.local\` file with **only** this:

\`\`\`bash
# Database (Required)
DATABASE_URL=postgresql://username:password@localhost:5432/zodii
\`\`\`

**That's it!** No other environment variables are needed.

### What You DON'T Need

- ❌ \`NEXTAUTH_URL\` - Not used in Zodii
- ❌ \`NEXTAUTH_SECRET\` - Not used in Zodii  
- ❌ External API keys - Everything is built-in

### Database Setup Steps

1. **Install PostgreSQL** (if not installed)
2. **Create database:**
   \`\`\`bash
   createdb zodii
   \`\`\`
3. **Initialize tables:**
   \`\`\`bash
   npm run init-db
   \`\`\`
4. **Add sample data:**
   \`\`\`bash
   npm run seed-db
   \`\`\`

## Verification Commands

\`\`\`bash
# Verify complete setup
npm run verify-setup

# Check API health
curl http://localhost:3000/api/health

# Test signup endpoint
curl -X POST http://localhost:3000/api/signup \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Test User","email":"test@example.com"}'

# Test API with token
curl "http://localhost:3000/api/zodiac/signs?token=YOUR_TOKEN"
\`\`\`

## Getting Help

If you're still experiencing issues:

1. Run \`npm run verify-setup\` and share the output
2. Check browser developer console for detailed errors
3. Check server logs in terminal where \`npm run dev\` is running
4. Verify your \`.env.local\` file exists and has correct DATABASE_URL

## Development vs Production

### Development
- Uses local PostgreSQL
- Detailed error messages shown
- Hot reloading enabled

### Production  
- Uses production database (Neon, Supabase, etc.)
- Error messages are generic for security
- Optimized builds
