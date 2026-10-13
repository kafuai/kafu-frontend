# Authentication, RBAC & Onboarding

## 1. Authentication

KAFU AI uses Supabase Authentication. The application distinguishes between:

**Guest Routes:**
- `/login`
- `/register`
- `/forgot-password`
- `/book-demo`

**Protected Routes (Examples):**
- `/assessment`
- `/discovery`
- `/corporate-brain`
- `/digital-workforce`
- `/employee-experience`
- `/admin`
- `/profile`

> **Note:** Unauthenticated users cannot access protected application areas.

---

## 2. Roles

The current role model contains:
- Admin
- Owner
- Manager
- Member
- Viewer

The platform administrator is represented separately through the database role: `admin`.

---

## 3. RBAC Permissions

The permission model includes:
- `ALL`
- `ASSESSMENT_VIEW`
- `DISCOVERY_VIEW`
- `CORPORATE_BRAIN_VIEW`
- `DIGITAL_WORKFORCE_VIEW`
- `REQUESTS_VIEW`
- `REQUESTS_MANAGE`
- `POLICIES_VIEW`
- `POLICIES_MANAGE`
- `EMPLOYEE_USE`

---

## 4. Role Permission Matrix

Conceptually, the exact implementation is controlled by the permission definitions in the application:

| Role | Assessment | Discovery | Corporate Brain | Digital Workforce | Requests | Policies | Employee |
| :--- | :---: | :---: | :---: | :---: | :--- | :--- | :---: |
| **Admin** | All | All | All | All | All | All | All |
| **Owner** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| **Manager** | — | — | — | — | ✓ | ✓ | — |
| **Member** | — | — | — | — | — | — | ✓ |
| **Viewer** | — | — | — | — | — | — | — |

---

## 5. Onboarding

The onboarding process is intentionally separate from normal application permissions. The main onboarding states are:
- `assessment_completed`
- `onboarding_completed`

### Assessment
The Assessment represents the first onboarding stage. 
If `assessment_completed = false`, it means the user/organization has not completed the assessment stage. 

The expected behavior is:

```text
    Protected route
          │
          ▼
 assessment_completed?
          │
       ┌──┴──┐
      NO     YES
      │       │
      ▼       ▼
 /assessment  │
              ▼
          Discovery
```

---

## 6. Discovery

After Assessment is completed, the user proceeds to Discovery. 
Discovery contains organization questions and stores answers in: `discovery_answers`

The answers are associated with their organization and question order.

---

## 7. Onboarding Completion

The final onboarding state is: `organizations.onboarding_completed`
This should represent completion of the onboarding journey.

The intended flow is:

```text
         Assessment
             │
             ▼
         Discovery
             │
             ▼
onboarding_completed = true
             │
             ▼
     Application Access
```

---

## 8. Proxy Responsibilities

`proxy.ts` is responsible for request-level protection. It handles:
- Authentication checks
- Guest route handling
- Protected route handling
- Organization membership resolution
- Onboarding restrictions
- RBAC permission checks

> **Note:** The proxy should **not** be treated as a replacement for database-level security. It is an application-level access layer.

---

## 9. Important Security Principle

Frontend hiding is not sufficient for authorization. For sensitive operations, every layer must be considered:

```text
       UI
       │
       ▼
      API
       │
       ▼
 Authorization
       │
       ▼
    Database
```

A user should not gain access merely because a navigation item is hidden.