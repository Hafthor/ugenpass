'use strict';

module.exports = ugenpass;

const pbkdf2Sync = require('pbkdf2').pbkdf2Sync;

const CAP = "ABCDEFGHIJKLMNPQRSTUVWXYZ"; // drop O for readability
const LWR = "abcdefghijkmnopqrstuvwxyz"; // drop l for readability
const NUM = "23456789"; // drop 0 and 1 for readability
const SYM = "!-()$@.";
const ALL = CAP + LWR;

const DEFAULTS = {
    rounds: 65536,
    template: [
        LWR, ALL, NUM, ALL, ALL, SYM,
        CAP, ALL, NUM, ALL, ALL, SYM,
        LWR, ALL, NUM, ALL, ALL, SYM,
        CAP, ALL, NUM, ALL, ALL
    ]
};

function ugenpass(password, domain, options) {
    options = options || {};
    options.template = options.template || DEFAULTS.template.slice();
    options.rounds = options.rounds || DEFAULTS.rounds;

    let hash = genHash(password, domain);
    // fill the template by selecting values from the hash
    return options.template.map(function(charset) {
        return charset[longDiv(hash, charset.length)];
    }).join('');
    
    function genHash(password, domain) {
        password = Buffer.from(password, 'utf-8');
        domain = Buffer.from(domain, 'utf-8');
        // fold password -> #+domain -> #+password again
        let hash = _hash(password);
        hash = _hash(Buffer.concat([hash, domain]));
        return _hash(Buffer.concat([hash, password]));
    }

    function _hash(buf) {
        return pbkdf2Sync(buf, '', options.rounds, 32, 'sha256');
    }

    function longDiv(bytes, div) {
        let mod = 0;
        // divide the hash by div
        for(let i=0; i<bytes.length; i++) {
            const n = bytes[i] + mod * 256;
            mod = n % div;
            bytes[i] = (n / div)|0;
        }
        return mod;
    }
}