const { signToken, verifyToken, hashPassword, comparePassword } = require('../lib/auth');

async function main() {
    try {
        console.log('Testing auth library...');

        // Test Hashing
        console.log('Testing hashPassword...');
        const password = 'password123';
        const hash = await hashPassword(password);
        console.log('Hash created:', hash);

        // Test Compare
        console.log('Testing comparePassword...');
        const isValid = await comparePassword(password, hash);
        console.log('Password valid:', isValid);

        // Test Sign Token
        console.log('Testing signToken...');
        const payload = { userId: '123', email: 'test@example.com' };
        const token = signToken(payload);
        console.log('Token signed:', token);

        // Test Verify Token
        console.log('Testing verifyToken...');
        const decoded = verifyToken(token);
        console.log('Token verified:', decoded);

        if (decoded.userId === payload.userId) {
            console.log('SUCCESS: Auth library is working correctly.');
        } else {
            console.error('FAILURE: Token payload mismatch.');
        }

    } catch (error) {
        console.error('FAILURE: Auth library test failed:', error);
    }
}

main();
