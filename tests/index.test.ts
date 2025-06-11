// tests/index.test.ts
function add(a: number, b: number): number {
  return a + b;
}

test('add function', () => {
  expect(add(1, 2)).toBe(3);
});
