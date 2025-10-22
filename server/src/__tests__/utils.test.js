"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = exports.calculateTotal = void 0;
const globals_1 = require("@jest/globals");
// Simple utility function for testing
const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};
exports.calculateTotal = calculateTotal;
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
(0, globals_1.describe)('Utility Functions', () => {
    (0, globals_1.describe)('calculateTotal', () => {
        (0, globals_1.it)('calculates total for single item', () => {
            const items = [{ price: 10, quantity: 2 }];
            (0, globals_1.expect)((0, exports.calculateTotal)(items)).toBe(20);
        });
        (0, globals_1.it)('calculates total for multiple items', () => {
            const items = [
                { price: 10, quantity: 2 },
                { price: 5, quantity: 3 },
                { price: 15, quantity: 1 }
            ];
            (0, globals_1.expect)((0, exports.calculateTotal)(items)).toBe(50);
        });
        (0, globals_1.it)('returns 0 for empty array', () => {
            (0, globals_1.expect)((0, exports.calculateTotal)([])).toBe(0);
        });
    });
    (0, globals_1.describe)('validateEmail', () => {
        (0, globals_1.it)('validates correct email addresses', () => {
            (0, globals_1.expect)((0, exports.validateEmail)('test@example.com')).toBe(true);
            (0, globals_1.expect)((0, exports.validateEmail)('user.name@domain.co.uk')).toBe(true);
            (0, globals_1.expect)((0, exports.validateEmail)('admin@company.org')).toBe(true);
        });
        (0, globals_1.it)('rejects invalid email addresses', () => {
            (0, globals_1.expect)((0, exports.validateEmail)('invalid-email')).toBe(false);
            (0, globals_1.expect)((0, exports.validateEmail)('test@')).toBe(false);
            (0, globals_1.expect)((0, exports.validateEmail)('@domain.com')).toBe(false);
            (0, globals_1.expect)((0, exports.validateEmail)('')).toBe(false);
        });
    });
});
