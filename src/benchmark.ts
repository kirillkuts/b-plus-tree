import { BPlusTree } from './BPlusTree';

interface BenchmarkResult {
  name: string;
  size: number;
  insertTime: number;
  searchTime: number;
  avgSearchTime: number;
}

/**
 * Benchmarks insertion and search performance
 * @param size Number of elements to insert
 * @param searchCount Number of search operations to perform
 */
function benchmarkDataStructure(
  size: number,
  searchCount: number = 1000
): { array: BenchmarkResult; bplusTree: BenchmarkResult } {
  // Generate test data
  const keys = Array.from({ length: size }, (_, i) => i);
  const searchKeys = Array.from({ length: searchCount }, () =>
    Math.floor(Math.random() * size)
  );

  // Benchmark Array
  console.log(`\n=== Benchmarking Array (${size.toLocaleString()} elements) ===`);

  // Array insertion
  const arrayInsertStart = performance.now();
  const array: Array<[number, string]> = [];
  for (const key of keys) {
    array.push([key, `value${key}`]);
  }
  const arrayInsertEnd = performance.now();
  const arrayInsertTime = arrayInsertEnd - arrayInsertStart;

  console.log(`Insert: ${arrayInsertTime.toFixed(2)}ms`);

  // Array search (linear search)
  const arraySearchStart = performance.now();
  for (const key of searchKeys) {
    array.find(([k]) => k === key);
  }
  const arraySearchEnd = performance.now();
  const arraySearchTime = arraySearchEnd - arraySearchStart;
  const arrayAvgSearchTime = arraySearchTime / searchCount;

  console.log(
    `Search (${searchCount} ops): ${arraySearchTime.toFixed(2)}ms (avg: ${arrayAvgSearchTime.toFixed(4)}ms)`
  );

  // Benchmark B+ Tree
  console.log(`\n=== Benchmarking B+ Tree (${size.toLocaleString()} elements, order=32) ===`);

  // B+ Tree insertion
  const treeInsertStart = performance.now();
  const tree = new BPlusTree<number, string>(32);
  for (const key of keys) {
    tree.insert(key, `value${key}`);
  }
  const treeInsertEnd = performance.now();
  const treeInsertTime = treeInsertEnd - treeInsertStart;

  console.log(`Insert: ${treeInsertTime.toFixed(2)}ms`);
  console.log(`Tree height: ${tree.getHeight()}, size: ${tree.size()}`);

  // B+ Tree search
  const treeSearchStart = performance.now();
  for (const key of searchKeys) {
    tree.search(key);
  }
  const treeSearchEnd = performance.now();
  const treeSearchTime = treeSearchEnd - treeSearchStart;
  const treeAvgSearchTime = treeSearchTime / searchCount;

  console.log(
    `Search (${searchCount} ops): ${treeSearchTime.toFixed(2)}ms (avg: ${treeAvgSearchTime.toFixed(4)}ms)`
  );

  // Performance comparison
  console.log('\n--- Performance Comparison ---');
  console.log(
    `Insert: Array ${arrayInsertTime.toFixed(2)}ms vs B+ Tree ${treeInsertTime.toFixed(2)}ms`
  );
  console.log(
    `  ${arrayInsertTime < treeInsertTime ? 'Array' : 'B+ Tree'} is ${Math.abs(1 - arrayInsertTime / treeInsertTime).toFixed(2)}x faster`
  );
  console.log(
    `Search: Array ${arraySearchTime.toFixed(2)}ms vs B+ Tree ${treeSearchTime.toFixed(2)}ms`
  );
  console.log(
    `  ${arraySearchTime < treeSearchTime ? 'Array' : 'B+ Tree'} is ${Math.abs(1 - arraySearchTime / treeSearchTime).toFixed(2)}x faster`
  );
  console.log(
    `  Speedup: ${(arraySearchTime / treeSearchTime).toFixed(2)}x`
  );

  return {
    array: {
      name: 'Array',
      size,
      insertTime: arrayInsertTime,
      searchTime: arraySearchTime,
      avgSearchTime: arrayAvgSearchTime,
    },
    bplusTree: {
      name: 'B+ Tree',
      size,
      insertTime: treeInsertTime,
      searchTime: treeSearchTime,
      avgSearchTime: treeAvgSearchTime,
    },
  };
}

/**
 * Runs benchmarks for multiple sizes and displays summary
 */
function runBenchmarks() {
  console.log('🔬 B+ Tree vs Array Performance Benchmark');
  console.log('==========================================\n');
  console.log('Testing insertion and search performance for different data sizes');
  console.log('Each search test performs 1,000 random lookups\n');

  const sizes = [1_000, 10_000, 100_000, 1_000_000];
  const results: Array<{
    array: BenchmarkResult;
    bplusTree: BenchmarkResult;
  }> = [];

  for (const size of sizes) {
    const result = benchmarkDataStructure(size);
    results.push(result);
  }

  // Print summary table
  console.log('\n\n📊 SUMMARY TABLE');
  console.log('================\n');

  console.log('INSERTION PERFORMANCE:');
  console.log(
    '│ Size      │ Array (ms) │ B+ Tree (ms) │ Speedup │'
  );
  console.log(
    '├───────────┼────────────┼──────────────┼─────────┤'
  );
  for (const result of results) {
    const speedup = result.array.insertTime / result.bplusTree.insertTime;
    const faster = speedup > 1 ? 'B+ Tree' : 'Array';
    console.log(
      `│ ${result.array.size.toString().padEnd(9)} │ ${result.array.insertTime.toFixed(2).padStart(10)} │ ${result.bplusTree.insertTime.toFixed(2).padStart(12)} │ ${speedup.toFixed(2)}x ${faster.padEnd(5)} │`
    );
  }

  console.log('\n');
  console.log('SEARCH PERFORMANCE (1,000 random lookups):');
  console.log(
    '│ Size      │ Array (ms) │ B+ Tree (ms) │ Speedup │'
  );
  console.log(
    '├───────────┼────────────┼──────────────┼─────────┤'
  );
  for (const result of results) {
    const speedup = result.array.searchTime / result.bplusTree.searchTime;
    console.log(
      `│ ${result.array.size.toString().padEnd(9)} │ ${result.array.searchTime.toFixed(2).padStart(10)} │ ${result.bplusTree.searchTime.toFixed(2).padStart(12)} │ ${speedup.toFixed(2)}x     │`
    );
  }

  console.log('\n');
  console.log('AVERAGE SEARCH TIME (per lookup):');
  console.log(
    '│ Size      │ Array (ms) │ B+ Tree (ms) │ Speedup │'
  );
  console.log(
    '├───────────┼────────────┼──────────────┼─────────┤'
  );
  for (const result of results) {
    const speedup = result.array.avgSearchTime / result.bplusTree.avgSearchTime;
    console.log(
      `│ ${result.array.size.toString().padEnd(9)} │ ${result.array.avgSearchTime.toFixed(4).padStart(10)} │ ${result.bplusTree.avgSearchTime.toFixed(4).padStart(12)} │ ${speedup.toFixed(2)}x     │`
    );
  }
}

// Run benchmarks when this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runBenchmarks();
}


export { benchmarkDataStructure, runBenchmarks };
