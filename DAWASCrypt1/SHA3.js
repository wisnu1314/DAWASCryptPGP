/* eslint-disable no-shadow */
/* eslint-disable no-bitwise */
/* global BigInt */
const RC = [
  0x0000000000000001n,
  0x0000000000008082n,
  0x800000000000808an,
  0x8000000080008000n,
  0x000000000000808bn,
  0x0000000080000001n,
  0x8000000080008081n,
  0x8000000000008009n,
  0x000000000000008an,
  0x0000000000000088n,
  0x0000000080008009n,
  0x000000008000000an,
  0x000000008000808bn,
  0x800000000000008bn,
  0x8000000000008089n,
  0x8000000000008003n,
  0x8000000000008002n,
  0x8000000000000080n,
  0x000000000000800an,
  0x800000008000000an,
  0x8000000080008081n,
  0x8000000000008080n,
  0x0000000080000001n,
  0x8000000080008008n,
];
const R = [
  0n,
  36n,
  3n,
  41n,
  18n,
  1n,
  44n,
  10n,
  45n,
  2n,
  62n,
  6n,
  43n,
  15n,
  61n,
  28n,
  55n,
  25n,
  21n,
  56n,
  27n,
  20n,
  39n,
  8n,
  14n,
];
export default function keccak256(message) {
  // State variables
  let state = new Array(25).fill(0n);

  // Padding
  message += String.fromCharCode(0x01); // Add the first bit of padding
  while ((message.length * 8) % 1088 !== 0) {
    message += String.fromCharCode(0x00);
  }
  message += String.fromCharCode(0x80); // Add the last bit of padding

  // Absorbing phase
  const blockSize = 1088 / 8;
  for (let i = 0; i < message.length; i += blockSize) {
    const block = message.slice(i, i + blockSize);
    for (let j = 0; j < blockSize / 8; j++) {
      state[j] ^= BigInt(block.slice(j * 8, j * 8 + 8).charCodeAt());
    }
    keccak_f(state);
  }

  // Squeezing phase
  const hashSize = 256 / 8;
  let hash = '';
  while (hash.length < hashSize) {
    for (let i = 0; i < blockSize / 8 && hash.length < hashSize; i++) {
      const byte = (state[i / 8] >> (8n * (i % 8))) & 0xffn;
      hash += String.fromCharCode(Number(byte));
    }
    if (hash.length < hashSize) {
      keccak_f(state);
    }
  }

  return hash;
}

function keccak_f(state) {
  for (let i = 0; i < 24; i++) {
    // Theta step
    const C = new Array(5).fill(0n);
    const D = new Array(5).fill(0n);
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        C[x] ^= state[x + 5 * y];
      }
    }
    for (let x = 0; x < 5; x++) {
      D[x] = C[(x + 4) % 5] ^ ((C[(x + 1) % 5] << 1n) | (C[(x + 1) % 5] >> 7n));
      for (let y = 0; y < 5; y++) {
        state[x + 5 * y] ^= D[x];
      }
    }

    // Rho and pi steps
    let [x, y] = [1, 0];
    let current = state[x + 5 * y];
    for (let t = 0; t < 24; t++) {
      const [nextX, nextY] = [y, (2 * x + 3 * y) % 5];
      const next = state[nextX + 5 * nextY];
      current = BigInt(current);
      const r = R[t] === 0 ? 0n : BigInt(R[t]);
      let shifted = current << r;
      if (r === 0n) {
        shifted = current;
      } else {
        shifted = current << r;
      }
      state[nextX + 5 * nextY] =
        (shifted | (current >> (BigInt(64) - r))) ^ RC[t];
      [x, y, current] = [nextX, nextY, next];
    }

    // Chi step
    for (let y = 0; y < 5; y++) {
      const T = new Array(5);
      for (let x = 0; x < 5; x++) {
        T[x] =
          state[x + 5 * y] ^
          (~state[((x + 1) % 5) + 5 * y] & state[((x + 2) % 5) + 5 * y]);
      }
      for (let x = 0; x < 5; x++) {
        state[x + 5 * y] = T[x];
      }
    }

    // Iota step
    state[0] ^= RC[i];
  }
}
