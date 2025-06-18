# E-Commerce Platform

A modern, full-stack e-commerce application built with Next.js 15, TypeScript, and MongoDB.

## 🚀 Live Demo

[Deploy to Vercel](https://vercel.com) - Add your deployment link here

##  Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: MongoDB with Mongoose
- **State Management**: Zustand, React Context API
- **Forms**: React Hook Form with Zod validation
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel

##  Features

### User Features
-  Authentication (Google OAuth + Email/Password)
-  Product browsing with filters and search
-  Shopping cart with persistent storage
-  User profile management
-  Order history and tracking
-  Checkout process

### Admin Features
-  Admin dashboard with analytics
-  Product management (CRUD operations)
-  User management
-  Order management
-  Contact form submissions
-  Category management

### Technical Features
-  Role-based access control
-  Responsive design
-  Server-side rendering (SSR)
-  Static site generation (SSG)
-  Comprehensive testing
- RESTful API endpoints

##  Project Structure

```
app/
├── api/                    # API routes
├── admin/                  # Admin panel pages
├── auth/                   # Authentication pages
├── dashboard/              # User dashboard
├── products/               # Product pages
├── profile/                # User profile
├── contact/                # Contact page
├── about/                  # About page
└── checkout/               # Checkout process

components/
├── admin/                  # Admin components
├── auth/                   # Authentication components
├── cart/                   # Shopping cart components
├── layout/                 # Layout components
├── products/               # Product components
├── ui/                     # Reusable UI components
└── providers/              # Context providers

lib/
├── models/                 # MongoDB models
├── database/               # Database operations
├── auth.ts                 # NextAuth configuration
├── store/                  # Zustand stores
└── utils.ts                # Utility functions
```

##  Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Albionii/E-Commerce
   cd e-commerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # NextAuth
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

##  Testing

Run the test suite:
```bash
npm test
# or
pnpm test
```

##  Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your Vercel dashboard:
- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

## Team Members

### Dren Syla - Full Stack Developer
- **Role**: Project Lead & Full Stack Development
- **Contributions**: 
  - NextAuth authentication system
  - Admin panel implementation
  - Product management system
  - Shopping cart functionality
  - API development
  - Database design and implementation

### Altin Asllani && Blend Elezi  - Frontend Developer
- **Role**: UI/UX Development
- **Contributions**:
  - Component library setup
  - Responsive design implementation
  - User interface development
  - Form validation

### Abdusamed Beqiri && Albion Qerreti - Backend Developer
- **Role**: Backend & Database
- **Contributions**:
  - MongoDB schema design
  - API route development
  - Database operations
  - Testing implementation

##  Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

##  License

This project is licensed under the MIT License.

##  Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful components
- [Vercel](https://vercel.com/) for hosting
- [MongoDB](https://www.mongodb.com/) for the database 