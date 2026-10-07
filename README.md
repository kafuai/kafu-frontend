# KAFU AI Overview

KAFU AI is a web-based enterprise AI platform built with Next.js, Supabase, and OpenAI. 
The platform provides organization-specific AI capabilities based on company data, onboarding information, policies, and employee requests.

## 1. Core Focus Areas

The current application focuses on:
- Organization onboarding
- Assessment
- Discovery
- Corporate Brain
- Digital Workforce
- Employee Experience
- Role-Based Access Control (RBAC)
- Organization and user administration
- Grounded AI responses
- HR / employee request management

---

## 2. Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js** | Frontend framework and server-side application |
| **React** | UI components |
| **TypeScript** | Type safety |
| **Supabase** | Authentication, database and backend services |
| **OpenAI** | AI response generation |
| **Tailwind CSS** | Styling |
| **ESLint** | Code quality |
| **Turbopack** | Next.js development/build tooling |

---

## 3. High-Level Architecture

```text
                        ┌─────────────────────┐
                        │       User          │
                        └──────────┬──────────┘
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │      Next.js        │
                        │      Frontend       │
                        └──────────┬──────────┘
                                   │
                 ┌─────────────────┼─────────────────┐
                 │                 │                 │
                 ▼                 ▼                 ▼
          ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
          │    Proxy    │   │ API Routes  │   │   UI Pages  │
          │ Auth / RBAC │   │ Application │   │             │
          └──────┬──────┘   └──────┬──────┘   └─────────────┘
                 │                 │
                 └────────┬────────┘
                          ▼
                   ┌──────────────┐
                   │   Supabase   │
                   │ Auth + DB    │
                   └──────┬───────┘
                          │
                          ▼
                   ┌──────────────┐
                   │ Organization │
                   │    Data      │
                   └──────┬───────┘
                          │
                          ▼
                   ┌──────────────┐
                   │ OpenAI / AI  │
                   │ Grounded AI  │
                   └──────────────┘
```

---

## 4. Main Application Flow

The intended user flow is:

```text
       Login
         │
         ▼
  Authentication
         │
         ▼
Organization / Membership
         │
         ▼
     Assessment
         │
         ▼
      Discovery
         │
         ▼
     Application
         │
         ├── Corporate Brain
         │
         ├── Digital Workforce
         │
         └── Employee Experience
```

> **Note:** Access to application areas is controlled through authentication, onboarding state, and RBAC.

---

## 5. Main Project Structure

```text
kafu-frontend/
│
├── app/
│   ├── admin/
│   ├── assessment/
│   ├── corporate-brain/
│   ├── discovery/
│   ├── digital-workforce/
│   ├── employee-experience/
│   ├── login/
│   └── api/
│
├── components/
├── features/
├── lib/
├── proxy.ts
├── public/
├── supabase/
├── docs/
├── package.json
└── README.md
```