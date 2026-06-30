# PHN — Proof of Help Network

> "Help others. Earn CRED. Own your reputation forever."

PHN is an onchain Q&A and reputation network built on Canopy blockchain. Every question, answer, vote, endorsement, and tribe action is a signed Canopy transaction. Reputation (CRED) is calculated by reading transaction history back from the chain, not from a database a platform admin could edit.

Built for Canopy Vibe Code Contest #2 (Social-Fi theme).

---

## One-line pitch

The onchain Q&A network where helping others earns CRED reputation that nobody can take from you.

---

## The idea

Most platforms turn your contributions into someone else's asset. You answer questions, build a following, earn endorsements — and all of it sits inside a company's database, shaped by their incentives, not yours. Leave the platform and it's gone. Get moderated and it's gone. The platform changes its algorithm and your visibility is gone.
PHN treats reputation as something that should belong to the person who earned it. Every action that builds your standing — asking a good question, giving a helpful answer, being voted accurate, being followed or endorsed — happens as a real transaction on Canopy. CRED isn't a feature inside an app; it's a record on a chain that exists independently of whether PHN itself keeps running.
---

## What's verifiably onchain

These are read back from Canopy transaction history at display time, not from local state:

- **CRED score** — derived from `reward_reputation` transactions targeting an address
- **Vote counts** (Helpful / Accurate) — derived from `verify_answer` transactions
- **Tribe membership** — derived from `join_tribe` transactions
- **Account balance** — derived from chain transaction count and fees
- **Profiles** — username, bio, and tags are stored directly in `create_profile` / `update_profile` transaction payloads and can be reconstructed from chain alone
- **Question metadata** — title, category, and tags are stored directly in `create_question` transaction payloads
- **Content integrity** — questions and answers are SHA-256 hashed and the hash is recorded onchain; the displayed content is checked against this hash and flagged if it doesn't match

You can verify this yourself: edit the cached CRED or vote values in `localStorage` (e.g. `phn_profiles[address].reputationScore`) and refresh. The tampered value will not persist — within moments of load, CRED is recalculated from chain transaction history and the correct value overwrites whatever was edited.

## Known limitation (stated plainly)

Full question and answer body text is currently cached client-side rather than included as a raw field in the transaction payload. A SHA-256 hash of that content is recorded onchain for integrity verification, but the plugin's current message schema only carries that hash — not the full text. As a result, body text does not yet survive a completely fresh browser with empty cache, even though the question/answer's existence, author, and metadata do (they're reconstructed from chain). Reputation (CRED), vote counts, tribe membership, and balance — the parts of the Social-Fi thesis that matter most — do not share this limitation: they are recalculated from chain transaction history on every page load, and a tampered local cache value is overwritten by the correct chain-derived value rather than trusted, as verified by directly editing `localStorage` and observing the value reset on refresh.

Pin-to-highlight on tribe questions is currently a client-side curation feature and is not yet backed by its own onchain transaction type.

---

## 15 custom Canopy transaction types

| Category | Transactions |
|---|---|
| Identity | `create_profile`, `update_profile` |
| Knowledge | `create_question`, `submit_answer`, `accept_answer`, `dispute_answer` |
| Reputation | `verify_answer`, `stake_reputation`, `reward_reputation`, `penalty_reputation` |
| Social | `follow_user`, `endorse_member`, `create_tribe`, `join_tribe`, `send` |

All 15 are implemented in the plugin and visible firing in the Reputation Explorer during normal use.

---

## How CRED works

- Submitting an answer: **0 CRED** — nothing is owed just for showing up
- Someone marks your answer **Helpful**: **+5 CRED**, paid as a real `reward_reputation` transaction, plus a 100 PROOFH tip sent peer-to-peer
- Someone marks your answer **Accurate**: **+5 CRED**, same mechanism
- Disputes are handled separately via `dispute_answer` + `penalty_reputation`
- There is no decay and no way to buy CRED — every point traces back to a specific transaction from a specific address

---

## Token

- **CRED** — non-transferable onchain reputation score
- **$PROOFH** — the platform's utility/fee token, used to pay the 1,000-PROOFH fee on each action and sent peer-to-peer as a 100-PROOFH tip when a vote rewards an answer

New accounts receive 50,000 PROOFH from the faucet on signup (sent via a real `send` transaction from the validator address), enough for roughly 40+ actions.

---

## Tech stack

- Canopy Network v0.1.18+beta — TypeScript plugin template
- React 19 + Vite + TypeScript
- BLS12-381 signing via `@noble/curves`
- Manual protobuf encoding for transaction signing
- RPC: `localhost:50002` (query) / `localhost:50003` (admin)

---

## Run locally

```bash
# Terminal 1 — start the Canopy node
~/go/bin/canopy start

# Terminal 2 — start the frontend
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`, sign up, and you'll receive 50,000 PROOFH to start asking and answering questions.

---

## Features

- Onchain identity — wallet-backed profiles, BLS12-381 signed
- Q&A feed with category filters and search
- Helpful/Accurate voting that pays real CRED and PROOFH rewards
- Accept-answer and dispute flows
- Tribes — communities with onchain membership, member leaderboards, and tribe-tagged questions
- Follow and endorse other users onchain
- Reputation Explorer — live, scrolling feed of every transaction type landing on the chain
- Devtools-resistant reputation: editing cached values is overwritten by the correct chain-derived value on refresh

---

## Repository structure

proof-of-help-network/
├── frontend/        React + Vite frontend
├── typescript/      Canopy TypeScript plugin (15 custom message types)
└── tutorial/        Canopy template tooling and test scripts

---

## Demo video

[link here]

---

## Builder
Discord: fideliscrypt
