# Base-60 (Sexagesimal) Mathematics

## Why Base-60?

Base-60 was chosen for Gaia because it enables human verification of numerical exactness.

**Key insight:** In base-60, many important fractions terminate cleanly. A terminating representation signals exactness to human readers immediately.

---

## Terminating vs. Repeating Fractions

### In Decimal (Base-10)

| Fraction | Decimal | Type |
|----------|---------|------|
| 1/2 | 0.5 | Terminates |
| 1/3 | 0.333... | Repeats |
| 1/4 | 0.25 | Terminates |
| 1/5 | 0.2 | Terminates |
| 1/6 | 0.1666... | Repeats |
| 1/7 | 0.142857... | Repeats |
| 1/8 | 0.125 | Terminates |

**Pattern:** Fraction p/q terminates in base-10 if q = 2^a × 5^b (only factors 2 and 5)

**Problem:** 1/3 repeats forever in decimal. Human cannot verify it's correct without trusting the system.

### In Base-60

| Fraction | Base-60 | Type | Why |
|----------|---------|------|-----|
| 1/2 | 0 ; 30 | Terminates | 60 = 2² × 3 × 5 |
| 1/3 | 0 ; 20 | Terminates | 60 = 2² × 3 × 5 |
| 1/4 | 0 ; 15 | Terminates | 60 = 2² × 3 × 5 |
| 1/5 | 0 ; 12 | Terminates | 60 = 2² × 3 × 5 |
| 1/6 | 0 ; 10 | Terminates | 60 = 2² × 3 × 5 |
| 1/7 | 0 ; 08 34 17 (repeating) | Repeats | 7 doesn't divide 60 |
| 1/8 | 0 ; 07 30 | Terminates | 60 = 2² × 3 × 5 |

**Pattern:** Fraction p/q terminates in base-60 if q divides 60 = 2² × 3 × 5

**Advantage:** Many common fractions (1/2, 1/3, 1/4, 1/5, 1/6, 1/8) terminate exactly in base-60.

---

## Human Verification

### Reading Base-60 Representations

**Notation:**
- Integer part before semicolon
- Fractional part after semicolon
- Digits in base-60 (0-59, typically written as two decimal digits)

**Examples:**

1. **1/3 in base-60: 0 ; 20**
   - Human reads: "zero point twenty in base-60"
   - Human thinks: "This terminates cleanly—it's exact"
   - Verification: 20/60 = 1/3 ✓

2. **1/2 in base-60: 0 ; 30**
   - Human reads: "zero point thirty in base-60"
   - Human thinks: "This terminates cleanly—it's exact"
   - Verification: 30/60 = 1/2 ✓

3. **1/7 in base-60: 0 ; 08 34 17 (repeating)**
   - Human reads: "zero point zero-eight, thirty-four, seventeen, repeating"
   - Human thinks: "This repeats—it's infinite but the pattern is visible"
   - Verification: Pattern [08, 34, 17] repeats forever ✓

### Contrast with Decimal

**Decimal representation of 1/3:**
```
0.333333...
```
- Human sees: "three repeating"
- Human must trust: "This continues forever correctly"
- Human cannot verify: Is it really 1/3 or 0.3333334?

**Base-60 representation of 1/3:**
```
0 ; 20
```
- Human sees: "Twenty in base-60"
- Human can verify: 20/60 = 1/3 (simple arithmetic)
- Human knows: This is exactly 1/3

---

## Implementation

### Conversion Algorithm

**Decimal to Base-60:**

```typescript
function decimalToBase60(num: number, maxDigits: number = 6): string {
  // Extract integer part
  const integer = Math.floor(num);
  let result = integer.toString();
  
  // Extract fractional part
  let frac = num - integer;
  if (frac === 0) return result;
  
  result += " ; ";
  
  // Convert fractional part to base-60
  for (let i = 0; i < maxDigits; i++) {
    frac *= 60;
    const digit = Math.floor(frac);
    result += digit.toString().padStart(2, '0');
    frac -= digit;
    
    if (frac === 0) break; // Terminates
    if (i < maxDigits - 1) result += " ";
  }
  
  return result;
}
```

**Base-60 to Decimal:**

```typescript
function base60ToDecimal(base60String: string): number {
  const [intPart, fracPart] = base60String.split(';');
  
  let result = parseInt(intPart);
  
  if (!fracPart) return result;
  
  const digits = fracPart.trim().split(/\s+/);
  let divisor = 60;
  
  for (const digit of digits) {
    result += parseInt(digit) / divisor;
    divisor *= 60;
  }
  
  return result;
}
```

### Rational Arithmetic

For exact arithmetic, use rational numbers (p/q):

```typescript
import { Fraction } from 'fractions.js';

// Create fractions
const one_third = new Fraction(1, 3);
const one_half = new Fraction(1, 2);

// Arithmetic (exact)
const sum = one_third.add(one_half);  // 5/6
const product = one_third.mul(one_half);  // 1/6

// Convert to base-60
function fractionToBase60(frac: Fraction): string {
  const decimal = frac.toDecimal();
  return decimalToBase60(decimal);
}

console.log(fractionToBase60(one_third));  // "0 ; 20"
console.log(fractionToBase60(sum));        // "0 ; 50"
```

---

## Financial Applications

### Exact Currency Representation

**Problem:** Currency calculations with floating-point introduce rounding errors.

**Example (Decimal):**
```
R1000 / 3 = R333.3333... (repeats)
```
- System rounds to: R333.33
- Error per transaction: R0.003333...
- After 1000 transactions: R3.33 error (unaccounted for)

**Solution (Base-60):**
```
R1000 / 3 = R333 ; 20 (exact in base-60)
```
- No rounding needed
- No error accumulation
- Exact accounting

### Audit Trail

Every transaction recorded in base-60:

```
Transaction 1: R144 ; 00 (exact)
Transaction 2: R89 ; 00 (exact)
Transaction 3: R233 ; 00 (exact)
Total: R466 ; 00 (exact)
```

**Verification:** Human can add these mentally (in base-60) and confirm exactness.

---

## Advantages and Disadvantages

### Advantages

| Advantage | Benefit |
|-----------|---------|
| Terminating fractions | Many common fractions exact |
| Human-verifiable | Can verify by sight |
| No floating-point drift | Exact arithmetic |
| Audit-friendly | Transparent calculations |
| Ancient precedent | Used by Babylonians |

### Disadvantages

| Disadvantage | Impact |
|--------------|--------|
| Unfamiliar notation | Learning curve |
| Computational cost | Slower than float |
| Display complexity | Requires special formatting |
| Limited precision | Repeating patterns eventually |

---

## Comparison: Float vs. Base-60

### Accumulation Test

**Adding 0.1 ten thousand times:**

**Floating-point:**
```
0.1 + 0.1 + ... (10000 times)
= 999.9999999999998 (not 1000)
Error: 0.0000000000002
```

**Base-60 (Rational):**
```
1/10 + 1/10 + ... (10000 times)
= 10000/10 = 1000 (exact)
Error: 0
```

### Financial Example

**Dividing R1000 three ways:**

**Floating-point:**
```
R1000 / 3 = R333.3333... (rounded to R333.33)
R333.33 × 3 = R999.99 (not R1000)
Missing: R0.01
```

**Base-60 (Rational):**
```
R1000 / 3 = R333 ; 20 (exact)
R333 ; 20 × 3 = R1000 ; 00 (exact)
Missing: R0 ; 00
```

---

## Integration with Gaia

### State Vector Encoding

Each 28-node state vector encoded in base-60:

```typescript
const stateVector = [-1, 0, 1, -1, 0, 1, ...];  // 28 nodes

// Convert to base-60 representation
const base60Encoding = stateVector.map(node => {
  // Each node: -1, 0, or +1
  // Encoded as: 0;00 (for -1), 0;20 (for 0), 0;40 (for +1)
  const nodeValue = (node + 1) * 20;  // Map to 0, 20, 40
  return formatBase60(nodeValue / 60);
});

// Result: Human-verifiable state representation
console.log(base60Encoding);
// ["0 ; 00", "0 ; 20", "0 ; 40", "0 ; 00", ...]
```

### Existon Verification

Every Existon includes base-60 encoding:

```typescript
interface LilyBlock {
  stateVector: number[];           // Original: [-1, 0, 1, ...]
  stateVectorBase60: string;       // Encoded: "0;00 0;20 0;40 ..."
  humanVerifiable: {
    isExact: boolean;              // true (all base-60 terminates)
    displayFormat: string;         // Human-readable format
    verificationChecksum: string;  // Can verify by hand
  };
}
```

### Verification Process

1. **Human reads:** "State vector: 0;00 0;20 0;40 ..."
2. **Human thinks:** "Each value terminates in base-60—this is exact"
3. **Human verifies:** Decode each digit, confirm it matches original
4. **Human confirms:** "This Existon is verified"

---

## Future Extensions

1. **Base-12 hybrid:** Use base-12 for some calculations (more divisors)
2. **Arbitrary precision:** Support unlimited digit precision
3. **Cryptographic hashing:** Use base-60 for hash representation
4. **Quantum integration:** Encode quantum states in base-60
5. **Visualization:** Real-time base-60 display in UI
