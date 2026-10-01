Environment

## 1. Requirements

The project requires:
- Node.js
- npm
- Git
- Supabase project
- OpenAI API access

---

## 2. Installation

Clone the repository:
```bash
git clone <repository-url>
```

Enter the project:
```bash
cd kafu-frontend
```

Install dependencies:
```bash
npm install
```

or, preferably when `package-lock.json` is available:
```bash
npm ci
```

---

## 3. Environment Variables

The application uses environment variables for external services. 
Typical configuration includes Supabase and OpenAI credentials.

Example:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
OPENAI_API_KEY=...
OPENAI_MODEL=...
```

> **Note:** The exact environment variable names must match the code.

---

## 4. Secrets

**Never commit:**
- `.env.local`
- `.env`
- API keys
- Supabase service-role keys
- OpenAI secret keys

...to Git.

---

## 5. Development

Run:
```bash
npm run dev
```

The application will start in development mode.

---

## 6. Production Build

Run:
```bash
npm run build
```

A successful build confirms that:
- TypeScript compiles
- Next.js can compile the application
- Routes can be generated
- Build-time imports are valid

---

## 7. Production Start

After a successful build:
```bash
npm start
```

---

## 8. Linting

Run:
```bash
npm run lint
```

> **Note:** Linting should be completed before handing the application to another testing team.