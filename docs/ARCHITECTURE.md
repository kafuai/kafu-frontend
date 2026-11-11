# System Overview

## 1. Application Architecture

KAFU AI uses a Next.js application architecture where frontend pages, server-side logic, and API routes exist within the same application. 
The main architectural layers are:

```text
Presentation Layer
        │
        ▼
Next.js Pages / Components
        │
        ▼
Application Layer
        │
        ├── Authentication
        ├── RBAC
        ├── Onboarding
        ├── AI
        └── Employee Experience
        │
        ▼
Data Layer
        │
        └── Supabase
```

---

## 2. Presentation Layer

The presentation layer is implemented through:
- `app/`
- `components/`
- `features/`

Pages are responsible for rendering user-facing application screens. Examples:
- `/login`
- `/assessment`
- `/discovery`
- `/corporate-brain`
- `/digital-workforce`
- `/employee-experience`
- `/admin`

Reusable UI components are located under `components/`.
Feature-specific logic is grouped under `features/`.

---

## 3. Application Layer

The application layer contains business logic related to:
- Authentication
- Organization identity
- Membership
- Role permissions
- AI agents
- Employee requests
- Policies
- AI grounding

API endpoints are implemented under:
- `app/api/`

---

## 4. Data Layer

Supabase is used as the primary backend. The application uses Supabase for:
- Authentication
- Database queries
- Organization data
- User membership
- Assessment data
- Discovery answers
- Policies
- Employee requests
- AI-related data

---

## 5. Organization Context

Most application functionality operates within an organization context. 
The effective organization is resolved from the authenticated user's membership.

Conceptually:

```text
Authenticated User
       │
       ▼
organization_memberships
       │
       ▼
Organization
       │
       ├── Company
       ├── Assessment
       ├── Discovery
       ├── Policies
       └── Employee Requests
```

This prevents application data from being treated as globally shared data.

---

## 6. Authentication

Authentication is handled through Supabase Auth. 
The application creates a Supabase server client and retrieves the current authenticated user.

The general flow is:

```text
      User
       │
       ▼
     Login
       │
       ▼
 Supabase Auth
       │
       ▼
Authenticated Session
       │
       ▼
  Next.js Proxy
       │
       ▼
Membership / Role
       │
       ▼
  Route Access
```