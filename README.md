# ugenpass
Cryptographically derived passwords.

Designed to be:

* strong - uses PBKDF2
* secure - no networking or storage
* short - 40 lines of JavaScript
* simple - only 1 require/import for pbkdf2
* understandable - see algorithm below

Algorithm is:

`hash[hash[hash[password]+domain]+password]` where hash is saltless pbkdf2 with 65536 rounds of sha256, then treating the result as a 32-byte big-endian unsigned integer and dividing the result, using the remainder to select characters from template, starting left to right.

Usage:

`node ugenpass example.com | pbcopy`
prompts for password, pipes result to pasteboard

or

`npm i ugenpass`

```
console.log(require('ugenpass')('password', 'example.com'))
```

`dc2Cs!HL6WZ!mY3Pm(YI8If`

ugenpass function parameters:

* password - required Buffer or string
* domain - required Buffer or string - normally just the base domain without www or similiar. Be sure to trim, normalize, lowercase before calling. EXAMPLE.COM is not the same as example.com
* options - optional object with the following
  * rounds - number of pbkdf2 rounds, with default of 65536
  * template - a string to indicate character sets to select password characters from. You can also pass in an array of strings to supply the character sets directly. The default template string is `x?#??!X?#??!x?#??!X?#??` where
    * `x` is any lowercase letter, except l (25)
    * `X` is any uppercase letter, except O (25)
    * `?` is any of the X or x from above (50)
    * `#` is any digit, except 0 or 1 (8)
    * `!` is one of the symbols !-()$@. (7)

Default template has ~9.38E+32 combinations (~2^109)