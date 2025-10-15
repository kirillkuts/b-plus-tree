import { describe, it, expect, beforeEach } from 'vitest';
import { BPlusTree } from './BPlusTree';

describe('BPlusTree', () => {
  let tree: BPlusTree<number, string>;

  beforeEach(() => {
    tree = new BPlusTree<number, string>(4);
  });

  describe('constructor', () => {
    it('should create an empty tree', () => {
      expect(tree.isEmpty()).toBe(true);
    });

    it('should throw error for order < 3', () => {
      expect(() => new BPlusTree(2)).toThrow('Order must be at least 3');
    });
  });

  describe('insert', () => {
    it('should insert into empty tree', () => {
      tree.insert(1, 'value1');
      expect(tree.isEmpty()).toBe(false);
      expect(tree.search(1)).toBe('value1');
    });

    it('should insert multiple keys in sorted order', () => {
      tree.insert(10, 'ten');
      tree.insert(20, 'twenty');
      tree.insert(30, 'thirty');

      expect(tree.search(10)).toBe('ten');
      expect(tree.search(20)).toBe('twenty');
      expect(tree.search(30)).toBe('thirty');
    });

    it('should insert multiple keys in random order', () => {
      tree.insert(30, 'thirty');
      tree.insert(10, 'ten');
      tree.insert(50, 'fifty');
      tree.insert(20, 'twenty');
      tree.insert(40, 'forty');

      expect(tree.search(10)).toBe('ten');
      expect(tree.search(20)).toBe('twenty');
      expect(tree.search(30)).toBe('thirty');
      expect(tree.search(40)).toBe('forty');
      expect(tree.search(50)).toBe('fifty');
    });

    it('should update value if key already exists', () => {
      tree.insert(10, 'original');
      tree.insert(10, 'updated');

      expect(tree.search(10)).toBe('updated');
      // Size should not increase when updating
      const keys = [20, 30];
      keys.forEach((k) => tree.insert(k, `value${k}`));
      expect(tree.size()).toBe(3); // 10, 20, 30
    });

    it('should handle insertion that causes leaf split', () => {
      // Order 4 means max 4 keys per node
      // Before split: height should be 1 (single leaf)
      tree.insert(10, 'ten');
      tree.insert(20, 'twenty');
      tree.insert(30, 'thirty');
      tree.insert(40, 'forty');
      expect(tree.getHeight()).toBe(1);

      // Insert 5th key to force a split
      tree.insert(50, 'fifty'); // This should cause split

      // After split: tree should have height 2 (root became internal with 2 leaf children)
      expect(tree.getHeight()).toBe(2);
      expect(tree.size()).toBe(5);

      // All values should still be searchable
      expect(tree.search(10)).toBe('ten');
      expect(tree.search(20)).toBe('twenty');
      expect(tree.search(30)).toBe('thirty');
      expect(tree.search(40)).toBe('forty');
      expect(tree.search(50)).toBe('fifty');

      // Tree structure should be valid
      expect(tree.validate()).toBe(true);
    });

    it('should handle insertion that causes root split', () => {
      // Order 4: fill root (leaf), then split it
      // This creates an internal root with two leaf children

      // Track height before and after split
      expect(tree.getHeight()).toBe(1);

      for (let i = 1; i <= 5; i++) {
        tree.insert(i * 10, `value${i * 10}`);
      }

      // Height should increase to 2 (internal root + leaf level)
      expect(tree.getHeight()).toBe(2);
      expect(tree.size()).toBe(5);

      // Tree should not be empty
      expect(tree.isEmpty()).toBe(false);

      // All values should be searchable
      for (let i = 1; i <= 5; i++) {
        expect(tree.search(i * 10)).toBe(`value${i * 10}`);
      }

      // Tree structure should be valid
      expect(tree.validate()).toBe(true);
    });

    it('should handle insertion that causes multiple level splits', () => {
      // Insert enough keys to cause multiple splits
      // Order 4: 4 keys per node max
      // With sequential insertions:
      // - 1-4 keys: height 1
      // - 5+ keys: height 2 (first split)
      // - More keys will cause internal node splits, increasing height to 3+

      const initialHeight = tree.getHeight();
      expect(initialHeight).toBe(1);

      // Insert 25 keys to create a deeper tree
      for (let i = 1; i <= 25; i++) {
        tree.insert(i, `value${i}`);
      }

      // Height should be at least 3 for order 4 with 25 keys
      const finalHeight = tree.getHeight();
      expect(finalHeight).toBeGreaterThanOrEqual(3);
      expect(finalHeight).toBeGreaterThan(initialHeight);

      // Size should match insertions
      expect(tree.size()).toBe(25);

      // All values should be searchable
      for (let i = 1; i <= 25; i++) {
        expect(tree.search(i)).toBe(`value${i}`);
      }

      // Tree structure should be valid
      expect(tree.validate()).toBe(true);
    });

    it('should maintain tree height after insertions', () => {
      const initialHeight = tree.getHeight();
      expect(initialHeight).toBe(1); // Empty tree has height 1 (single leaf)

      // Insert a few keys (no split)
      tree.insert(10, 'ten');
      tree.insert(20, 'twenty');
      tree.insert(30, 'thirty');
      expect(tree.getHeight()).toBe(1);

      // Insert more to cause split
      tree.insert(40, 'forty');
      tree.insert(50, 'fifty');
      expect(tree.getHeight()).toBe(2);
    });

    it('should handle duplicate key insertions', () => {
      tree.insert(10, 'first');
      const size1 = tree.size();

      tree.insert(10, 'second');
      const size2 = tree.size();

      tree.insert(10, 'third');
      const size3 = tree.size();

      // Size should not change with duplicate keys
      expect(size1).toBe(size2);
      expect(size2).toBe(size3);
      expect(size1).toBe(1);

      // Latest value should be stored
      expect(tree.search(10)).toBe('third');
    });

    it('should handle large number of insertions (1000+)', () => {
      const n = 1000;

      // Insert 1000 keys in random order
      const keys = Array.from({ length: n }, (_, i) => i + 1);
      // Shuffle array
      for (let i = keys.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [keys[i], keys[j]] = [keys[j], keys[i]];
      }

      // Insert all keys
      keys.forEach((key) => {
        tree.insert(key, `value${key}`);
      });

      // Verify all keys are searchable
      for (let i = 1; i <= n; i++) {
        expect(tree.search(i)).toBe(`value${i}`);
      }

      expect(tree.size()).toBe(n);
    });

    it('should maintain B+ tree invariants after insertions', () => {
      // Insert various keys
      const keys = [50, 25, 75, 10, 30, 60, 80, 5, 15, 27, 35, 55, 65, 77, 85];
      keys.forEach((key) => tree.insert(key, `value${key}`));

      // Validate tree structure
      expect(tree.validate()).toBe(true);

      // All keys should be searchable
      keys.forEach((key) => {
        expect(tree.search(key)).toBe(`value${key}`);
      });

      // Size should match
      expect(tree.size()).toBe(keys.length);
    });
  });

  describe('search', () => {
    it.todo('should return undefined for empty tree');
    it.todo('should find value after single insertion');
    it.todo('should find all inserted values');
    it.todo('should return undefined for non-existing key');
    it.todo('should handle search in multi-level tree');
    it.todo('should find keys after splits');
    it.todo('should find updated value after key update');
    it.todo('should handle search with many keys (1000+)');
  });

  describe('delete', () => {
    it('should return false when deleting from empty tree', () => {
      // Empty tree should return false for any deletion attempt
      expect(tree.delete(1)).toBe(false);
      expect(tree.delete(100)).toBe(false);
      expect(tree.isEmpty()).toBe(true);
    });

    it('should delete single key from tree', () => {
      // Insert one key and delete it
      tree.insert(10, 'ten');
      expect(tree.size()).toBe(1);
      expect(tree.search(10)).toBe('ten');

      // Delete the key
      const result = tree.delete(10);
      expect(result).toBe(true);

      // Tree should be empty now
      expect(tree.isEmpty()).toBe(true);
      expect(tree.size()).toBe(0);
      expect(tree.search(10)).toBeUndefined();
    });

    it('should return true when key is deleted', () => {
      // Insert multiple keys
      tree.insert(10, 'ten');
      tree.insert(20, 'twenty');
      tree.insert(30, 'thirty');

      // Delete existing key should return true
      expect(tree.delete(20)).toBe(true);
      expect(tree.search(20)).toBeUndefined();
      expect(tree.size()).toBe(2);

      // Other keys should still exist
      expect(tree.search(10)).toBe('ten');
      expect(tree.search(30)).toBe('thirty');
    });

    it('should return false when key does not exist', () => {
      // Insert some keys
      tree.insert(10, 'ten');
      tree.insert(20, 'twenty');
      tree.insert(30, 'thirty');

      // Try to delete non-existing keys
      expect(tree.delete(5)).toBe(false);
      expect(tree.delete(15)).toBe(false);
      expect(tree.delete(100)).toBe(false);

      // Size should remain unchanged
      expect(tree.size()).toBe(3);

      // All original keys should still exist
      expect(tree.search(10)).toBe('ten');
      expect(tree.search(20)).toBe('twenty');
      expect(tree.search(30)).toBe('thirty');
    });

    it('should handle deletion without underflow', () => {
      // Order 4: minimum keys in non-root leaf = Math.ceil(4/2) = 2
      // Insert enough keys to have a leaf with more than minimum
      // After split: leaves will have ~2-3 keys each
      tree.insert(10, 'v10');
      tree.insert(20, 'v20');
      tree.insert(30, 'v30');
      tree.insert(40, 'v40');
      tree.insert(50, 'v50');

      const sizeBefore = tree.size();
      const heightBefore = tree.getHeight();

      // Delete a key from a leaf that won't underflow
      const result = tree.delete(30);
      expect(result).toBe(true);

      // Tree structure should remain stable
      expect(tree.getHeight()).toBe(heightBefore);
      expect(tree.size()).toBe(sizeBefore - 1);

      // Verify deletion
      expect(tree.search(30)).toBeUndefined();

      // Other keys should still be searchable
      expect(tree.search(10)).toBe('v10');
      expect(tree.search(20)).toBe('v20');
      expect(tree.search(40)).toBe('v40');
      expect(tree.search(50)).toBe('v50');

      expect(tree.validate()).toBe(true);
    });

    it('should handle deletion causing borrow from left sibling', () => {
      // Build a tree where deleting a key causes borrowing from left sibling
      // Order 4: After splits, we'll have leaves with 2-3 keys
      // Insert pattern to create specific leaf distribution
      const keys = [10, 20, 30, 40, 50, 60, 70, 80];
      keys.forEach((k) => tree.insert(k, `v${k}`));

      const sizeBefore = tree.size();

      // Delete a key that will cause its leaf to underflow
      // This should trigger borrowing from the left sibling
      const result = tree.delete(70);
      expect(result).toBe(true);

      expect(tree.size()).toBe(sizeBefore - 1);
      expect(tree.search(70)).toBeUndefined();

      // All other keys should still be searchable
      [10, 20, 30, 40, 50, 60, 80].forEach((k) => {
        expect(tree.search(k)).toBe(`v${k}`);
      });

      expect(tree.validate()).toBe(true);
    });

    it('should handle deletion causing borrow from right sibling', () => {
      // Build a tree where deleting a key causes borrowing from right sibling
      const keys = [10, 20, 30, 40, 50, 60, 70, 80];
      keys.forEach((k) => tree.insert(k, `v${k}`));

      const sizeBefore = tree.size();

      // Delete a key that will cause its leaf to underflow
      // This should trigger borrowing from the right sibling
      const result = tree.delete(20);
      expect(result).toBe(true);

      const result2 = tree.delete(10);
      expect(result2).toBe(true);

      expect(tree.size()).toBe(sizeBefore - 2);
      expect(tree.search(20)).toBeUndefined();
      expect(tree.search(10)).toBeUndefined();

      // All other keys should still be searchable
      [30, 40, 50, 60, 70, 80].forEach((k) => {
        expect(tree.search(k)).toBe(`v${k}`);
      });

      expect(tree.validate()).toBe(true);
    });

    it('should handle deletion causing merge with left sibling', () => {
      // Build a tree structure where deletion causes a merge with left sibling
      // Order 4: minimum = floor(4/2) = 2 keys per leaf
      // Strategy: Create leaves with exactly 2 keys each, then delete to force merge

      // Insert 5 keys to force split, then delete one to get both leaves at minimum
      // After inserting [10, 20, 30, 40, 50]:
      //   INTERNAL [30]
      //     ├── LEAF [10, 20]
      //     └── LEAF [30, 40, 50]
      const keys = [10, 20, 30, 40, 50];
      keys.forEach((k) => tree.insert(k, `v${k}`));

      // Delete 50 to bring right leaf to minimum
      tree.delete(50);
      // Now: LEAF [10, 20] and LEAF [30, 40] - both at minimum (2 keys)

      const sizeBefore = tree.size();

      // Delete from right leaf to cause underflow
      // Right leaf will have [30] (1 key) after deletion - underflow!
      // Left leaf has [10, 20] (2 keys) - at minimum, cannot lend
      // This should trigger merge
      const result = tree.delete(40);
      expect(result).toBe(true);

      expect(tree.size()).toBe(sizeBefore - 1);

      // After merge, all remaining keys should be searchable
      [10, 20, 30].forEach((k) => {
        expect(tree.search(k)).toBe(`v${k}`);
      });

      // After merge, tree should shrink to single leaf (height = 1)
      expect(tree.getHeight()).toBe(1);

      expect(tree.validate()).toBe(true);
    });

    it('should handle deletion causing merge with right sibling', () => {
      // Build a tree structure where deletion causes a merge with right sibling
      // Order 4: minimum = floor(4/2) = 2 keys per leaf
      // Strategy: Create leaves with exactly 2 keys each, then delete from LEFT leaf to force merge

      // Insert 5 keys to force split, then delete one to get both leaves at minimum
      const keys = [10, 20, 30, 40, 50];
      keys.forEach((k) => tree.insert(k, `v${k}`));

      // Delete 50 to bring right leaf to minimum
      tree.delete(50);
      // Now: LEAF [10, 20] and LEAF [30, 40] - both at minimum (2 keys)

      const sizeBefore = tree.size();

      // Delete from left leaf to cause underflow
      // Left leaf will have [10] (1 key) after deletion - underflow!
      // Right leaf has [30, 40] (2 keys) - at minimum, cannot lend
      // This should trigger merge: left merges with right
      const result = tree.delete(20);
      expect(result).toBe(true);

      expect(tree.size()).toBe(sizeBefore - 1);

      // After merge, all remaining keys should be searchable
      [10, 30, 40].forEach((k) => {
        expect(tree.search(k)).toBe(`v${k}`);
      });

      // After merge, tree should shrink to single leaf (height = 1)
      expect(tree.getHeight()).toBe(1);

      expect(tree.validate()).toBe(true);
    });

    it('should handle deletion causing root to shrink', () => {
      // Insert enough keys to create height > 1
      for (let i = 1; i <= 10; i++) {
        tree.insert(i * 10, `v${i * 10}`);
      }

      const initialHeight = tree.getHeight();
      expect(initialHeight).toBeGreaterThan(1);

      // Delete keys until the root shrinks (merges propagate up)
      // Keep deleting until only a few keys remain
      for (let i = 10; i > 2; i--) {
        tree.delete(i * 10);
      }

      const finalHeight = tree.getHeight();

      // Height should decrease or stay same (depending on exact tree structure)
      expect(finalHeight).toBeLessThanOrEqual(initialHeight);

      // Remaining keys should be searchable
      expect(tree.search(10)).toBe('v10');
      expect(tree.search(20)).toBe('v20');

      expect(tree.validate()).toBe(true);
    });

    it('should handle deleting all keys one by one', () => {
      // Insert multiple keys
      const keys = [50, 25, 75, 10, 30, 60, 80, 5, 15, 27, 35, 55, 65, 77, 85];
      keys.forEach((k) => tree.insert(k, `v${k}`));

      expect(tree.size()).toBe(keys.length);

      // Delete all keys one by one
      keys.forEach((k) => {
        const result = tree.delete(k);
        expect(result).toBe(true);
        expect(tree.search(k)).toBeUndefined();
      });

      // Tree should be empty
      expect(tree.isEmpty()).toBe(true);
      expect(tree.size()).toBe(0);
      expect(tree.getHeight()).toBe(1); // Should be back to single empty leaf
    });

    it('should handle deletion in various orders', () => {
      // Test deletion in ascending order
      const keys = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      keys.forEach((k) => tree.insert(k, `v${k}`));

      // Delete in ascending order
      for (let i = 0; i < 5; i++) {
        expect(tree.delete(keys[i])).toBe(true);
      }
      expect(tree.size()).toBe(5);

      // Verify remaining keys
      for (let i = 5; i < keys.length; i++) {
        expect(tree.search(keys[i])).toBe(`v${keys[i]}`);
      }

      // Re-insert and test descending deletion
      tree = new BPlusTree<number, string>(4);
      keys.forEach((k) => tree.insert(k, `v${k}`));

      // Delete in descending order
      for (let i = keys.length - 1; i >= keys.length - 5; i--) {
        expect(tree.delete(keys[i])).toBe(true);
      }
      expect(tree.size()).toBe(5);

      expect(tree.validate()).toBe(true);

      // Re-insert and test random deletion
      tree = new BPlusTree<number, string>(4);
      keys.forEach((k) => tree.insert(k, `v${k}`));

      // Delete in random order
      const deleteOrder = [30, 70, 10, 90, 50];
      deleteOrder.forEach((k) => {
        expect(tree.delete(k)).toBe(true);
      });
      expect(tree.size()).toBe(keys.length - deleteOrder.length);

      expect(tree.validate()).toBe(true);
    });

    it('should maintain B+ tree invariants after deletions', () => {
      // Insert many keys
      const keys = Array.from({ length: 50 }, (_, i) => (i + 1) * 10);
      keys.forEach((k) => tree.insert(k, `v${k}`));

      // Perform random deletions
      const deleteKeys = [100, 250, 380, 420, 150, 200, 340, 480];
      deleteKeys.forEach((k) => {
        if (keys.includes(k)) {
          tree.delete(k);
        }
      });

      // Validate tree structure after deletions
      expect(tree.validate()).toBe(true);

      // All non-deleted keys should be searchable
      keys.forEach((k) => {
        if (!deleteKeys.includes(k)) {
          expect(tree.search(k)).toBe(`v${k}`);
        } else {
          expect(tree.search(k)).toBeUndefined();
        }
      });

      // Size should be correct
      const expectedSize = keys.length - deleteKeys.filter((k) => keys.includes(k)).length;
      expect(tree.size()).toBe(expectedSize);
    });

    it('should not find deleted keys in search', () => {
      // Insert keys
      const keys = [10, 20, 30, 40, 50, 60, 70, 80];
      keys.forEach((k) => tree.insert(k, `v${k}`));

      // Delete some keys
      const deletedKeys = [20, 40, 60];
      deletedKeys.forEach((k) => {
        tree.delete(k);
      });

      // Deleted keys should return undefined
      deletedKeys.forEach((k) => {
        expect(tree.search(k)).toBeUndefined();
      });

      // Non-deleted keys should still be found
      const remainingKeys = keys.filter((k) => !deletedKeys.includes(k));
      remainingKeys.forEach((k) => {
        expect(tree.search(k)).toBe(`v${k}`);
      });

      // Try to delete already deleted keys - should return false
      deletedKeys.forEach((k) => {
        expect(tree.delete(k)).toBe(false);
      });
    });
  });

  describe('range', () => {
    it.todo('should return empty array for empty tree');
    it.todo('should return all keys in range');
    it.todo('should return single key if start === end');
    it.todo('should return empty array if range contains no keys');
    it.todo('should handle range spanning multiple leaves');
    it.todo('should respect inclusive boundaries');
    it.todo('should return keys in sorted order');
    it.todo('should handle range from min to max');
    it.todo('should handle partial ranges');
  });

  describe('min', () => {
    it.todo('should return undefined for empty tree');
    it.todo('should return the only key in single-key tree');
    it.todo('should return minimum key after multiple insertions');
    it.todo('should update after deleting minimum key');
    it.todo('should find minimum in multi-level tree');
  });

  describe('max', () => {
    it.todo('should return undefined for empty tree');
    it.todo('should return the only key in single-key tree');
    it.todo('should return maximum key after multiple insertions');
    it.todo('should update after deleting maximum key');
    it.todo('should find maximum in multi-level tree');
  });

  describe('getHeight', () => {
    it.todo('should return 1 for empty tree (single leaf)');
    it.todo('should return 1 for tree with keys in single leaf');
    it.todo('should return 2 after first split creates internal node');
    it.todo('should increase height when root splits');
    it.todo('should decrease height when tree shrinks');
  });

  describe('size', () => {
    it.todo('should return 0 for empty tree');
    it.todo('should return correct count after insertions');
    it.todo('should not count duplicate key insertions');
    it.todo('should decrease after deletions');
    it.todo('should return 0 after deleting all keys');
  });

  describe('toArray', () => {
    it.todo('should return empty array for empty tree');
    it.todo('should return all key-value pairs in sorted order');
    it.todo('should match insertion-search results');
    it.todo('should work correctly after splits');
    it.todo('should work correctly after deletions');
  });

  describe('validate', () => {
    it.todo('should return true for empty tree');
    it.todo('should return true after valid insertions');
    it.todo('should return true after splits');
    it.todo('should return true after deletions');
    it.todo('should verify all leaves at same level');
    it.todo('should verify keys in sorted order');
    it.todo('should verify node key counts within bounds');
    it.todo('should verify parent-child relationships');
    it.todo('should verify leaf linked list integrity');
  });

  describe('toString', () => {
    it.todo('should return string representation of tree structure');
    it.todo('should show levels clearly');
    it.todo('should be useful for debugging');
  });

  describe('stress tests', () => {
    it.todo('should handle 1000 sequential insertions');
    it.todo('should handle 1000 random insertions');
    it.todo('should handle 1000 insertions followed by 1000 deletions');
    it.todo('should handle interleaved insertions and deletions');
    it.todo('should handle random operations maintaining correctness');
  });

  describe('edge cases', () => {
    it.todo('should handle minimum order (3)');
    it.todo('should handle large order');
    it.todo('should handle negative keys');
    it.todo('should handle string keys with custom comparator');
    it.todo('should handle complex object keys with custom comparator');
  });

  describe('integration tests', () => {
    it.todo('should maintain correctness through mixed operations', () => {
      // Insert, search, delete, range query in various combinations
    });

    it.todo('should handle bulk load and queries');

    it.todo('should maintain performance characteristics', () => {
      // Verify operations are O(log n)
    });
  });

  describe('B+ tree specific properties', () => {
    it.todo('should store all data in leaf nodes only');
    it.todo('should maintain leaf node linked list');
    it.todo('should keep internal nodes as guides only');
    it.todo('should allow efficient range queries via leaf list');
    it.todo('should keep tree balanced at all times');
  });
});
