const jwt = require("jsonwebtoken");

const JWT_SECRET = "test-secret";

function signToken(payload) {
    console.log("signToken called with payload:", payload);
    if (!payload) {
        console.error("signToken Error: Payload is null/undefined");
        throw new Error("signToken Error: Payload is null/undefined");
    }
    // Ensure payload is a plain object
    const plainPayload = JSON.parse(JSON.stringify(payload));
    try {
        const token = jwt.sign(plainPayload, JWT_SECRET, { expiresIn: "7d" });
        console.log("Token signed successfully");
        return token;
    } catch (error) {
        console.error("JWT Sign Error:", error.message);
    }
}

console.log("--- Testing Object ---");
signToken({ userId: "123", email: "test@test.com" });

console.log("--- Testing String ---");
signToken("some string");

console.log("--- Testing Number ---");
signToken(123);

console.log("--- Testing Array ---");
signToken(["item"]);

console.log("--- Testing Boolean ---");
try {
    signToken(true);
} catch (e) {
    console.log(e.message);
}

console.log("--- Testing Null ---");
try {
    signToken(null);
} catch (e) {
    console.log(e.message);
}
