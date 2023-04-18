// npm install blueimp-md5
// npm install seedrandom

var md5 = require("blueimp-md5");
var shuffleSeed = require('shuffle-seed');

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

ROUNDS = 16;
BLOCKSIZE = 16;
BLOCKSIZE_BITS = 16;
UNIQUE = generateuniquekey(36);

function shuffle(message, key){
    shuffled = new Array(message.length);
    for (let i = 0; i > message.length; i++){
        shuffled[i] = message[i];
    }
    shuffleSeed.shuffle(shuffled,key);
    
    return shuffled;
}

function unshuffle(shuffled_message, key){
    l = new Array(message.length);
    shuffleSeed.unshuffle(l,key);
    for (i, x in enumerate(l)){
        out[x] = shuffled_message[i];
    }
    return out;
}


function encrypt(key, message, mode){
    ciphertext = "";
    n = BLOCKSIZE;

    message = function () {
        var _pj_a = [],
            _pj_b = range(0, message.length, n);
      
        for (var _pj_c = 0, _pj_d = _pj_b.length; _pj_c < _pj_d; _pj_c += 1) {
          var i = _pj_b[_pj_c];
      
          _pj_a.push(message.slice(i, i + n));
        }
      
        return _pj_a;
    }.call(this);

    lastBlockLength = message[message.length - 1].length;

    if (lastBlockLength < BLOCKSIZE){
        for (let i = lastBlockLength; i < BLOCKSIZE; i++){
            message[message.length - 1] += " ";
        }
    }

    key = key_md5(key);
    key_initial = key;
    ctr = 0;

    for (block in message) {
        sbox = generatesbox(key);
        L = [""] * (ROUNDS + 1);
        R = [""] * (ROUNDS + 1);
        L[0] = block.slice(0, BLOCKSIZE/2);
        R[0] = block.slice(BLOCKSIZE/2);

        for (let i = 1; i < (ROUNDS+1); i++){
            round_key = subkeygen(str(i), key, i)
            LR_im = R[i - 1].slice(0, BLOCKSIZE / 4);
            RR_im = R[i - 1].slice(BLOCKSIZE / 4);

            RR_im = LL_i;
            LR_im = xor(RL_i, transform(RR_im, i, round_key, sbox));
            
            LL_i = RR_im;
            RL_i = xor(LR_im, transform(RR_im, i, round_key, sbox));

            L[i] = LL_i + RL_i;
            R[i] = xor(L[i - 1], transform(R[i - 1], i, round_key, sbox));
        }

        partial_message = L[ROUNDS] + R[ROUNDS];
        shuffle(partial_message, key)
        message += partial_message
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

function decrypt(key, ciphertext, mode){
    message = "";
    n = BLOCKSIZE;

    ciphertext = function () {
        var _pj_a = [],
            _pj_b = range(0, ciphertext.length, n);
      
        for (var _pj_c = 0, _pj_d = _pj_b.length; _pj_c < _pj_d; _pj_c += 1) {
          var i = _pj_b[_pj_c];
      
          _pj_a.push(ciphertext.slice(i, i + n));
        }
      
        return _pj_a;
    }.call(this);

    lastBlockLength = ciphertext[ciphertext.length - 1].length;

    if (lastBlockLength < BLOCKSIZE){
        for (let i = lastBlockLength; i < BLOCKSIZE ; i++){
            ciphertext[ciphertext.length - 1] += " ";
        } 
    }

    key = key_md5(key);
    key_initial = key;
    ctr = 0;

    for (block in ciphertext) {
        sbox = generatesbox(key);
        L = [""] * (ROUNDS + 1);
        R = [""] * (ROUNDS + 1);
        L[ROUNDS] = block.slice(0, BLOCKSIZE/2);
        R[ROUNDS] = block.slice(BLOCKSIZE/2);

        for (let i = ROUNDS; i > 0; i--){
            round_key = subkeygen(str(i), key, i)
            LL_i = L[i].slice(0, BLOCKSIZE / 4);
            RL_i = L[i].slice(BLOCKSIZE / 4);

            RR_im = LL_i;
            LR_im = xor(RL_i, transform(RR_im, i, round_key, sbox));
            
            R[i - 1] = LR_im + RR_im;
            L[i - 1] = xor(R[i], transform(R[i - 1], i, round_key, sbox));
        }

        partial_message = L[0] + R[0];
        unshuffle(partial_message, key)
        message += partial_message
        if (mode == "cbc"){
            key = subkeygen(L[0], key, i);
        }
        if (mode == "counter"){
            key = subkeygen(str(ctr), key_initial, i);
            ctr += 1;
        }
    }
    return message;
}

function key_md5(key){
    return (md5((key+UNIQUE).encode('utf-8')));
}
    
function subkeygen(s1, s2, i){
    result = md5((s1+s2).encode('utf-8'));
    return result
}
    


function transform(x, i, k, sbox){
    k = stobin(k);
    x = stobin(x.toString());
    if (x.lenth == 32){
        out = "";
        for (let i = 0; i < 8; i++){
            val = bintoint(x.slice(i * 4, i * 4 + 4));
            out += bin(sbox[i].index(val)).slice(2).zfill(4);
        }
        out = out.slice(4, out.length) + out.slice(0, 4);
    }
    else {
        out = x
    }
    k = bintoint(k);
    x = bintoint(out);
    res = pow((x * k), i);
    res = itobin(res);
    return bintostr(res);
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
    const numString = num.toString(radix);
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
    return parseInt(x, 2);
}

//decimal to binary to string
function inttobin(dec) {
    return (dec >>> 0).toString(2);
}

// hexadecimal to decimal
function hextodec(s){
    return parseInt(hex, s);
}

function generatesbox(key){
    sb1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    sb2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    sb3 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    sb4 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    sb5 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    sb6 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    sb7 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    sb8 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    for (let i = 1; i < 9; i++){
        for (let j = 1; j < 17; j++){
            switch(i) {
                case 1:
                    hdec1 = (hextodec(key.slice((j - 1) * 2, (j - 1) * 2 + 2)) + i + j) % 16;
                    sb1 = sb1.slice(hdec1) + sb1.slice(0, hdec1);
                    break;
                case 2:
                    hdec2 = (hextodec(key.slice((j - 1) * 2, (j - 1) * 2 + 2)) + i + j) % 16;
                    sb2 = sb2.slice(-hdec2) + sb2.slice(0, -hdec2);
                    break;
                case 3:
                    hdec3 = (hextodec(key.slice((j - 1) * 2, (j - 1) * 2 + 2)) + i + j) % 16;
                    sb3 = sb3.slice(hdec3) + sb3.slice(0, hdec3);
                    break;
                case 4:
                    hdec4 = (hextodec(key.slice((j - 1) * 2, (j - 1) * 2 + 2)) + i + j) % 16;
                    sb4 = sb4.slice(-hdec4) + sb4.slice(0, -hdec4);
                    break;
                case 5:
                    hdec5 = (hextodec(key.slice((j - 1) * 2, (j - 1) * 2 + 2)) + i + j) % 16;
                    sb5 = sb5.slice(hdec5) + sb5.slice(0, hdec5);
                    break;
                case 6:
                    hdec6 = (hextodec(key.slice((j - 1) * 2, (j - 1) * 2 + 2)) + i + j) % 16;
                    sb6 = sb6.slice(-hdec6) + sb6.slice(0, -hdec6);
                    break;
                case 7:
                    hdec7 = (hextodec(key.slice((j - 1) * 2, (j - 1) * 2 + 2)) + i + j) % 16;
                    sb7 = sb7.slice(hdec7) + sb7.slice(0, hdec7);
                    break;
                case 8:
                    hdec8 = (hextodec(key.slice((j - 1) * 2, (j - 1) * 2 + 2)) + i + j) % 16;
                    sb8 = sb8.slice(-hdec8) + sb8.slice(0, -hdec8);
                    break;
            }
        }
    }
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