import { describe, it, expect, beforeEach } from 'vitest';
import { InternalNode } from './InternalNode';
import { LeafNode } from './LeafNode';

describe('InternalNode', () => {
  let node: InternalNode<number, string>;

  beforeEach(() => {
    node = new InternalNode<number, string>(4);
  });

  describe('constructor', () => {
    it('should create an internal node with no children', () => {
      expect(node.getChildCount()).toBe(0);
    });

    it('should be identified as non-leaf', () => {
      expect(node.isLeaf()).toBe(false);
    });
  });

  describe('getChildCount', () => {
    it.todo('should return 0 for new node');
    it.todo('should return correct count after adding children');
    it.todo('should maintain invariant: childCount = keyCount + 1');
  });

  describe('getChild', () => {
    it.todo('should return child at specified index');
    it.todo('should handle out of bounds access appropriately');
  });

  describe('getChildren', () => {
    it.todo('should return empty array for new node');
    it.todo('should return copy of all children');
    it.todo('should not allow modification of internal children array');
  });

  describe('insertKeyAndChild', () => {
    it('should insert first key and child correctly', () => {
      // Create initial children
      const leftChild = new LeafNode<number, string>(4);
      leftChild.insert(5, 'five');
      leftChild.insert(10, 'ten');

      const rightChild = new LeafNode<number, string>(4);
      rightChild.insert(20, 'twenty');
      rightChild.insert(25, 'twenty-five');

      // Internal node starts empty, but we need to manually set up the initial state
      // In practice, this happens during a split where we create a new root
      // For testing, we'll add the leftChild first, then use insertKeyAndChild for the separator

      // Manually set up the initial child (this would normally be done in tree construction)
      // We need to test insertKeyAndChild, which assumes at least one child exists
      node['children'] = [leftChild]; // Private access for testing

      node.insertKeyAndChild(20, rightChild);

      expect(node.getKeyCount()).toBe(1);
      expect(node.getChildCount()).toBe(2);
      expect(node.getKey(0)).toBe(20);
      expect(node.getChild(0)).toBe(leftChild);
      expect(node.getChild(1)).toBe(rightChild);
    });

    it('should maintain sorted order of keys', () => {
      const child1 = new LeafNode<number, string>(4);
      const child2 = new LeafNode<number, string>(4);
      const child3 = new LeafNode<number, string>(4);
      const child4 = new LeafNode<number, string>(4);

      // Set up initial state with one child
      node['children'] = [child1];

      // Insert keys out of order
      node.insertKeyAndChild(30, child3);
      node.insertKeyAndChild(10, child2);
      node.insertKeyAndChild(50, child4);

      // Keys should be sorted
      const keys = node.getKeys();
      expect(keys).toEqual([10, 30, 50]);

      // Verify sorted order
      for (let i = 1; i < keys.length; i++) {
        expect(keys[i]).toBeGreaterThan(keys[i - 1]);
      }
    });

    it('should insert child at correct position', () => {
      const child1 = new LeafNode<number, string>(4);
      const child2 = new LeafNode<number, string>(4);
      const child3 = new LeafNode<number, string>(4);

      node['children'] = [child1];

      node.insertKeyAndChild(20, child2);
      node.insertKeyAndChild(40, child3);

      // Keys: [20, 40]
      // Children: [child1, child2, child3]
      // child1 < 20 <= child2 < 40 <= child3

      expect(node.getKeyCount()).toBe(2);
      expect(node.getChildCount()).toBe(3);
      expect(node.getChild(0)).toBe(child1);
      expect(node.getChild(1)).toBe(child2);
      expect(node.getChild(2)).toBe(child3);
    });

    it('should handle insertion at beginning', () => {
      // Setup: we already have keys [30] with children [childLeft, childRight]
      const childLeft = new LeafNode<number, string>(4);
      childLeft.insert(5, 'five');

      const childRight = new LeafNode<number, string>(4);
      childRight.insert(35, 'thirty-five');

      node['children'] = [childLeft];
      node.insertKeyAndChild(30, childRight);

      // Now childLeft splits, producing childLeft and childNew with separator 10
      const childNew = new LeafNode<number, string>(4);
      childNew.insert(15, 'fifteen');

      // Insert the split result
      node.insertKeyAndChild(10, childNew);

      // Keys: [10, 30]
      // Children: [childLeft, childNew, childRight]
      expect(node.getKeys()).toEqual([10, 30]);
      expect(node.getChild(0)).toBe(childLeft);   // keys < 10
      expect(node.getChild(1)).toBe(childNew);    // 10 ≤ keys < 30
      expect(node.getChild(2)).toBe(childRight);  // keys ≥ 30
    });

    it('should handle insertion at end', () => {
      const child1 = new LeafNode<number, string>(4);
      const child2 = new LeafNode<number, string>(4);
      const child3 = new LeafNode<number, string>(4);

      node['children'] = [child1];
      node.insertKeyAndChild(20, child2);

      // Insert at end
      node.insertKeyAndChild(40, child3);

      expect(node.getKeys()).toEqual([20, 40]);
      expect(node.getChild(0)).toBe(child1);
      expect(node.getChild(1)).toBe(child2);
      expect(node.getChild(2)).toBe(child3);
    });

    it('should handle insertion in middle', () => {
      const child1 = new LeafNode<number, string>(1);
      const child2 = new LeafNode<number, string>(2);
      const child3 = new LeafNode<number, string>(3);
      const child4 = new LeafNode<number, string>(4);

      node['children'] = [child1];
      node.insertKeyAndChild(10, child2);
      node.insertKeyAndChild(40, child4);

      // Insert in middle
      node.insertKeyAndChild(25, child3);

      // Keys: [10, 25, 40]
      // Children: [child1, child2, child3, child4]
      expect(node.getKeys()).toEqual([10, 25, 40]);
      expect(node.getChildCount()).toBe(4);
      expect(node.getChild(0)).toBe(child1);
      expect(node.getChild(1)).toBe(child2);
      expect(node.getChild(2)).toBe(child3);
      expect(node.getChild(3)).toBe(child4);
    });

    it('should update child parent pointer', () => {
      const child1 = new LeafNode<number, string>(4);
      const child2 = new LeafNode<number, string>(4);

      node['children'] = [child1];

      expect(child2.getParent()).toBeNull();

      node.insertKeyAndChild(20, child2);

      expect(child2.getParent()).toBe(node);
    });

    it('should maintain invariant: keys[i] separates children[i] and children[i+1]', () => {
      // Create leaves with specific key ranges
      const leaf1 = new LeafNode<number, string>(4);
      leaf1.insert(5, 'five');
      leaf1.insert(10, 'ten');

      const leaf2 = new LeafNode<number, string>(4);
      leaf2.insert(20, 'twenty');
      leaf2.insert(25, 'twenty-five');

      const leaf3 = new LeafNode<number, string>(4);
      leaf3.insert(40, 'forty');
      leaf3.insert(45, 'forty-five');

      node['children'] = [leaf1];
      node.insertKeyAndChild(20, leaf2);
      node.insertKeyAndChild(40, leaf3);

      // Keys: [20, 40]
      // Children: [leaf1, leaf2, leaf3]
      // Invariant:
      // - leaf1 has keys < 20
      // - leaf2 has keys >= 20 and < 40
      // - leaf3 has keys >= 40

      const keys = node.getKeys();
      const children = node.getChildren();

      // Verify invariant for each key
      for (let i = 0; i < keys.length; i++) {
        const separator = keys[i];
        const leftChild = children[i] as LeafNode<number, string>;
        const rightChild = children[i + 1] as LeafNode<number, string>;

        // All keys in left child should be < separator
        leftChild.getKeys().forEach(key => {
          expect(key).toBeLessThan(separator);
        });

        // All keys in right child should be >= separator
        rightChild.getKeys().forEach(key => {
          expect(key).toBeGreaterThanOrEqual(separator);
        });
      }
    });

    it('should maintain childCount = keyCount + 1', () => {
      const child1 = new LeafNode<number, string>(4);
      const child2 = new LeafNode<number, string>(4);
      const child3 = new LeafNode<number, string>(4);
      const child4 = new LeafNode<number, string>(4);

      node['children'] = [child1];
      expect(node.getChildCount()).toBe(node.getKeyCount() + 1);

      node.insertKeyAndChild(20, child2);
      expect(node.getChildCount()).toBe(node.getKeyCount() + 1);

      node.insertKeyAndChild(40, child3);
      expect(node.getChildCount()).toBe(node.getKeyCount() + 1);

      node.insertKeyAndChild(60, child4);
      expect(node.getChildCount()).toBe(node.getKeyCount() + 1);
    });
  });

  describe('findChild', () => {
    it('should return leftmost child for key smaller than all keys', () => {
      // Setup: keys [20, 40], children [child1, child2, child3]
      const child1 = new LeafNode<number, string>(4);
      child1.insert(5, 'five');
      child1.insert(10, 'ten');

      const child2 = new LeafNode<number, string>(4);
      child2.insert(25, 'twenty-five');

      const child3 = new LeafNode<number, string>(4);
      child3.insert(50, 'fifty');

      node['children'] = [child1];
      node.insertKeyAndChild(20, child2);
      node.insertKeyAndChild(40, child3);

      // Search for key smaller than all keys
      const result = node.findChild(5);
      expect(result).toBe(child1);

      const result2 = node.findChild(15);
      expect(result2).toBe(child1);
    });

    it('should return rightmost child for key larger than all keys', () => {
      // Setup: keys [20, 40], children [child1, child2, child3]
      const child1 = new LeafNode<number, string>(4);
      const child2 = new LeafNode<number, string>(4);
      const child3 = new LeafNode<number, string>(4);

      node['children'] = [child1];
      node.insertKeyAndChild(20, child2);
      node.insertKeyAndChild(40, child3);

      // Search for keys larger than all keys
      const result = node.findChild(50);
      expect(result).toBe(child3);

      const result2 = node.findChild(100);
      expect(result2).toBe(child3);
    });

    it('should return correct child for key in middle', () => {
      // Setup: keys [20, 40, 60], children [c1, c2, c3, c4]
      const child1 = new LeafNode<number, string>(4);
      const child2 = new LeafNode<number, string>(4);
      const child3 = new LeafNode<number, string>(4);
      const child4 = new LeafNode<number, string>(4);

      node['children'] = [child1];
      node.insertKeyAndChild(20, child2);
      node.insertKeyAndChild(40, child3);
      node.insertKeyAndChild(60, child4);

      // Keys: [20, 40, 60]
      // Children: [child1, child2, child3, child4]
      // child1: < 20
      // child2: 20 ≤ x < 40
      // child3: 40 ≤ x < 60
      // child4: ≥ 60

      // Test key equal to separator (should go to right child)
      expect(node.findChild(20)).toBe(child2);
      expect(node.findChild(40)).toBe(child3);

      // Test keys in between separators
      expect(node.findChild(25)).toBe(child2);
      expect(node.findChild(30)).toBe(child2);
      expect(node.findChild(35)).toBe(child2);

      expect(node.findChild(45)).toBe(child3);
      expect(node.findChild(50)).toBe(child3);
      expect(node.findChild(55)).toBe(child3);
    });

    it('should handle single child correctly', () => {
      // Internal node with just one child (no keys yet)
      const onlyChild = new LeafNode<number, string>(4);
      node['children'] = [onlyChild];

      // Any key should return the only child
      expect(node.findChild(10)).toBe(onlyChild);
      expect(node.findChild(100)).toBe(onlyChild);
      expect(node.findChild(-5)).toBe(onlyChild);
    });

    it('should handle node with one key and two children', () => {
      // Setup: keys [50], children [left, right]
      const leftChild = new LeafNode<number, string>(4);
      const rightChild = new LeafNode<number, string>(4);

      node['children'] = [leftChild];
      node.insertKeyAndChild(50, rightChild);

      // Keys < 50 go to left
      expect(node.findChild(10)).toBe(leftChild);
      expect(node.findChild(25)).toBe(leftChild);
      expect(node.findChild(49)).toBe(leftChild);

      // Keys ≥ 50 go to right
      expect(node.findChild(50)).toBe(rightChild);
      expect(node.findChild(75)).toBe(rightChild);
      expect(node.findChild(100)).toBe(rightChild);
    });

    it('should correctly navigate with multiple keys', () => {
      // Create a more realistic scenario with multiple levels
      const leaf1 = new LeafNode<number, string>(4);
      leaf1.insert(5, 'five');
      leaf1.insert(10, 'ten');
      leaf1.insert(15, 'fifteen');

      const leaf2 = new LeafNode<number, string>(4);
      leaf2.insert(25, 'twenty-five');
      leaf2.insert(30, 'thirty');

      const leaf3 = new LeafNode<number, string>(4);
      leaf3.insert(45, 'forty-five');
      leaf3.insert(50, 'fifty');

      const leaf4 = new LeafNode<number, string>(4);
      leaf4.insert(70, 'seventy');
      leaf4.insert(80, 'eighty');

      node['children'] = [leaf1];
      node.insertKeyAndChild(20, leaf2);
      node.insertKeyAndChild(40, leaf3);
      node.insertKeyAndChild(60, leaf4);

      // Keys: [20, 40, 60]
      // Test boundary cases
      expect(node.findChild(19)).toBe(leaf1);
      expect(node.findChild(20)).toBe(leaf2);
      expect(node.findChild(21)).toBe(leaf2);

      expect(node.findChild(39)).toBe(leaf2);
      expect(node.findChild(40)).toBe(leaf3);
      expect(node.findChild(41)).toBe(leaf3);

      expect(node.findChild(59)).toBe(leaf3);
      expect(node.findChild(60)).toBe(leaf4);
      expect(node.findChild(61)).toBe(leaf4);
    });

    it('should maintain invariant: returned child contains appropriate keys', () => {
      // Setup with actual data in leaves to verify correctness
      const leaf1 = new LeafNode<number, string>(4);
      leaf1.insert(5, 'five');
      leaf1.insert(10, 'ten');

      const leaf2 = new LeafNode<number, string>(4);
      leaf2.insert(30, 'thirty');
      leaf2.insert(35, 'thirty-five');

      const leaf3 = new LeafNode<number, string>(4);
      leaf3.insert(60, 'sixty');
      leaf3.insert(70, 'seventy');

      node['children'] = [leaf1];
      node.insertKeyAndChild(20, leaf2);
      node.insertKeyAndChild(50, leaf3);

      // Keys: [20, 50]
      // For each search key, verify it would be found in the returned child
      const testCases = [
        { searchKey: 5, expectedLeaf: leaf1 },
        { searchKey: 10, expectedLeaf: leaf1 },
        { searchKey: 30, expectedLeaf: leaf2 },
        { searchKey: 35, expectedLeaf: leaf2 },
        { searchKey: 60, expectedLeaf: leaf3 },
        { searchKey: 70, expectedLeaf: leaf3 },
      ];

      testCases.forEach(({ searchKey, expectedLeaf }) => {
        const foundChild = node.findChild(searchKey);
        expect(foundChild).toBe(expectedLeaf);

        // Verify the key actually exists in the returned leaf
        const leafResult = (foundChild as LeafNode<number, string>).search(searchKey);
        expect(leafResult).toBeDefined();
      });
    });
  });

  describe('findChildIndex', () => {
    it.todo('should return correct index for existing child');
    it.todo('should return -1 for non-existing child');
    it.todo('should handle first child');
    it.todo('should handle last child');
  });

  describe('split', () => {
    it('should create new internal node', () => {
      // Setup: fill internal node with order keys (4 keys for order 4)
      const children = Array.from({ length: 5 }, () => new LeafNode<number, string>(4));

      node['children'] = [children[0]];
      node.insertKeyAndChild(10, children[1]);
      node.insertKeyAndChild(20, children[2]);
      node.insertKeyAndChild(30, children[3]);
      node.insertKeyAndChild(40, children[4]);

      // Keys: [10, 20, 30, 40], Children: 5

      const result = node.split();

      expect(result.rightNode).toBeInstanceOf(InternalNode);
      expect(result.rightNode.isLeaf()).toBe(false);
    });

    it('should split keys evenly between nodes', () => {
      // Order 4: insert 4 keys (5 children)
      const children = Array.from({ length: 5 }, () => new LeafNode<number, string>(4));

      node['children'] = [children[0]];
      node.insertKeyAndChild(10, children[1]);
      node.insertKeyAndChild(20, children[2]);
      node.insertKeyAndChild(30, children[3]);
      node.insertKeyAndChild(40, children[4]);

      // Keys: [10, 20, 30, 40]
      // For 4 keys: middle at index 2, so keys split as:
      // Left: [10, 20], Middle: 30 (pushed up), Right: [40]

      const result = node.split();

      expect(node.getKeyCount()).toBe(2); // [10, 20]
      expect(result.rightNode.getKeyCount()).toBe(1); // [40]
      expect(result.middleKey).toBe(30);
    });

    it('should split children correctly (n keys means n+1 children)', () => {
      const children = Array.from({ length: 5 }, () => new LeafNode<number, string>(4));

      node['children'] = [children[0]];
      node.insertKeyAndChild(10, children[1]);
      node.insertKeyAndChild(20, children[2]);
      node.insertKeyAndChild(30, children[3]);
      node.insertKeyAndChild(40, children[4]);

      // Children: [c0, c1, c2, c3, c4] (5 children for 4 keys)
      // Split at index 2:
      // Left gets: [c0, c1, c2] (3 children for 2 keys)
      // Right gets: [c3, c4] (2 children for 1 key)

      const result = node.split();

      expect(node.getChildCount()).toBe(3);
      expect(result.rightNode.getChildCount()).toBe(2);

      // Verify invariant: childCount = keyCount + 1
      expect(node.getChildCount()).toBe(node.getKeyCount() + 1);
      expect(result.rightNode.getChildCount()).toBe(result.rightNode.getKeyCount() + 1);

      // Verify specific children
      expect(node.getChild(0)).toBe(children[0]);
      expect(node.getChild(1)).toBe(children[1]);
      expect(node.getChild(2)).toBe(children[2]);

      expect(result.rightNode.getChild(0)).toBe(children[3]);
      expect(result.rightNode.getChild(1)).toBe(children[4]);
    });

    it('should return middle key to push up to parent', () => {
      const children = Array.from({ length: 5 }, () => new LeafNode<number, string>(4));

      node['children'] = [children[0]];
      node.insertKeyAndChild(10, children[1]);
      node.insertKeyAndChild(20, children[2]);
      node.insertKeyAndChild(30, children[3]);
      node.insertKeyAndChild(40, children[4]);

      // Keys: [10, 20, 30, 40]
      // Middle index: floor(4 / 2) = 2
      // Middle key: 30

      const result = node.split();

      expect(result.middleKey).toBe(30);

      // IMPORTANT: Middle key should be REMOVED from both nodes (pushed up)
      expect(node.getKeys()).toEqual([10, 20]);
      expect(result.rightNode.getKeys()).toEqual([40]);
      expect(node.getKeys()).not.toContain(30);
      expect(result.rightNode.getKeys()).not.toContain(30);
    });

    it('should return new right node', () => {
      const children = Array.from({ length: 5 }, () => new LeafNode<number, string>(4));

      node['children'] = [children[0]];
      node.insertKeyAndChild(10, children[1]);
      node.insertKeyAndChild(20, children[2]);
      node.insertKeyAndChild(30, children[3]);
      node.insertKeyAndChild(40, children[4]);

      const result = node.split();

      expect(result.rightNode).toBeDefined();
      expect(result.rightNode.getKeyCount()).toBeGreaterThan(0);
      expect(result.rightNode.getChildCount()).toBeGreaterThan(0);
    });

    it('should update parent pointers of moved children', () => {
      const children = Array.from({ length: 5 }, () => new LeafNode<number, string>(4));

      node['children'] = [children[0]];
      children[0].setParent(node as any);
      node.insertKeyAndChild(10, children[1]);
      node.insertKeyAndChild(20, children[2]);
      node.insertKeyAndChild(30, children[3]);
      node.insertKeyAndChild(40, children[4]);

      // Before split, all children point to original node
      children.forEach(child => {
        expect(child.getParent()).toBe(node);
      });

      const result = node.split();

      // After split:
      // Children [0, 1, 2] stay with original node
      expect(children[0].getParent()).toBe(node);
      expect(children[1].getParent()).toBe(node);
      expect(children[2].getParent()).toBe(node);

      // Children [3, 4] move to right node
      expect(children[3].getParent()).toBe(result.rightNode);
      expect(children[4].getParent()).toBe(result.rightNode);
    });

    it('should handle odd number of keys (5 keys)', () => {
      // Order 5 internal node with 5 keys (6 children)
      const nodeOrder5 = new InternalNode<number, string>(5);
      const children = Array.from({ length: 6 }, () => new LeafNode<number, string>(5));

      nodeOrder5['children'] = [children[0]];
      nodeOrder5.insertKeyAndChild(10, children[1]);
      nodeOrder5.insertKeyAndChild(20, children[2]);
      nodeOrder5.insertKeyAndChild(30, children[3]);
      nodeOrder5.insertKeyAndChild(40, children[4]);
      nodeOrder5.insertKeyAndChild(50, children[5]);

      // Keys: [10, 20, 30, 40, 50] (5 keys)
      // Middle index: floor(5 / 2) = 2
      // Left: [10, 20], Middle: 30, Right: [40, 50]

      const result = nodeOrder5.split();

      expect(nodeOrder5.getKeyCount()).toBe(2);
      expect(result.rightNode.getKeyCount()).toBe(2);
      expect(result.middleKey).toBe(30);

      expect(nodeOrder5.getKeys()).toEqual([10, 20]);
      expect(result.rightNode.getKeys()).toEqual([40, 50]);

      // Children: [c0, c1, c2] and [c3, c4, c5]
      expect(nodeOrder5.getChildCount()).toBe(3);
      expect(result.rightNode.getChildCount()).toBe(3);
    });

    it('should handle even number of keys (4 keys)', () => {
      const children = Array.from({ length: 5 }, () => new LeafNode<number, string>(4));

      node['children'] = [children[0]];
      node.insertKeyAndChild(10, children[1]);
      node.insertKeyAndChild(20, children[2]);
      node.insertKeyAndChild(30, children[3]);
      node.insertKeyAndChild(40, children[4]);

      // Keys: [10, 20, 30, 40] (4 keys)
      // Middle index: floor(4 / 2) = 2
      // Left: [10, 20], Middle: 30, Right: [40]

      const result = node.split();

      expect(node.getKeyCount()).toBe(2);
      expect(result.rightNode.getKeyCount()).toBe(1);
      expect(result.middleKey).toBe(30);

      expect(node.getKeys()).toEqual([10, 20]);
      expect(result.rightNode.getKeys()).toEqual([40]);
    });

    it('should maintain B+ tree invariants after split', () => {
      const children = Array.from({ length: 5 }, () => new LeafNode<number, string>(4));

      // Give each leaf specific keys to verify navigation invariants
      children[0].insert(5, 'five');
      children[1].insert(15, 'fifteen');
      children[2].insert(25, 'twenty-five');
      children[3].insert(35, 'thirty-five');
      children[4].insert(45, 'forty-five');

      node['children'] = [children[0]];
      node.insertKeyAndChild(10, children[1]);
      node.insertKeyAndChild(20, children[2]);
      node.insertKeyAndChild(30, children[3]);
      node.insertKeyAndChild(40, children[4]);

      const result = node.split();

      // Verify invariant: childCount = keyCount + 1 for both nodes
      expect(node.getChildCount()).toBe(node.getKeyCount() + 1);
      expect(result.rightNode.getChildCount()).toBe(result.rightNode.getKeyCount() + 1);

      // Verify keys are sorted in both nodes
      const leftKeys = node.getKeys();
      for (let i = 1; i < leftKeys.length; i++) {
        expect(leftKeys[i]).toBeGreaterThan(leftKeys[i - 1]);
      }

      const rightKeys = result.rightNode.getKeys();
      for (let i = 1; i < rightKeys.length; i++) {
        expect(rightKeys[i]).toBeGreaterThan(rightKeys[i - 1]);
      }

      // Verify all keys in left node < middleKey < all keys in right node
      leftKeys.forEach(key => {
        expect(key).toBeLessThan(result.middleKey);
      });

      rightKeys.forEach(key => {
        expect(key).toBeGreaterThan(result.middleKey);
      });

      // Verify separator invariants for left node
      const leftChildren = node.getChildren();
      for (let i = 0; i < node.getKeyCount(); i++) {
        const separator = node.getKey(i);
        const leftChild = leftChildren[i] as LeafNode<number, string>;
        const rightChild = leftChildren[i + 1] as LeafNode<number, string>;

        // All keys in left child < separator
        leftChild.getKeys().forEach(key => {
          expect(key).toBeLessThan(separator);
        });

        // All keys in right child >= separator
        rightChild.getKeys().forEach(key => {
          expect(key).toBeGreaterThanOrEqual(separator);
        });
      }

      // Verify separator invariants for right node
      const rightChildren = result.rightNode.getChildren();
      for (let i = 0; i < result.rightNode.getKeyCount(); i++) {
        const separator = result.rightNode.getKey(i);
        const leftChild = rightChildren[i] as LeafNode<number, string>;
        const rightChild = rightChildren[i + 1] as LeafNode<number, string>;

        leftChild.getKeys().forEach(key => {
          expect(key).toBeLessThan(separator);
        });

        rightChild.getKeys().forEach(key => {
          expect(key).toBeGreaterThanOrEqual(separator);
        });
      }
    });

    it('should handle split with minimum keys (3 keys for order 3)', () => {
      const nodeOrder3 = new InternalNode<number, string>(3);
      const children = Array.from({ length: 4 }, () => new LeafNode<number, string>(3));

      nodeOrder3['children'] = [children[0]];
      nodeOrder3.insertKeyAndChild(10, children[1]);
      nodeOrder3.insertKeyAndChild(20, children[2]);
      nodeOrder3.insertKeyAndChild(30, children[3]);

      // Keys: [10, 20, 30] (3 keys)
      // Middle index: floor(3 / 2) = 1
      // Left: [10], Middle: 20, Right: [30]

      const result = nodeOrder3.split();

      expect(nodeOrder3.getKeyCount()).toBe(1);
      expect(result.rightNode.getKeyCount()).toBe(1);
      expect(result.middleKey).toBe(20);

      expect(nodeOrder3.getKeys()).toEqual([10]);
      expect(result.rightNode.getKeys()).toEqual([30]);

      expect(nodeOrder3.getChildCount()).toBe(2);
      expect(result.rightNode.getChildCount()).toBe(2);
    });
  });

  describe('removeKeyAndChild', () => {
    it.todo('should remove key at specified index');
    it.todo('should remove corresponding child');
    it.todo('should shift remaining keys and children correctly');
    it.todo('should handle removal from beginning');
    it.todo('should handle removal from end');
    it.todo('should handle removal from middle');
    it.todo('should maintain invariant: childCount = keyCount + 1');
  });

  describe('borrowFromLeft', () => {
    it.todo('should borrow rightmost key from left sibling');
    it.todo('should move rightmost child from left sibling');
    it.todo('should update parent separator key');
    it.todo('should update parent pointers of moved child');
    it.todo('should maintain sorted order after borrowing');
  });

  describe('borrowFromRight', () => {
    it.todo('should borrow leftmost key from right sibling');
    it.todo('should move leftmost child from right sibling');
    it.todo('should update parent separator key');
    it.todo('should update parent pointers of moved child');
    it.todo('should maintain sorted order after borrowing');
  });

  describe('mergeWithRight', () => {
    it.todo('should combine all keys from both nodes');
    it.todo('should combine all children from both nodes');
    it.todo('should pull down parent separator key');
    it.todo('should update parent pointers of all children');
    it.todo('should handle merge with various key counts');
    it.todo('should result in valid node after merge');
  });

  describe('edge cases', () => {
    it.todo('should handle minimum order (3)');
    it.todo('should handle large order');
    it.todo('should handle maximum capacity');
  });

  describe('invariants', () => {
    it.todo('should always maintain childCount = keyCount + 1');
    it.todo('should keep keys in sorted order');
    it.todo('should maintain parent-child relationships');
    it.todo('should respect order constraints');
  });
});
