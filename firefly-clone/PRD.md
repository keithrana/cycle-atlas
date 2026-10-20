# PRD: "Firefly-style" Cloud Control Platform (working name: CloudLens)

Status: DRAFT 1. Written from general knowledge of Firefly.ai (their website was
blocked from my work environment). Please compare against firefly.ai before we build.

## 1. What is this, in plain words?
Companies rent computers, storage and databases from Amazon (AWS), Google (GCP) and
Microsoft (Azure). Over time nobody knows exactly what they have, what it costs, or
who changed what. Firefly is like a **smart inventory + safety camera for the cloud**:

1. It **looks** at your cloud account and lists everything you own.
2. It spots things that were made **by hand** (nobody wrote them down as code).
3. It **writes the code** (Terraform) so those things are tracked.
4. It **watches for changes** ("drift") and warns you.
5. It checks **rules** (e.g. "no public storage buckets") and **cost**.

## 2. Core features (the full dream list)
| # | Feature | 4th-grade explanation |
|---|---------|-----------------------|
| 1 | Cloud connection | Give the app a read-only key so it can look at your cloud. |
| 2 | Asset inventory | One big searchable list of everything you own. |
| 3 | Unmanaged-asset finder | Highlights things made by hand, not by code. |
| 4 | Code generator (IaC) | Turns a hand-made thing into Terraform code. |
| 5 | Drift detection | "This changed and nobody told us!" alerts. |
| 6 | Policy / rules engine | Checks against safety and cost rules. |
| 7 | Cost view | Shows what each thing costs per month. |
| 8 | Alerts | Email / Slack messages when something is wrong. |
| 9 | Backup & restore | Saves a copy of your setup so you can rebuild it. |
| 10 | AI helper | Ask "which servers are public?" in normal words. |
| 11 | Teams, logins, audit log | Who can see what, and who did what. |

## 3. Phased roadmap (small steps, test each one)

### Phase 0 - Quick win TODAY (about 1 session)
Goal: something you can open and click.
- A web dashboard with a **sample** cloud inventory (fake data, clearly labeled).
- Search, filter by cloud / type / region, and a red badge for "unmanaged".
- Summary cards: total assets, unmanaged count, monthly cost.
- No logins, no real cloud yet. Zero risk.
- **Tests:** page loads with no errors -> search/filter buttons work.

### Phase 1 - Real data (read-only)
- Connect ONE real AWS account with a read-only key.
- Replace sample data with real resources (EC2, S3, RDS first).
- **You must:** create a read-only AWS user and give me its keys (I will walk you through it).
- **Tests:** real API returns data -> keys never shown in the browser or saved in code.

### Phase 2 - Drift + rules
- Save a snapshot every day; show "what changed".
- First 10 rules (public bucket, no encryption, untagged, etc.).
- Tests: change something on purpose -> app notices.

### Phase 3 - Code generation
- Click an unmanaged item -> get Terraform code. Start with S3 + EC2 only.
- Tests: generated code passes `terraform validate`.

### Phase 4 - Alerts, cost, teams
- Email/Slack alerts, real cost numbers, logins and roles, audit log.
- Security review: passwords, permissions, secret storage, rate limits.

### Phase 5 - Multi-cloud + AI
- Add GCP and Azure. Add the "ask in plain English" helper (Claude API).
- Backup & restore of cloud setups.

## 4. Suggested tech (so you know, no need to learn it)
- Frontend: Next.js + React (what Firefly-style dashboards use).
- Backend: Node/TypeScript API, PostgreSQL database.
- Cloud reading: official AWS / GCP / Azure SDKs.
- Secrets: a vault / environment variables, never in code.

## 5. Security rules (non-negotiable)
- Read-only cloud keys first. Write access only in a later phase, with approval.
- Keys stored encrypted on the server only.
- Every phase ends with a security check before the next starts.

## 6. Out of scope (for now)
Copying Firefly's logo, name, text or design. We build our **own** product with the
same *kind* of features. Their exact code/designs are theirs.

## 7. Open questions for you
1. Who is it for: just you, your company, or customers you will sell to?
2. Which cloud do you use most: AWS, Google, or Azure?
3. Do you have a cloud account we can use for testing? (If not, Phase 0 stays on fake data.)
