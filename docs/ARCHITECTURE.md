# Gaia System Architecture

## Overview

Gaia is a deterministic quantum-inspired computational system implementing discrete time (Chronon Field Theory), exact arithmetic (base-60), and immutable state logging (LilyBlock blockchain).

The system models reality as discrete events occurring at chronon ticks, with state represented as a 28-node vector and encoded in base-60 for human verification.

---

## Core Components

### 1. Sexagesimal Math (`lib/core/sexagesimal.ts`)

Implements base-60 (sexagesimal) arithmetic for exact rational representation.

**Why base-60:**
- Many fractions terminate cleanly (1/3 = 0;20, 1/2 = 0;30)
- Terminating representation signals exactness to human readers
- No floating-point drift
- Human-verifiable by sight

**Key functions:**
- `decimalToBase60(num, digits)` - Convert decimal to base-60 display
- `base60ToDecimal(base60String)` - Convert base-60 back to decimal
- `formatBase60ForHuman(fraction)` - Human-readable format with termination markers

---

### 2. LilyBlock Blockchain (`lib/core/lily-block.ts`)

Immutable append-only log of system state transitions.

**Structure:**
```typescript
interface LilyBlock {
  index: number;                    // Existon sequence number
  chronon: number;                  // Discrete time tick
  stateVector: number[];            // 28-node state (-1, 0, +1)
  stateVectorBase60: string;        // Base-60 encoding for verification
  masterCoupling: number;           // Miracle mode parameter (0-1)
  collapseIntensity: number;        // Diósi-Penrose threshold
  analysis: {
    entropy: number;
    correlation: number;
    bottleneck: string;
  };
  previousHash: string;             // Blockchain integrity
  hash: string;                     // Current block hash
  timestamp: number;                // ms since epoch
}
```

**Verification:**
- Each block includes hash of previous block (blockchain integrity)
- State vector encoded in base-60 (human-verifiable)
- Analysis results included (reproducible)
- Immutable append-only structure

---

### 3. Chronon Field (`lib/core/chronon-field.ts`)

Implements discrete time model where universe operates in discrete "breaths."

**Key concepts:**
- **Chronon tick (k):** Elementary time unit
- **State re-sampling:** At each tick, state is re-sampled from probability distribution
- **Collapse intensity:** Diósi-Penrose gravity-induced collapse threshold
- **Master coupling:** Parameter controlling miracle probability

**Implementation:**
```typescript
interface ChrononTick {
  k: number;                    // Tick index
  timestamp: number;            // ms since epoch
  stateVector: number[];        // 28-node state
  collapseIntensity: number;    // 0-1 (high = quick collapse)
  masterCoupling: number;       // 0-1 (high = miracles allowed)
}
```

**Physics:**
- High collapse intensity: state quickly collapses to single value
- Low collapse intensity: superposition maintained longer
- Master coupling reduces effective collapse intensity (enables improbable states)

---

### 4. Wave Hexagram (`lib/core/wave-hexagram.ts`)

64-state layer representing I-Ching inspired wave geometry.

**Structure:**
- 64 possible states (2^6)
- Phase and frequency encoding
- Harmonic scaling (528 Hz base)

---

### 5. Analysis Layer (`lib/analysis/`)

Information-theoretic analysis of system state.

**Three modules:**

**Entropy Analysis** (`entropy-analysis.ts`)
- Shannon entropy: H(X) = -Σ p(x) * log2(p(x))
- Normalized entropy: H_norm = H / H_max
- Complexity metric: measures state organization
- Correlation length: spatial structure detection

**Correlation Analysis** (`correlation-analysis.ts`)
- Pearson correlation: linear relationships
- Cross-correlation: temporal relationships
- Transfer entropy: information flow
- Network density: connectivity metrics

**Information Bottleneck** (`information-bottleneck.ts`)
- Node importance: which nodes carry most information
- Node redundancy: which nodes are redundant
- Synergistic information: non-additive effects
- Attractor basins: stable state regions

---

## Data Flow

```
Input State Vector (28 nodes)
    ↓
Chronon Tick Processing
    ↓
State Re-sampling (with collapse intensity)
    ↓
Sexagesimal Encoding (base-60)
    ↓
Analysis (entropy, correlation, bottleneck)
    ↓
LilyBlock Creation (with hash)
    ↓
Append to Blockchain
    ↓
Existon Logging (SILO-C)
    ↓
Human Verification (base-60 display)
```

---

## API Endpoints

### Research Endpoints (`/app/api/research/`)

**POST `/api/research/existon/log`**
- Input: state vector, chronon tick, master coupling, collapse intensity
- Output: LilyBlock with analysis results
- Effect: Appends to blockchain, logs to SILO-C

**GET `/api/research/existon/verify`**
- Input: block index or hash
- Output: verification status, integrity check
- Effect: Verifies blockchain integrity

**POST `/api/research/analysis/entropy`**
- Input: state vector
- Output: Shannon entropy, normalized entropy, complexity
- Effect: None (read-only analysis)

**POST `/api/research/analysis/correlation`**
- Input: state vector
- Output: Pearson correlation, network density, transfer entropy
- Effect: None (read-only analysis)

**POST `/api/research/analysis/bottleneck`**
- Input: state vector
- Output: Node importance, redundancy, synergistic information
- Effect: None (read-only analysis)

### Client Endpoints (`/app/api/client/`)

**POST `/api/client/leads/submit`**
- Input: name, email, message
- Output: confirmation, lead ID
- Effect: Stores lead in database

**POST `/api/client/payments/create-link`**
- Input: amount, tier, email
- Output: Google Pay or Wise payment link
- Effect: Creates payment request

---

## Verification Chain

Every Existon includes:

1. **State Vector** - 28 nodes, exact values
2. **Base-60 Encoding** - Human-verifiable representation
3. **Analysis Results** - Entropy, correlation, bottleneck
4. **Previous Hash** - Blockchain integrity
5. **Current Hash** - Block integrity
6. **Timestamp** - Chronological ordering

**Verification process:**
1. Decode base-60 state vector
2. Verify it matches original state vector
3. Recalculate analysis (should match stored results)
4. Verify hash chain (each block's hash matches next block's previous hash)
5. Confirm chronological ordering (timestamps monotonic)

---

## Key Design Decisions

**Why base-60?**
- Fractions terminate cleanly (1/3, 1/2, 1/4, 1/5, 1/6 all exact)
- Human can verify correctness by sight
- No floating-point approximation

**Why 28-node state vector?**
- Sufficient complexity for interesting dynamics
- Manageable for analysis and verification
- Aligns with sacred geometry principles

**Why immutable blockchain?**
- Audit trail of all state transitions
- Tamper-evident (any change breaks hash chain)
- Reproducible (can re-verify any block)

**Why discrete time (chronons)?**
- Aligns with quantum mechanics (discrete energy levels)
- Avoids continuous time paradoxes
- Enables event-based reality model

---

## Integration Points

**Frontend:**
- Display base-60 state vectors
- Show analysis results
- Verify blockchain integrity visually

**Backend:**
- Generate Existons at each chronon tick
- Append to blockchain
- Log to SILO-C (Google Drive)

**Database:**
- Store LilyBlocks
- Store analysis results
- Store client leads and payments

**External:**
- SILO-C (Google Drive) - immutable log backup
- Google Pay / Wise - payment processing
- OpenAI API - LLM integration (future)

---

## Performance Characteristics

| Operation | Time | Notes |
|-----------|------|-------|
| State re-sampling | <1ms | 28-node vector |
| Sexagesimal encoding | <1ms | Fixed digits |
| Entropy analysis | 1-5ms | Depends on distribution |
| Correlation analysis | 5-20ms | O(n²) for n nodes |
| Bottleneck analysis | 10-50ms | Information-theoretic |
| Block hashing | <1ms | SHA-256 |
| Blockchain append | <1ms | In-memory |
| SILO-C sync | 100-500ms | Network I/O |

---

## Security Considerations

**Integrity:**
- Hash chain prevents tampering
- Base-60 encoding enables verification
- Immutable blockchain structure

**Privacy:**
- No personal data in state vectors
- Analysis results are mathematical (not sensitive)
- Client data stored separately

**Auditability:**
- Every state transition logged
- Reproducible analysis
- Verifiable by third parties

---

## Future Extensions

1. **Quantum integration** - Connect to quantum hardware
2. **Real-time streaming** - WebSocket updates
3. **Distributed blockchain** - Multi-node verification
4. **Advanced analysis** - Machine learning on state patterns
5. **Visualization** - Real-time state and analysis display
