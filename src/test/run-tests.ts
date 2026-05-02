type TestCase = {
  name: string;
  fn: () => void | Promise<void>;
};

const tests: TestCase[] = [];

globalThis.describe = (_name: string, fn: () => void) => {
  fn();
};

globalThis.it = (name: string, fn: () => void | Promise<void>) => {
  tests.push({ name, fn });
};

await import('../lib/validation.test');

let failed = 0;

for (const test of tests) {
  try {
    await test.fn();
    console.log(`PASS ${test.name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${test.name}`);
    console.error(error);
  }
}

if (failed > 0) {
  process.exitCode = 1;
}
