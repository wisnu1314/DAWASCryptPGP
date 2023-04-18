// npm install starkbank-ecdsa 

var ellipticcurve = require("starkbank-ecdsa");
var Ecdsa = ellipticcurve.Ecdsa;
var PrivateKey = ellipticcurve.PrivateKey;

// Generate new Keys
let privateKey = new PrivateKey();
let publicKey = privateKey.publicKey();

let message = "My test message";

// Generate Signature
let signature = Ecdsa.sign(message, privateKey);

// Verify if signature is valid
console.log(Ecdsa.verify(message, signature, publicKey));