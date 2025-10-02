// simple.test.js - Basic test to check if Jest works
test('1 + 1 should equal 2', () => {
  expect(1 + 1).toBe(2);
});

test('true should be true', () => {
  expect(true).toBe(true);
});

test('should handle strings', () => {
  expect('hello').toBe('hello');
});