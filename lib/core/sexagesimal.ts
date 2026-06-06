/**
 * Sexagesimal (Base-60) Mathematics for Existon Encoding
 * 
 * Implements base-60 arithmetic for wave geometry phase/frequency encoding
 * and Existon state vector compression in the LilyBlock blockchain.
 */

const SEXAGESIMAL_DIGITS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrst';

/**
 * Convert decimal to sexagesimal (base-60)
 */
export function decimalToSexagesimal(num: number): string {
  if (num === 0) return '0';
  
  let result = '';
  let n = Math.abs(num);
  
  while (n > 0) {
    result = SEXAGESIMAL_DIGITS[n % 60] + result;
    n = Math.floor(n / 60);
  }
  
  return num < 0 ? '-' + result : result;
}

/**
 * Convert sexagesimal to decimal
 */
export function sexagesimalToDecimal(str: string): number {
  let result = 0;
  let isNegative = str.startsWith('-');
  const digits = isNegative ? str.slice(1) : str;
  
  for (const digit of digits) {
    const value = SEXAGESIMAL_DIGITS.indexOf(digit);
    if (value === -1) throw new Error(`Invalid sexagesimal digit: ${digit}`);
    result = result * 60 + value;
  }
  
  return isNegative ? -result : result;
}

/**
 * Encode state vector (-1, 0, +1) to sexagesimal
 * Each state is mapped: -1 → 0, 0 → 1, +1 → 2
 * Then packed as base-60 digits
 */
export function encodeStateVectorSexagesimal(stateVector: number[]): string {
  if (stateVector.length !== 28) {
    throw new Error('State vector must have exactly 28 nodes');
  }
  
  // Map states to digits: -1→0, 0→1, +1→2
  const mapped = stateVector.map(s => {
    if (s === -1) return 0;
    if (s === 0) return 1;
    if (s === 1) return 2;
    throw new Error(`Invalid state value: ${s}`);
  });
  
  // Pack into sexagesimal: treat as base-3 first, then convert
  let decimal = 0;
  for (let i = 0; i < 28; i++) {
    decimal += mapped[i] * Math.pow(3, i);
  }
  
  return decimalToSexagesimal(decimal);
}

/**
 * Decode sexagesimal back to state vector
 */
export function decodeStateVectorSexagesimal(encoded: string): number[] {
  const decimal = sexagesimalToDecimal(encoded);
  const stateVector: number[] = [];
  
  let n = decimal;
  for (let i = 0; i < 28; i++) {
    const digit = n % 3;
    if (digit === 0) stateVector.push(-1);
    else if (digit === 1) stateVector.push(0);
    else stateVector.push(1);
    n = Math.floor(n / 3);
  }
  
  return stateVector;
}

/**
 * Encode phase/frequency as sexagesimal (0-360 degrees → 0-60 in base-60)
 */
export function encodePhaseFrequencySexagesimal(degrees: number): string {
  // Normalize to 0-360
  const normalized = ((degrees % 360) + 360) % 360;
  // Convert to 0-60 range
  const scaled = (normalized / 360) * 60;
  return decimalToSexagesimal(Math.round(scaled));
}

/**
 * Decode sexagesimal phase back to degrees
 */
export function decodePhaseFrequencySexagesimal(encoded: string): number {
  const sexagesimalValue = sexagesimalToDecimal(encoded);
  return (sexagesimalValue / 60) * 360;
}

/**
 * Hash a LilyBlock using sexagesimal encoding
 */
export function hashLilyBlockSexagesimal(
  k: number,
  stateVector: number[],
  chrononTick: number,
  masterCoupling: number
): string {
  const kSex = decimalToSexagesimal(k);
  const stateSex = encodeStateVectorSexagesimal(stateVector);
  const tickSex = decimalToSexagesimal(chrononTick);
  const coupSex = decimalToSexagesimal(Math.round(masterCoupling * 1000));
  
  // Concatenate and return as hash
  return `${kSex}:${stateSex}:${tickSex}:${coupSex}`;
}

/**
 * Compute Fibonacci-based scaling factor for harmonic rendering
 */
export function fibonacciScalingFactor(index: number): number {
  const fib = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
  const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
  
  if (index < fib.length) {
    return fib[index] / fib[fib.length - 1];
  }
  
  // Use golden ratio for higher indices
  return Math.pow(phi, index - fib.length) / Math.pow(phi, 10);
}

/**
 * 528 Hz harmonic frequency scaling
 */
export function harmonic528Scale(octave: number): number {
  const baseFreq = 528; // Hz
  return baseFreq * Math.pow(2, octave);
}

export default {
  decimalToSexagesimal,
  sexagesimalToDecimal,
  encodeStateVectorSexagesimal,
  decodeStateVectorSexagesimal,
  encodePhaseFrequencySexagesimal,
  decodePhaseFrequencySexagesimal,
  hashLilyBlockSexagesimal,
  fibonacciScalingFactor,
  harmonic528Scale,
};
