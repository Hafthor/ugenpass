'use strict';
const ugenpass = require('./index');
const domain = process.argv[2] || process.exit(console.error('required argument missing. Usage: node ugenpass example.com'));
/^[a-z0-9][a-z0-9-.]*[a-z0-9]$/.test(domain) && !/[-.][-.]/.test(domain) || console.error('WARNING: Possibly invalid domain name given');
process.stderr.write('domain: ' + domain + ', master password: ');
process.stdin.setRawMode(true);
require('readline').createInterface({input: process.stdin}).on('line', function(password) {
    while (/\u007f/.test(password)) // process backspaces
        password = password.replace(/[^\u007f]\u007f/, '').replace(/^\u007f+/, '');
    console.error('[redacted]')
    process.exit(process.stdout.write(ugenpass(password, domain)) ? 0 : 1);
});