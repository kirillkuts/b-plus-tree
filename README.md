# B+ Tree Implementation in TypeScript

A hands-on learning project for understanding B+ tree data structures through a complete implementation from scratch.

💡 KEY INSIGHTS:
================
1. Array insertion is typically faster for sequential data
   (no tree balancing overhead)

2. B+ Tree search becomes significantly faster as data grows
   (O(log n) vs O(n) for array linear search)

3. The performance advantage of B+ Tree search grows with data size:
    - At 1,000 elements: 9.61x faster
    - At 10,000 elements: 309.85x faster
    - At 100,000 elements: 1249.22x faster
    - At 1,000,000 elements: 1601.83x faster

4. For databases and large datasets, B+ Tree provides:
    - Predictable O(log n) search performance
    - Efficient range queries (via leaf linked list)
    - Better cache locality for disk-based storage
