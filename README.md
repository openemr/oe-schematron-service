# oe-schematron-service
A forked server wrapper for C-CDA schematron validation in Node.js from  [cda-schematron-server](https://github.com/ewadkins/cda-schematron-server) and modified for our purpose.

### Schematron Location
The latest HL7 schematron was downloaded from HL7's github repo here: [https://github.com/HL7/CDA-ccda-2.1](https://github.com/HL7/CDA-ccda-2.1).

### Install
Cd into the ccdaservice directory:
```
npm install --only=production
```

### Starting the server
The server will automatically start on demand.


---
## Original License (MIT)

Copyright &copy; 2017 [Eric Wadkins](http://www.ericwadkins.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
