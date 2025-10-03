import { describe, it, expect, beforeEach } from 'vitest';
import { LeafNode } from './LeafNode';

describe('LeafNode', () => {
  let leaf: LeafNode<number, string>;

  beforeEach(() => {
    leaf = new LeafNode<number, string>(4);
  });

  describe('constructor', () => {
    it('should create a leaf node with no values', () => {
      expect(leaf.getKeyCount()).toBe(0);
      expect(leaf.getValues()).toEqual([]);
    });

    it('should be identified as leaf', () => {
      expect(leaf.isLeaf()).toBe(true);
    });

    it('should have no siblings initially', () => {
      expect(leaf.getNext()).toBeNull();
      expect(leaf.getPrev()).toBeNull();
    });
  });

  describe('getValue', () => {
    it.todo('should return value at specified index');
    it.todo('should handle out of bounds access appropriately');
  });

  describe('getValues', () => {
    it.todo('should return empty array for new leaf');
    it.todo('should return copy of all values');
    it.todo('should not allow modification of internal values array');
  });

  describe('sibling pointers', () => {
    it.todo('should set and get next leaf correctly');
    it.todo('should set and get previous leaf correctly');
    it.todo('should allow setting siblings to null');
    it.todo('should maintain doubly-linked list invariant');
  });

  describe('insert', () => {
    it('should insert first key-value pair', () => {
      const result = leaf.insert(10, 'ten');

      expect(result).toBe(true);
      expect(leaf.getKeyCount()).toBe(1);
      expect(leaf.getKeys()).toEqual([10]);
      expect(leaf.getValues()).toEqual(['ten']);
    });

    it('should insert multiple key-value pairs in sorted order', () => {
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');
      leaf.insert(30, 'thirty');

      expect(leaf.getKeyCount()).toBe(3);
      expect(leaf.getKeys()).toEqual([10, 20, 30]);
      expect(leaf.getValues()).toEqual(['ten', 'twenty', 'thirty']);
    });

    it('should maintain keys and values in sync', () => {
      leaf.insert(50, 'fifty');
      leaf.insert(10, 'ten');
      leaf.insert(30, 'thirty');

      const keys = leaf.getKeys();
      const values = leaf.getValues();

      expect(keys.length).toBe(values.length);
      expect(keys).toEqual([10, 30, 50]);
      expect(values).toEqual(['ten', 'thirty', 'fifty']);
    });

    it('should insert at beginning when key is smallest', () => {
      leaf.insert(30, 'thirty');
      leaf.insert(20, 'twenty');
      leaf.insert(10, 'ten');

      expect(leaf.getKeys()).toEqual([10, 20, 30]);
      expect(leaf.getValues()).toEqual(['ten', 'twenty', 'thirty']);
    });

    it('should insert at end when key is largest', () => {
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');
      leaf.insert(30, 'thirty');

      expect(leaf.getKeys()).toEqual([10, 20, 30]);
      expect(leaf.getValues()).toEqual(['ten', 'twenty', 'thirty']);
    });

    it('should insert in middle for intermediate values', () => {
      leaf.insert(10, 'ten');
      leaf.insert(30, 'thirty');
      leaf.insert(20, 'twenty');

      expect(leaf.getKeys()).toEqual([10, 20, 30]);
      expect(leaf.getValues()).toEqual(['ten', 'twenty', 'thirty']);
    });

    it('should update existing value if key already exists', () => {
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');

      const result = leaf.insert(10, 'TEN');

      expect(result).toBe(false);
      expect(leaf.getKeyCount()).toBe(2);
      expect(leaf.getKeys()).toEqual([10, 20]);
      expect(leaf.getValues()).toEqual(['TEN', 'twenty']);
    });

    it('should return true for new key insertion', () => {
      const result1 = leaf.insert(10, 'ten');
      const result2 = leaf.insert(20, 'twenty');

      expect(result1).toBe(true);
      expect(result2).toBe(true);
    });

    it('should return false when updating existing key', () => {
      leaf.insert(10, 'ten');
      const result = leaf.insert(10, 'updated');

      expect(result).toBe(false);
      expect(leaf.getValue(0)).toBe('updated');
    });

    it('should maintain sorted order with random insertions', () => {
      const keys = [50, 10, 30, 40, 20];
      keys.forEach((key) => leaf.insert(key, `value${key}`));

      expect(leaf.getKeys()).toEqual([10, 20, 30, 40, 50]);
      expect(leaf.getValues()).toEqual(['value10', 'value20', 'value30', 'value40', 'value50']);
    });
  });

  describe('search', () => {
    it('should return undefined for non-existing key in empty leaf', () => {
      const result = leaf.search(10);
      expect(result).toBeUndefined();
    });

    it('should find value for existing key', () => {
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');
      leaf.insert(30, 'thirty');

      expect(leaf.search(10)).toBe('ten');
      expect(leaf.search(20)).toBe('twenty');
      expect(leaf.search(30)).toBe('thirty');
    });

    it('should return undefined for non-existing key', () => {
      leaf.insert(10, 'ten');
      leaf.insert(30, 'thirty');

      expect(leaf.search(20)).toBeUndefined();
      expect(leaf.search(5)).toBeUndefined();
      expect(leaf.search(40)).toBeUndefined();
    });

    it('should handle single key-value pair', () => {
      leaf.insert(42, 'answer');

      expect(leaf.search(42)).toBe('answer');
      expect(leaf.search(41)).toBeUndefined();
      expect(leaf.search(43)).toBeUndefined();
    });

    it('should handle multiple key-value pairs', () => {
      const entries = [
        [10, 'ten'],
        [20, 'twenty'],
        [30, 'thirty'],
        [40, 'forty'],
        [50, 'fifty'],
      ] as Array<[number, string]>;

      entries.forEach(([key, value]) => leaf.insert(key, value));

      // Search for all existing keys
      entries.forEach(([key, value]) => {
        expect(leaf.search(key)).toBe(value);
      });

      // Search for non-existing keys
      expect(leaf.search(5)).toBeUndefined();
      expect(leaf.search(15)).toBeUndefined();
      expect(leaf.search(25)).toBeUndefined();
      expect(leaf.search(60)).toBeUndefined();
    });

    it('should find updated values', () => {
      leaf.insert(10, 'original');
      expect(leaf.search(10)).toBe('original');

      leaf.insert(10, 'updated');
      expect(leaf.search(10)).toBe('updated');
    });
  });

  describe('delete', () => {
    it.todo('should return false when deleting from empty leaf');
    it.todo('should delete existing key-value pair');
    it.todo('should return true when key is found and deleted');
    it.todo('should return false when key is not found');
    it.todo('should maintain keys and values in sync after deletion');
    it.todo('should handle deletion from beginning');
    it.todo('should handle deletion from end');
    it.todo('should handle deletion from middle');
    it.todo('should handle deleting last remaining key');
  });

  describe('split', () => {
    it('should create new leaf node', () => {
      // Fill leaf with order number of keys
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');
      leaf.insert(30, 'thirty');
      leaf.insert(40, 'forty');

      const result = leaf.split();

      expect(result.rightNode).toBeInstanceOf(LeafNode);
      expect(result.rightNode.isLeaf()).toBe(true);
    });

    it('should split key-value pairs evenly', () => {
      // Order 4: insert 4 keys
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');
      leaf.insert(30, 'thirty');
      leaf.insert(40, 'forty');

      const result = leaf.split();

      // For 4 keys: first ceil(4/2) = 2 stay, 2 move
      expect(leaf.getKeyCount()).toBe(2);
      expect(result.rightNode.getKeyCount()).toBe(2);
    });

    it('should keep first half in original node', () => {
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');
      leaf.insert(30, 'thirty');
      leaf.insert(40, 'forty');

      const result = leaf.split();

      // Original should keep first half
      expect(leaf.getKeys()).toEqual([10, 20]);
      expect(leaf.getValues()).toEqual(['ten', 'twenty']);
    });

    it('should move second half to new node', () => {
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');
      leaf.insert(30, 'thirty');
      leaf.insert(40, 'forty');

      const result = leaf.split();

      // New node should have second half
      expect(result.rightNode.getKeys()).toEqual([30, 40]);
      expect(result.rightNode.getValues()).toEqual(['thirty', 'forty']);
    });

    it('should return smallest key of new node as split key', () => {
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');
      leaf.insert(30, 'thirty');
      leaf.insert(40, 'forty');

      const result = leaf.split();

      // Split key should be first key of right node
      expect(result.splitKey).toBe(30);
      expect(result.splitKey).toBe(result.rightNode.getKey(0));
    });

    it('should return new right node', () => {
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');
      leaf.insert(30, 'thirty');
      leaf.insert(40, 'forty');

      const result = leaf.split();

      expect(result.rightNode).toBeDefined();
      expect(result.rightNode.getKeyCount()).toBeGreaterThan(0);
    });

    it('should update sibling pointers correctly without existing next', () => {
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');
      leaf.insert(30, 'thirty');
      leaf.insert(40, 'forty');

      // Original has no next sibling
      expect(leaf.getNext()).toBeNull();

      const result = leaf.split();

      // After split: original -> new -> null
      expect(leaf.getNext()).toBe(result.rightNode);
      expect(result.rightNode.getPrev()).toBe(leaf);
      expect(result.rightNode.getNext()).toBeNull();
    });

    it('should maintain original->new->originalNext chain', () => {
      // Create a chain: leaf -> nextLeaf
      const nextLeaf = new LeafNode<number, string>(4);
      nextLeaf.insert(50, 'fifty');
      nextLeaf.insert(60, 'sixty');

      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');
      leaf.insert(30, 'thirty');
      leaf.insert(40, 'forty');

      leaf.setNext(nextLeaf);
      nextLeaf.setPrev(leaf);

      const result = leaf.split();

      // After split: leaf -> newNode -> nextLeaf
      expect(leaf.getNext()).toBe(result.rightNode);
      expect(result.rightNode.getPrev()).toBe(leaf);
      expect(result.rightNode.getNext()).toBe(nextLeaf);
      expect(nextLeaf.getPrev()).toBe(result.rightNode);
    });

    it('should handle odd number of keys', () => {
      // Order 5: insert 5 keys
      const leafOrder5 = new LeafNode<number, string>(5);
      leafOrder5.insert(10, 'ten');
      leafOrder5.insert(20, 'twenty');
      leafOrder5.insert(30, 'thirty');
      leafOrder5.insert(40, 'forty');
      leafOrder5.insert(50, 'fifty');

      const result = leafOrder5.split();

      // For 5 keys: first ceil(5/2) = 3 stay, 2 move
      expect(leafOrder5.getKeyCount()).toBe(3);
      expect(result.rightNode.getKeyCount()).toBe(2);
      expect(leafOrder5.getKeys()).toEqual([10, 20, 30]);
      expect(result.rightNode.getKeys()).toEqual([40, 50]);
    });

    it('should handle even number of keys', () => {
      // Order 4: insert 4 keys
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');
      leaf.insert(30, 'thirty');
      leaf.insert(40, 'forty');

      const result = leaf.split();

      // For 4 keys: first ceil(4/2) = 2 stay, 2 move
      expect(leaf.getKeyCount()).toBe(2);
      expect(result.rightNode.getKeyCount()).toBe(2);
      expect(leaf.getKeys()).toEqual([10, 20]);
      expect(result.rightNode.getKeys()).toEqual([30, 40]);
    });

    it('should maintain sorted order in both nodes after split', () => {
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');
      leaf.insert(30, 'thirty');
      leaf.insert(40, 'forty');

      const result = leaf.split();

      // Original node should be sorted
      const originalKeys = leaf.getKeys();
      for (let i = 1; i < originalKeys.length; i++) {
        expect(originalKeys[i]).toBeGreaterThan(originalKeys[i - 1]);
      }

      // New node should be sorted
      const newKeys = result.rightNode.getKeys();
      for (let i = 1; i < newKeys.length; i++) {
        expect(newKeys[i]).toBeGreaterThan(newKeys[i - 1]);
      }

      // All keys in original should be less than all keys in new
      const maxOriginal = originalKeys[originalKeys.length - 1];
      const minNew = newKeys[0];
      expect(maxOriginal).toBeLessThan(minNew);
    });

    it('should split correctly after insertion causes overflow', () => {
      // Simulate the typical split scenario: insert causing overflow
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');
      leaf.insert(30, 'thirty');
      leaf.insert(40, 'forty');
      // Now leaf is at capacity (order 4, has 4 keys)

      // Insert one more (this would normally trigger split in BPlusTree)
      leaf.insert(50, 'fifty');
      // Now leaf has 5 keys (overflow)

      const result = leaf.split();

      // After split of 5 keys: 3 in original, 2 in new
      expect(leaf.getKeyCount()).toBe(3);
      expect(result.rightNode.getKeyCount()).toBe(2);

      // All 5 keys should be preserved
      const allKeys = [...leaf.getKeys(), ...result.rightNode.getKeys()];
      expect(allKeys).toEqual([10, 20, 30, 40, 50]);
    });
  });

  describe('borrowFromLeft', () => {
    it.todo('should borrow rightmost key-value from left sibling');
    it.todo('should insert borrowed pair at beginning of current node');
    it.todo('should remove borrowed pair from left sibling');
    it.todo('should return new separator key for parent');
    it.todo('should maintain sorted order after borrowing');
  });

  describe('borrowFromRight', () => {
    it.todo('should borrow leftmost key-value from right sibling');
    it.todo('should insert borrowed pair at end of current node');
    it.todo('should remove borrowed pair from right sibling');
    it.todo('should return new separator key for parent');
    it.todo('should maintain sorted order after borrowing');
  });

  describe('mergeWithRight', () => {
    it.todo('should combine all key-value pairs from both nodes');
    it.todo('should append right sibling pairs to current node');
    it.todo('should update next pointer to skip merged sibling');
    it.todo('should update prev pointer of next node');
    it.todo('should maintain sorted order after merge');
    it.todo('should handle merge with various key counts');
  });

  describe('getEntries', () => {
    it.todo('should return empty array for empty leaf');
    it.todo('should return all key-value pairs as tuples');
    it.todo('should return entries in sorted order');
    it.todo('should return copy that does not affect internal state');
  });

  describe('edge cases', () => {
    it.todo('should handle minimum order (3)');
    it.todo('should handle large order');
    it.todo('should handle maximum capacity');
    it.todo('should handle duplicate insertions correctly');
  });

  describe('invariants', () => {
    it.todo('should maintain keys.length === values.length');
    it.todo('should keep keys in sorted order');
    it.todo('should respect order constraints');
  });

  describe('range queries support', () => {
    it.todo('should support traversal via next pointers');
    it.todo('should support backward traversal via prev pointers');
    it.todo('should maintain linked list integrity after operations');
  });
});
