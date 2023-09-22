'use strict';
module.exports = ugenpass;
ugenpass.genHash = genHash;
ugenpass.longDiv = longDiv;
const pbkdf2Sync = require('pbkdf2').pbkdf2Sync;
const CHARSETS = {
    'X': 'ABCDEFGHIJKLMNPQRSTUVWXYZ', // drop O for readability
    'x': 'abcdefghijkmnopqrstuvwxyz', // drop l for readability
    '?': 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
    '#': '23456789', // drop 0 and 1 for readability
    '!': '!-()$@.'
}, DEFAULTS = { rounds: 65536, template: 'x?#??!X?#??!x?#??!X?#??' };

function ugenpass(password, domain, options) {
    const rounds = (options || {}).rounds || DEFAULTS.rounds;
    const hash = genHash(Buffer.from(password, 'utf-8'), Buffer.from(domain, 'utf-8'), rounds);
    const template = (options || {}).template || DEFAULTS.template;
    const charsets = Array.isArray(template) ? template : template.split('').map(function(c) { 
        return CHARSETS[c] || c; 
    });
    return charsets.map(function(charset) {
        return charset[longDiv(hash, charset.length)];
    }).join('');
}

function genHash(password, domain, rounds) {
    let hash = pbkdf2Sync(password, '', rounds, 32, 'sha256');
    hash = pbkdf2Sync(Buffer.concat([hash, domain]), '', rounds, 32, 'sha256');
    return pbkdf2Sync(Buffer.concat([hash, password]), '', rounds, 32, 'sha256');
}

function longDiv(bytes, div) {
    let mod = 0;
    for(let i=0; i<bytes.length; i++) { // divide the hash by div
        const n = bytes[i] + mod * 256;
        mod = n % div;
        bytes[i] = (n / div)|0;
    }
    return mod;
}