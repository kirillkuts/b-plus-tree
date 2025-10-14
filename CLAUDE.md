# B+ Tree Learning Project

## Project Objective

This is a hands-on learning project for understanding B+ tree data structures by building a complete implementation from scratch in TypeScript. The goal is to deeply understand how B+ trees work by implementing all core operations, testing them thoroughly, and visualizing the tree structure.

## What is a B+ Tree?

A B+ tree is a self-balancing tree data structure commonly used in databases and file systems. Key characteristics:

- **All data is stored in leaf nodes** - Internal nodes only store keys for navigation
- **Leaf nodes are linked** - Enables efficient range queries by traversing the linked list
- **Always balanced** - All leaves are at the same level, guaranteeing consistent performance
- **Order-based capacity** - Each node can hold up to `order` keys (minimum 3)
- **Efficient operations** - Search, insert, and delete are O(log n)

## Learning Goals

1. **Understand node structure** - Learn how internal nodes and leaf nodes differ
2. **Master tree balancing** - Implement splitting and merging to maintain balance
3. **Practice algorithms** - Implement search, insertion, deletion, and range queries
4. **Test-driven development** - Write comprehensive tests using Vitest
5. **Debug tree structures** - Use visualization methods to understand tree state

## Current Implementation Status

### Completed
- ✅ Basic Node class structure (abstract base class)
- ✅ LeafNode implementation with key-value storage
- ✅ InternalNode implementation with child pointers
- ✅ BPlusTree class with basic structure
- ✅ Insert operation (fully implemented in src/BPlusTree.ts:56-109)
- ✅ Search operation (implemented in src/BPlusTree.ts:119-127)
- ✅ Tree height calculation (src/BPlusTree.ts:190-201)
- ✅ Size calculation via leaf traversal (src/BPlusTree.ts:207-221)
- ✅ toString() visualization (src/BPlusTree.ts:285-346)

### In Progress / TODO
- ⏳ Delete operation (stub at src/BPlusTree.ts:139)
- ⏳ Range query operation (stub at src/BPlusTree.ts:154)
- ⏳ Min/max operations (stubs at src/BPlusTree.ts:164, 174)
- ⏳ Helper methods in Node class (isFull, hasMinimumKeys, etc.)
- ⏳ Tree validation method (partial at src/BPlusTree.ts:277)
- ⏳ toArray() method for debugging (stub at src/BPlusTree.ts:261)

## Project Structure

```
src/
├── Node.ts              # Abstract base class for all nodes
├── InternalNode.ts      # Internal nodes (store keys + child pointers)
├── LeafNode.ts          # Leaf nodes (store key-value pairs)
├── BPlusTree.ts         # Main B+ tree implementation
├── Node.test.ts         # Tests for base Node functionality
├── InternalNode.test.ts # Tests for internal node operations
├── LeafNode.test.ts     # Tests for leaf node operations
├── BPlusTree.test.ts    # Integration tests for tree operations
└── index.ts             # Entry point / exports
```

## Key Concepts Being Learned

### 1. Node Splitting
When a node exceeds its capacity (order), it must split:
- Leaf nodes: Split keys/values in half, promote first key of right node
- Internal nodes: Split keys/children, promote middle key to parent

### 2. Tree Balancing
The tree maintains balance by:
- Propagating splits upward when nodes overflow
- Creating new root when the current root splits
- Ensuring all leaves remain at the same level

### 3. Linked Leaf Nodes
Leaf nodes form a linked list:
- Enables efficient range queries without tree traversal
- Used by the size() method to count all entries
- Critical for database-style operations

### 4. Parent-Child Relationships
Nodes maintain bidirectional relationships:
- Children have parent pointers
- Parents have child arrays
- Used during splits and merges

## Development Commands

```bash
npm run dev           # Watch mode for development
npm run build         # Compile TypeScript to JavaScript
npm test              # Run all tests with Vitest
npm run test:ui       # Open Vitest UI for interactive testing
npm run test:coverage # Generate test coverage report
npm run lint          # Check code style with ESLint
npm run format        # Format code with Prettier
```

## Next Steps

1. **Complete deletion** - Implement the delete operation with underflow handling
2. **Range queries** - Traverse leaf linked list for range operations
3. **Helper methods** - Fill in TODO methods in Node.ts
4. **Validation** - Complete the validate() method to verify tree invariants
5. **Optimization** - Consider performance improvements and edge cases

## Learning Resources

As you work through this implementation, consider:
- Drawing tree diagrams after operations to visualize changes
- Using toString() method to inspect tree structure during debugging
- Writing tests before implementing features (TDD approach)
- Experimenting with different order values to see behavior changes
- Comparing your implementation with database B+ tree implementations

## Notes for Claude Code

When assisting with this project:
- Remember this is a **learning project** - explain concepts thoroughly
- Encourage test-driven development with comprehensive test cases
- Point out B+ tree invariants and why they matter
- Suggest visualization and debugging techniques
- Reference specific line numbers when discussing implementation details
- Help identify edge cases and potential bugs
