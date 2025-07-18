# SaaS Starter Template

A comprehensive Next.js SaaS template with authentication, payments, dashboard, and API infrastructure. Everything you need to launch your SaaS product quickly.

## Features

- 🔐 Complete authentication system
- 💳 Stripe payments & subscriptions
- 📊 User dashboard & analytics
- 🚀 RESTful API infrastructure
- 🔒 Token-based API authentication
- 🌐 CORS & rate limiting
- 📚 Complete documentation
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design

## Quick Start

### 1. Installation

\`\`\`bash
git clone <repository-url>
cd saas-starter-template
npm install
\`\`\`

### 2. Environment Setup

Create a `.env.local` file in the root directory:

\`\`\`bash
# Required: Your MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/saas-starter

# Optional: Database name (defaults to 'saas-starter')
MONGODB_DB_NAME=saas-starter

# Optional: Set to production when deploying
NODE_ENV=development
\`\`\`

**That's it!** You only need the `MONGODB_URI`. No other environment variables are required for basic functionality.

### 3. Database Setup

Initialize the database:

\`\`\`bash
npm run init-db
\`\`\`

### 4. Database Seeding

Seed with sample data for testing:

\`\`\`bash
npm run seed-db
\`\`\`

### 5. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the application.

## Environment Variables Explained

### Required Variables

- **`MONGODB_URI`** - Your MongoDB connection string
  - Local: `mongodb://localhost:27017/saas-starter`
  - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/saas-starter`

### Optional Variables

- **`MONGODB_DB_NAME`** - Database name (defaults to 'saas-starter')
- **`NODE_ENV`** - Environment mode (development/production)

### Not Needed for Basic Setup

- ❌ `DATABASE_URL` - Now using MONGODB_URI instead
- ❌ PostgreSQL dependencies - Now using MongoDB
- ❌ External API keys - Everything is built-in

## Stripe Subscription Setup

### 1. Stripe Account Configuration

1. **Create Products and Prices in Stripe Dashboard:**
   \`\`\`bash
   # Professional Plan
   Product Name: "Professional Plan"
   Price ID: price_1OQJ9wElA2mt6LK8professional (create this in Stripe)
   Amount: $29.00 USD/month
   
   # Enterprise Plan  
   Product Name: "Enterprise Plan"
   Price ID: price_1OQJ9wElA2mt6LK8enterprise (create this in Stripe)
   Amount: $99.00 USD/month
   \`\`\`

2. **Update Price IDs in configuration:**
   \`\`\`typescript
   // In lib/stripe-config.ts
   plans: {
     professional: {
       priceId: 'price_YOUR_ACTUAL_PROFESSIONAL_PRICE_ID',
       name: 'Professional Plan',
       price: 2900,
     },
     enterprise: {
       priceId: 'price_YOUR_ACTUAL_ENTERPRISE_PRICE_ID', 
       name: 'Enterprise Plan',
       price: 9900,
     },
   }
   \`\`\`

### 2. Webhook Configuration

1. **In Stripe Dashboard:**
   - Go to Developers → Webhooks
   - Add endpoint: `https://your-domain.com/api/stripe/webhook`
   - Select events:
     - `checkout.session.completed`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`

2. **Copy webhook signing secret to `.env.local`:**
   \`\`\`bash
   STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret
   \`\`\`

### 3. Environment Variables

Required for subscription functionality:

\`\`\`bash
# Stripe Keys (from Stripe Dashboard)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
STRIPE_SECRET_KEY=sk_live_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App URL (required for Stripe redirects)
NEXT_PUBLIC_APP_URL=https://your-domain.com
\`\`\`

### 4. Subscription Flow

1. **User selects plan** → `/pricing`
2. **Organization signup** → Creates user account
3. **Stripe Checkout** → Handles payment
4. **Webhook processes** → Activates subscription
5. **Dashboard access** → `/dashboard`

### 5. Testing Subscriptions

Use Stripe test mode:
\`\`\`bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
\`\`\`

Test cards:
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`

## Database Connection Examples

### Local MongoDB
\`\`\`bash
MONGODB_URI=mongodb://localhost:27017/saas-starter
\`\`\`

### MongoDB Atlas (Cloud)
\`\`\`bash
MONGODB_URI=mongodb+srv://username:password@cluster0.abcdef.mongodb.net/saas-starter
\`\`\`

### MongoDB with Authentication
\`\`\`bash
MONGODB_URI=mongodb://username:password@localhost:27017/saas-starter
\`\`\`

## Getting an API Token

1. Visit `http://localhost:3000/signup`
2. Create a free account with your email and name
3. Copy your unique API token
4. Use the token in your API requests

## API Endpoints

### Authentication
All endpoints require a `token` parameter:

\`\`\`bash
# Example API call
curl "https://your-domain.com/api/example?token=YOUR_TOKEN"
\`\`\`

### Example API Endpoints

#### Get Example Data
\`\`\`bash
GET /api/example?token=YOUR_TOKEN
\`\`\`

Response:
\`\`\`json
{
  "success": true,
  "data": {
    "message": "Hello from your SaaS API!",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "items": [
      {
        "id": 1,
        "name": "Sample Item 1",
        "description": "This is a sample item"
      }
    ]
  }
}
\`\`\`

#### Get Specific Item
\`\`\`bash
GET /api/example/1?token=YOUR_TOKEN
\`\`\`

Response:
\`\`\`json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Sample Item 1",
    "description": "This is a sample item",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
\`\`\`

#### Create New Item
\`\`\`bash
POST /api/example?token=YOUR_TOKEN
Content-Type: application/json

{
  "name": "New Item",
  "description": "Description of the new item"
}
\`\`\`

## Customization Guide

### 1. Replace Example API

The template includes example API endpoints at `/api/example`. Replace these with your actual business logic:

1. **Update API endpoints** in `app/api/example/`
2. **Modify data models** in `lib/models/`
3. **Update database schemas** as needed

### 2. Customize UI

1. **Update branding** in `app/page.tsx`
2. **Modify color scheme** in `tailwind.config.js`
3. **Update navigation** in components
4. **Customize dashboard** in `app/dashboard/`

### 3. Add Your Features

1. **Create new API routes** in `app/api/`
2. **Add new pages** in `app/`
3. **Create components** in `components/`
4. **Update database models** in `lib/`

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Payments**: Stripe
- **UI**: Tailwind CSS + Radix UI
- **Authentication**: Custom token-based system
- **Deployment**: Vercel-ready

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── docs/             # Documentation
│   └── page.tsx          # Landing page
├── components/            # React components
│   └── ui/               # UI components
├── lib/                  # Utilities and configurations
│   ├── models/           # Database models
│   └── utils/            # Helper functions
├── public/               # Static assets
└── styles/               # Global styles
\`\`\`

## Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy** - Vercel will handle the build automatically

### Environment Variables for Production

\`\`\`bash
# Database
MONGODB_URI=mongodb+srv://...

# Stripe (Production)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Optional
NODE_ENV=production
\`\`\`

## Support

- 📚 [Documentation](https://your-domain.com/docs)
- 💬 [Community Support](https://github.com/your-repo/discussions)
- 📧 [Email Support](mailto:support@your-domain.com)

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Ready to build your SaaS?** Start customizing this template to match your business needs!
