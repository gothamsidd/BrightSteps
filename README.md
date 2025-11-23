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

* Resume analysis & suggestions
* Skill gap evaluation
* Personalized career roadmaps
* AI-generated cover letters
* Interview preparation tools
* Context-aware recommendations

### 📊 User Dashboard

* Track goals and progress
* Revisit past analyses
* Manage resumes, cover letters, interview results, and insights
* Simple, focused UI for seamless workflows

### 🧱 Built With

* **Next.js 15 (App Router)** — UI, routing & backend routes
* **Prisma ORM** — database models & migrations
* **JWT + Custom Middleware** — authentication
* **TailwindCSS** — responsive UI styling
* **Google Gemini AI** — intelligent career analysis
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
```

* `actions/` — server actions for AI features
* `app/api/` — backend API routes
* `app/(auth)/` — login, register screens
* `app/(main)/` — dashboard, resume tools, interview prep
* `prisma/` — schema + migrations
* `hooks/` — custom React hooks
* `components/` — reusable UI blocks

---

## 🔑 Authentication Overview

The authentication system was implemented manually, with no external frameworks:

* User registration with hashed passwords
* Login issuing JWT access tokens
* Middleware validating protected requests
* Secure HTTP-only cookies
* Logout clearing token sessions
* Error handling for invalid credentials / expired tokens

This ensures maximum control, transparency, and security.

---

## 📦 Installation & Setup

Clone the repo:

```bash
git clone https://github.com/gothamsidd/BrightSteps.git
cd BrightSteps
```

Install dependencies:

```bash
npm install
```

Create your environment variables:

```
DATABASE_URL="your_database_url"
JWT_SECRET="your_jwt_secret"
GEMINI_API_KEY="your_gemini_api_key"
```

Run Prisma migrations:

```bash
npx prisma db push
```

Start the development server:

```bash
npm run dev
```

---

## 📘 Usage

1. Register or log in
2. Upload your resume or enter your career goals
3. Receive AI-powered insights and suggestions
4. Track your growth through dashboards and saved results
5. Use tools like cover letter generation & interview prep

---

## 🛠️ Roadmap

* Advanced interview simulations
* Career timeline visualization
* Team / mentor collaboration features
* Mobile app version
* Full onboarding flow with deeper personalization

---

## 🤝 Contributing

BrightSteps is continually evolving. Suggestions and contributions are welcome through issues and pull requests.

---

## 📄 License

MIT License
