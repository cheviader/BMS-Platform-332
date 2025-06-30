# BoostMy.Site - Business Management Platform

A comprehensive business management application built with React, Supabase, and Tailwind CSS.

## Features

### 🔐 Authentication
- Email/Password sign up and sign in  
- Google OAuth integration
- Password reset functionality
- Secure session management
- **Demo Admin Login** - Use `admin@blueprintmanager.com` / `admin123`

### 📋 Core Management
- **Blueprints**: Marketing blueprint management
- **SOPs**: Standard Operating Procedures  
- **Tools**: Business tool management with pricing
- **Clients**: Customer relationship management
- **Pricing**: Service pricing and packages

### 🎨 Design
- Modern, responsive UI with Tailwind CSS
- Smooth animations with Framer Motion
- Professional gradient color scheme
- Mobile-friendly interface
- Custom BoostMy.Site branding

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Supabase account (optional for demo)

### Quick Demo
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Use demo credentials:
   - **Email:** `admin@blueprintmanager.com`
   - **Password:** `admin123`

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd boostmysite-business-manager
```

2. Install dependencies
```bash
npm install
```

3. Set up Supabase (Optional)
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Update `src/lib/supabase.js` with your credentials, or
   - Create a `.env` file based on `.env.example`

4. Configure Google OAuth (optional)
   - Go to your Supabase project dashboard
   - Navigate to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials

5. Start the development server
```bash
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Demo Mode

The application includes a fully functional demo mode:
- **No Supabase setup required**
- **Demo admin account** with full access
- **Mock data** for testing features
- **Production-ready code** for easy deployment

### Demo Credentials
- **Email:** `admin@blueprintmanager.com`
- **Password:** `admin123`

## Database Schema

The application uses the following main tables:
- `blueprints` - Marketing blueprints
- `sops` - Standard Operating Procedures
- `tools` - Business tools and software
- `clients` - Customer information
- `pricing_plans` - Service pricing

## Authentication Setup

### Google OAuth Configuration
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-project-id.supabase.co/auth/v1/callback`
6. Copy Client ID and Secret to Supabase

### Supabase Auth Configuration
1. In Supabase Dashboard > Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth Client ID and Secret
4. Configure redirect URLs

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### Deploy to Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

## Branding

The application features custom BoostMy.Site branding:
- **Logo**: Integrated BoostMy.Site logo throughout the application
- **Colors**: Professional gradient color scheme
- **Typography**: Clean, modern Inter font family
- **Responsive**: Looks great on all devices

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.