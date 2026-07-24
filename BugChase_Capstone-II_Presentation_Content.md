**BugChase**

**Capstone-II Presentation Content  
A. Development Projects**

Full-Stack Bug Bounty & Coordinated Vulnerability Disclosure Platform  
Gift University, Gujranwala - Final Year Project (FYP)  
Academic Year 2025-2026

Note: This document contains detailed slide content for Capstone-II. Paste Capstone-I feedback screenshot into Slide 6. The project README may be used as additional/appendix material.

# **Can You Use the README?**

Yes. Use the README as additional / appendix material, not as a replacement for slides.

| **Use README for**                 | **Don't put whole README on slides** |
| ---------------------------------- | ------------------------------------ |
| Setup steps, env vars, ports       | Long install commands                |
| Architecture diagram reference     | Full env tables                      |
| Module folders (cvss_engine, etc.) | Every script name                    |
| Examiner Q&A backup                | Tiny unreadable text                 |

Slide tip: End with: "Detailed setup & architecture: see project README." Keep slides short; keep README for depth.

# **Slide 1 - Title Slide**

**Title: BugChase**

Subtitle: A Full-Stack Bug Bounty & Coordinated Vulnerability Disclosure Platform

Project type: Capstone-II - Development Project (FYP)

**Team (edit with real names):**

- Shahzaib Ahmad
- M. Qasim
- Shahzaib
- Tauseef Ahmad

Supervisor: \[Your supervisor's name\]

Institution: Gift University, Gujranwala

Academic year: 2025-2026

**Live platforms (optional):**

- Web: <www.bugchase.com>
- API: api.bugchase.com
- Support: support.bugchase.com

Visual idea: BugChase logo + dark monochrome tech background (no clutter).

# **Slide 2 - Introduction (Overview)**

**Heading: Introduction**

BugChase is a multi-role security platform that connects researchers, companies, triagers, support agents, and admins in one workflow.

| **Role**    | **Purpose**                           |
| ----------- | ------------------------------------- |
| Researchers | Find & report vulnerabilities         |
| Companies   | Run BBP / VDP programs & pay bounties |
| Triagers    | Validate severity & status            |
| Support     | Mediate disputes                      |
| Admins      | Govern platform, users, finance       |

One-line pitch: "Pakistan-focused crowdsourced security testing with AI-assisted triage, escrow payouts, and coordinated disclosure."

Then go into Problem Statement, Proposed Solution, and Scope (Slides 3-5).

# **Slide 3 - Problem Statement**

**Heading: Problem Statement**

Traditional security testing is:

- Expensive & infrequent - annual pentests miss continuous risk
- Unstructured disclosure - researchers email bugs with no legal/scope clarity
- Manual triage overload - companies drown in duplicates and severity disputes
- Weak trust & payouts - no escrow, no reputation, no KYC for serious programs
- No local integrated platform - fragmented tools (email, spreadsheets, chat) instead of one workflow

**Core problem: There is no unified system that safely connects ethical hackers and organizations with scoped programs, AI-assisted triage, dispute handling, and PKR payouts.**

# **Slide 4 - Proposed Solution**

**Heading: Proposed Solution - BugChase**

BugChase provides:

| **Pillar**   | **What we built**                                          |
| ------------ | ---------------------------------------------------------- |
| Programs     | Public/private BBP & VDP with scope, rewards, safe harbor  |
| Reports      | Guided submission (VRT taxonomy), attachments, spam guards |
| AI pipeline  | Duplicate detection + CVSS triage after submit             |
| Human triage | Triager queue, claim, decisions, chat                      |
| Money        | Company escrow (Stripe), researcher wallet & payouts (PKR) |
| Trust        | KYC, reputation/profile gates, private invites             |
| Governance   | Admin moderation, support disputes, hall of fame           |

Result: One end-to-end pipeline from discovery → report → triage → resolution → reward.

# **Slide 5 - Scope of the Project**

**Heading: Scope of the Project**

## **In scope**

- Multi-role web apps (main + support portal)
- REST API with JWT + 2FA + session revocation
- Program management (BBP/VDP, private invites)
- Report lifecycle + real-time chat (Socket.io)
- AI modules: CVSS engine, duplicate engine, Gemini helpers, KYC (HF Space)
- Asset discovery (optional microservice)
- Stripe wallet/escrow + notifications/email
- Public landing, legal pages, hall of fame, public profiles

## **Out of scope / limitations**

- Native mobile apps
- Full legal liability insurance product
- Guaranteed 100% AI accuracy (AI assists; humans decide)
- Offline/air-gapped enterprise install (cloud-first)

## **Deployment targets**

- Client + support + API on Vercel
- MongoDB Atlas, Upstash Redis, Cloudinary, Stripe, Gmail

# **Slide 6 - Capstone-I Feedback (Original Screenshot)**

**Heading: Capstone-I Feedback**

Content: Paste the original Capstone-I feedback screenshot here (required by your template).

Caption: Figure: Capstone-I evaluation / supervisor feedback (original).

Speaker note: "This is the unedited Capstone-I feedback we received."

# **Slide 7 - Feedback Response and Justification**

**Heading: Feedback Response & Justification**

Replace rows with your real Capstone-I points:

| **Capstone-I Feedback**                | **Our Response in Capstone-II**                                                                              | **Justification**                                      |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| Strengthen server-side security / auth | JWT purpose (session vs 2fa_pending), logout blacklist, password tokenVersion, private-profile API redaction | UI-only checks are not enough; API must enforce policy |
| Clearer role separation                | Researcher / company / triager / support / admin routes + restrictTo                                         | Prevent privilege confusion                            |
| AI / automation value                  | reportProcessingQueue → Atlas Search + duplicate_engine + cvss_engine                                        | Reduce triage load; keep humans in loop                |
| Completeness of product                | Escrow, disputes, KYC, private invites, hall of fame, public stats                                           | Move from prototype → production-like FYP              |
| Documentation                          | Expanded README + architecture                                                                               | Examiner can reproduce setup                           |

Closing line: Capstone-II focused on security hardening, end-to-end workflows, and AI-assisted operations, not only UI polish.

# **Slide 8 - System Roles and Responsibilities (with Achieved Status)**

**Heading: System Roles & Responsibilities**

| **Role**       | **Responsibilities**                                                                            | **Achieved Status**                      |
| -------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Researcher     | Signup/2FA, profile+KYC, browse programs, submit reports, chat, wallet/payouts, private invites | Achieved                                 |
| Company        | Create BBP/VDP, assets/discovery, review reports, award bounty from escrow, team settings       | Achieved                                 |
| Triager        | Queue/pool, claim reports, severity/status decisions, notices, Gemini summary                   | Achieved                                 |
| Support        | Dispute inbox, messages, reassignment invites (support portal)                                  | Achieved                                 |
| Admin          | Users/programs moderation, finance/treasury, announcements, hall of fame                        | Achieved                                 |
| Public visitor | Landing, solutions, legal, hall of fame, public profiles (privacy-aware)                        | Achieved                                 |
| System / AI    | Duplicate check, CVSS triage, KYC match, asset scan, emails/notifications                       | Achieved (optional engines configurable) |

Visual: 5 role icons + "AI Assist" node.

# **Slide 9 - Capstone-I vs Capstone-II Completed Tasks (Overview)**

**Heading: Completed Tasks Across Capstone Phases**

| **Phase**   | **Focus**                               | **Outcome**                                                                         |
| ----------- | --------------------------------------- | ----------------------------------------------------------------------------------- |
| Capstone-I  | Core product foundation                 | Roles, programs, reports UI, basic API, initial auth                                |
| Capstone-II | Hardening + intelligence + completeness | AI pipeline, security fixes, disputes, escrow, KYC, public site, production domains |

Then split Frontend / Backend / ML into the next three slides.

# **Slide 10 - Completed Tasks: Frontend**

**Heading: Frontend Completed Tasks**

## **Capstone-I (foundation)**

- Role-based dashboards (researcher, company, triager, admin)
- Auth pages (login/signup/OTP)
- Program browse & report submission wizard (VRT)
- Basic profile / settings

## **Capstone-II (productization)**

- Support portal (support.bugchase.com) for disputes
- Public marketing site (landing, solutions, company, legal) with live stats/programs
- Hall of Fame + public researcher profiles (/h/:username)
- Wallet / escrow UI (Stripe), KYC upload flow
- Real-time report chat UX
- Private invite & reassignment invite landing pages
- Security UX: private profile lock, 2FA login step, submission eligibility gate

Stack: React + Vite + TypeScript + Tailwind + React Router

# **Slide 11 - Completed Tasks: Backend**

**Heading: Backend Completed Tasks**

## **Capstone-I**

- Express API mounts (/auth, /users, /reports, /programs, /company, /triager, /admin)
- MongoDB models (User, Report, Program, …)
- JWT auth + role middleware
- Basic report CRUD & program APIs

## **Capstone-II**

- Full auth suite: 2FA pending tokens, logout revocation (Redis), tokenVersion on password change
- Sanitized auth payloads (no internal field leaks)
- Public signup role lockdown (no self-assign triager)
- Server-side report eligibility (≥150 score)
- Private profile API redaction
- reportProcessingQueue (duplicate → CVSS)
- Stripe transactions / escrow / payouts
- Disputes API + cron private-invite scaling
- Socket.io report rooms
- Integrations: Cloudinary, Gmail, Gemini, KYC Space, asset discovery

Stack: Node.js + Express + Mongoose + Redis + Socket.io

# **Slide 12 - Completed Tasks: ML / AI Module**

**Heading: ML / AI Module**

| **Module**       | **Tech**                          | **Role in BugChase**                           | **Status**       |
| ---------------- | --------------------------------- | ---------------------------------------------- | ---------------- |
| Duplicate Engine | FastAPI + Ollama (Foundation-Sec) | Decide if new report duplicates an older one   | Implemented      |
| CVSS Engine      | FastAPI + Ollama + cvss lib       | Suggest CVSS v3.1 vector/severity after submit | Implemented      |
| Atlas Search     | MongoDB Atlas                     | First-pass similar-report candidates           | Implemented      |
| Gemini 2.5 Flash | Google Generative AI              | Triager summary; company bounty message drafts | Implemented      |
| KYC Engine       | FastAPI on Hugging Face           | Face/ID verification for researchers           | Hosted           |
| Asset Discovery  | FastAPI + Celery                  | Subdomain/port discovery for company assets    | Optional service |

**Important examiner line: AI assists triage; final decisions remain with humans (triager/company).**

# **Slide 13 - Tools and Technologies**

**Heading: Tools & Technologies**

| **Layer** | **Technologies**                                                          |
| --------- | ------------------------------------------------------------------------- |
| Frontend  | React, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query       |
| Backend   | Node.js, Express, Mongoose, JWT, Helmet, CORS, Socket.io                  |
| Databases | MongoDB Atlas (+ Atlas Search), Upstash Redis                             |
| AI / ML   | FastAPI, Ollama, Foundation-Sec, Gemini API, EasyOCR/DeepFace (KYC Space) |
| Payments  | Stripe                                                                    |
| Media     | Cloudinary                                                                |
| Email     | Nodemailer + Gmail                                                        |
| Infra     | Vercel (client, support, API), Hugging Face Spaces                        |
| Dev tools | Git, npm, Postman/curl, ESLint                                            |

# **Detailed Workflows (Appendix / Speaker Notes)**

You can add a section "System Workflows" after Tools (optional slides 14+), or put this in a handout/README appendix.

## **Workflow 1 - Authentication & Session Security**

Signup → email OTP (Redis) → verify email  
→ Login (password)  
→ if 2FA on: return twoFactorToken (aud=2fa_login_pending ONLY)  
→ POST /auth/login-2fa + TOTP  
→ issue session JWT (aud=session, jti, tv) + httpOnly cookie  
Logout → blacklist jti in Redis  
Password change → bump tokenVersion → all old sessions die  
Protected APIs → reject 2FA-pending tokens; check blacklist + tv

## **Workflow 2 - Company Creates a Program**

Company login → Create Program (BBP or VDP)  
→ set scope, rewards, rules, private/public  
→ Admin may moderate (Pending/Active/Banned)  
→ Public programs appear on /programs + landing registry  
→ Private programs: invites only (manual or cron auto-invite)

## **Workflow 3 - Researcher Eligibility & Submission**

Researcher completes profile + KYC (KYC engine)  
→ effectiveScore = max(reputation, profileCompletion)  
→ UI locks submit if < 150  
→ SERVER also rejects POST /api/reports if < 150  
→ multipart report + attachments → Cloudinary  
→ Report status = Submitted  
→ enqueue AI pipeline

## **Workflow 4 - AI Processing Pipeline (post-submit)**

reportProcessingQueue (serial FIFO)

1. Atlas Search → candidate duplicates
2. duplicate_engine (optional deep LLM) → duplicate / not
3. cvss_engine → CVSS vector + severity suggestion  
   → update Report.aiTriage / aiDuplicateAnalysis  
   → Socket events notify UI  
   → report enters triager visibility

## **Workflow 5 - Triage Decision**

Triager opens Queue / Unassigned Pool  
→ Claim report  
→ Chat with researcher (Socket.io)  
→ Decision: severity / status / validation notes  
→ Optional Gemini summary  
→ Company sees updated report

## **Workflow 6 - Bounty & Payout**

Company funds escrow (Stripe top-up)  
→ Award bounty on accepted/resolved report  
→ Transaction: bounty_payment / bounty_earned / platform_fee (PKR)  
→ Researcher wallet balance increases  
→ Researcher requests withdrawal via payout method (+ OTP)

## **Workflow 7 - Disputes (Support Portal)**

User opens dispute (severity/payout/duplicate/scope/…)  
→ Report may move to In Dispute  
→ Support agent on support.bugchase.com reviews  
→ Messages / resolution  
→ Optional triager reassignment invite

## **Workflow 8 - Private Program Invite**

Company invites researcher (or cron auto-scales)  
→ PrivateProgramInvite created + email  
→ Researcher accepts/declines  
→ Only accepted researchers see/submit to private program

## **Workflow 9 - Public Presence**

Landing loads live platform-stats + active programs  
Hall of Fame from published awards  
Public profile /h/:username  
→ if isPrivate: API returns only nickname + isPrivate (no PII dump)

# **Suggested Slide Deck Order (Final)**

- 1\. Title
- 2\. Introduction
- 3\. Problem Statement
- 4\. Proposed Solution
- 5\. Scope
- 6\. Capstone-I Feedback (screenshot)
- 7\. Feedback Response
- 8\. Roles & Achieved Status
- 9\. Capstone-I vs II Overview
- 10\. Frontend tasks
- 11\. Backend tasks
- 12\. ML/AI tasks
- 13\. Tools & Technologies
- 14\. (Optional) Architecture diagram
- 15\. (Optional) Key workflows (1-2 slides of diagrams)
- 16\. (Optional) Demo / Live links
- 17\. (Optional) Future work & conclusion

# **Design Tips (BugChase Brand)**

- Dark/light monochrome, monospace accents (matches your site)
- One idea per slide; use tables over paragraphs
- Architecture: use the 3D exploded diagram prompt prepared earlier
- Demo: short video or live click-path beats 10 screenshots

# **README as Additional Material - Recommended**

Put in your submission package / appendix:

- Root README.md - setup & architecture
- cvss_engine/README.md, duplicate_engine/README.md - AI modules
- Architecture image
- Capstone-I feedback screenshot
- Short demo checklist (login as each role)

On the last slide: "Additional documentation: Project README & module READMEs (setup, AI engines, env configuration)."