const jwt = require('jsonwebtoken');

try {
    console.log("Testing jwt.sign(null)...");
    jwt.sign(null, 'secret');
} catch (e) {
    console.log("CAUGHT ERROR:", e.message);
    console.log("ERROR CODE:", e.code);
}

try {
    console.log("Testing jwt.sign(undefined)...");
    jwt.sign(undefined, 'secret');
} catch (e) {
    console.log("CAUGHT ERROR:", e.message);
}
