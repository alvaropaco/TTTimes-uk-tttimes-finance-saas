# Clerk OAuth Redirect Troubleshooting Guide

## 🚨 **Common Issue: Clerk OAuth Redirect Not Working**

If you're being redirected to Clerk OAuth but can't return to your project after authentication, follow this comprehensive troubleshooting guide.

## ✅ **Step 1: Verify Environment Variables**

### Required Environment Variables in `.env` file:
```bash
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Redirect URLs
CLERK_SIGN_IN_URL=/sign-in
CLERK_SIGN_UP_URL=/sign-up
CLERK_AFTER_SIGN_IN_URL=/dashboard
CLERK_AFTER_SIGN_UP_URL=/dashboard

# Public redirect URLs (for client-side)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## ✅ **Step 2: Check Clerk Dashboard Settings**

### 1. **Allowed Redirect URLs**
In your Clerk Dashboard → Settings → Paths:
- **Sign-in URL**: `/sign-in`
- **Sign-up URL**: `/sign-up`
- **After sign-in URL**: `/dashboard`
- **After sign-up URL**: `/dashboard`

### 2. **Allowed Origins**
In your Clerk Dashboard → Settings → Domains:
- Add `http://localhost:3000` for development
- Add your production domain for production

### 3. **OAuth Settings**
In your Clerk Dashboard → User & Authentication → Social Connections:
- Ensure your OAuth providers are properly configured
- Check redirect URIs match your domain

## ✅ **Step 3: Verify Webhook Configuration**

### 1. **Webhook Endpoint**
- URL: `http://localhost:3000/api/webhooks/clerk` (development)
- URL: `https://yourdomain.com/api/webhooks/clerk` (production)

### 2. **Webhook Events**
Enable these events in Clerk Dashboard:
- `user.created`
- `user.updated`
- `session.created`

### 3. **Get Webhook Secret**
1. Go to Clerk Dashboard → Webhooks
2. Copy the webhook signing secret
3. Add it to your `.env` file as `CLERK_WEBHOOK_SECRET`

## ✅ **Step 4: Check Middleware Configuration**

Ensure your `middleware.ts` includes all necessary public routes:
```typescript
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/signin(.*)',
  '/signup(.*)',
  '/api/webhooks/clerk',
  '/api/health'
])
```

## ✅ **Step 5: Restart Development Server**

After making changes to environment variables:
```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## ✅ **Step 6: Test Authentication Flow**

### 1. **Clear Browser Data**
- Clear cookies and local storage
- Try incognito/private browsing mode

### 2. **Test Sign-in Flow**
1. Go to `http://localhost:3000/sign-in`
2. Click on OAuth provider (Google, GitHub, etc.)
3. Complete authentication
4. Should redirect back to `/dashboard`

### 3. **Check Browser Console**
- Open Developer Tools → Console
- Look for any JavaScript errors
- Check Network tab for failed requests

## 🔧 **Common Solutions**

### **Issue 1: "Invalid redirect URL"**
**Solution**: Ensure the redirect URL in Clerk Dashboard exactly matches your app's URL structure.

### **Issue 2: "Webhook verification failed"**
**Solution**: 
1. Verify `CLERK_WEBHOOK_SECRET` is correct
2. Check webhook endpoint is accessible
3. Ensure webhook URL uses HTTPS in production

### **Issue 3: "Authentication loop"**
**Solution**:
1. Clear browser cookies
2. Check middleware configuration
3. Verify environment variables are loaded correctly

### **Issue 4: "Cannot read properties of undefined"**
**Solution**:
1. Restart development server
2. Check all required environment variables are set
3. Verify Clerk components are properly imported

## 🐛 **Debug Mode**

Enable debug logging by adding to your `.env`:
```bash
NODE_ENV=development
```

This will show middleware logs in your console to help identify routing issues.

## 📞 **Still Having Issues?**

### Check These Files:
1. `middleware.ts` - Routing configuration
2. `app/layout.tsx` - ClerkProvider setup
3. `app/sign-in/page.tsx` - Sign-in component
4. `app/api/webhooks/clerk/route.ts` - Webhook handler

### Verify Network Requests:
1. Open Browser DevTools → Network
2. Look for failed requests to Clerk APIs
3. Check for CORS errors
4. Verify webhook calls are successful

### Test Webhook Manually:
```bash
curl -X POST http://localhost:3000/api/webhooks/clerk \
  -H "Content-Type: application/json" \
  -d '{"test": "webhook"}'
```

## 🎯 **Quick Fix Checklist**

- [ ] All environment variables are set correctly
- [ ] Clerk Dashboard URLs match your app routes
- [ ] Webhook secret is configured
- [ ] Development server has been restarted
- [ ] Browser cache/cookies cleared
- [ ] Middleware includes all public routes
- [ ] No JavaScript errors in console
- [ ] Network requests are successful

---

**Note**: Most Clerk OAuth issues are caused by mismatched URLs between your Clerk Dashboard configuration and your application routes. Double-check these first!