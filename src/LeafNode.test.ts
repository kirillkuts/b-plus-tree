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
    it('should return false when deleting from empty leaf', () => {
      const result = leaf.delete(10);
      expect(result).toBe(false);
      expect(leaf.getKeyCount()).toBe(0);
    });

    it('should delete existing key-value pair', () => {
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');
      leaf.insert(30, 'thirty');

      expect(leaf.getKeyCount()).toBe(3);

      const result = leaf.delete(20);

      expect(result).toBe(true);
      expect(leaf.getKeyCount()).toBe(2);
      expect(leaf.getKeys()).toEqual([10, 30]);
      expect(leaf.getValues()).toEqual(['ten', 'thirty']);
    });

    it('should return true when key is found and deleted', () => {
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');

      const result = leaf.delete(10);

      expect(result).toBe(true);
    });

    it('should return false when key is not found', () => {
      leaf.insert(10, 'ten');
      leaf.insert(30, 'thirty');

      const result = leaf.delete(20);

      expect(result).toBe(false);
      expect(leaf.getKeyCount()).toBe(2); // Should remain unchanged
    });

    it('should maintain keys and values in sync after deletion', () => {
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');
      leaf.insert(30, 'thirty');
      leaf.insert(40, 'forty');

      leaf.delete(20);

      const keys = leaf.getKeys();
      const values = leaf.getValues();

      expect(keys.length).toBe(values.length);
      expect(keys).toEqual([10, 30, 40]);
      expect(values).toEqual(['ten', 'thirty', 'forty']);

      // Verify each key maps to correct value
      keys.forEach((key, index) => {
        expect(leaf.search(key)).toBe(values[index]);
      });
    });

    it('should handle deletion from beginning', () => {
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');
      leaf.insert(30, 'thirty');

      const result = leaf.delete(10);

      expect(result).toBe(true);
      expect(leaf.getKeys()).toEqual([20, 30]);
      expect(leaf.getValues()).toEqual(['twenty', 'thirty']);
    });

    it('should handle deletion from end', () => {
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');
      leaf.insert(30, 'thirty');

      const result = leaf.delete(30);

      expect(result).toBe(true);
      expect(leaf.getKeys()).toEqual([10, 20]);
      expect(leaf.getValues()).toEqual(['ten', 'twenty']);
    });

    it('should handle deletion from middle', () => {
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');
      leaf.insert(30, 'thirty');
      leaf.insert(40, 'forty');
      leaf.insert(50, 'fifty');

      const result = leaf.delete(30);

      expect(result).toBe(true);
      expect(leaf.getKeys()).toEqual([10, 20, 40, 50]);
      expect(leaf.getValues()).toEqual(['ten', 'twenty', 'forty', 'fifty']);
    });

    it('should handle deleting last remaining key', () => {
      leaf.insert(42, 'answer');

      expect(leaf.getKeyCount()).toBe(1);

      const result = leaf.delete(42);

      expect(result).toBe(true);
      expect(leaf.getKeyCount()).toBe(0);
      expect(leaf.getKeys()).toEqual([]);
      expect(leaf.getValues()).toEqual([]);
      expect(leaf.isEmpty()).toBe(true);
    });

    it('should handle multiple deletions', () => {
      // Insert several keys
      const entries = [10, 20, 30, 40, 50];
      entries.forEach(key => leaf.insert(key, `value${key}`));

      expect(leaf.getKeyCount()).toBe(5);

      // Delete in various order
      leaf.delete(30); // middle
      expect(leaf.getKeyCount()).toBe(4);
      expect(leaf.getKeys()).toEqual([10, 20, 40, 50]);

      leaf.delete(10); // beginning
      expect(leaf.getKeyCount()).toBe(3);
      expect(leaf.getKeys()).toEqual([20, 40, 50]);

      leaf.delete(50); // end
      expect(leaf.getKeyCount()).toBe(2);
      expect(leaf.getKeys()).toEqual([20, 40]);

      leaf.delete(40);
      leaf.delete(20);
      expect(leaf.getKeyCount()).toBe(0);
    });

    it('should not delete the same key twice', () => {
      leaf.insert(10, 'ten');

      const result1 = leaf.delete(10);
      expect(result1).toBe(true);
      expect(leaf.getKeyCount()).toBe(0);

      const result2 = leaf.delete(10);
      expect(result2).toBe(false);
      expect(leaf.getKeyCount()).toBe(0);
    });

    it('should maintain sorted order after deletions', () => {
      leaf.insert(50, 'fifty');
      leaf.insert(10, 'ten');
      leaf.insert(30, 'thirty');
      leaf.insert(20, 'twenty');
      leaf.insert(40, 'forty');

      leaf.delete(30);
      leaf.delete(10);

      const keys = leaf.getKeys();
      for (let i = 1; i < keys.length; i++) {
        expect(keys[i]).toBeGreaterThan(keys[i - 1]);
      }

      expect(keys).toEqual([20, 40, 50]);
    });

    it('should return correct search results after deletion', () => {
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');
      leaf.insert(30, 'thirty');

      leaf.delete(20);

      expect(leaf.search(10)).toBe('ten');
      expect(leaf.search(20)).toBeUndefined();
      expect(leaf.search(30)).toBe('thirty');
    });
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

  describe('tryBorrowFromLeft', () => {
    it('should return undefined when there is no left sibling', () => {
      // Leaf has no prev sibling
      leaf.insert(30, 'thirty');
      leaf.insert(40, 'forty');

      expect(leaf.getPrev()).toBeNull();

      const result = leaf.tryBorrowFromLeft();

      expect(result).toBeUndefined();
      expect(leaf.getKeyCount()).toBe(2); // Unchanged
    });

    it('should return undefined when left sibling cannot lend (at minimum)', () => {
      // Order 4: minimum keys = floor(4/2) = 2
      // If left sibling has 2 keys, after lending it would have 1 (below minimum)
      const leftLeaf = new LeafNode<number, string>(4);
      leftLeaf.insert(10, 'ten');
      leftLeaf.insert(20, 'twenty');

      leaf.insert(30, 'thirty');
      leaf.insert(40, 'forty');

      // Link siblings
      leftLeaf.setNext(leaf);
      leaf.setPrev(leftLeaf);

      // Left sibling has 2 keys, canBorrow() should return false
      expect(leftLeaf.canBorrow()).toBe(false);

      const result = leaf.tryBorrowFromLeft();

      expect(result).toBeUndefined();
      expect(leaf.getKeyCount()).toBe(2); // Unchanged
      expect(leftLeaf.getKeyCount()).toBe(2); // Unchanged
    });

    it('should borrow rightmost key-value from left sibling when possible', () => {
      // Left sibling has 3 keys (can lend one and still have 2)
      const leftLeaf = new LeafNode<number, string>(4);
      leftLeaf.insert(10, 'ten');
      leftLeaf.insert(20, 'twenty');
      leftLeaf.insert(25, 'twenty-five');

      // Current leaf has 1 key (underflow)
      leaf.insert(30, 'thirty');

      // Link siblings
      leftLeaf.setNext(leaf);
      leaf.setPrev(leftLeaf);

      expect(leftLeaf.canBorrow()).toBe(true);

      const result = leaf.tryBorrowFromLeft();

      // Should borrow 25 (rightmost from left sibling)
      expect(result).toBe(25);
      expect(leaf.getKeys()).toEqual([25, 30]);
      expect(leaf.getValues()).toEqual(['twenty-five', 'thirty']);
    });

    it('should remove borrowed key-value from left sibling', () => {
      const leftLeaf = new LeafNode<number, string>(4);
      leftLeaf.insert(10, 'ten');
      leftLeaf.insert(20, 'twenty');
      leftLeaf.insert(25, 'twenty-five');

      leaf.insert(30, 'thirty');

      leftLeaf.setNext(leaf);
      leaf.setPrev(leftLeaf);

      expect(leftLeaf.getKeyCount()).toBe(3);

      leaf.tryBorrowFromLeft();

      // Left sibling should now have 2 keys (25 was removed)
      expect(leftLeaf.getKeyCount()).toBe(2);
      expect(leftLeaf.getKeys()).toEqual([10, 20]);
      expect(leftLeaf.getValues()).toEqual(['ten', 'twenty']);
    });

    it('should return new first key of current node (new separator)', () => {
      const leftLeaf = new LeafNode<number, string>(4);
      leftLeaf.insert(10, 'ten');
      leftLeaf.insert(20, 'twenty');
      leftLeaf.insert(25, 'twenty-five');

      leaf.insert(30, 'thirty');
      leaf.insert(40, 'forty');

      leftLeaf.setNext(leaf);
      leaf.setPrev(leftLeaf);

      const newSeparator = leaf.tryBorrowFromLeft();

      // New separator should be the borrowed key (now first key of current node)
      expect(newSeparator).toBe(25);
      expect(leaf.getKey(0)).toBe(25);
    });

    it('should maintain sorted order after borrowing', () => {
      const leftLeaf = new LeafNode<number, string>(4);
      leftLeaf.insert(10, 'ten');
      leftLeaf.insert(15, 'fifteen');
      leftLeaf.insert(20, 'twenty');

      leaf.insert(30, 'thirty');
      leaf.insert(40, 'forty');

      leftLeaf.setNext(leaf);
      leaf.setPrev(leftLeaf);

      leaf.tryBorrowFromLeft();

      // Both nodes should remain sorted
      const leftKeys = leftLeaf.getKeys();
      for (let i = 1; i < leftKeys.length; i++) {
        expect(leftKeys[i]).toBeGreaterThan(leftKeys[i - 1]);
      }

      const currentKeys = leaf.getKeys();
      for (let i = 1; i < currentKeys.length; i++) {
        expect(currentKeys[i]).toBeGreaterThan(currentKeys[i - 1]);
      }

      // All keys in left should be < all keys in current
      const maxLeft = leftKeys[leftKeys.length - 1];
      const minCurrent = currentKeys[0];
      expect(maxLeft).toBeLessThan(minCurrent);
    });

    it('should insert borrowed pair in correct sorted position', () => {
      const leftLeaf = new LeafNode<number, string>(4);
      leftLeaf.insert(5, 'five');
      leftLeaf.insert(10, 'ten');
      leftLeaf.insert(15, 'fifteen');

      leaf.insert(20, 'twenty');
      leaf.insert(30, 'thirty');

      leftLeaf.setNext(leaf);
      leaf.setPrev(leftLeaf);

      leaf.tryBorrowFromLeft();

      // 15 should be inserted between left sibling and existing keys
      expect(leaf.getKeys()).toEqual([15, 20, 30]);
      expect(leaf.getValues()).toEqual(['fifteen', 'twenty', 'thirty']);
    });

    it('should handle borrowing when current node has single key', () => {
      const leftLeaf = new LeafNode<number, string>(4);
      leftLeaf.insert(10, 'ten');
      leftLeaf.insert(20, 'twenty');
      leftLeaf.insert(25, 'twenty-five');

      leaf.insert(30, 'thirty'); // Only one key

      leftLeaf.setNext(leaf);
      leaf.setPrev(leftLeaf);

      const result = leaf.tryBorrowFromLeft();

      expect(result).toBe(25);
      expect(leaf.getKeyCount()).toBe(2);
      expect(leaf.getKeys()).toEqual([25, 30]);
    });

    it('should handle borrowing when current node is empty', () => {
      const leftLeaf = new LeafNode<number, string>(4);
      leftLeaf.insert(10, 'ten');
      leftLeaf.insert(20, 'twenty');
      leftLeaf.insert(25, 'twenty-five');

      // Current leaf is empty (extreme underflow)
      expect(leaf.getKeyCount()).toBe(0);

      leftLeaf.setNext(leaf);
      leaf.setPrev(leftLeaf);

      const result = leaf.tryBorrowFromLeft();

      expect(result).toBe(25);
      expect(leaf.getKeyCount()).toBe(1);
      expect(leaf.getKeys()).toEqual([25]);
      expect(leaf.getValues()).toEqual(['twenty-five']);
    });

    it('should work correctly with order 3', () => {
      // Order 3: minimum = floor(3/2) = 1
      // Left sibling needs at least 2 keys to lend (2-1 = 1 >= minimum)
      const leftLeaf = new LeafNode<number, string>(3);
      leftLeaf.insert(10, 'ten');
      leftLeaf.insert(20, 'twenty');

      const currentLeaf = new LeafNode<number, string>(3);
      currentLeaf.insert(30, 'thirty');

      leftLeaf.setNext(currentLeaf);
      currentLeaf.setPrev(leftLeaf);

      expect(leftLeaf.canBorrow()).toBe(true);

      const result = currentLeaf.tryBorrowFromLeft();

      expect(result).toBe(20);
      expect(currentLeaf.getKeys()).toEqual([20, 30]);
      expect(leftLeaf.getKeys()).toEqual([10]);
    });

    it('should work correctly with larger order', () => {
      // Order 6: minimum = floor(6/2) = 3
      const leftLeaf = new LeafNode<number, string>(6);
      leftLeaf.insert(10, 'ten');
      leftLeaf.insert(20, 'twenty');
      leftLeaf.insert(30, 'thirty');
      leftLeaf.insert(40, 'forty');

      const currentLeaf = new LeafNode<number, string>(6);
      currentLeaf.insert(50, 'fifty');

      leftLeaf.setNext(currentLeaf);
      currentLeaf.setPrev(leftLeaf);

      expect(leftLeaf.canBorrow()).toBe(true);

      const result = currentLeaf.tryBorrowFromLeft();

      expect(result).toBe(40);
      expect(currentLeaf.getKeys()).toEqual([40, 50]);
      expect(leftLeaf.getKeyCount()).toBe(3); // Still at minimum
    });

    it('should preserve key-value correspondence after borrowing', () => {
      const leftLeaf = new LeafNode<number, string>(4);
      leftLeaf.insert(10, 'value10');
      leftLeaf.insert(20, 'value20');
      leftLeaf.insert(25, 'value25');

      leaf.insert(30, 'value30');
      leaf.insert(40, 'value40');

      leftLeaf.setNext(leaf);
      leaf.setPrev(leftLeaf);

      leaf.tryBorrowFromLeft();

      // Verify each key still maps to its correct value
      expect(leaf.search(25)).toBe('value25');
      expect(leaf.search(30)).toBe('value30');
      expect(leaf.search(40)).toBe('value40');

      expect(leftLeaf.search(10)).toBe('value10');
      expect(leftLeaf.search(20)).toBe('value20');
      expect(leftLeaf.search(25)).toBeUndefined(); // No longer in left
    });

    it('should handle multiple consecutive borrows', () => {
      const leftLeaf = new LeafNode<number, string>(4);
      leftLeaf.insert(5, 'five');
      leftLeaf.insert(10, 'ten');
      leftLeaf.insert(15, 'fifteen');
      leftLeaf.insert(20, 'twenty');

      leaf.insert(30, 'thirty');

      leftLeaf.setNext(leaf);
      leaf.setPrev(leftLeaf);

      // First borrow
      const result1 = leaf.tryBorrowFromLeft();
      expect(result1).toBe(20);
      expect(leaf.getKeys()).toEqual([20, 30]);
      expect(leftLeaf.getKeyCount()).toBe(3);

      // Second borrow (if still possible)
      const result2 = leaf.tryBorrowFromLeft();
      expect(result2).toBe(15);
      expect(leaf.getKeys()).toEqual([15, 20, 30]);
      expect(leftLeaf.getKeyCount()).toBe(2);

      // Third borrow should fail (left sibling at minimum)
      const result3 = leaf.tryBorrowFromLeft();
      expect(result3).toBeUndefined();
    });

    it('should not borrow when left sibling would go below minimum', () => {
      // Order 4: minimum = 2
      const leftLeaf = new LeafNode<number, string>(4);
      leftLeaf.insert(10, 'ten');
      leftLeaf.insert(20, 'twenty');
      // Left has exactly 2 keys (at minimum)

      leaf.insert(30, 'thirty');

      leftLeaf.setNext(leaf);
      leaf.setPrev(leftLeaf);

      expect(leftLeaf.canBorrow()).toBe(false);

      const result = leaf.tryBorrowFromLeft();

      expect(result).toBeUndefined();
      // Both nodes unchanged
      expect(leftLeaf.getKeys()).toEqual([10, 20]);
      expect(leaf.getKeys()).toEqual([30]);
    });
  });

  describe('tryBorrowFromRight', () => {
    it('should return undefined when there is no right sibling', () => {
      // Leaf has no next sibling
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');

      expect(leaf.getNext()).toBeNull();

      const result = leaf.tryBorrowFromRight();

      expect(result).toBeUndefined();
      expect(leaf.getKeyCount()).toBe(2); // Unchanged
    });

    it('should return undefined when right sibling cannot lend (at minimum)', () => {
      // Order 4: minimum keys = floor(4/2) = 2
      const rightLeaf = new LeafNode<number, string>(4);
      rightLeaf.insert(30, 'thirty');
      rightLeaf.insert(40, 'forty');

      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');

      // Link siblings
      leaf.setNext(rightLeaf);
      rightLeaf.setPrev(leaf);

      // Right sibling has 2 keys, canBorrow() should return false
      expect(rightLeaf.canBorrow()).toBe(false);

      const result = leaf.tryBorrowFromRight();

      expect(result).toBeUndefined();
      expect(leaf.getKeyCount()).toBe(2); // Unchanged
      expect(rightLeaf.getKeyCount()).toBe(2); // Unchanged
    });

    it('should borrow leftmost key-value from right sibling when possible', () => {
      // Current leaf has 1 key (underflow)
      leaf.insert(10, 'ten');

      // Right sibling has 3 keys (can lend one and still have 2)
      const rightLeaf = new LeafNode<number, string>(4);
      rightLeaf.insert(30, 'thirty');
      rightLeaf.insert(40, 'forty');
      rightLeaf.insert(50, 'fifty');

      // Link siblings
      leaf.setNext(rightLeaf);
      rightLeaf.setPrev(leaf);

      expect(rightLeaf.canBorrow()).toBe(true);

      const result = leaf.tryBorrowFromRight();

      // Should borrow 30 (leftmost from right sibling)
      expect(result).toBe(30);
      expect(leaf.getKeys()).toEqual([10, 30]);
      expect(leaf.getValues()).toEqual(['ten', 'thirty']);
    });

    it('should remove borrowed key-value from right sibling', () => {
      leaf.insert(10, 'ten');

      const rightLeaf = new LeafNode<number, string>(4);
      rightLeaf.insert(30, 'thirty');
      rightLeaf.insert(40, 'forty');
      rightLeaf.insert(50, 'fifty');

      leaf.setNext(rightLeaf);
      rightLeaf.setPrev(leaf);

      expect(rightLeaf.getKeyCount()).toBe(3);

      leaf.tryBorrowFromRight();

      // Right sibling should now have 2 keys (30 was removed)
      expect(rightLeaf.getKeyCount()).toBe(2);
      expect(rightLeaf.getKeys()).toEqual([40, 50]);
      expect(rightLeaf.getValues()).toEqual(['forty', 'fifty']);
    });

    it('should return borrowed key (which is inserted into current node)', () => {
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');

      const rightLeaf = new LeafNode<number, string>(4);
      rightLeaf.insert(30, 'thirty');
      rightLeaf.insert(40, 'forty');
      rightLeaf.insert(50, 'fifty');

      leaf.setNext(rightLeaf);
      rightLeaf.setPrev(leaf);

      const borrowedKey = leaf.tryBorrowFromRight();

      // Should return the borrowed key
      expect(borrowedKey).toBe(30);
      // The borrowed key should now be in current node
      expect(leaf.getKeys()).toContain(30);
    });

    it('should maintain sorted order after borrowing', () => {
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');

      const rightLeaf = new LeafNode<number, string>(4);
      rightLeaf.insert(35, 'thirty-five');
      rightLeaf.insert(40, 'forty');
      rightLeaf.insert(50, 'fifty');

      leaf.setNext(rightLeaf);
      rightLeaf.setPrev(leaf);

      leaf.tryBorrowFromRight();

      // Both nodes should remain sorted
      const currentKeys = leaf.getKeys();
      for (let i = 1; i < currentKeys.length; i++) {
        expect(currentKeys[i]).toBeGreaterThan(currentKeys[i - 1]);
      }

      const rightKeys = rightLeaf.getKeys();
      for (let i = 1; i < rightKeys.length; i++) {
        expect(rightKeys[i]).toBeGreaterThan(rightKeys[i - 1]);
      }

      // All keys in current should be < all keys in right
      const maxCurrent = currentKeys[currentKeys.length - 1];
      const minRight = rightKeys[0];
      expect(maxCurrent).toBeLessThan(minRight);
    });

    it('should insert borrowed pair in correct sorted position', () => {
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');

      const rightLeaf = new LeafNode<number, string>(4);
      rightLeaf.insert(25, 'twenty-five');
      rightLeaf.insert(30, 'thirty');
      rightLeaf.insert(40, 'forty');

      leaf.setNext(rightLeaf);
      rightLeaf.setPrev(leaf);

      leaf.tryBorrowFromRight();

      // 25 should be inserted at the end (after 10, 20)
      expect(leaf.getKeys()).toEqual([10, 20, 25]);
      expect(leaf.getValues()).toEqual(['ten', 'twenty', 'twenty-five']);
    });

    it('should handle borrowing when current node has single key', () => {
      leaf.insert(10, 'ten'); // Only one key

      const rightLeaf = new LeafNode<number, string>(4);
      rightLeaf.insert(30, 'thirty');
      rightLeaf.insert(40, 'forty');
      rightLeaf.insert(50, 'fifty');

      leaf.setNext(rightLeaf);
      rightLeaf.setPrev(leaf);

      const result = leaf.tryBorrowFromRight();

      expect(result).toBe(30);
      expect(leaf.getKeyCount()).toBe(2);
      expect(leaf.getKeys()).toEqual([10, 30]);
    });

    it('should handle borrowing when current node is empty', () => {
      // Current leaf is empty (extreme underflow)
      expect(leaf.getKeyCount()).toBe(0);

      const rightLeaf = new LeafNode<number, string>(4);
      rightLeaf.insert(30, 'thirty');
      rightLeaf.insert(40, 'forty');
      rightLeaf.insert(50, 'fifty');

      leaf.setNext(rightLeaf);
      rightLeaf.setPrev(leaf);

      const result = leaf.tryBorrowFromRight();

      expect(result).toBe(30);
      expect(leaf.getKeyCount()).toBe(1);
      expect(leaf.getKeys()).toEqual([30]);
      expect(leaf.getValues()).toEqual(['thirty']);
    });

    it('should work correctly with order 3', () => {
      // Order 3: minimum = floor(3/2) = 1
      const currentLeaf = new LeafNode<number, string>(3);
      currentLeaf.insert(10, 'ten');

      const rightLeaf = new LeafNode<number, string>(3);
      rightLeaf.insert(30, 'thirty');
      rightLeaf.insert(40, 'forty');

      currentLeaf.setNext(rightLeaf);
      rightLeaf.setPrev(currentLeaf);

      expect(rightLeaf.canBorrow()).toBe(true);

      const result = currentLeaf.tryBorrowFromRight();

      expect(result).toBe(30);
      expect(currentLeaf.getKeys()).toEqual([10, 30]);
      expect(rightLeaf.getKeys()).toEqual([40]);
    });

    it('should work correctly with larger order', () => {
      // Order 6: minimum = floor(6/2) = 3
      const currentLeaf = new LeafNode<number, string>(6);
      currentLeaf.insert(10, 'ten');

      const rightLeaf = new LeafNode<number, string>(6);
      rightLeaf.insert(50, 'fifty');
      rightLeaf.insert(60, 'sixty');
      rightLeaf.insert(70, 'seventy');
      rightLeaf.insert(80, 'eighty');

      currentLeaf.setNext(rightLeaf);
      rightLeaf.setPrev(currentLeaf);

      expect(rightLeaf.canBorrow()).toBe(true);

      const result = currentLeaf.tryBorrowFromRight();

      expect(result).toBe(50);
      expect(currentLeaf.getKeys()).toEqual([10, 50]);
      expect(rightLeaf.getKeyCount()).toBe(3); // Still at minimum
    });

    it('should preserve key-value correspondence after borrowing', () => {
      leaf.insert(10, 'value10');
      leaf.insert(20, 'value20');

      const rightLeaf = new LeafNode<number, string>(4);
      rightLeaf.insert(30, 'value30');
      rightLeaf.insert(40, 'value40');
      rightLeaf.insert(50, 'value50');

      leaf.setNext(rightLeaf);
      rightLeaf.setPrev(leaf);

      leaf.tryBorrowFromRight();

      // Verify each key still maps to its correct value
      expect(leaf.search(10)).toBe('value10');
      expect(leaf.search(20)).toBe('value20');
      expect(leaf.search(30)).toBe('value30');

      expect(rightLeaf.search(30)).toBeUndefined(); // No longer in right
      expect(rightLeaf.search(40)).toBe('value40');
      expect(rightLeaf.search(50)).toBe('value50');
    });

    it('should handle multiple consecutive borrows', () => {
      leaf.insert(10, 'ten');

      const rightLeaf = new LeafNode<number, string>(4);
      rightLeaf.insert(30, 'thirty');
      rightLeaf.insert(40, 'forty');
      rightLeaf.insert(50, 'fifty');
      rightLeaf.insert(60, 'sixty');

      leaf.setNext(rightLeaf);
      rightLeaf.setPrev(leaf);

      // First borrow
      const result1 = leaf.tryBorrowFromRight();
      expect(result1).toBe(30);
      expect(leaf.getKeys()).toEqual([10, 30]);
      expect(rightLeaf.getKeyCount()).toBe(3);

      // Second borrow (if still possible)
      const result2 = leaf.tryBorrowFromRight();
      expect(result2).toBe(40);
      expect(leaf.getKeys()).toEqual([10, 30, 40]);
      expect(rightLeaf.getKeyCount()).toBe(2);

      // Third borrow should fail (right sibling at minimum)
      const result3 = leaf.tryBorrowFromRight();
      expect(result3).toBeUndefined();
    });

    it('should not borrow when right sibling would go below minimum', () => {
      // Order 4: minimum = 2
      leaf.insert(10, 'ten');

      const rightLeaf = new LeafNode<number, string>(4);
      rightLeaf.insert(30, 'thirty');
      rightLeaf.insert(40, 'forty');
      // Right has exactly 2 keys (at minimum)

      leaf.setNext(rightLeaf);
      rightLeaf.setPrev(leaf);

      expect(rightLeaf.canBorrow()).toBe(false);

      const result = leaf.tryBorrowFromRight();

      expect(result).toBeUndefined();
      // Both nodes unchanged
      expect(leaf.getKeys()).toEqual([10]);
      expect(rightLeaf.getKeys()).toEqual([30, 40]);
    });

    it('should update right sibling first key after borrowing', () => {
      leaf.insert(10, 'ten');

      const rightLeaf = new LeafNode<number, string>(4);
      rightLeaf.insert(30, 'thirty');
      rightLeaf.insert(40, 'forty');
      rightLeaf.insert(50, 'fifty');

      leaf.setNext(rightLeaf);
      rightLeaf.setPrev(leaf);

      // Before borrowing, right sibling starts with 30
      expect(rightLeaf.getKey(0)).toBe(30);

      leaf.tryBorrowFromRight();

      // After borrowing, right sibling should now start with 40
      expect(rightLeaf.getKey(0)).toBe(40);
    });

    it('should return the new first key of right sibling (new separator)', () => {
      leaf.insert(10, 'ten');

      const rightLeaf = new LeafNode<number, string>(4);
      rightLeaf.insert(30, 'thirty');
      rightLeaf.insert(40, 'forty');
      rightLeaf.insert(50, 'fifty');

      leaf.setNext(rightLeaf);
      rightLeaf.setPrev(leaf);

      const result = leaf.tryBorrowFromRight();

      // The returned key (30) was inserted into current node
      // But note: the method returns the borrowed key, not the new separator
      // The new separator for parent should be rightLeaf.getKey(0) after borrowing
      expect(result).toBe(30);
      // After borrowing, right sibling starts with 40 (this becomes new separator)
      expect(rightLeaf.getKey(0)).toBe(40);
    });
  });

  describe('mergeWithRight', () => {
    it('should combine all key-value pairs from both nodes', () => {
      // Left node has 2 keys
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');

      // Right node has 2 keys
      const rightLeaf = new LeafNode<number, string>(4);
      rightLeaf.insert(30, 'thirty');
      rightLeaf.insert(40, 'forty');

      // Link siblings
      leaf.setNext(rightLeaf);
      rightLeaf.setPrev(leaf);

      const leftKeysBefore = leaf.getKeyCount();
      const rightKeysBefore = rightLeaf.getKeyCount();

      // Merge right into left
      leaf.mergeWithRight(rightLeaf);

      // Left should now have all keys from both nodes
      expect(leaf.getKeyCount()).toBe(leftKeysBefore + rightKeysBefore);
      expect(leaf.getKeys()).toEqual([10, 20, 30, 40]);
      expect(leaf.getValues()).toEqual(['ten', 'twenty', 'thirty', 'forty']);
    });

    it('should append right sibling pairs to current node', () => {
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');

      const rightLeaf = new LeafNode<number, string>(4);
      rightLeaf.insert(30, 'thirty');
      rightLeaf.insert(40, 'forty');

      leaf.setNext(rightLeaf);
      rightLeaf.setPrev(leaf);

      leaf.mergeWithRight(rightLeaf);

      // Keys should be in order: left keys first, then right keys
      const keys = leaf.getKeys();
      expect(keys[0]).toBe(10);
      expect(keys[1]).toBe(20);
      expect(keys[2]).toBe(30);
      expect(keys[3]).toBe(40);
    });

    it('should update next pointer to skip merged sibling', () => {
      leaf.insert(10, 'ten');

      const rightLeaf = new LeafNode<number, string>(4);
      rightLeaf.insert(30, 'thirty');

      // Create a third leaf beyond the right sibling
      const furtherRight = new LeafNode<number, string>(4);
      furtherRight.insert(50, 'fifty');

      // Link: leaf -> rightLeaf -> furtherRight
      leaf.setNext(rightLeaf);
      rightLeaf.setPrev(leaf);
      rightLeaf.setNext(furtherRight);
      furtherRight.setPrev(rightLeaf);

      // Merge rightLeaf into leaf
      leaf.mergeWithRight(rightLeaf);

      // leaf should now point directly to furtherRight (skip merged node)
      expect(leaf.getNext()).toBe(furtherRight);
    });

    it('should update prev pointer of next node', () => {
      leaf.insert(10, 'ten');

      const rightLeaf = new LeafNode<number, string>(4);
      rightLeaf.insert(30, 'thirty');

      const furtherRight = new LeafNode<number, string>(4);
      furtherRight.insert(50, 'fifty');

      // Link: leaf -> rightLeaf -> furtherRight
      leaf.setNext(rightLeaf);
      rightLeaf.setPrev(leaf);
      rightLeaf.setNext(furtherRight);
      furtherRight.setPrev(rightLeaf);

      // Before merge: furtherRight.prev points to rightLeaf
      expect(furtherRight.getPrev()).toBe(rightLeaf);

      // Merge rightLeaf into leaf
      leaf.mergeWithRight(rightLeaf);

      // After merge: furtherRight.prev should point to leaf
      expect(furtherRight.getPrev()).toBe(leaf);
    });

    it('should maintain sorted order after merge', () => {
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');

      const rightLeaf = new LeafNode<number, string>(4);
      rightLeaf.insert(30, 'thirty');
      rightLeaf.insert(40, 'forty');

      leaf.setNext(rightLeaf);
      rightLeaf.setPrev(leaf);

      leaf.mergeWithRight(rightLeaf);

      // All keys should be in sorted order
      const keys = leaf.getKeys();
      for (let i = 1; i < keys.length; i++) {
        expect(keys[i]).toBeGreaterThan(keys[i - 1]);
      }

      expect(keys).toEqual([10, 20, 30, 40]);
    });

    it('should handle merge with various key counts', () => {
      // Test 1: 1 key + 1 key
      const leaf1 = new LeafNode<number, string>(4);
      leaf1.insert(10, 'ten');

      const right1 = new LeafNode<number, string>(4);
      right1.insert(20, 'twenty');

      leaf1.setNext(right1);
      right1.setPrev(leaf1);

      leaf1.mergeWithRight(right1);
      expect(leaf1.getKeyCount()).toBe(2);
      expect(leaf1.getKeys()).toEqual([10, 20]);

      // Test 2: 2 keys + 1 key
      const leaf2 = new LeafNode<number, string>(4);
      leaf2.insert(10, 'ten');
      leaf2.insert(20, 'twenty');

      const right2 = new LeafNode<number, string>(4);
      right2.insert(30, 'thirty');

      leaf2.setNext(right2);
      right2.setPrev(leaf2);

      leaf2.mergeWithRight(right2);
      expect(leaf2.getKeyCount()).toBe(3);
      expect(leaf2.getKeys()).toEqual([10, 20, 30]);

      // Test 3: 1 key + 2 keys
      const leaf3 = new LeafNode<number, string>(4);
      leaf3.insert(10, 'ten');

      const right3 = new LeafNode<number, string>(4);
      right3.insert(30, 'thirty');
      right3.insert(40, 'forty');

      leaf3.setNext(right3);
      right3.setPrev(leaf3);

      leaf3.mergeWithRight(right3);
      expect(leaf3.getKeyCount()).toBe(3);
      expect(leaf3.getKeys()).toEqual([10, 30, 40]);
    });

    it('should preserve key-value correspondence after merge', () => {
      leaf.insert(10, 'value10');
      leaf.insert(20, 'value20');

      const rightLeaf = new LeafNode<number, string>(4);
      rightLeaf.insert(30, 'value30');
      rightLeaf.insert(40, 'value40');

      leaf.setNext(rightLeaf);
      rightLeaf.setPrev(leaf);

      leaf.mergeWithRight(rightLeaf);

      // Verify each key still maps to correct value
      expect(leaf.search(10)).toBe('value10');
      expect(leaf.search(20)).toBe('value20');
      expect(leaf.search(30)).toBe('value30');
      expect(leaf.search(40)).toBe('value40');
    });

    it('should handle merge when right sibling has no further next', () => {
      leaf.insert(10, 'ten');

      const rightLeaf = new LeafNode<number, string>(4);
      rightLeaf.insert(30, 'thirty');

      // rightLeaf is the last leaf (no next)
      leaf.setNext(rightLeaf);
      rightLeaf.setPrev(leaf);
      expect(rightLeaf.getNext()).toBeNull();

      leaf.mergeWithRight(rightLeaf);

      // After merge, leaf should have no next (it's now the last leaf)
      expect(leaf.getNext()).toBeNull();
      expect(leaf.getKeys()).toEqual([10, 30]);
    });

    it('should handle merge in the middle of a chain', () => {
      // Create chain: leaf1 -> leaf2 -> leaf3 -> leaf4
      const leaf1 = new LeafNode<number, string>(4);
      leaf1.insert(10, 'ten');

      const leaf2 = new LeafNode<number, string>(4);
      leaf2.insert(20, 'twenty');

      const leaf3 = new LeafNode<number, string>(4);
      leaf3.insert(30, 'thirty');

      const leaf4 = new LeafNode<number, string>(4);
      leaf4.insert(40, 'forty');

      // Link them
      leaf1.setNext(leaf2);
      leaf2.setPrev(leaf1);
      leaf2.setNext(leaf3);
      leaf3.setPrev(leaf2);
      leaf3.setNext(leaf4);
      leaf4.setPrev(leaf3);

      // Merge leaf3 into leaf2
      leaf2.mergeWithRight(leaf3);

      // New chain should be: leaf1 -> leaf2 -> leaf4
      expect(leaf1.getNext()).toBe(leaf2);
      expect(leaf2.getPrev()).toBe(leaf1);
      expect(leaf2.getNext()).toBe(leaf4);
      expect(leaf4.getPrev()).toBe(leaf2);

      expect(leaf2.getKeys()).toEqual([20, 30]);
    });

    it('should work with minimum key counts (typical merge scenario)', () => {
      // Order 4: minimum = 2
      // Typical merge: left has 2 keys, right has 1 key (underflow)
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');

      const rightLeaf = new LeafNode<number, string>(4);
      rightLeaf.insert(30, 'thirty');

      leaf.setNext(rightLeaf);
      rightLeaf.setPrev(leaf);

      // This is the typical scenario: right underflows after deletion
      expect(leaf.getKeyCount()).toBe(2); // at minimum
      expect(rightLeaf.getKeyCount()).toBe(1); // underflow

      leaf.mergeWithRight(rightLeaf);

      expect(leaf.getKeyCount()).toBe(3); // 2 + 1 = 3 ≤ order (4)
      expect(leaf.getKeys()).toEqual([10, 20, 30]);
    });

    it('should handle merge resulting in full node', () => {
      // Order 4: max 4 keys
      // Merge 2 + 2 = 4 (at capacity but valid)
      leaf.insert(10, 'ten');
      leaf.insert(20, 'twenty');

      const rightLeaf = new LeafNode<number, string>(4);
      rightLeaf.insert(30, 'thirty');
      rightLeaf.insert(40, 'forty');

      leaf.setNext(rightLeaf);
      rightLeaf.setPrev(leaf);

      leaf.mergeWithRight(rightLeaf);

      expect(leaf.getKeyCount()).toBe(4); // At capacity
      expect(leaf.getKeys()).toEqual([10, 20, 30, 40]);
    });

    it('should maintain linked list integrity with multiple merges', () => {
      // Create chain of 5 leaves
      const leaves = Array.from({ length: 5 }, (_, i) => {
        const l = new LeafNode<number, string>(4);
        l.insert((i + 1) * 10, `value${(i + 1) * 10}`);
        return l;
      });

      // Link them
      for (let i = 0; i < leaves.length - 1; i++) {
        leaves[i].setNext(leaves[i + 1]);
        leaves[i + 1].setPrev(leaves[i]);
      }

      // Merge leaves[1] with leaves[2]
      leaves[1].mergeWithRight(leaves[2]);

      // Verify chain: leaves[0] -> leaves[1] -> leaves[3] -> leaves[4]
      expect(leaves[0].getNext()).toBe(leaves[1]);
      expect(leaves[1].getPrev()).toBe(leaves[0]);
      expect(leaves[1].getNext()).toBe(leaves[3]);
      expect(leaves[3].getPrev()).toBe(leaves[1]);
      expect(leaves[3].getNext()).toBe(leaves[4]);
      expect(leaves[4].getPrev()).toBe(leaves[3]);

      expect(leaves[1].getKeys()).toEqual([20, 30]);
    });

    it('should verify all keys remain searchable after merge', () => {
      leaf.insert(10, 'ten');
      leaf.insert(15, 'fifteen');

      const rightLeaf = new LeafNode<number, string>(4);
      rightLeaf.insert(30, 'thirty');
      rightLeaf.insert(35, 'thirty-five');

      leaf.setNext(rightLeaf);
      rightLeaf.setPrev(leaf);

      leaf.mergeWithRight(rightLeaf);

      // All keys from both nodes should be searchable
      expect(leaf.search(10)).toBe('ten');
      expect(leaf.search(15)).toBe('fifteen');
      expect(leaf.search(30)).toBe('thirty');
      expect(leaf.search(35)).toBe('thirty-five');

      // Non-existent keys should return undefined
      expect(leaf.search(20)).toBeUndefined();
      expect(leaf.search(40)).toBeUndefined();
    });
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
