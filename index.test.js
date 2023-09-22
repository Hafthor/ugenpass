const assert = require('assert');
const ugenpass = require('./index');

describe('ugenpass', function() {
    it('should generate expected test password', function() {
        assert.strictEqual(ugenpass('password', 'example.com'), 'dc2Cs!HL6WZ!mY3Pm(YI8If');
    });
    it('should generate expected test password using template string', function() {
        assert.strictEqual(ugenpass('password', 'example.com', {template: 'X?#??!x?#??!X?#??!x?#??'}), 'Dc2Cs!hL6WZ!LY3Pm(yI8If');
    });
    it('should generate expected test password using template charsets', function() {
        assert.strictEqual(ugenpass('password', 'example.com', {template: ['abcde', 'ABCDE', 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz', '23456789']}), 'dAc2'); // 5*5=25
    });
    it('should generate expected test password using fewer rounds', function() {
        assert.strictEqual(ugenpass('password', 'example.com', {rounds: 10000}), 'hc5uX!Qb6fT-cU2rm!Cw4Xw');
    });
});

describe('longDiv', function() {
    it('should long divide', function() {
        const v = [0, 1, 0, 0];
        assert.strictEqual(ugenpass.longDiv(v, 23), 9); // 65536 divided by 23 = 2849 r 9
        assert.deepEqual(v, [0, 0, 11, 33]);            // 2849 = 11x256 + 33
        assert.strictEqual(ugenpass.longDiv(v, 23), 20) // divided by 23 again = 123 r 20
        assert.deepEqual(v, [0, 0, 0, 123]);
    });
});