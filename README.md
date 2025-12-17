# BrightSteps

BrightSteps is an AI-powered career development platform designed to give users clear, actionable guidance on their professional journey. It combines intelligent resume insights, skill analysis, personalized recommendations, and a secure, modern authentication system — all built from the ground up.

This project reflects a complete end-to-end implementation using Next.js, Prisma, custom JWT auth, and LLM-based analysis tools.

---

## 🚀 Features

### 🔐 Custom Authentication

BrightSteps uses a fully custom-built JWT authentication system with:

* Access & refresh tokens
* Secure password hashing
* Middleware-protected routes
* Automatic token refresh
* Session-based user security

### 🤖 AI-Driven Career Coaching

* Resume analysis & suggestions with AI-powered improvements
* Skill gap evaluation
* Personalized career roadmaps
* AI-generated cover letters
* Interview preparation tools with practice quizzes
* Context-aware recommendations
* AI-powered resume entry enhancement

### 📅 Calendar & Task Management

* Interactive calendar view with monthly navigation
* Create and manage calendar events (interviews, deadlines, meetings)
* Color-coded event types for easy identification
* To-do list with priority levels and categories
* Filter tasks by status (All, Active, Completed)
* Due date tracking and reminders

### 📊 User Dashboard

* Industry insights with real-time market data
* Salary range visualizations by role
* Industry growth rates and demand levels
* Key trends and recommended skills
* Track goals and progress
* Revisit past analyses
* Manage resumes, cover letters, interview results, and insights
* Simple, focused UI for seamless workflows

### 📧 Email & Password Management
* Secure Forgot Password flow
* Email notifications via **Resend**
* Password reset tokens with expiration

### 🧱 Built With

* **Next.js 15 (App Router)** — UI, routing & backend routes
* **Prisma ORM** — database models & migrations
* **JWT + Custom Middleware** — authentication
* **TailwindCSS** — responsive UI styling
* **Google Gemini AI** — intelligent career analysis
* **Resend** — email infrastructure
* **React 19** — clean, reusable client components

---

## 🏗️ Project Structure

```
BrightSteps/
  app/
    (auth)/
    (main)/
    api/
    lib/
  components/
  actions/
  prisma/
  public/
  hooks/
  scripts/
```

* `actions/` — server actions for AI features
* `app/api/` — backend API routes
* `app/(auth)/` — login, register, forgot-password screens
* `app/(main)/` — dashboard, resume tools, interview prep, calendar & tasks
* `prisma/` — schema + migrations
* `hooks/` — custom React hooks
* `components/` — reusable UI blocks
* `scripts/` — utility scripts for testing and verification

---

## 🔑 Authentication Overview

The authentication system was implemented manually, with no external frameworks:

* User registration with hashed passwords
* Login issuing JWT access tokens
* Middleware validating protected requests
* Secure HTTP-only cookies
* Logout clearing token sessions
* Forgot Password flow with email verification
* Error handling for invalid credentials / expired tokens

This ensures maximum control, transparency, and security.

---

## 📦 Installation & Setup

### Prerequisites

* Node.js 18+ and npm
* PostgreSQL database (or use a service like Neon, Supabase, or Railway)
* Google Gemini API key (for AI features)
* Resend API key (for email functionality)

### Setup Steps

1. **Clone the repository:**

```bash
git clone https://github.com/gothamsidd/BrightSteps.git
cd BrightSteps
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-min-32-characters"

# AI Services
GEMINI_API_KEY="your-google-gemini-api-key"

# Email Service (Resend)
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM_EMAIL="onboarding@resend.dev" # Or your verified domain email

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000" # Update to your production URL
```

4. **Set up the database:**

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push
```

5. **Start the development server:**

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

---

## 📘 Usage

1. Register or log in
2. Complete onboarding to set your industry and profile
3. Build your resume with AI-powered improvements
4. Generate personalized cover letters
5. Practice interview questions with industry-specific quizzes
6. Track events and tasks in the calendar
7. View industry insights and salary data on your dashboard
8. Monitor your career growth through saved results and analytics

---

## 🛠️ Roadmap

### Upcoming Features

* **Job Application Tracker** - Track applications, interviews, and offers
* **Resume ATS Score** - Real-time ATS optimization scoring
* **Skill Gap Analysis** - Identify and bridge skill gaps with learning paths
* **Video Interview Simulations** - Practice with AI-powered video interviews
* **Career Roadmap Builder** - Visual career progression planning
* **Salary Negotiation Assistant** - Get negotiation tips and scripts
* **Portfolio Showcase** - Create and share your project portfolio
* **Mobile App** - Native iOS and Android applications
* **Social Features** - Community, mentorship, and peer feedback

### Recent Updates

* ✅ Calendar & Task Management system
* ✅ Enhanced Resume Builder with project links
* ✅ Improved Education and Project entry forms
* ✅ Quiz improvements (explanations shown after completion)
* ✅ Better navigation structure

---

## 🐛 Troubleshooting

### Common Issues

**Database Connection Errors:**
- Ensure your `DATABASE_URL` is correct and the database is accessible
- Check if your database provider requires SSL connections

**Authentication Issues:**
- Verify `JWT_SECRET` is set and is at least 32 characters long
- Clear browser cookies and try logging in again

**AI Features Not Working:**
- Check that `GEMINI_API_KEY` is valid and has sufficient quota
- Ensure the API key has not been revoked

**Email Not Sending:**
- Verify `RESEND_API_KEY` is correct
- Check that `RESEND_FROM_EMAIL` is verified in your Resend account

---

## 🤝 Contributing

BrightSteps is continually evolving. Suggestions and contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 👤 Author

**gothamsidd**

* GitHub: [@gothamsidd](https://github.com/gothamsidd)

---

## 🙏 Acknowledgments

* Built with [Next.js](https://nextjs.org/)
* UI components from [Radix UI](https://www.radix-ui.com/)
* Icons from [Lucide](https://lucide.dev/)
* AI powered by [Google Gemini](https://ai.google.dev/)
