const ugenpass = require('./index');


function calcAndShow() {
    process.stderr.write('\n');
    process.stdout.write(ugenpass(pwd, dom));
    process.exit(0);
}

function backspace() {
    if(pwd) {
        pwd = pwd.slice(0, -1);
        process.stderr.write('\b \b');
    }
}

function addCharacter(c) {
    pwd += c;
    process.stderr.write('*');
}

function quit() {
    process.exit(0);
}

let pwd = '';
const dom = process.argv[2];
if (!dom) {
    console.error('required argument missing');
    console.error('Usage: node ugenpass example.com');
    process.exit(0);
}
process.stderr.write('domain: ' + dom + ', password: ');
process.on('SIGINT', quit);
process.on('SIGTERM', quit);

process.stdin.resume();
process.stdin.setRawMode(true);
process.stdin.on('data', function(c) {
    ({
        '\u0003': quit, 
        '\u0004': quit,
        '\r': calcAndShow, 
        '\u007F': backspace
    }[c] || addCharacter)(c);
});