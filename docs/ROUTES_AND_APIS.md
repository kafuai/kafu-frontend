# Routes & APIs

## 1. Main Pages

### Login
- **Route:** `/login`
- **Purpose:** Authenticate the user through Supabase.

### Assessment
- **Route:** `/assessment`
- **Purpose:** Collect organization assessment information.

### Discovery
- **Route:** `/discovery`
- **Purpose:** Collect organization discovery information.

### Corporate Brain
- **Route:** `/corporate-brain`
- **Purpose:** Provide AI-powered organization intelligence using grounded organizational data.

### Digital Workforce
- **Route:** `/digital-workforce`
- **Purpose:** Expose AI workforce agents. 
- **Current agent concepts include:**
  - Employee Experience Manager
  - Documents & Policies Advisor
  - Executive HR Advisor
  
### Employee Experience
- **Route:** `/employee-experience`
- **Purpose:** Employee-facing AI interaction.

### Employee Requests
- **Route:** `/employee-experience/requests`
- **Purpose:** HR-side request management.

### Policies
- **Route:** `/employee-experience/policies`
- **Purpose:** View and manage company policies.

### Admin
- **Routes:** 
  - `/admin`
  - `/admin/organizations`
  - `/admin/user`
- **Purpose:** Platform administration.

---

## 2. API Routes

### AI Grounded
- **Endpoint:** `POST /api/ai/grounded`
- **Purpose:** Generate organization-grounded AI responses.

**Conceptually:**

```text
    User Question
          │
          ▼
 Organization Context
          │
          ▼
 Evidence Retrieval
          │
          ▼
 Prompt Construction
          │
          ▼
        OpenAI
          │
          ▼
  Grounded Response
```

> **Note:** The endpoint should not intentionally invent organization information.

---

## 3. Employee Experience

- **Endpoint:** `POST /api/employee-experience`
- **Purpose:** Process employee experience conversations and requests. 
The endpoint resolves workspace identity and invokes the Employee Experience agent.

---

## 4. Employee Requests

Representative endpoints include:
- `/api/employee-experience/requests`
- `/api/employee-experience/requests/[id]/approve`
- `/api/employee-experience/requests/[id]/reject`

- **Purpose:** Allow authorized HR users to inspect and process employee requests.

---

## 5. Policies

Policy APIs include:
- `/api/employee-experience/policies`
- `/api/employee-experience/policies/[id]`

- **Purpose:** Retrieve and manage company policies.

---

## 6. Letters

The Employee Experience module also includes endpoints for approving/rejecting employee letters.

---

## 7. Admin APIs

**Organization management:**
- `/api/admin/organizations`

**User management:**
- `/api/admin/users`

- **Purpose:** These APIs support platform-level administration.