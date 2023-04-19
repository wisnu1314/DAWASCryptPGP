let string = require('./stringutils');
let utils = require('./numberutils');
var rate = 6;
var Fwidth = 128;

module.exports = {
  /**
   *
   * @param {Array} input
   */
  hashAlphaNumeric: function (input) {
    let i = 0;
    let str = '';
    let begin = '0'.charCodeAt(0);
    let end = 'z'.charCodeAt(0);
    while (i < input.length) {
      str += String.fromCharCode((input[i] % (end - begin)) + begin);
      i++;
    }
    return str;
  },
  /**
   * Pads array so that array.length % rate == 0
   * @param {Array} input
   */
  padArray: function (input) {
    let i = 0;
    while (input.length % rate !== 0) {
      input.push(input[i] ** 2 % 256);
    }
    return input;
  },
  /**
   * Breaks array to n-arrays of length (rate)
   * input.length % rate must be 0
   * @param {Array} input
   * @returns {any[][]}
   */
  breakArray: function (input) {
    let out = [];
    while (input.length > 0) {
      out.push(input.splice(0, rate));
    }
    return out;
  },
  /**
   * Keccak absorbtion function
   * @param {any[][]} PP
   * @param {Array} S
   */
  absorb: function (PP, S) {
    let i = 0;
    while (i < PP.length) {
      let droplet = PP[i];
      let j = 0;
      while (droplet.length < Fwidth) {
        droplet.push(droplet[j % droplet.length]);
        j++;
      }
      S = utils.XORArrays(droplet, S);
      S = utils.permutate(S);
      // console.log("S: ", i, " = ", S);
      i++;
    }
    return S;
  },
  /**
   * Keccak squeeze function
   * Squeezes S rate-by-rate
   * @param {Array} S
   * @param {Number} outputSize
   */
  squeeze: function (S, outputSize) {
    let Z = [];
    while (Z.length < outputSize) {
      let droplet = S.splice(0, rate);
      Z = Z.concat(droplet);
      S = utils.permutate(S);
    }
    return Z;
  },
  /**
   *
   * @param {String} plaintext
   * @param {Number} outputSize
   */
  hash: function (plaintext, outputSize) {
    // Sets Fwidth
    if (outputSize > Fwidth) {
      Fwidth = outputSize * 2;
    }

    // Converts plaintext to array of ascii codes, then Pad&Break
    let P = string.toASCII(plaintext);
    P = this.padArray(P);
    // console.log(P);
    let PP = this.breakArray(P);

    // Initiate an array of Fwidth zeros
    let S = Array(Fwidth);
    S.fill(0);

    // console.log("Begin Absorption");
    S = this.absorb(PP, S);

    // console.log("Begin Squeezing");
    let Z = this.squeeze(S, outputSize);
    Z = Z.splice(0, outputSize);
    // console.log(Z);

    return this.hashAlphaNumeric(Z);
  },
};
