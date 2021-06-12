const assert = require('assert');
const ugenpass = require('./index');

describe('gen', function() {
    it('should generate expected test password', function() {
        const actual = ugenpass('password', 'example.com');
        assert.strictEqual(actual, 'dc2Cs!HL6WZ!mY3Pm(YI8If');
    });

    it('should generate expected test password with options.template', function() {
        const actual = ugenpass('password', 'example.com', {template: ['abcde', 'ABCDE', 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz', '23456789']});
        assert.strictEqual(actual, 'dAc2'); // 5*5=25
    });

    it('should generate expected test password with options.rounds', function() {
        const actual = ugenpass('password', 'example.com', {rounds: 10000});
        assert.strictEqual(actual, 'hc5uX!Qb6fT-cU2rm!Cw4Xw');
    });
});