import { performance } from 'node:perf_hooks';

const ITERATIONS = 1_000_000;

function measureUnoptimized() {
  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    // Simulate usage inside component
    const year = new Date().getFullYear();
    // Prevent optimization by using the value
    if (year < 2000) throw new Error("Time travel detected");
  }
  const end = performance.now();
  return end - start;
}

function measureOptimized() {
  const start = performance.now();
  // Simulate usage outside component (calculated once)
  const year = new Date().getFullYear();
  for (let i = 0; i < ITERATIONS; i++) {
    // Prevent optimization by using the value
    if (year < 2000) throw new Error("Time travel detected");
  }
  const end = performance.now();
  return end - start;
}

console.log(`Running benchmark with ${ITERATIONS.toLocaleString()} iterations...`);

const unoptimizedTime = measureUnoptimized();
console.log(`Unoptimized (inside loop): ${unoptimizedTime.toFixed(4)} ms`);

const optimizedTime = measureOptimized();
console.log(`Optimized (outside loop): ${optimizedTime.toFixed(4)} ms`);

const improvement = unoptimizedTime / optimizedTime;
console.log(`Speedup: ${improvement.toFixed(2)}x faster`);

if (unoptimizedTime > optimizedTime) {
  console.log("✅ Optimization verified: Moving calculation outside is faster.");
} else {
  console.log("❌ Optimization failed: No significant improvement measured.");
}
