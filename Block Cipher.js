// npm install md5

/*Problem :
- Caranya ngeseed random
*/

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

const generator = new Math.seedrandom('[your seed here]');
const randomNumber = generator();

function shuffle(message, key){
    //random.seed(key)
    l = new Array(message.length);
    //random.shuffle(l)
    return ; //[message[x] for x in l];
}

function unshuffle(shuffled_message, key){
    //random.seed(key)
    l = new Array(message.length);
    //random.shuffle(l)
    //for i, x in enumerate(l):
    //  out[x] = shuffled_message[i]
    return out;
}

function encrypt(key, message, mode){
    ciphertext = "";
    n = BLOCKSIZE;

    message = 

    lastBlockLength = message[message.length - 1].length;

    if (lastBlockLength < BLOCKSIZE){
        for (let i = lastBlockLength; i < BLOCKSIZE; i++){
            message[message.length - 1] += " ";
        }
    }
}

function decrypt(key, ciphertext, mode){
    message = "";
    n = BLOCKSIZE;

}

function transform(x, i, k, sbox){
    k = stobin(k);
    x = stobin()
    if (x.lenth == 32){
        out = "";
        for (let i = 0; i < 8; i++){
            
        }
        
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
function xor(s1, s2){
    return ;
}

// string to binary with length 8
function stobin(s){
    return ;
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