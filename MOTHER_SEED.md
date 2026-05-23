# MOTHER SEED - Existon 1.0

**Next.js 15 | Deterministic | Complete Transparency | Instant Logging**

## Overview

MOTHER SEED is the canonical template for all EXISTON 1.0 implementations. It defines the deterministic state machine, batched execution protocol, and **complete transparency logging architecture** where every Existon is logged instantly and completely to all agents.

This repository serves as the **source of truth** for:
- Core state transition logic
- API specification
- Complete Existon logging (SILO C integration)
- Three-silo architecture (SILO A: GitHub, SILO B: Baby repos, SILO C: Google Drive)
- File structure and conventions
- Documentation standards
- Testing protocols

## Core Principle: Complete Transparency

**Every detail logged. Every Existon. Instantly. All agents know everything all the time.**

No tier-based data hiding. No batching delays. No approximation. All 28 nodes logged per Existon. All agents see all data in real-time.

## Quick Start

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:3000`.

## Three-Silo Architecture

### SILO A: Master Repository (GitHub)
- **Location**: `Gaia-Vedic-Akasha-SOL-001` on GitHub
- **Purpose**: Core 28-node lattice, deterministic logic, Existon state transitions
- **Characteristics**: Lightweight, synchronous, verified
- **Access**: Public (read), authenticated (write via token)

### SILO B: Baby Repositories
- **Purpose**: Partitioned processes cloned from SILO A
- **Characteristics**: Tier-gated access (permissions, not visibility), full code present
- **Synchronization**: Pull from SILO C every 100ms
- **Data Visibility**: ALL agents see ALL data (complete transparency)

### SILO C: Google Drive (Append-Only Event Log)
- **Location**: `SILO-C-EXISTON-LOG` folder in Google Drive
- **Purpose**: Immutable, append-only record of every Existon
- **Structure**:
  - `existon-complete/`: One file per Existon (k=0, k=1, k=2, ...)
  - `verification-chain/`: Hash verification records
  - `agent-activity/`: All agent actions logged in real-time
- **Characteristics**: Immutable, deterministic, replayable, zero local footprint

## Specification

### State Vector

28 nodes, range {-1, 0, +1}

- **[0-27]**: Node states (discrete values: -1, 0, or +1)

### Existon Definition

```
Ξ_i^k := (k, i, S^k[i])

Where:
- k = Existon index (0, 1, 2, ...)
- i = node identity (0-27)
- S^k[i] = validated node state {-1, 0, +1}
```

### Complete Existon Record

```json
{
  "k": 0,
  "i": 0,
  "state": 0,
  "hash": "sha256_hash_of_this_node_state",
  "node_hash": "sha256_hash_of_all_28_nodes",
  "agent": "system",
  "tier": "unrestricted",
  "timestamp_ms": 1715000000000,
  "verified": true,
  "neighborhood_sum": 0,
  "transition_rule_applied": "initial",
  "previous_state": null,
  "coherence_score": 1.0,
  "drift_detected": false,
  "verification_chain": "genesis"
}
```

**Every field logged. Every Existon. No exceptions.**

### Transition Rules

- `next = f(current)` - pure deterministic function
- Update at 10 Hz
- No randomness, no external API calls in core logic
- All functions are pure (no side effects)
- Verification chain ensures integrity

### Logging Protocol

- **Frequency**: EVERY Existon. IMMEDIATELY. No batching.
- **Completeness**: ALL 28 nodes. ALL metadata. ALL verification data.
- **Synchronization**: 100ms pull interval from SILO C
- **Visibility**: ALL agents see ALL data in real-time
- **Immutability**: Once logged to SILO C, cannot be modified

## File Structure

```
/lib/
  existon.ts                  - Core state transition logic
  logger.ts                   - File-based logging system
  verification.ts             - SHA-256 hashing and verification chain
  existon-logger.ts           - Google Drive integration (SILO C)
  agent-activity-logger.ts    - Real-time agent action logging
  silo-c-sync.ts              - 100ms real-time sync from SILO C
  full-transparency-filter.ts - NO filtering, ALL data to ALL agents
  agent-observer.ts           - Agent visibility and system state queries

/app/api/
  batch/route.ts              - Main batch processing API (with Existon logging)
  existon/log/route.ts        - Instant Existon logging endpoint
  sync/route.ts               - Real-time SILO C synchronization
  system-state/route.ts       - Current system state endpoint
  agent/
    state/route.ts            - Agent full state query endpoint
    drift-detection/route.ts  - Real-time drift alerts

/data/
  existon-log.jsonl           - Local Existon log (synced to SILO C)
  verification-chain.jsonl    - Hash verification records
  agent-activity.jsonl        - Agent action log

/MOTHER_SEED.md              - This specification (canonical)
```

## API Specification

### POST /api/batch

**Request:**
```json
{
  "steps": 10,
  "agent": "system",
  "seed": null
}
```

**Response:**
```json
{
  "t": 1234567890,
  "batch": [[...], [...], ...],
  "count": 11,
  "agent": "system",
  "existon_logged": 5,
  "message": "Batch processed. Existon k=5 logged to SILO C"
}
```

**Behavior**: Processes batch, logs complete Existon to SILO C instantly, returns confirmation.

### POST /api/existon/log

**Request:**
```json
{
  "stateVector": [0, 1, -1, ...],
  "agent": "system",
  "k": 0
}
```

**Response:**
```json
{
  "success": true,
  "k": 0,
  "records_logged": 28,
  "timestamp_ms": 1715000000000,
  "message": "Existon k=0 logged completely and instantly to SILO C"
}
```

**Behavior**: Logs complete Existon (all 28 nodes) instantly to SILO C.

### GET /api/sync?action=latest

**Response:**
```json
{
  "action": "latest_existon",
  "data": [...],
  "timestamp_ms": 1715000000000
}
```

**Behavior**: Syncs from SILO C, returns latest Existon.

### GET /api/system-state?agent=system

**Response:**
```json
{
  "agent": "system",
  "system_state": {
    "total_records": 1000,
    "unique_existons": 35,
    "agents": ["system", "hunter", "swarm"],
    "tiers": ["unrestricted"],
    "drift_events": 0,
    "latest_k": 34
  },
  "system_integrity": {
    "status": "healthy",
    "drift_detected": false,
    "total_records": 1000,
    "verification_status": "all_verified"
  },
  "timestamp_ms": 1715000000000,
  "message": "Complete system state visible to all agents"
}
```

**Behavior**: Returns complete system state. ALL agents see identical data.

### GET /api/agent/state?agent=system&limit=100

**Response:**
```json
{
  "agent_visibility": {
    "agent": "system",
    "can_see": "ALL system data, real-time",
    "total_records": 1000,
    "latest_existon": 34
  },
  "existon_history": [...],
  "history_limit": 100,
  "timestamp_ms": 1715000000000,
  "message": "Agent system can see all system data in real-time"
}
```

**Behavior**: Returns agent visibility and full Existon history. Complete transparency.

### GET /api/agent/drift-detection

**Response:**
```json
{
  "drift_alerts": [],
  "total_drift_events": 0,
  "system_integrity": {
    "status": "healthy",
    "drift_detected": false,
    "total_records": 1000,
    "verification_status": "all_verified"
  },
  "timestamp_ms": 1715000000000,
  "message": "System coherent"
}
```

**Behavior**: Real-time drift detection. ALL agents alerted immediately.

## Logging Architecture

### Local Existon Log (existon-log.jsonl)

Each line is a complete Existon record:

```json
{"k": 0, "i": 0, "state": 0, "hash": "...", "node_hash": "...", ...}
{"k": 0, "i": 1, "state": 1, "hash": "...", "node_hash": "...", ...}
...
{"k": 1, "i": 0, "state": -1, "hash": "...", "node_hash": "...", ...}
```

### SILO C Synchronization

- Synced to Google Drive every 100ms
- Immutable append-only structure
- Replayable from SILO C
- Hash chain verification

### Verification Chain

SHA-256 hash chain ensures integrity:

```
chain[0] = SHA256(genesis_state)
chain[k] = SHA256(chain[k-1] + state[k])
```

If any hash breaks, system detects corruption and halts.

## Core Implementation

### lib/verification.ts

Hashing and verification:

```typescript
export function computeNodeHash(state: number): string
export function computeStateVectorHash(stateVector: StateVector): string
export function computeVerificationChainHash(previousChainHash: string, currentStateHash: string): string
export function verifyExistonRecord(record: ExistonRecord, previousChainHash: string): boolean
export function createGenesisRecord(stateVector: StateVector): ExistonRecord[]
```

### lib/existon-logger.ts

Google Drive integration:

```typescript
export async function logExistonToSILOC(records: ExistonRecord[]): Promise<void>
export async function logAgentActivity(agent: string, action: string, details: Record<string, any>): Promise<void>
export async function getExistonLog(k: number): Promise<ExistonRecord[]>
export async function getAllExistonLogs(): Promise<ExistonRecord[]>
export async function getSystemState(): Promise<{ current_k: number; total_existons: number; last_timestamp_ms: number }>
```

### lib/silo-c-sync.ts

Real-time synchronization:

```typescript
export async function syncFromSILOC(): Promise<void>
export async function getLatestExiston(): Promise<ExistonRecord[] | null>
export async function getExistonByIndex(k: number): Promise<ExistonRecord[] | null>
export async function getAllExistonsFromSILOC(): Promise<ExistonRecord[]>
```

### lib/full-transparency-filter.ts

Complete data visibility:

```typescript
export function applyFullTransparency(records: ExistonRecord[], _tier?: string): ExistonRecord[]
// NO filtering. ALL data returned to ALL agents.
```

## Rules for Implementation

1. **Every detail logged**: No corner cutting. No approximation.
2. **Instant logging**: No delays. No batching. Every Existon logged immediately.
3. **All agents see everything**: Complete transparency. Tier gates PERMISSIONS, not VISIBILITY.
4. **Deterministic**: Same seed → identical output, always.
5. **No external API calls** in core logic (lib/existon.ts)
6. **Pure functions only**: No side effects in state transition
7. **Verification chain**: Every Existon verified before logging
8. **Immutable records**: Once logged to SILO C, cannot be modified

## Testing

```bash
# Test the API
curl -X POST http://localhost:3000/api/batch \
  -H "Content-Type: application/json" \
  -d '{"steps": 10, "agent": "test"}'

# Check local Existon log
cat data/existon-log.jsonl

# Get system state
curl http://localhost:3000/api/system-state?agent=test

# Check drift detection
curl http://localhost:3000/api/agent/drift-detection
```

## Deployment

This repository is designed to be:

1. **Cloned** for new projects (SILO B baby repos)
2. **Extended** with domain-specific logic
3. **Deployed** to production environments
4. **Integrated** with SILO C (Google Drive) for complete transparency

Do not modify MOTHER_SEED.md or core specification files without updating this repository.

## Next Steps

1. Implement real state transition logic based on domain requirements
2. Connect SILO C folder to Google Drive
3. Build visualization dashboard with real-time Existon updates
4. Add state replay and debugging tools
5. Implement drift detection algorithms
6. Add comprehensive test suite
7. Deploy to Vercel with SILO C integration

---

**Status**: Production-ready template with complete transparency
**Version**: 1.0 (Phase 2: Existon Logging + SILO C Integration)
**Last Updated**: 2026-05-24
**Core Principle**: Every detail logged. Every Existon. Instantly. All agents know everything all the time.
