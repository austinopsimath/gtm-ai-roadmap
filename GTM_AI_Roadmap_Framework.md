# GTM AI Roadmap Management

---

## Overview

Most GTM AI initiatives fail not because the technology is wrong, but because the process of selecting, sequencing, building, and embedding AI is improvised. This framework provides a repeatable operating system for managing a GTM AI roadmap — from idea intake to full adoption — with explicit gates at every stage to prevent bad investments from advancing.

The framework has six stages — **Prioritize → PRD → Calendar → Deploy → Pilot → GA** — each followed by explicit exit criteria that must be satisfied before the next stage begins. The exit criteria sections carry as much weight as the stage sections themselves; they are where the gatekeeping actually happens. The PRD (Stage 2) is the framework's most consequential planning artifact: it documents the path, success metrics, pilot design, risks, workstreams, and the conditional Accountability Compact (Section 13). Between Stages 5 and 6, the Accountability Compact is formally executed.

---

## Foundational Concept: Three Layers of GTM Metrics

Before any initiative is scored, piloted, or launched, the team must agree on how success will be measured. This framework uses a three-layer model that reflects how GTM impact actually works — from rep behavior through to executive-level business outcomes.

**Level 1 — Behavior**
What customer-facing roles are saying, typing, and clicking. These are the leading indicators — the earliest signal that something is or isn't working. Examples: % of target accounts with activity, % of calls incorporating AI-generated insights, email response rates. Audience: individual contributors and frontline managers.

**Level 2 — Indicators**
The intermediary impact of those behaviors on account and opportunity health. These are the metrics that connect rep behavior to business outcomes. Examples: average number of meetings per opportunity, stage-to-stage conversion rates, average sales price, pipeline multiplier. Audience: frontline managers, directors, mid-level leaders.

**Level 3 — Impact**
Business results that inform executive decisions. These are the metrics that appear in board presentations and earnings calls. Examples: win rates, ARR growth, NRR, CAC, attainment. Audience: VP and above.

**Why all three layers matter**

Most GTM AI initiatives are evaluated only at Level 3 — and only after it's too late to course-correct. The three-layer model solves this in two ways. First, Level 1 metrics move fast enough to give you a real-time signal during the pilot about whether reps are actually changing behavior. If Level 1 isn't moving, Level 3 never will. Second, the causal chain — behavior drives indicators, indicators drive impact — gives you a diagnostic framework when something isn't working. You're not guessing; you're tracing the break.

Every initiative in this framework requires metrics defined and baselined at all three levels before a pilot begins.

---

## Foundational Concept: The Initiative Registry

The framework describes how individual initiatives move through stages. The Initiative Registry is the artifact that holds the portfolio — the system of record for every GTM AI initiative the organization is running, has run, or has decided not to run. Without it, the framework has no memory: the score that justified an initiative is forgotten, the Initiative Owner who shepherded the build moves teams, the dashboard that proved the pilot succeeded gets buried, and the next quarterly review starts from a blank page.

The Registry is a single, living list maintained by the Roadmap Owner. Every initiative — from the moment it enters the intake queue through GA and into wind-down — has a row. The Registry is the source of truth for the executive review, the quarterly reprioritization, and the cognitive load calculation. A roadmap that exists only in slide decks decays between presentations; a Registry that is updated as a matter of course does not.

### Required Metadata

For every initiative, the Registry captures:

| Field | Description |
|---|---|
| **Name** | Short, distinct name used everywhere this initiative is referenced |
| **Description** | One-sentence plain-language summary of what it does |
| **Current Stage** | 1 (Prioritize), 2 (PRD), 3 (Calendar), 4 (Deploy), 5 (Pilot), 6 (GA), Killed, or Wound Down |
| **Health** | Green / Yellow / Red — the Roadmap Owner's portfolio-level judgment, not a self-report from the Initiative Owner |
| **Initiative Owner** | Named individual accountable end-to-end |
| **Executive Sponsor** | Named leader who signed (or conditionally signed) the Accountability Compact |
| **Path** | Build or Buy |
| **Audiences Served** | The specific roles and segments in scope (e.g., "Enterprise AEs, EMEA"; "All SDRs"; "Frontline managers, North America") |
| **Technologies / Vendors** | Tools and platforms involved (e.g., Gong, Clari, custom RAG on Snowflake, internal LLM gateway) |
| **Systems Touched** | Every system the initiative reads from, writes to, or sits alongside — populated from PRD Section 6 |
| **CARET Scores** | C, A, R, E, T values plus the computed Priority Score |
| **Level 3 Metric Targeted** | The executive-level outcome this initiative was funded to move |
| **Key Dates** | Intake date, Pilot start, GA launch, Last review |
| **Last Reviewed** | Date the Roadmap Owner last confirmed the row is current |

### Maintenance

The Initiative Owner is responsible for keeping their own row accurate — Stage transitions, dates, technology and audience changes as scope evolves. The Roadmap Owner audits the full Registry at the quarterly review and is the only person who can change an initiative's Health rating. This separation matters: an Initiative Owner with a struggling pilot is the worst person to mark themselves Red. Health is a portfolio judgment, not a self-report.

The Registry is also the evidence base for closing the loop back to Stage 1. When initiatives complete GA or are killed, their final state stays in the Registry — what the CARET score got right, what it got wrong, what actually drove the outcome. Future scoring panels reference it when calibrating new initiatives, which is how the framework gets smarter over time rather than re-litigating the same debates each quarter.

---

## Before You Start: Governance

No framework survives without ownership. Before running a single initiative through this process, define the following:

**Roadmap Owner**
One person — typically RevOps, GTM Ops, or a dedicated AI Program Manager — owns the roadmap and is accountable for keeping it current, running quarterly reviews, and enforcing gate criteria. Without a single owner, the roadmap becomes a committee document and dies.

**Initiative Owner (GTM AI Product Manager)**
Every initiative that enters the roadmap requires a named individual who shepherds it from PRD through GA. This role is distinct from the Roadmap Owner, who manages the portfolio. The Initiative Owner is accountable for a single initiative end-to-end: writing and maintaining the PRD, coordinating the Stage 4 (Deploy) workstreams, running the pilot, managing the GA rollout, and reporting results back to the scoring panel and executive sponsor.

In more sophisticated organizations, this role is beginning to emerge as a dedicated function: the GTM AI Product Manager. It requires an unusual combination of skills — enough technical fluency to manage a build or buy process, enough GTM knowledge to design meaningful pilot cohorts and success metrics, and enough change management sensibility to drive adoption through GA. Whether it's a dedicated hire or a hat worn by someone in RevOps, enablement, or GTM Ops, the role must be named before the PRD is written. An initiative without a named owner is an initiative that will stall.

**Scoring Panel**
CARET scores are opinions. Every factor — how complex this will be to build, how much behavior change it requires, how well it maps to executive priorities — is a judgment call, and different people will reach different conclusions based on where they sit. That's not a flaw; it's the point. The scoring panel exists to surface those differences, not to rubber-stamp a score that someone already decided.

*Composition — minimum three functions*
The panel must include representatives from at least three distinct functions. Recommended core functions: a field sales perspective (SDR or AE org), a RevOps or enablement perspective, and a technical or data/IT perspective. An executive sponsor or senior sales leader should also participate when available — they have the clearest read on Alignment (A) against actual board and exec priorities. Each function brings irreplaceable signal to specific factors:

| Factor | Primary Perspective |
|---|---|
| C — Complexity | Technical / Data / IT lead |
| A — Alignment | Executive sponsor or senior sales/revenue leader |
| R — Results | Sales leader + RevOps (jointly) |
| E — Effort | RevOps / Enablement lead + frontline manager |
| T — Timeline | Roadmap Owner + executive sponsor |

*Seniority mix*
Include both senior (director/VP) and ground-level (manager/IC) perspectives on the panel. They will frequently disagree — especially on Effort and Alignment — and that disagreement is valuable. Senior leaders often overestimate Alignment (because the initiative sounds like an exec priority) and underestimate Effort (because they aren't absorbing the cognitive load). Frontline managers and ICs often have the inverse blind spots. Both inputs together produce a more accurate score than either alone.

*Scoring and aggregation*
Each panel member scores every factor independently before any group discussion — scores submitted before anyone sees others' inputs. Scores are then averaged. When any individual scores diverge by more than 2 points on a given factor, the panel discusses before the average is finalized. That divergence is usually a signal that the initiative isn't well understood by at least one function, that assumptions differ significantly, or that the scope needs more definition. The discussion is the value. Simple averaging is used rather than weighted averaging — weighting adds complexity and gives disproportionate influence to whoever controls the weights, which can undermine the legitimacy of the output and invite gaming.

**Review Cadence**
The roadmap is a living document. Reprioritize quarterly. New initiatives can be submitted at any time but are only formally scored and sequenced at the quarterly review, unless a timeline urgency factor (T ≥ ×1.3) creates a compelling case for an off-cycle addition.

**Authority Matrix**
Define who can do what:
- *Add an initiative to the intake queue*: Anyone
- *Formally score and roadmap an initiative*: Scoring Panel + Roadmap Owner
- *Accelerate an initiative past its queue position*: Executive sponsor + Roadmap Owner
- *Kill an initiative mid-flight*: Executive sponsor + Roadmap Owner

---

## Stage 1: Prioritize

**Purpose:** Score every candidate initiative using a consistent methodology so that sequencing decisions are empirical, not political.

### The CARET Framework

Each initiative is scored across five factors. The result is a Priority Score that determines its position in the queue.

| Factor | What It Measures | Scale | Role in Formula |
|---|---|---|---|
| **C — Complexity** | How technically difficult is it to build or integrate? | 1 (simple) → 5 (extremely complex) | Denominator (higher = lower score) |
| **A — Alignment** | How directly does this support current exec priorities or OKRs? | 1 (no alignment) → 5 (explicitly named in priorities) | Numerator (higher = higher score) |
| **R — Results** | What is the expected, quantifiable business impact? Anchored to Level 3 (Impact) metrics — win rates, ARR growth, NRR, CAC. | 1 (negligible) → 5 (massive, measurable impact) | Numerator (higher = higher score) |
| **E — Effort** | How much change management and enablement is required? | 1 (1 day) → 2 (1 week) → 3 (1 month) → 4 (1 quarter) → 5 (2 quarters) | Denominator (higher = lower score) |
| **T — Timeline** | How urgent is this? | 1.0 (no urgency) → ×1.5 (must ship in 2 weeks) | Multiplier applied after initial calculation |

**Formula:**

```
Priority Score = (A × R) / (C × E) × T
```

Higher scores = higher priority.

*Who scores:* See the Scoring Panel section under Governance for composition requirements, seniority guidance, and the averaging protocol. The short version: a minimum of three functions score independently before any group discussion; scores are averaged; divergences of 2+ points trigger a discussion before the average is finalized.

### Scoring Alignment Correctly

The Alignment factor (A) is the one most commonly miscalibrated. Alignment should be scored against *executive-level* language — board presentations, earnings calls, CEO all-hands priorities — not against VP or RevOps operational language. An initiative that "improves pipeline visibility" scores lower than one that "helps us grow revenue without growing headcount," even if they're the same initiative described differently. Score the initiative against the language your executives actually use.

---

## Stage 1 Exit Criteria

The scoring process is complete and the queue is ready to move to Stage 2 when all of the following are true:

- [ ] All candidate initiatives have been independently scored by the full panel before group discussion
- [ ] Divergences of 2+ points on any factor have been discussed and resolved
- [ ] The prioritized queue is documented, agreed upon, and signed off by the Roadmap Owner
- [ ] No ties in Priority Score remain unresolved — any equal scores have been manually ordered by the panel

The output is a rank-ordered initiative queue. Higher-scoring initiatives advance into Stage 2 (PRD) for detailed planning. Cognitive load constraints are applied later, in Stage 3, when the initiative is placed on a calendar.

---

## Stage 2: PRD

**Purpose:** Document the full plan — path, vendor, success metrics, pilot design, risks, workstreams, measurement cadence, approval mechanism — and capture conditional executive commitment via the Accountability Compact (Section 13). The PRD is the framework's gate artifact; without an approved PRD, an initiative does not advance to scheduling.

The PRD (Product Requirements Document) is written by the Initiative Owner and approved by the scoring panel and executive sponsor before any calendar placement or build/buy work begins. A completed, approved PRD with the conditional Compact is the single artifact that certifies an initiative is ready to advance.

The PRD is also a living document. It is reviewed and revised at the Stage 4 (Deploy) gate to reflect what was discovered during the build or buy process — integration realities, data ownership changes, risk disposition updates. The revised PRD is the accurate record of what was actually built and why.

### Who Writes It

The Initiative Owner writes the PRD. It is not a committee document — one person is accountable for its completeness and accuracy. The scoring panel and executive sponsor review and approve it; they do not write it.

### PRD Sections

**1. Initiative Summary**
What is this initiative, and what problem does it solve? One paragraph. Includes the initiative name, a plain-language description of what it does, and which path it takes: Build or Buy.

**2. Target Users**
Who will use this solution, and in what context? Define the specific roles (e.g., AEs working enterprise accounts, SDRs running outbound sequences, frontline managers conducting pipeline reviews), the segments or teams in scope, and what part of their workflow this touches. Be specific — "the sales team" is not a target user definition.

**3. Business Need and CARET Context**
What business need is this addressing? Reference the Level 3 metric (Impact) that this initiative is expected to move. Include the CARET Priority Score and factor breakdown for traceability — so anyone reviewing the PRD later understands why this initiative was prioritized.

**4. Success Metrics — All Three Layers**
The specific metrics that will be tracked during the pilot and GA, defined at all three levels: Level 1 (Behavior), Level 2 (Indicators), Level 3 (Impact). Include the baseline value for each metric — captured before the pilot begins — and the target improvement the initiative is expected to produce.

**5. Path: Build or Buy**
Confirm the path and document the rationale. For Buy: name the vendor(s) under consideration and the evaluation criteria. For Build: identify the core technical components and architecture approach.

**6. Systems and Integrations**
Every system this initiative will touch, read from, write to, or sit alongside. For each: integration type (read-only, read-write, bidirectional), internal system owner, and whether API access is established or needs to be provisioned.

**7. Data Architecture**
For each data type the solution handles — inputs consumed, outputs generated, intermediate states — document the storage location, the owner, and what happens to that data if the solution is wound down. For Buy: document vendor data retention policies and what data leaves the organization's environment.

**8. Risk Assessment**
Assessment of the initiative against each risk category, with a disposition (accept / mitigate / escalate) for each. Risk categories: New UI or Login Requirement, Overlapping Capabilities, Data Quality and Completeness, Integration Fragility, Vendor Lock-In (Buy only). See Stage 4 (Deploy) for full definitions of each risk category.

**9. Pilot Plan**
Pilot scope (which team, which segment), cohort selection rationale (based on behavior gap), timeline, intervention design approach (what type of intervention and why), and the decision criteria for each gate outcome (Scale / Fix and Re-Pilot / Kill).

**10. Workstream Assignments**
Named owners and target dates for each essential workstream. Roles should be confirmed at PRD approval; names may be TBD for workstreams that depend on scope finalization. See Stage 4 (Deploy) for the full workstream list by path (Build vs. Buy).

**11. Measurement Cadence**
For each success metric at all three layers, specify the tracking cadence (daily, weekly, monthly, quarterly) and the mechanism for capturing it. This section must be completed before Stage 4 begins so that measurement infrastructure is built early — not assembled at the gate. The cadence for each metric should reflect how quickly that metric naturally moves: Level 1 (Behavior) typically weekly, Level 2 (Indicators) typically monthly, Level 3 (Impact) typically quarterly.

**12. Approval Mechanism**
How will this PRD be approved? The Initiative Owner specifies the approval process — a formal committee meeting, a Slack channel vote, an email sign-off, or another mechanism — and names who is required to approve. This section ensures the approval process is agreed upon before the PRD is circulated, not improvised after.

---

**13. The Accountability Compact**

*This is the most consequential section of the PRD. It must not be treated as boilerplate.*

The Accountability Compact is a written agreement between the Initiative Owner and executive leadership specifying exactly what will be expected of them if the pilot succeeds. It is presented here — before a dollar is spent on Deploy — as a conditional commitment: *"Assuming the pilot hits the success metrics, will you agree to these specific terms?"*

The executive sponsor reads the exact document they will be asked to sign at the Stage 5→6 gate. There are no surprises at GA time. That is the point.

**Why this section matters more than any other**

The most common reason GTM AI initiatives decay after GA is not poor technology or poor training. It is the absence of sustained leadership accountability. The hardest link in the accountability chain is not exec-to-rep — it is exec-to-frontline-manager-to-rep. Executives must be willing to hold their frontline managers accountable for holding their reps accountable. Most executives will agree to "support the initiative." Far fewer will commit in writing to specific behaviors they will be required to enforce on their managers. This section finds that out before any Deploy investment is made.

If an executive will not conditionally agree to these specific terms, that is one of the strongest available predictors of GA failure — regardless of how good the pilot results are. The Initiative Owner must escalate that finding to the scoring panel before advancing past Stage 2.

**What the Compact asks of leadership**

*1. Verbal expectation-setting before GA launch*
Before the initiative rolls out to the full population, the executive sponsor will verbally communicate to targeted reps and their frontline managers that adoption of [Desired Behaviors] is a requirement — not a suggestion. This is not delegated to enablement. It comes from leadership.

*2. Dedicated coaching cadence for frontline managers*
Each frontline manager whose reps are in scope will conduct a minimum of [X] dedicated coaching conversations per [month/quarter] focused specifically on the target behaviors and behavior change metrics. These conversations are separate from deal reviews and pipeline calls — urgencies in those meetings reliably displace coaching.

*3. Executive accountability for manager compliance*
The executive sponsor is responsible for monitoring whether frontline managers are conducting those coaching conversations and for holding managers accountable when they are not. The Initiative Owner will provide a dashboard showing coaching cadence compliance alongside the behavior change metrics to support this.

*4. Active participation in the reinforcement arc*
During the first 90 days of GA, the executive sponsor participates in at least [X] visible reinforcement activities — team meetings, all-hands mentions, or recognition of high-adoption outcomes — to signal that this initiative is a sustained priority, not a launch event.

**The conditional gate**

The Initiative Owner presents the compact to the executive sponsor with a direct ask:

*"If the pilot succeeds and we make a Scale decision, will you commit to these specific terms?"*

- **Yes** → Document the conditional agreement. The PRD is ready for final approval.
- **Conditional yes with modifications** → Negotiate the specific terms. Document the revised version. Proceed only if the revised compact still includes meaningful accountability for the manager coaching cadence — that commitment is non-negotiable.
- **No, or significant reluctance** → Escalate before proceeding. Surface this to the scoring panel as a material risk. An initiative whose executive sponsor will not commit to these terms should not advance.

### PRD Approval

The Initiative Owner drives the approval process using the mechanism specified in Section 12. The PRD requires sign-off from two parties before Stage 3 (Calendar) begins:

1. **Scoring Panel** — all sections are complete, internally consistent, and the initiative is well enough understood to proceed
2. **Executive sponsor conditional sign-off on the Accountability Compact** — the specific terms have been reviewed and conditionally agreed to

Both approvals are documented. The signed PRD (with the conditional Accountability Compact) is the artifact that opens Stage 3.

---

## Stage 2 Exit Criteria

An initiative cannot advance to Stage 3 (Calendar) until all of the following are true:

- [ ] **Initiative Owner named** — a specific person is accountable for shepherding this initiative from PRD through GA
- [ ] **All 13 PRD sections complete** — the PRD is internally consistent and reviewed by the scoring panel
- [ ] **Scoring panel approved the PRD** — using the mechanism documented in Section 12
- [ ] **Executive sponsor conditionally signed the Accountability Compact** — the specific four terms have been reviewed and conditionally agreed to
- [ ] **Resources allocated** — build capacity committed, enablement lead assigned, budget approved

If an initiative cannot clear these exit criteria, it returns to the queue. The PRD is not a formality — it is the proof that the initiative is understood well enough to be worth scheduling and resourcing.

---

## Stage 3: Calendar

**Purpose:** Translate the approved PRD into a sequenced calendar position with cumulative cognitive load awareness. Where Stage 2 decided *what* to build and *who* commits to it, Stage 3 decides *when* — accounting for everything else already in flight.

### What Happens Here

The Roadmap Owner places approved initiatives onto a calendar, accounting for team capacity (build resources, enablement bandwidth), initiative dependencies (some AI solutions require upstream data infrastructure before downstream tools can function), cognitive load constraints (see below), and pilot windows (avoid piloting during peak selling periods like Q4 close).

### Cognitive Load Constraint

Priority Score determines *sequence*. Cognitive load determines *how many initiatives can run at the same time*.

Every initiative that requires reps to change behavior adds to the cumulative cognitive load on the field. Reps are not infinitely absorptive — asking them to change too many behaviors simultaneously is a reliable way to produce adoption failure across all of them, not just one. The Effort score (E) from CARET is the proxy for how much cognitive load a given initiative carries.

The total cumulative Effort score of all active initiatives running concurrently should not exceed approximately 10 at any point in time. This ceiling varies by team and organization — consult with your enablement lead to calibrate the right threshold. But err on the side of doing fewer things well rather than many things poorly. A high-priority initiative that fails because it was crowded out by three simultaneous lower-priority initiatives is a worse outcome than a slightly slower roadmap.

When placing initiatives on the calendar, the Roadmap Owner checks the cumulative Effort score of everything already in flight before scheduling the start date of the next initiative. If adding the new initiative would breach the ceiling, its start date is pushed until sufficient cognitive load capacity is available — regardless of its Priority Score.

### Stage 3 Output

A sequenced roadmap with initiatives placed on a calendar — ideally represented as a Gantt chart showing each initiative's Deploy start date, Pilot window, and projected GA date on a shared timeline. The visual format is not cosmetic: it makes the cognitive load constraint legible at a glance (overlapping initiatives with high Effort scores become immediately visible), exposes dependency sequencing, and gives executive stakeholders a concrete artifact to review and pressure-test rather than a ranked list they have to mentally translate into time.

---

## Stage 3 Exit Criteria

An initiative cannot advance to Stage 4 (Deploy) until all of the following are true:

- [ ] **Placed on the calendar** — Deploy start, Pilot start, and GA dates are set on a shared timeline
- [ ] **Cumulative cognitive load verified against portfolio capacity** — at no point during the planned Pilot or GA window does the sum of in-flight initiatives' Effort scores exceed the ceiling
- [ ] **No conflicts with declared blackout windows** — peak selling periods (Q4 close, end-of-quarter pushes) are avoided for pilot launches unless a deliberate exception is documented

The PRD work was completed in Stage 2. By the time an initiative reaches Calendar, the *what* and the *who* are already settled; Stage 3 is purely about *when*.

---

## Stage 4: Deploy

**Purpose:** Execute the approved PRD — build the custom solution or procure and onboard the vendor product — to a state that is ready for controlled pilot testing. Where the PRD defined the plan, Stage 4 is where that plan meets reality. Discoveries made during execution feed a mandatory PRD revision at the Stage 4 gate.

### Two Paths: Build or Buy

Every initiative enters Stage 4 as one of two types. The PRD specifies which path; Stage 4 executes it.

**Path 1 — Custom Build**
The team architects and develops a net-new AI solution. This includes designing the data architecture, building or integrating AI models, constructing any workflow automations or CRM integrations, and internal QA testing. Scope is fixed by the approved PRD — this is not a free-ranging build phase. The output is a functional solution that has been tested internally and is ready to be handed to a pilot cohort.

**Path 2 — Vendor Buy**
The team procures and onboards a third-party AI solution. This includes vendor contracting, technical onboarding (SSO, CRM integration, data connections), and configuration against the use case defined in the PRD. Note: onboarding here refers to the technical installation of the product — not user adoption. Users do not touch the product until Stage 5. The output is a fully configured, integration-tested solution ready for controlled user testing.

### Risk Reference

The PRD documents the risk assessment and dispositions for this initiative before Stage 4 begins. The following risk categories are defined here for reference — they are what the Initiative Owner assesses when writing the PRD, and what gets updated in the PRD revision at the Stage 4 gate if execution surfaces new information.

**New UI / Login Requirement**
If this solution requires reps to navigate to a new interface, log into a new tool, or interrupt their existing workflow to access it, that is a significant adoption risk. Reps already have more tools than they use consistently. An AI solution that lives outside their daily click path will not get used, regardless of how good it is. If a new UI is unavoidable, that must be a deliberate, justified decision — not an oversight — and the Effort score (E) should be re-evaluated accordingly. Wherever possible, push output into the systems reps already live in: CRM records, Slack messages, email drafts.

**Overlapping Capabilities**
Before building or buying, audit what already exists in the tech stack. There are often other tools, modules, or features that already do some of what this initiative proposes — sometimes with a different team owning them and no awareness that the overlap exists. Proceeding without this audit risks political friction, redundant spend, and reps receiving conflicting outputs from competing systems. If overlap exists, the disposition options are: consolidate (retire the older capability), differentiate (document clearly what this does differently), or escalate (if the overlap is significant enough to revisit the Priority Score).

**Data Quality and Completeness**
AI solutions are only as good as the data they run on. If the initiative depends on CRM fields that are inconsistently populated, signals that aren't being captured, or historical data that doesn't exist yet, document that gap now. A data readiness assessment should be completed in the PRD, not discovered as a surprise during Stage 4.

**Integration Fragility**
Integrations built on undocumented APIs, webhook dependencies, or vendor endpoints that aren't part of a formal agreement are brittle. If a vendor changes an API, a key integration breaks silently. Document which integrations are on stable, supported APIs and which carry fragility risk — the latter need monitoring and a fallback plan.

**Vendor Lock-In** *(Buy path only)*
Evaluate what it would take to migrate off this vendor if needed: data portability, contract exit terms, and whether the capabilities it provides could be replicated with internal tooling or a different vendor. This isn't a reason to avoid buying — it's due diligence that should inform the contracting conversation.

### Workstream Assignments

The workstream assignments were seeded in PRD Section 10 before Stage 4 began. At the start of Stage 4, the Initiative Owner confirms named owners and finalizes target dates. Every workstream needs one person who is accountable for it — not a team, a person. Unassigned workstreams are the primary cause of initiative stall.

**Build Path Workstreams**

| Workstream | Description | Owner | Target Date |
|---|---|---|---|
| Architecture & Design | Data flow, model selection, system design | [Name] | [Date] |
| Hands-on Development | Writing and testing the core solution | [Name] | [Date] |
| Integration & API Management | Connecting to CRM, SEP, warehouse, and other systems; managing API keys and credentials | [Name] | [Date] |
| QA & Internal Testing | Functional testing against the pilot plan spec | [Name] | [Date] |
| Enablement Brief | Drafting the rep-facing guide for pilot onboarding | [Name] | [Date] |
| Project Coordination | Timeline tracking, blocker escalation, status communication | [Name] | [Date] |

**Buy Path Workstreams**

| Workstream | Description | Owner | Target Date |
|---|---|---|---|
| Vendor Evaluation & Selection | Finalizing vendor choice; completing security and IT review | [Name] | [Date] |
| Legal & Procurement | Contracting, DPA, MSA, order form | [Name] | [Date] |
| Technical Onboarding | SSO setup, CRM integration, API key provisioning, data connections | [Name] | [Date] |
| Configuration | Customizing the product to the pilot use case | [Name] | [Date] |
| Integration & API Management | Connecting vendor to internal systems; managing credentials | [Name] | [Date] |
| Enablement Brief | Drafting the rep-facing guide for pilot onboarding | [Name] | [Date] |
| Project Coordination | Timeline tracking, blocker escalation, status communication | [Name] | [Date] |

Throughout Stage 4, the Initiative Owner monitors for scope creep. On the Build path, scope creep typically surfaces as feature expansion. On the Buy path, it surfaces as configuration requests that weren't in the pilot plan. Either way: any material change to scope triggers a re-score on Complexity (C) and Effort (E) and a formal decision on whether to continue, rescope, or kill.

---

## Stage 4 Exit Criteria

An initiative cannot advance to Pilot until all of the following are true:

- [ ] **Solution is functional and internally tested** — the build works as specified; known bugs are documented and triaged
- [ ] **Measurement cadence is established at all three layers** — this is not a one-time data capture. Baselining means building the mechanism to track each metric on its natural cadence (daily, weekly, monthly, or quarterly) before the pilot begins, so that pilot results reflect real before/after movement rather than a point-in-time estimate. This work should begin as early as possible in Stage 4 — not scrambled at the gate. For Level 1 (Behavior) metrics, weekly tracking is typically sufficient. For Level 2 (Indicators), monthly. For Level 3 (Impact), quarterly. The cadence for each metric should be specified in PRD Section 11 and the tracking mechanism confirmed operational before advancing.
- [ ] **Test cohort is identified and prepared** — specific reps or teams are confirmed, have been briefed on participation, and understand the pilot timeline and expectations
- [ ] **Rollback criteria are defined** — the team has agreed in advance on what would trigger a pause or rollback (e.g., adoption below X%, negative rep feedback above Y threshold, data quality issues)
- [ ] **Enablement brief is drafted** — a concise document that tells reps what the tool does, how to use it in their workflow, and what "good" looks like; this is the input for pilot onboarding
- [ ] **PRD reviewed and revised** — the Initiative Owner has updated the PRD to reflect what was actually built or procured: integration realities, data ownership as confirmed, risk disposition changes, workstream changes, and any scope modifications. The revised PRD is the accurate record of what is going into the pilot.

---

## Stage 5: Pilot

**Purpose:** Test the solution with a controlled group to validate impact and identify what needs to change before full rollout.

### Pilot Components

**Scope:** A small, representative cohort — typically one team or one segment. Large enough to generate signal, small enough to contain failure. Cohort selection should be driven by behavior gap, not convenience: prioritize reps who most exhibit the problematic behaviors the initiative is designed to address. Piloting with reps who already perform the desired behaviors produces inflated results that don't replicate at GA. Avoid selecting only your best reps; the pilot should reflect the range of the eventual GA population.

**Timeline:** Long enough to measure the metric that matters. If the goal is pipeline conversion, a two-week pilot is meaningless. If the goal is call quality score improvement, two weeks may be sufficient. Let the metric drive the timeline, not the calendar.

**Intervention Design — Start Low, Escalate Deliberately:** The intervention is what you do to nudge rep behavior in the desired direction. The default assumption in most organizations is that a new tool or behavior change requires training. It usually doesn't — or at least, not immediately.

Design the intervention starting at the lowest-effort mechanism that could plausibly achieve the behavior change, and escalate only when the complexity of the behavior change demands it. From least to most effort: email communication and announcements → documentation and job aids → discussion in existing all-hands or team meetings → self-paced training → live online training → in-person training. Training is the most labor-intensive option for both reps and enablement. It is a last resort, not a default. The CARET Effort score reflects this: a high Effort score should be justified by genuine behavior complexity, not assumed.

When training is required, design it around the full workflow — not the tool in isolation. Don't train reps on "here's how to use [AI tool]." Train them on the specific sales motion the tool supports: What's the talk track? What's the click path? How does the rep transition between tools before, during, and after the interaction? What content will they share, and how do they access it? A rep who understands the tool but not the workflow it lives in will use it inconsistently or not at all.

**Success Metrics — Three Layers:** Measure at all three levels throughout the pilot. Level 1 (Behavior) metrics are your early warning system — if rep behavior isn't changing in the first two weeks, Level 3 will never move, and you have enough signal to intervene before the pilot ends. Level 2 (Indicators) metrics confirm that behavior change is translating into account and opportunity health improvements. Level 3 (Impact) metrics are the go/no-go anchor for the Scale decision, but they require enough elapsed time to be meaningful — let the metric drive the pilot timeline, not the calendar. The gate decision hinges on Level 3, but the diagnostic work hinges on the full three-layer picture.

**Reinforcement During Pilot:** The executive sponsor and frontline managers actively reinforce usage during the pilot period. A pilot that isn't managed like a real initiative produces data about abandonment, not about the tool.

**Structured Feedback Collection:** Reps are surveyed or interviewed at the midpoint and end of the pilot. The question isn't just "did you like it?" — it's "what would need to change for this to be part of how you work every day?"

---

## Stage 5 Exit Criteria

An initiative cannot advance to GA until the panel has made an explicit decision across three possible outcomes:

**Scale:** The pilot hit (or materially exceeded) the success metric. Enablement is ready. Proceed to GA.

**Fix and Re-Pilot:** The pilot revealed a specific, correctable problem. The issue is documented, a fix is scoped, and a second pilot is scheduled. Do not advance to GA on optimism.

**Kill:** The initiative did not produce the expected value and the path to fixing it is unclear or disproportionately expensive. Return the initiative to the queue at a lower priority or retire it. A kill decision is not a failure — it is the framework working correctly.

If the panel chooses Scale, the following must also be true before GA begins:

- [ ] **Enablement team is ready to onboard the full population** — training materials, manager briefs, and reinforcement plan are finalized
- [ ] **Measurement dashboard is built** — GA-state metrics will be tracked in a live dashboard from day one, not reconstructed after the fact
- [ ] **Ownership continuity confirmed** — the Initiative Owner either commits to continuing ownership through GA or formally hands off to a named successor who accepts accountability for adoption, measurement, and ongoing optimization
- [ ] **Accountability Compact is executed** — the conditional commitment captured in PRD Section 13 is converted into a signed agreement; see below

---

## The Accountability Compact: Execution

*This step occurs between Stages 5 and 6 — after the Scale decision is made, before GA launches.*

### What Happens Here

The pilot hit the success metrics. The Scale decision has been made. Now the conditional commitment the executive sponsor made in PRD Section 13 becomes a binding agreement.

This is not a renegotiation. The exec reviewed and conditionally agreed to the specific terms months ago. The Initiative Owner returns with the same document and a simple ask: *"The pilot succeeded. These are the terms you agreed to. Let's execute."*

If the executive sponsor is now reluctant to sign — despite having conditionally agreed — that reluctance is a critical signal. Do not proceed to GA without resolving it. An exec who won't commit at this stage will not hold managers accountable during the 90-day reinforcement arc, and the initiative will decay.

### Execution Checklist

Before GA launch date is set, all of the following must be documented and confirmed:

- [ ] **Compact is signed** — the executive sponsor has formally committed to the four accountability terms agreed to in PRD Section 13
- [ ] **Frontline managers are briefed** — each in-scope manager has been individually briefed on their specific obligations: coaching cadence, metrics they'll be reviewing, and the dashboard they'll use
- [ ] **Coaching cadence is calendared** — dedicated coaching sessions (separate from deal reviews) are on the calendar before GA day one
- [ ] **Exec communication is drafted and scheduled** — the expectation-setting message from leadership to reps and managers is written and has a confirmed delivery date before or at GA launch
- [ ] **Accountability check-in dates are set** — the Initiative Owner and executive sponsor have scheduled at least two check-ins during the first 90 days of GA to review manager coaching compliance alongside behavior change metrics

---

## Stage 6: GA (General Availability)

**Purpose:** Achieve durable, organization-wide adoption and close the feedback loop back to Stage 1.

### The GA Failure Pattern

Most GTM AI initiatives that make it to GA fail here — not with a dramatic crash, but with a slow decay. Usage spikes at launch, drops over 60–90 days as novelty fades and competing priorities emerge, and within two quarters the initiative is effectively dead while still appearing on the roadmap as "complete." The framework addresses this directly.

### The Reinforcement Hierarchy

Not all reinforcement is equal. Before designing the GA reinforcement plan, the team should understand the impact hierarchy and weight their plan accordingly — from most impactful to least:

**1. Accountability** *(most impactful)* — Leadership holding frontline managers accountable for holding reps accountable. This is the foundation. Without it, everything above it degrades. The Accountability Compact executed between Stages 5 and 6 is the mechanism for this.

**2. Manager-Led Coaching** — Dedicated 1:1 or small group coaching sessions focused specifically on the target behaviors and behavior change metrics. Ideally led by frontline managers; can be led by enablement as a fallback (think performance coaches, not trainers). Critically, this must be a separate cadence from deal reviews and pipeline calls — coaching agenda items reliably lose to deal urgency when they share the same meeting.

**3. In-Workflow Documentation** — Training and job aids placed directly in the rep's daily click path, not in a LMS they'll rarely visit. If reps spend their days in the CRM, the support should be in the CRM. This requires either a purpose-built digital adoption platform (Spekit, Guru, WalkMe, and others) or custom CRM configuration. It is harder to build than a training deck, and significantly more effective.

**4. Periodic Micro-Learning** — Brief, focused reinforcement content (mini tutorials, quizzes, scenario prompts) pushed to reps on a regular cadence. Useful for maintaining awareness, not for driving complex behavior change.

**5. Meetings and Internal Communication** *(least impactful)* — Reminders in all-hands meetings, Slack announcements, email updates. These are the easiest to produce and the easiest for reps to ignore. Use them to maintain visibility, not as a substitute for the four mechanisms above.

The reinforcement plan should lead with accountability and coaching. Teams that invert the pyramid — heavy on communications, light on accountability — reliably produce the slow decay pattern described above.

### The First 90 Days

The first 90 days of GA are a managed reinforcement period, not a handoff. Structure it in three phases:

**Days 1–30 (Onboard):** Full population onboarding, with manager-led kickoffs in each team. The executive sponsor delivers the expectation-setting communication committed to in the Accountability Compact — this comes from leadership, not from enablement. The measurement dashboard goes live. Frontline managers begin the dedicated coaching cadence on day one; these sessions should already be calendared from the Compact execution checklist.

**Days 31–60 (Reinforce):** First behavior data (Level 1 metrics) is reviewed in manager coaching sessions using the decoder ring (see below). Identify and address the bottom quartile of adopters — not punitively, but diagnostically. Is the workflow integration confusing? Is management not coaching? Is in-workflow documentation missing from a key click path? Fix the root cause, not the symptom.

**Days 61–90 (Embed):** The tool and the desired behaviors are incorporated into existing operating rhythms — deal reviews, pipeline calls, QBRs. Adoption is no longer a special initiative; it's the expectation. Recognition of high-adoption outcomes (not just usage) is shared publicly by the executive sponsor.

### The Manager Decoder Ring

Managers are not data analysts. A dashboard showing behavior change metrics is only useful if managers know how to interpret the data and translate it into a coaching conversation. Without this, they'll open the dashboard, feel uncertain about what to say, and stop opening it.

For each behavior change metric in the GA dashboard, the Initiative Owner and enablement team produce a decoder ring: a simple guide that specifies what each metric measures, what a healthy vs. concerning reading looks like, and what a manager should say about it in a coaching conversation. The decoder ring is the difference between a manager who reinforces behavior change and one who nods at a chart.

The decoder ring is provided to managers before Day 1 of GA, reviewed in the first dedicated coaching session, and updated if the metrics or target behaviors change.

### Ongoing Measurement

After the first 90 days, the measurement dashboard is reviewed on a defined cadence — typically monthly. The dashboard is structured around the three metric layers:

- **Level 1 — Behavior:** % of target population using the tool at the defined frequency; specific behavioral metrics from the pilot plan (e.g., % of calls incorporating AI insights). This is the earliest decay signal — behavioral dropout almost always precedes outcome degradation.
- **Level 2 — Indicators:** Account and opportunity health metrics (e.g., stage conversion rates, meetings per opportunity). These confirm that sustained behavior is translating into pipeline impact.
- **Level 3 — Impact:** The executive-level outcomes the initiative was funded to move (e.g., win rate, ARR, NRR). Reviewed monthly in the first two quarters; feeds directly into the quarterly roadmap review.
- **Decay signal:** A rolling 30-day trend on Level 1 adoption; a consistent downward trend is an early warning that intervention is needed before the problem reaches Level 3.

### Decay Intervention

When the decay signal fires, the Initiative Owner investigates before the problem compounds. Common causes: manager reinforcement has dropped off, a competing initiative is consuming cognitive load, the tool has a UX or integration issue that emerged at scale. Each cause has a different fix. If the investigation concludes that the initiative should be wound down or resources redirected, the Roadmap Owner is brought in to make that portfolio-level call. Decay left unaddressed becomes abandonment.

### Closing the Loop

Every initiative that completes GA feeds structured learnings back into Stage 1. What did the CARET score get right or wrong? Did Complexity underestimate the build? Did Effort underestimate the change management required? These calibrations improve the scoring panel's accuracy on future initiatives.

The quarterly roadmap review incorporates GA performance data: are live initiatives delivering their promised Results score? If not, the Roadmap Owner investigates whether a correction is needed or whether the initiative should be wound down to free cognitive load capacity for higher-priority work.

---

## Framework Summary

| Stage / Exit Criteria | Purpose | Key Exit Criteria |
|---|---|---|
| **1 — Prioritize** | Score initiatives with CARET; sequence by priority | — |
| **Stage 1 Exit Criteria** | Confirm queue is ready for detailed planning | Panel scored independently; divergences resolved; queue agreed and documented |
| **2 — PRD** | Document path, success metrics, pilot plan, risks, workstreams, and the conditional Accountability Compact | — |
| **Stage 2 Exit Criteria** | Confirm initiative is ready to be scheduled and resourced | Initiative Owner named; 13 PRD sections complete; scoring panel approved; exec sponsor conditionally signed Compact; resources allocated |
| **3 — Calendar** | Place initiatives on Gantt; apply cognitive load constraint | — |
| **Stage 3 Exit Criteria** | Confirm timeline is realistic against portfolio capacity | Placed on calendar; cumulative cognitive load verified; no blackout-window conflicts |
| **4 — Deploy** | Build or buy the solution to pilot-ready state | — |
| **Stage 4 Exit Criteria** | Confirm solution is ready for controlled pilot | Functional build; measurement cadence operational; cohort prepared; rollback criteria set; enablement brief drafted; PRD revised |
| **5 — Pilot** | Test with controlled cohort; make Scale/Fix/Kill decision | — |
| **Stage 5 Exit Criteria** | Confirm Scale decision and GA readiness | Scale decision made; enablement ready; dashboard built; ownership continuity confirmed; Accountability Compact executed |
| **Accountability Compact: Execution** | Convert conditional leadership commitment to binding agreement | Compact signed; managers briefed; coaching cadence calendared; exec communication scheduled |
| **6 — GA** | Drive durable adoption; close feedback loop | Reinforcement hierarchy deployed; 90-day arc managed; decay monitoring active; learnings fed to Stage 1 |
