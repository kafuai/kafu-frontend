# AI & Agents

## 1. AI Architecture

KAFU AI uses OpenAI as the language model provider. 
The AI architecture is designed around organizational grounding.

```text
       User
         │
         ▼
    Application
         │
         ▼
Organization Context
         │
         ▼
      Evidence
         │
         ▼
       Prompt
         │
         ▼
       OpenAI
         │
         ▼
      Response
```

---

## 2. Grounded AI

The Corporate Brain uses: `/api/ai/grounded`

The purpose is to answer using organization-specific evidence. The intended instruction is effectively:

> "Answer using only the available organization evidence and do not assume information that is not present."

This is important because KAFU AI is an enterprise application and fabricated company information can produce incorrect business decisions.

---

## 3. Evidence

Potential evidence sources include organization data such as:
- `companies`
- `discovery_answers`
- `corporate_dna`
- `company_policies`
- `knowledge_sources`

The actual evidence used depends on the endpoint and feature.

---

## 4. AI Response Cleaning

The application includes response-cleaning logic to avoid exposing internal placeholder identifiers. 
Examples of internal placeholders that should not be displayed directly:
- `[COMPANY-NAME]`
- `[COMPANY-INDUSTRY]`
- `[COMPANY-COUNTRY]`

The goal is to provide customer-facing references while preserving grounding.

---

## 5. Employee Experience Agent

The main pilot agent is: `employee-experience-manager`

The agent handles employee-related conversations. Typical flow:

```text
   Employee Message
          │
          ▼
Employee Experience API
          │
          ▼
  Workspace Identity
          │
          ▼
        Agent
          │
          ├── Inquiry
          │
          └── Request
                 │
                 ▼
          Employee Request
```

---

## 6. Inquiry vs Request

The Employee Experience agent can distinguish between:

### Inquiry
**Example:** *"What is the annual leave policy?"*
The system retrieves relevant policy information.

### Request
**Example:** *"I want to request annual leave."*
The system can create/process an employee request.

---

## 7. Policy Retrieval

Policies are stored in: `company_policies`

The current implementation retrieves relevant policy content based on available application logic. 
It should not be described as a full vector/RAG implementation unless vector retrieval is actually enabled.

---

## 8. Agent Expansion

The architecture is intended to support additional agents. Potential agents include:
- Employee Experience Manager
- Documents & Policies Advisor
- Executive HR Advisor
- Talent Acquisition Advisor
- Compliance Intelligence Advisor
- Localization Intelligence Advisor

Each agent should have:
- Defined purpose
- Defined permissions
- Defined data sources
- Defined API boundary
- Defined failure behavior