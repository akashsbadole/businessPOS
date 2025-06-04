# 🚀 POS System Deployment Guide

## **📋 Overview**
This guide covers deploying the POS system to various hosting platforms including Vercel, Netlify, and GitHub Pages.

## **🔧 Prerequisites**
- Node.js 18+ installed
- Git repository on GitHub
- Account on your chosen hosting platform

## **🌐 Deployment Options**

### **1. Vercel Deployment**

#### **Quick Deploy**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/akashsbadole/businessPOS)

#### **Manual Setup**
1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

#### **Environment Variables for Vercel**
Set these in your Vercel dashboard:
```env
VITE_TURSO_DATABASE_URL=your_turso_url
VITE_TURSO_AUTH_TOKEN=your_turso_token
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

### **2. Netlify Deployment**

#### **Quick Deploy**
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/akashsbadole/businessPOS)

#### **Manual Setup**
1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Build and Deploy**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

#### **Environment Variables for Netlify**
Set these in your Netlify dashboard:
```env
VITE_TURSO_DATABASE_URL=your_turso_url
VITE_TURSO_AUTH_TOKEN=your_turso_token
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

### **3. GitHub Pages Deployment**

#### **Automatic Deployment**
The repository includes GitHub Actions workflow that automatically deploys to GitHub Pages on push to main branch.

#### **Manual Setup**
1. **Enable GitHub Pages**
   - Go to repository Settings > Pages
   - Select "GitHub Actions" as source

2. **Push to Main Branch**
   ```bash
   git push origin main
   ```

## **🎤 Voice Search Setup**

### **Requirements**
- HTTPS connection (required for microphone access)
- Modern browser (Chrome, Edge, Safari)
- Microphone permissions granted

### **Supported Commands**
```
✅ ADD Commands (Recommended):
• "Add milk" → Adds 1 milk to cart
• "Add 2 milk" → Adds 2 milk to cart
• "Add biscuits" → Adds 1 biscuit to cart

✅ Simple Commands:
• "Milk" → Adds 1 milk to cart
• "2 milk" → Adds 2 milk to cart
• "Chawal" → Adds 1 rice to cart (Hindi)

✅ Hindi Support:
• chawal (rice), doodh (milk), cheeni (sugar)
• tel (oil), chai (tea), namak (salt)
```

### **Troubleshooting Voice Search**
1. **Network Error**: Ensure HTTPS connection
2. **Microphone Access**: Grant permissions in browser
3. **No Speech Detected**: Speak clearly and try again
4. **Fallback**: Use manual search if voice fails

## **🔐 Environment Variables**

### **Required Variables**
```env
# Database (Turso)
VITE_TURSO_DATABASE_URL=libsql://your-database.turso.io
VITE_TURSO_AUTH_TOKEN=your_auth_token

# Authentication (Clerk)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key

# Optional: Analytics
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

### **Setting Up Environment Variables**

#### **Vercel**
```bash
vercel env add VITE_TURSO_DATABASE_URL
vercel env add VITE_TURSO_AUTH_TOKEN
vercel env add VITE_CLERK_PUBLISHABLE_KEY
```

#### **Netlify**
```bash
netlify env:set VITE_TURSO_DATABASE_URL "your_value"
netlify env:set VITE_TURSO_AUTH_TOKEN "your_value"
netlify env:set VITE_CLERK_PUBLISHABLE_KEY "your_value"
```

## **🛠️ Build Configuration**

### **Vite Config**
The project uses Vite with optimized build settings:
```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
})
```

### **Package.json Scripts**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest"
  }
}
```

## **📊 Performance Optimization**

### **Build Optimizations**
- Tree shaking enabled
- Code splitting for routes
- Lazy loading for components
- Optimized bundle size

### **Runtime Optimizations**
- Service worker for offline support
- Local storage for data persistence
- Efficient state management with Zustand

## **🔍 Monitoring & Analytics**

### **Error Tracking**
- Console logging for development
- Error boundaries for production
- Network status monitoring

### **Performance Monitoring**
- Bundle analyzer reports
- Lighthouse CI integration
- Core Web Vitals tracking

## **🚨 Troubleshooting**

### **Common Issues**
1. **Build Failures**: Check Node.js version (18+)
2. **Environment Variables**: Ensure all required vars are set
3. **HTTPS Required**: Voice features need secure connection
4. **Database Connection**: Verify Turso credentials

### **Support**
- Check GitHub Issues
- Review deployment logs
- Test locally first: `npm run dev`

## **📝 Deployment Checklist**
- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] Database connected
- [ ] Voice search tested
- [ ] Build successful
- [ ] Performance optimized
- [ ] Error monitoring setup
