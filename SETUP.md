# SaaS Starter Template Setup Guide

Complete setup instructions for the SaaS Starter Template.

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd saas-starter-template
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.sample .env.local
   # Edit .env.local with your MongoDB connection
   ```

3. **Setup Database**
   ```bash
   npm run init-db
   npm run seed-db
   ```

4. **Start Application**
   ```bash
   npm run dev
   ```

## Database Setup Options

### Option 1: Local MongoDB (Development)

**Install MongoDB:**
```bash
# macOS
brew install mongodb/brew/mongodb-community

# Ubuntu/Debian
sudo apt update
sudo apt install mongodb

# Windows
# Download from: https://www.mongodb.com/try/download/community
```

**Start MongoDB:**
```bash
# macOS
brew services start mongodb/brew/mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod
sudo systemctl enable mongod

# Windows
# MongoDB starts automatically after installation
```

**Configure Environment:**
```bash
# In .env.local
MONGODB_URI=mongodb://localhost:27017/saas-starter
```

### Option 2: MongoDB Atlas (Cloud - Recommended)

**Create Account:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Sign up for free account
3. Create a new cluster (free tier available)

**Setup Database:**
1. Create database user with read/write permissions
2. Add your IP address to IP Access List (or use 0.0.0.0/0 for development)
3. Get connection string from "Connect" button

**Configure Environment:**
```bash
# In .env.local
MONGODB_URI=mongodb+srv://username:password@cluster0.abcdef.mongodb.net/saas-starter
```

### Option 3: Docker MongoDB

**Run MongoDB in Docker:**
```bash
docker run -d \
  --name saas-mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:latest
```

**Configure Environment:**
```bash
# In .env.local
MONGODB_URI=mongodb://admin:password@localhost:27017/saas-starter?authSource=admin
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/saas-starter` |

### Optional Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `MONGODB_DB_NAME` | Database name | `saas-starter` | `my_saas_db` |
| `NODE_ENV` | Environment mode | `development` | `production` |

### Stripe Variables (for payments)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_live_...` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_...` |
| `NEXT_PUBLIC_APP_URL` | Your app URL | `https://your-domain.com` |

## Database Initialization

### Create Indexes and Collections
```bash
npm run init-db
```

This creates:
- `users` collection with indexes on email and token
- `api_usage` collection with indexes for analytics
- `subscriptions` collection for Stripe subscriptions

### Seed Sample Data
```bash
npm run seed-db
```

This creates:
- Sample users with API tokens
- Sample API usage data for analytics
- Demo accounts for testing

### Reset Database (if needed)
```bash
npm run reset-db
```

## Testing Your Setup

### Command Line Test
```bash
npm run test-connection
```

### Web Interface Test
Visit: `http://localhost:3000/test`

### API Health Check
```bash
curl http://localhost:3000/api/health
```

### Manual API Test
```bash
# Get a token by signing up
curl -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'

# Use the token to test API
curl "http://localhost:3000/api/example?token=YOUR_TOKEN"
```

## Stripe Setup (Optional)

### 1. Create Stripe Account
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Create account or sign in
3. Get your API keys from Developers → API keys

### 2. Create Products and Prices
1. Go to Products in Stripe Dashboard
2. Create your subscription plans:
   - Professional Plan ($29/month)
   - Enterprise Plan ($99/month)
3. Copy the Price IDs

### 3. Configure Webhooks
1. Go to Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

### 4. Update Environment Variables
```bash
# Add to .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 5. Update Price IDs
Edit `lib/stripe-config.ts` with your actual Price IDs from Stripe.

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy!

3. **Environment Variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add all required variables:
     - `MONGODB_URI`
     - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (if using Stripe)
     - `STRIPE_SECRET_KEY` (if using Stripe)
     - `STRIPE_WEBHOOK_SECRET` (if using Stripe)
     - `NEXT_PUBLIC_APP_URL`

### Other Platforms

**Railway:**
- Connect GitHub repository
- Add environment variables
- Deploy automatically

**Netlify:**
- Connect GitHub repository  
- Add environment variables in site settings
- Deploy

**DigitalOcean App Platform:**
- Connect GitHub repository
- Configure environment variables
- Deploy

## Customization

### 1. Update Branding
- Edit `app/page.tsx` for landing page
- Update `app/layout.tsx` for metadata
- Modify `public/` assets

### 2. Replace Example API
- Delete `app/api/example/` routes
- Create your own API routes
- Update documentation

### 3. Customize UI
- Edit components in `components/`
- Update styles in `styles/`
- Modify Tailwind config

### 4. Add Features
- Create new pages in `app/`
- Add new API routes
- Update database models

## Troubleshooting

### Common Issues

**MongoDB Connection Failed:**
- Check your connection string
- Verify network access (Atlas IP whitelist)
- Ensure MongoDB is running (local)

**Stripe Webhook Errors:**
- Verify webhook URL is correct
- Check webhook secret matches
- Ensure HTTPS in production

**Build Errors:**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`

### Getting Help

- Check the [documentation](https://your-domain.com/docs)
- Review error logs in console
- Check environment variables
- Verify database connection

## Security Checklist

### Development
- [ ] Use environment variables for secrets
- [ ] Never commit `.env.local` to git
- [ ] Use HTTPS in production
- [ ] Validate all API inputs

### Production
- [ ] Use production Stripe keys
- [ ] Set up proper CORS
- [ ] Enable rate limiting
- [ ] Monitor API usage
- [ ] Set up error tracking

## Performance Optimization

### Database
- [ ] Add proper indexes
- [ ] Use connection pooling
- [ ] Monitor query performance

### API
- [ ] Implement caching
- [ ] Add rate limiting
- [ ] Use CDN for static assets

### Frontend
- [ ] Optimize images
- [ ] Enable compression
- [ ] Use lazy loading

---

**Ready to launch your SaaS?** Follow this guide step by step and you'll have a production-ready application!
