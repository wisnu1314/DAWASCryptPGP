// npm install blueimp-md5
// npm install seedrandom

var md5 = require("blueimp-md5");
// var shuffleSeed = require('shuffle-seed');
var utf8 = require('utf8');
var crypto = require('crypto')

function generateuniquekey(length){
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

const ROUNDS = 16;
const BLOCKSIZE = 16;
const BLOCKSIZE_BITS = 16;
const UNIQUE = generateuniquekey(36);
 /*
function shuffle(message, key){
    var shuffled = new Array(message.length);
    for (let i = 0; i > message.length; i++){
        shuffled[i] = message[i];
    }
    shuffleSeed.shuffle(shuffled,key);
    
    return shuffled;
}

function unshuffle(shuffled_message, key){
    var l = new Array(message.length);
    shuffleSeed.unshuffle(l,key);
    for (i, x in enumerate(l)){
        
        out[x] = shuffled_message[i];
    }
    return out;
}
*/

function encryptMessage(key, message, mode){
    var ciphertext = "";
    var n = BLOCKSIZE;
    var b_message = new Array(message.length/n);

    var len = message.length;

    for (let i = 0; i < (len/n); i++){
        b_message[i] = message.slice(0,n);
        message = message.slice(n);
    }

    var lastBlockLength = b_message[b_message.length - 1].length;

    if (lastBlockLength < BLOCKSIZE){
        for (let i = lastBlockLength; i < BLOCKSIZE; i++){
            message[message.length - 1] += " ";
        }
    }

    var key = key_md5(key);
    var key_initial = key;
    var ctr = 0;

    console.log(b_message);

    for (let i = 0; i < b_message.length ; i++) {
        var sbox = generatesbox(key);
        var L = new Array(ROUNDS +1);
        var R = new Array(ROUNDS +1);
        
        L[0] = b_message[i].slice(0, BLOCKSIZE/2);
        R[0] = b_message[i].slice(BLOCKSIZE/2);
        //console.log(L[0]);

        for (let i = 1; i < (ROUNDS+1); i++){
            var round_key = subkeygen(i.toString(), key, i)
            var LR_im = R[i - 1].slice(0, BLOCKSIZE / 4);
            var RR_im = R[i - 1].slice(BLOCKSIZE / 4);
            //console.log(RR_im);
            
            /*
            console.log(LR_im);
            console.log(RR_im);
            console.log(round_key);
            console.log(sbox);
            console.log(transform(RR_im, i, round_key, sbox));
            */
            var LL_i = RR_im;
            var RL_i = xor(LR_im, transform(RR_im, i, round_key, sbox));

            L[i] = LL_i + RL_i;
            R[i] = xor(L[i - 1], transform(R[i - 1], i, round_key, sbox));
        }

        var partial_message = L[ROUNDS] + R[ROUNDS];
        
        ciphertext += partial_message
        if (mode == "cbc"){
            key = subkeygen(L[0], key, i);
        }
        if (mode == "counter"){
            key = subkeygen(ctr.toString(), key_initial, i);
            ctr += 1;
        }
    }
    return message;

}

function decryptMessage(key, ciphertext, mode){
    var message = "";
    ciphertext = "Theories about learning with multimedia can be positioned at different levels. At a basic level, psychological theories describe memory systems and cognitive processes that explain how people process different types of information and how they learn with different senses."
    var n = BLOCKSIZE;
    var b_ciphertext = new Array(ciphertext.length/n);;

    console.log(ciphertext);
    var len = ciphertext.length;

    for (let i = 0; i < (len/n); i++){
        b_ciphertext[i] = ciphertext.slice(0,n);
        ciphertext = ciphertext.slice(n);
    }
    console.log(b_ciphertext);

    var lastBlockLength = b_ciphertext[b_ciphertext.length - 1].length;

    if (lastBlockLength < BLOCKSIZE){
        for (let i = lastBlockLength; i < BLOCKSIZE ; i++){
            ciphertext[ciphertext.length - 1] += " ";
        } 
    }

    var key = key_md5(key);
    var key_initial = key;
    var ctr = 0;

    for (block in b_ciphertext) {
        var sbox = generatesbox(key);
        var L = new Array(ROUNDS +1);
        var R = new Array(ROUNDS +1);
        L[ROUNDS] = block.slice(0, BLOCKSIZE/2);
        R[ROUNDS] = block.slice(BLOCKSIZE/2);

        for (let i = ROUNDS; i > 0; i--){
            var round_key = subkeygen(i.toString, key, i)
            var LL_i = L[i].slice(0, BLOCKSIZE / 4);
            var RL_i = L[i].slice(BLOCKSIZE / 4);
                
            var RR_im = LL_i;
            var LR_im = xor(RL_i, transform(RR_im, i, round_key, sbox));
            
            R[i - 1] = LR_im + RR_im;
            L[i - 1] = xor(R[i], transform(R[i - 1], i, round_key, sbox));
        }

        var partial_message = L[0] + R[0];
        
        message += partial_message
        if (mode == "cbc"){
            key = subkeygen(L[0], key, i);
        }
        if (mode == "counter"){
            key = subkeygen(ctr.toString, key_initial, i);
            ctr += 1;
        }
    }
    return message;
}

function key_md5(key){
    var md5hash = crypto.createHash('md5');
    md5hash.update(new Buffer(key+UNIQUE, 'utf8'));
    md5val = md5hash.digest('hex');
    return md5val;
}
    
function subkeygen(s1, s2, i){
    var md5hash = crypto.createHash('md5');
    md5hash.update(new Buffer(s1+s2, 'utf8'));
    md5val = md5hash.digest('hex');
    return md5val;
}

function transform(x, i, k, sbox){
    k = stobin(k);
    //console.log(k);
    x = stobin(x.toString());
    //console.log(x);
    if (x.length == 32){
        var out = "";
        for (let i = 0; i < 8; i++){
            val = bintoint(x.slice(i * 4, i * 4 + 4));
            out += bin(sbox[i].index(val)).slice(2).zfill(4);
        }
        out = out.slice(4, out.length) + out.slice(0, 4);
    }
    else {
        out = x;
    }
    
    var k = bintoint(k);
    var x = bintoint(out);

    var res = Math.pow((x * k), i);
    return itobin(res);
}

// xor two strings
function xor(a, b){
    var res = "",
        l = Math.max(a.length, b.length);
    for (var i=0; i<l; i+=4)
        res = ("000"+(parseInt(a.slice(-i-4, -i||a.length), 16) ^ parseInt(b.slice(-i-4, -i||b.length), 16)).toString(16)).slice(-4) + res;
    return res;
}
// string to binary with length 8
function stobin(s){
    const numString = s.toString(16);
    length = s.length;
    return numString.length === length ?
      numString :
      padStart(numString, length - numString.length, "0")
}

function padStart(string, length, char) {
    return length > 0 ?
      padStart(char + string, --length, char) :
      string;
}

// binary to decimal
function bintoint(s){
    return parseInt(s, 2);
}

//decimal to binary to string
function itobin(dec) {
    return (dec >>> 0).toString(2);
}

// hexadecimal to decimal
function hextodec(s){
    return parseInt(s, 16);
}

function generatesbox(key){
    var sb1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    var sb2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    var sb3 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    var sb4 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    var sb5 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    var sb6 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    var sb7 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    var sb8 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    for (let i = 1; i < 9; i++){
        for (let j = 1; j < 17; j++){
            switch(i) {
                case 1:
                    var hdec1 = (hextodec(key.slice((j - 1) * 2, (j - 1) * 2 + 2)) + i + j) % 16;
                    sb1 = sb1.slice(hdec1) + sb1.slice(0, hdec1);
                    break;
                case 2:
                    var hdec2 = (hextodec(key.slice((j - 1) * 2, (j - 1) * 2 + 2)) + i + j) % 16;
                    sb2 = sb2.slice(-hdec2) + sb2.slice(0, -hdec2);
                    break;
                case 3:
                    var hdec3 = (hextodec(key.slice((j - 1) * 2, (j - 1) * 2 + 2)) + i + j) % 16;
                    sb3 = sb3.slice(hdec3) + sb3.slice(0, hdec3);
                    break;
                case 4:
                    var hdec4 = (hextodec(key.slice((j - 1) * 2, (j - 1) * 2 + 2)) + i + j) % 16;
                    sb4 = sb4.slice(-hdec4) + sb4.slice(0, -hdec4);
                    break;
                case 5:
                    var hdec5 = (hextodec(key.slice((j - 1) * 2, (j - 1) * 2 + 2)) + i + j) % 16;
                    sb5 = sb5.slice(hdec5) + sb5.slice(0, hdec5);
                    break;
                case 6:
                    var hdec6 = (hextodec(key.slice((j - 1) * 2, (j - 1) * 2 + 2)) + i + j) % 16;
                    sb6 = sb6.slice(-hdec6) + sb6.slice(0, -hdec6);
                    break;
                case 7:
                    var hdec7 = (hextodec(key.slice((j - 1) * 2, (j - 1) * 2 + 2)) + i + j) % 16;
                    sb7 = sb7.slice(hdec7) + sb7.slice(0, hdec7);
                    break;
                case 8:
                    var hdec8 = (hextodec(key.slice((j - 1) * 2, (j - 1) * 2 + 2)) + i + j) % 16;
                    sb8 = sb8.slice(-hdec8) + sb8.slice(0, -hdec8);
                    break;
            }
        }
    }
    sb = [ sb1, sb2, sb3, sb4, sb5, sb6, sb7, sb8 ];
    return sb;
}

function determineMode(inp){
    if(inp % 2 == 0) {
        return "cbc";
    }
    else if (inp % 3 == 1) {
        return "ecb";
    } 
    else {
        return "counter";
    }
}

plaintextinp1 = "Theories about learning with multimedia can be positioned at different levels. At a basic level, psychological theories describe memory systems and cognitive processes that explain how people process different types of information and how they learn with different senses.";
keyinp1 = "ameagari no niji ma";
mode1 = determineMode(1);

ciptext1 = encryptMessage(keyinp1, plaintextinp1, mode1);
console.log("===========test============");
console.log(ciptext1);


plaintext1 = decryptMessage(keyinp1, ciptext1, mode1);
console.log(plaintext1);
