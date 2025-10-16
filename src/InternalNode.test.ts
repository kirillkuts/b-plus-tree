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
    it('should return correct index for existing child', () => {
      // Setup: Create internal node with multiple children
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

      // Test finding each child
      expect(node.findChildIndex(child1)).toBe(0);
      expect(node.findChildIndex(child2)).toBe(1);
      expect(node.findChildIndex(child3)).toBe(2);
      expect(node.findChildIndex(child4)).toBe(3);
    });

    it('should return -1 for non-existing child', () => {
      // Setup: Create node with some children
      const child1 = new LeafNode<number, string>(4);
      const child2 = new LeafNode<number, string>(4);

      node['children'] = [child1];
      node.insertKeyAndChild(20, child2);

      // Create a child that is NOT in the node
      const orphanChild = new LeafNode<number, string>(4);
      orphanChild.insert(100, 'hundred');

      // Should return -1 for child not in this node
      expect(node.findChildIndex(orphanChild)).toBe(-1);
    });

    it('should handle first child', () => {
      // Setup node with multiple children
      const child1 = new LeafNode<number, string>(4);
      const child2 = new LeafNode<number, string>(4);
      const child3 = new LeafNode<number, string>(4);

      node['children'] = [child1];
      node.insertKeyAndChild(30, child2);
      node.insertKeyAndChild(60, child3);

      // First child should be at index 0
      const index = node.findChildIndex(child1);
      expect(index).toBe(0);

      // Verify it's actually the first child
      expect(node.getChild(index)).toBe(child1);
      expect(index).toBe(0);
    });

    it('should handle last child', () => {
      // Setup node with multiple children
      const child1 = new LeafNode<number, string>(4);
      const child2 = new LeafNode<number, string>(4);
      const child3 = new LeafNode<number, string>(4);
      const child4 = new LeafNode<number, string>(4);

      node['children'] = [child1];
      node.insertKeyAndChild(20, child2);
      node.insertKeyAndChild(40, child3);
      node.insertKeyAndChild(60, child4);

      // Last child should be at index = childCount - 1
      const index = node.findChildIndex(child4);
      expect(index).toBe(3); // childCount is 4, so last index is 3

      // Verify it's actually the last child
      expect(node.getChild(index)).toBe(child4);
      expect(index).toBe(node.getChildCount() - 1);
    });

    it('should handle single child', () => {
      // Node with only one child
      const onlyChild = new LeafNode<number, string>(4);
      node['children'] = [onlyChild];

      // Should return index 0
      expect(node.findChildIndex(onlyChild)).toBe(0);

      // Should return -1 for different child
      const otherChild = new LeafNode<number, string>(4);
      expect(node.findChildIndex(otherChild)).toBe(-1);
    });

    it('should handle middle children', () => {
      // Setup with 5 children
      const children = Array.from({ length: 5 }, () => new LeafNode<number, string>(4));

      node['children'] = [children[0]];
      node.insertKeyAndChild(10, children[1]);
      node.insertKeyAndChild(20, children[2]);
      node.insertKeyAndChild(30, children[3]);
      node.insertKeyAndChild(40, children[4]);

      // Test middle children (indices 1, 2, 3)
      expect(node.findChildIndex(children[1])).toBe(1);
      expect(node.findChildIndex(children[2])).toBe(2);
      expect(node.findChildIndex(children[3])).toBe(3);
    });

    it('should work with internal node children (nested structure)', () => {
      // Create a two-level structure with internal nodes as children
      const leftInternalChild = new InternalNode<number, string>(4);
      const rightInternalChild = new InternalNode<number, string>(4);

      // Setup some structure in the child internal nodes
      const leaf1 = new LeafNode<number, string>(4);
      const leaf2 = new LeafNode<number, string>(4);
      leftInternalChild['children'] = [leaf1];
      leftInternalChild.insertKeyAndChild(10, leaf2);

      // Add internal nodes as children of the main node
      node['children'] = [leftInternalChild];
      node.insertKeyAndChild(50, rightInternalChild);

      // Should find internal children correctly
      expect(node.findChildIndex(leftInternalChild)).toBe(0);
      expect(node.findChildIndex(rightInternalChild)).toBe(1);
    });

    it('should be used for finding siblings during deletion', () => {
      // This is a practical use case: finding the index to determine siblings
      const child1 = new LeafNode<number, string>(4);
      const child2 = new LeafNode<number, string>(4);
      const child3 = new LeafNode<number, string>(4);

      child1.insert(5, 'five');
      child2.insert(25, 'twenty-five');
      child3.insert(45, 'forty-five');

      node['children'] = [child1];
      node.insertKeyAndChild(20, child2);
      node.insertKeyAndChild(40, child3);

      // Keys: [20, 40]
      // Children: [child1, child2, child3]

      // Find index of middle child to determine its siblings
      const indexOfChild2 = node.findChildIndex(child2);
      expect(indexOfChild2).toBe(1);

      // Left sibling should be at index - 1
      const leftSibling = node.getChild(indexOfChild2 - 1);
      expect(leftSibling).toBe(child1);

      // Right sibling should be at index + 1
      const rightSibling = node.getChild(indexOfChild2 + 1);
      expect(rightSibling).toBe(child3);

      // Separator key to left sibling is at index - 1
      const leftSeparator = node.getKey(indexOfChild2 - 1);
      expect(leftSeparator).toBe(20);

      // Separator key to right sibling is at index
      const rightSeparator = node.getKey(indexOfChild2);
      expect(rightSeparator).toBe(40);
    });

    it('should return consistent results across multiple calls', () => {
      // Setup
      const child1 = new LeafNode<number, string>(4);
      const child2 = new LeafNode<number, string>(4);

      node['children'] = [child1];
      node.insertKeyAndChild(50, child2);

      // Multiple calls should return same result
      expect(node.findChildIndex(child1)).toBe(0);
      expect(node.findChildIndex(child1)).toBe(0);
      expect(node.findChildIndex(child1)).toBe(0);

      expect(node.findChildIndex(child2)).toBe(1);
      expect(node.findChildIndex(child2)).toBe(1);
    });

    it('should handle node with maximum children', () => {
      // Order 4 means max 4 keys, so max 5 children
      const children = Array.from({ length: 5 }, () => new LeafNode<number, string>(4));

      node['children'] = [children[0]];
      node.insertKeyAndChild(10, children[1]);
      node.insertKeyAndChild(20, children[2]);
      node.insertKeyAndChild(30, children[3]);
      node.insertKeyAndChild(40, children[4]);

      // Should find all children correctly
      for (let i = 0; i < 5; i++) {
        expect(node.findChildIndex(children[i])).toBe(i);
      }
    });
  });

  describe('split me test', () => {
    // n = keys count
    const getMockNode = (n: number) => {
      const internal = new InternalNode<number, string>(2);

      //

      const zeroChild = new LeafNode<number, string>(Number.MAX_SAFE_INTEGER); //
      zeroChild.insert(5, `number_5`);
      zeroChild.insert(7, `number_7`);

      internal['children'] = [zeroChild];

      //

      const newChildrenData = new Array(n).fill(0).map((_, i) => {
        const base = (i + 1) * 10; // 10, 20, 30 ...

        const child = new LeafNode<number, string>(Number.MAX_SAFE_INTEGER); //

        [
            base + 5, // 15, 25, 35, ...
            base + 7, // 17, 27, 37, ...
        ].forEach(key => {
          child.insert(key, `value_${key}`);
        });

        return {
          base,
          child,
        }
      });

      newChildrenData.forEach((item) => {
        internal.insertKeyAndChild(item.base, item.child);
      });

      return {
        internal,
        children: [
            zeroChild,
            ...newChildrenData.map(item => item.child),
        ]
      }
    };

    it('should split 3 keys', () => {
      const {
        internal,
        children,
      } = getMockNode(3);

      const [
        zeroChild, // X < 10
        firstChild, // 10 < X < 20
        secondChild, // 20 < X < 30
        thirdChild, // 30 < X < 40
      ] = children;

      //

      const result = internal.split();

      expect(internal.getKeys()).toEqual([10]); // should keep left key [10]
      expect(internal.getChildren()).toEqual([zeroChild, firstChild]); // should keep [[5, 7], [15, 17]]

      expect(result.middleKey).toBe(20); // should split on the middle key [20]

      expect(result.rightNode.getKeys()).toEqual([30]); // should give right key [30]
      expect(result.rightNode.getChildren()).toEqual([secondChild, thirdChild]); // should give [[25, 27], [35, 37]]
    });

    it('should split 4 keys', () => {
      // [null, 10, 20, 30, 40]         length 5, 5/2 = 3, keys[3] = 30 (split index)
      // [[5, 7], [15, 17], [25, 27], [35, 37], [45, 47]]
      //
      // keep keys [10, 20], keep child [[5, 7], [15, 17], [25, 27]]

      const {
        internal,
        children,
      } = getMockNode(4);

      const [
          zeroChild, // X < 10
          firstChild, // 10 < X < 20
          secondChild, // 20 < X < 30
          thirdChild, // 30 < X < 40
          fourthChild, // 40 < X < 50
      ] = children;

      //

      const result = internal.split();

      expect(internal.getKeys()).toEqual([10, 20]); // should keep [10, 20]
      expect(internal.getChildren()).toEqual([zeroChild, firstChild, secondChild]); // should keep [[5, 7], [15, 17], [25, 27]]

      expect(result.middleKey).toBe(30); // should split on the middle key [20]

      expect(result.rightNode.getKeys()).toEqual([40]); // should give right key [30]
      expect(result.rightNode.getChildren()).toEqual([thirdChild, fourthChild]); // should give [[35, 37], [45, 47]]
    });

    it('should split 5 keys', () => {
      // [null, 10, 20, 30, 40, 50]     length 6, 6/2 = 3, keys[3] = 30 (split index)
      // [[5, 7], [12, 15], [22, 23], [32, 34], [45, 48], [52, 54]]

      // keep keys [10, 20], keep child [[5, 7], [12, 15], [22, 23]]

      const {
        internal,
        children,
      } = getMockNode(5);

      const [
          zeroChild, // X < 10
          firstChild, // 10 < X < 20
          secondChild, // 20 < X < 30
          thirdChild, // 30 < X < 40
          fourthChild, // 40 < X < 50
          fifthChild, // 50 < X < 60
      ] = children;

      //

      const result = internal.split();

      expect(internal.getKeys()).toEqual([10, 20]); // should keep [10, 20]
      expect(internal.getChildren()).toEqual([zeroChild, firstChild, secondChild]); // should keep [[5, 7], [15, 17], [25, 27]]

      expect(result.middleKey).toBe(30); // should split on the middle key [30]

      expect(result.rightNode.getKeys()).toEqual([40, 50]); // should give right key [40, 50]
      expect(result.rightNode.getChildren()).toEqual([thirdChild, fourthChild, fifthChild]); // should give [[35, 37], [45, 47], [55, 57]]
    });
  });

  describe('split cluade test', () => {
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
    it('should borrow rightmost key from left sibling via parent rotation', () => {
      // Setup parent with two internal children
      const parent = new InternalNode<number, string>(4);
      const leftChild = new InternalNode<number, string>(4);
      const rightChild = new InternalNode<number, string>(4);

      // Create leaf nodes for the internal nodes
      const leaves = Array.from({ length: 6 }, () => new LeafNode<number, string>(4));

      // Left child: keys [10, 15, 20], children [c0, c1, c2, c3] - can lend
      leftChild['children'] = [leaves[0]];
      leftChild.insertKeyAndChild(10, leaves[1]);
      leftChild.insertKeyAndChild(15, leaves[2]);
      leftChild.insertKeyAndChild(20, leaves[3]);

      // Right child: keys [40], children [c4, c5] - needs to borrow
      rightChild['children'] = [leaves[4]];
      rightChild.insertKeyAndChild(40, leaves[5]);

      // Parent: keys [30], children [leftChild, rightChild]
      parent['children'] = [leftChild];
      parent.insertKeyAndChild(30, rightChild);
      leftChild.setParent(parent as any);
      rightChild.setParent(parent as any);

      // Before: Left [10, 15, 20], Parent [30], Right [40]
      // After rotation:
      // - Left donates rightmost key (20) and rightmost child (c3)
      // - Parent key (30) moves down to right child
      // - Left's rightmost key (20) becomes new parent separator
      // Result: Left [10, 15], Parent [20], Right [30, 40]

      const parentKeyIndex = 1; // Index of separator key in parent
      rightChild.borrowFromLeft(leftChild, parentKeyIndex);

      // Left should have lost its rightmost key
      expect(leftChild.getKeys()).toEqual([10, 15]);
      expect(leftChild.getChildCount()).toBe(3);

      // Right should have gained parent key (30) at the beginning
      expect(rightChild.getKeys()).toEqual([30, 40]);
      expect(rightChild.getChildCount()).toBe(3);
    });

    it('should move rightmost child from left sibling to borrowing node', () => {
      const parent = new InternalNode<number, string>(4);
      const leftChild = new InternalNode<number, string>(4);
      const rightChild = new InternalNode<number, string>(4);

      const leaves = Array.from({ length: 6 }, () => new LeafNode<number, string>(4));

      // Give each leaf specific data for tracking
      leaves[0].insert(5, 'five');
      leaves[1].insert(12, 'twelve');
      leaves[2].insert(17, 'seventeen');
      leaves[3].insert(22, 'twenty-two');
      leaves[4].insert(35, 'thirty-five');
      leaves[5].insert(45, 'forty-five');

      leftChild['children'] = [leaves[0]];
      leftChild.insertKeyAndChild(10, leaves[1]);
      leftChild.insertKeyAndChild(15, leaves[2]);
      leftChild.insertKeyAndChild(20, leaves[3]);

      rightChild['children'] = [leaves[4]];
      rightChild.insertKeyAndChild(40, leaves[5]);

      parent['children'] = [leftChild];
      parent.insertKeyAndChild(30, rightChild);
      leftChild.setParent(parent as any);
      rightChild.setParent(parent as any);

      rightChild.borrowFromLeft(leftChild, 0);

      // Left's rightmost child (leaves[3]) should move to right
      expect(leftChild.getChild(0)).toBe(leaves[0]);
      expect(leftChild.getChild(1)).toBe(leaves[1]);
      expect(leftChild.getChild(2)).toBe(leaves[2]);

      // Right should have received left's rightmost child as its leftmost child
      expect(rightChild.getChild(0)).toBe(leaves[3]);
      expect(rightChild.getChild(1)).toBe(leaves[4]);
      expect(rightChild.getChild(2)).toBe(leaves[5]);
    });

    it('should update parent separator key after borrowing', () => {
      const parent = new InternalNode<number, string>(4);
      const leftChild = new InternalNode<number, string>(4);
      const rightChild = new InternalNode<number, string>(4);

      const leaves = Array.from({ length: 6 }, () => new LeafNode<number, string>(4));

      leftChild['children'] = [leaves[0]];
      leftChild.insertKeyAndChild(10, leaves[1]);
      leftChild.insertKeyAndChild(15, leaves[2]);
      leftChild.insertKeyAndChild(20, leaves[3]);

      rightChild['children'] = [leaves[4]];
      rightChild.insertKeyAndChild(40, leaves[5]);

      parent['children'] = [leftChild];
      parent.insertKeyAndChild(30, rightChild);
      leftChild.setParent(parent as any);
      rightChild.setParent(parent as any);

      // Before: Parent key is 30
      expect(parent.getKey(0)).toBe(30);

      rightChild.borrowFromLeft(leftChild, 1);

      // After: Parent key should be updated to left's old rightmost key (20)
      expect(parent.getKey(0)).toBe(20);
    });

    it('should update parent pointers of moved child', () => {
      const parent = new InternalNode<number, string>(4);
      const leftChild = new InternalNode<number, string>(4);
      const rightChild = new InternalNode<number, string>(4);

      const leaves = Array.from({ length: 6 }, () => new LeafNode<number, string>(4));

      leftChild['children'] = [leaves[0]];
      leftChild.insertKeyAndChild(10, leaves[1]);
      leftChild.insertKeyAndChild(15, leaves[2]);
      leftChild.insertKeyAndChild(20, leaves[3]);

      parent['children'] = [leftChild];
      parent.insertKeyAndChild(30, rightChild);
      leftChild.setParent(parent as any);
      rightChild.setParent(parent as any);

      // Set parent pointers
      leaves.forEach(leaf => leaf.setParent(leftChild as any));
      rightChild['children'] = [leaves[4]];
      rightChild.insertKeyAndChild(40, leaves[5]);
      leaves[4].setParent(rightChild as any);
      leaves[5].setParent(rightChild as any);

      // Before: leaves[3] parent is leftChild
      expect(leaves[3].getParent()).toBe(leftChild);

      rightChild.borrowFromLeft(leftChild, 0);

      // After: leaves[3] parent should be rightChild
      expect(leaves[3].getParent()).toBe(rightChild);
    });

    it('should maintain sorted order after borrowing', () => {
      const parent = new InternalNode<number, string>(4);
      const leftChild = new InternalNode<number, string>(4);
      const rightChild = new InternalNode<number, string>(4);

      const leaves = Array.from({ length: 7 }, () => new LeafNode<number, string>(4));

      leftChild['children'] = [leaves[0]];
      leftChild.insertKeyAndChild(10, leaves[1]);
      leftChild.insertKeyAndChild(20, leaves[2]);
      leftChild.insertKeyAndChild(25, leaves[3]);

      rightChild['children'] = [leaves[4]];
      rightChild.insertKeyAndChild(50, leaves[5]);
      rightChild.insertKeyAndChild(60, leaves[6]);

      parent['children'] = [leftChild];
      parent.insertKeyAndChild(30, rightChild);
      leftChild.setParent(parent as any);
      rightChild.setParent(parent as any);

      rightChild.borrowFromLeft(leftChild, 1);

      // Keys in left should remain sorted
      const leftKeys = leftChild.getKeys();
      for (let i = 1; i < leftKeys.length; i++) {
        expect(leftKeys[i]).toBeGreaterThan(leftKeys[i - 1]);
      }

      // Keys in right should be sorted
      const rightKeys = rightChild.getKeys();
      for (let i = 1; i < rightKeys.length; i++) {
        expect(rightKeys[i]).toBeGreaterThan(rightKeys[i - 1]);
      }

      // All keys in left < parent separator < all keys in right
      const parentSeparator = parent.getKey(0);
      leftKeys.forEach(key => expect(key).toBeLessThan(parentSeparator));
      rightKeys.forEach(key => expect(key).toBeGreaterThan(parentSeparator));
    });

    it('should maintain childCount = keyCount + 1 invariant after borrowing', () => {
      const parent = new InternalNode<number, string>(4);
      const leftChild = new InternalNode<number, string>(4);
      const rightChild = new InternalNode<number, string>(4);

      const leaves = Array.from({ length: 6 }, () => new LeafNode<number, string>(4));

      leftChild['children'] = [leaves[0]];
      leftChild.insertKeyAndChild(10, leaves[1]);
      leftChild.insertKeyAndChild(15, leaves[2]);
      leftChild.insertKeyAndChild(20, leaves[3]);

      rightChild['children'] = [leaves[4]];
      rightChild.insertKeyAndChild(40, leaves[5]);

      parent['children'] = [leftChild];
      parent.insertKeyAndChild(30, rightChild);
      leftChild.setParent(parent as any);
      rightChild.setParent(parent as any);

      rightChild.borrowFromLeft(leftChild, 0);

      // Both nodes must maintain invariant
      expect(leftChild.getChildCount()).toBe(leftChild.getKeyCount() + 1);
      expect(rightChild.getChildCount()).toBe(rightChild.getKeyCount() + 1);
    });

    it('should handle borrowing when left has multiple extra keys', () => {
      const parent = new InternalNode<number, string>(6);
      const leftChild = new InternalNode<number, string>(6);
      const rightChild = new InternalNode<number, string>(6);

      const leaves = Array.from({ length: 8 }, () => new LeafNode<number, string>(6));

      // Left has 5 keys (well above minimum)
      leftChild['children'] = [leaves[0]];
      leftChild.insertKeyAndChild(5, leaves[1]);
      leftChild.insertKeyAndChild(10, leaves[2]);
      leftChild.insertKeyAndChild(15, leaves[3]);
      leftChild.insertKeyAndChild(20, leaves[4]);
      leftChild.insertKeyAndChild(25, leaves[5]);

      // Right has 1 key (at minimum for order 6)
      rightChild['children'] = [leaves[6]];
      rightChild.insertKeyAndChild(50, leaves[7]);

      parent['children'] = [leftChild];
      parent.insertKeyAndChild(30, rightChild);
      leftChild.setParent(parent as any);
      rightChild.setParent(parent as any);

      rightChild.borrowFromLeft(leftChild, 1);

      // Left loses rightmost key (25)
      expect(leftChild.getKeys()).toEqual([5, 10, 15, 20]);

      // Right gains parent key (30) at beginning
      expect(rightChild.getKeys()).toEqual([30, 50]);

      // Parent separator updated to 25
      expect(parent.getKey(0)).toBe(25);
    });

    it('should correctly handle the rotation mechanism', () => {
      // This test specifically validates the 3-way rotation:
      // 1. Left's rightmost key goes to parent
      // 2. Parent's separator goes to right as leftmost key
      // 3. Left's rightmost child goes to right as leftmost child

      const parent = new InternalNode<number, string>(4);
      const leftChild = new InternalNode<number, string>(4);
      const rightChild = new InternalNode<number, string>(4);

      const leaves = Array.from({ length: 5 }, () => new LeafNode<number, string>(4));

      leftChild['children'] = [leaves[0]];
      leftChild.insertKeyAndChild(10, leaves[1]);
      leftChild.insertKeyAndChild(20, leaves[2]);

      rightChild['children'] = [leaves[3]];
      rightChild.insertKeyAndChild(50, leaves[4]);

      parent['children'] = [leftChild];
      parent.insertKeyAndChild(30, rightChild);
      leftChild.setParent(parent as any);
      rightChild.setParent(parent as any);

      // Before:
      // Left: keys [10, 20], children [c0, c1, c2]
      // Parent: keys [30]
      // Right: keys [50], children [c3, c4]

      rightChild.borrowFromLeft(leftChild, 1);

      // After rotation:
      // Left: keys [10], children [c0, c1]
      // Parent: keys [20] (was 30, replaced by left's 20)
      // Right: keys [30, 50], children [c2, c3, c4] (c2 moved from left)

      expect(leftChild.getKeys()).toEqual([10]);
      expect(leftChild.getChildren()).toEqual([leaves[0], leaves[1]]);

      expect(parent.getKeys()).toEqual([20]);

      expect(rightChild.getKeys()).toEqual([30, 50]);
      expect(rightChild.getChildren()).toEqual([leaves[2], leaves[3], leaves[4]]);
    });
  });

  describe('borrowFromRight', () => {
    it('should borrow leftmost key from right sibling via parent rotation', () => {
      // Setup parent with two internal children
      const parent = new InternalNode<number, string>(4);
      const leftChild = new InternalNode<number, string>(4);
      const rightChild = new InternalNode<number, string>(4);

      const leaves = Array.from({ length: 6 }, () => new LeafNode<number, string>(4));

      // Left child: keys [10], children [c0, c1] - needs to borrow
      leftChild['children'] = [leaves[0]];
      leftChild.insertKeyAndChild(10, leaves[1]);

      // Right child: keys [40, 50, 60], children [c2, c3, c4, c5] - can lend
      rightChild['children'] = [leaves[2]];
      rightChild.insertKeyAndChild(40, leaves[3]);
      rightChild.insertKeyAndChild(50, leaves[4]);
      rightChild.insertKeyAndChild(60, leaves[5]);

      // Parent: keys [30], children [leftChild, rightChild]
      parent['children'] = [leftChild];
      parent.insertKeyAndChild(30, rightChild);
      leftChild.setParent(parent as any);
      rightChild.setParent(parent as any);

      // Before: Left [10], Parent [30], Right [40, 50, 60]
      // After rotation:
      // - Right donates leftmost key (40) and leftmost child (c2)
      // - Parent key (30) moves down to left child
      // - Right's leftmost key (40) becomes new parent separator
      // Result: Left [10, 30], Parent [40], Right [50, 60]

      const parentKeyIndex = 1; // Index of separator key in parent
      leftChild.borrowFromRight(rightChild, parentKeyIndex);

      // Left should have gained parent key (30) at the end
      expect(leftChild.getKeys()).toEqual([10, 30]);
      expect(leftChild.getChildCount()).toBe(3);

      // Right should have lost its leftmost key
      expect(rightChild.getKeys()).toEqual([50, 60]);
      expect(rightChild.getChildCount()).toBe(3);
    });

    it('should move leftmost child from right sibling to borrowing node', () => {
      const parent = new InternalNode<number, string>(4);
      const leftChild = new InternalNode<number, string>(4);
      const rightChild = new InternalNode<number, string>(4);

      const leaves = Array.from({ length: 6 }, () => new LeafNode<number, string>(4));

      // Give each leaf specific data for tracking
      leaves[0].insert(5, 'five');
      leaves[1].insert(12, 'twelve');
      leaves[2].insert(35, 'thirty-five');
      leaves[3].insert(45, 'forty-five');
      leaves[4].insert(55, 'fifty-five');
      leaves[5].insert(65, 'sixty-five');

      leftChild['children'] = [leaves[0]];
      leftChild.insertKeyAndChild(10, leaves[1]);

      rightChild['children'] = [leaves[2]];
      rightChild.insertKeyAndChild(40, leaves[3]);
      rightChild.insertKeyAndChild(50, leaves[4]);
      rightChild.insertKeyAndChild(60, leaves[5]);

      parent['children'] = [leftChild];
      parent.insertKeyAndChild(30, rightChild);
      leftChild.setParent(parent as any);
      rightChild.setParent(parent as any);

      leftChild.borrowFromRight(rightChild, 1);

      // Left should have received right's leftmost child (leaves[2]) as its rightmost child
      expect(leftChild.getChild(0)).toBe(leaves[0]);
      expect(leftChild.getChild(1)).toBe(leaves[1]);
      expect(leftChild.getChild(2)).toBe(leaves[2]);

      // Right's leftmost child should be removed
      expect(rightChild.getChild(0)).toBe(leaves[3]);
      expect(rightChild.getChild(1)).toBe(leaves[4]);
      expect(rightChild.getChild(2)).toBe(leaves[5]);
    });

    it('should update parent separator key after borrowing', () => {
      const parent = new InternalNode<number, string>(4);
      const leftChild = new InternalNode<number, string>(4);
      const rightChild = new InternalNode<number, string>(4);

      const leaves = Array.from({ length: 6 }, () => new LeafNode<number, string>(4));

      leftChild['children'] = [leaves[0]];
      leftChild.insertKeyAndChild(10, leaves[1]);

      rightChild['children'] = [leaves[2]];
      rightChild.insertKeyAndChild(40, leaves[3]);
      rightChild.insertKeyAndChild(50, leaves[4]);
      rightChild.insertKeyAndChild(60, leaves[5]);

      parent['children'] = [leftChild];
      parent.insertKeyAndChild(30, rightChild);
      leftChild.setParent(parent as any);
      rightChild.setParent(parent as any);

      // Before: Parent key is 30
      expect(parent.getKey(0)).toBe(30);

      leftChild.borrowFromRight(rightChild, 1);

      // After: Parent key should be updated to right's old leftmost key (40)
      expect(parent.getKey(0)).toBe(40);
    });

    it('should update parent pointers of moved child', () => {
      const parent = new InternalNode<number, string>(4);
      const leftChild = new InternalNode<number, string>(4);
      const rightChild = new InternalNode<number, string>(4);

      const leaves = Array.from({ length: 6 }, () => new LeafNode<number, string>(4));

      leftChild['children'] = [leaves[0]];
      leftChild.insertKeyAndChild(10, leaves[1]);

      rightChild['children'] = [leaves[2]];
      rightChild.insertKeyAndChild(40, leaves[3]);
      rightChild.insertKeyAndChild(50, leaves[4]);
      rightChild.insertKeyAndChild(60, leaves[5]);

      parent['children'] = [leftChild];
      parent.insertKeyAndChild(30, rightChild);
      leftChild.setParent(parent as any);
      rightChild.setParent(parent as any);

      // Set parent pointers
      leaves[0].setParent(leftChild as any);
      leaves[1].setParent(leftChild as any);
      leaves.slice(2).forEach(leaf => leaf.setParent(rightChild as any));

      // Before: leaves[2] parent is rightChild
      expect(leaves[2].getParent()).toBe(rightChild);

      leftChild.borrowFromRight(rightChild, 1);

      // After: leaves[2] parent should be leftChild
      expect(leaves[2].getParent()).toBe(leftChild);
    });

    it('should maintain sorted order after borrowing', () => {
      const parent = new InternalNode<number, string>(4);
      const leftChild = new InternalNode<number, string>(4);
      const rightChild = new InternalNode<number, string>(4);

      const leaves = Array.from({ length: 7 }, () => new LeafNode<number, string>(4));

      leftChild['children'] = [leaves[0]];
      leftChild.insertKeyAndChild(5, leaves[1]);
      leftChild.insertKeyAndChild(10, leaves[2]);

      rightChild['children'] = [leaves[3]];
      rightChild.insertKeyAndChild(40, leaves[4]);
      rightChild.insertKeyAndChild(50, leaves[5]);
      rightChild.insertKeyAndChild(60, leaves[6]);

      parent['children'] = [leftChild];
      parent.insertKeyAndChild(30, rightChild);
      leftChild.setParent(parent as any);
      rightChild.setParent(parent as any);

      leftChild.borrowFromRight(rightChild, 1);

      // Keys in left should be sorted
      const leftKeys = leftChild.getKeys();
      for (let i = 1; i < leftKeys.length; i++) {
        expect(leftKeys[i]).toBeGreaterThan(leftKeys[i - 1]);
      }

      // Keys in right should remain sorted
      const rightKeys = rightChild.getKeys();
      for (let i = 1; i < rightKeys.length; i++) {
        expect(rightKeys[i]).toBeGreaterThan(rightKeys[i - 1]);
      }

      // All keys in left < parent separator < all keys in right
      const parentSeparator = parent.getKey(0);
      leftKeys.forEach(key => expect(key).toBeLessThan(parentSeparator));
      rightKeys.forEach(key => expect(key).toBeGreaterThan(parentSeparator));
    });

    it('should maintain childCount = keyCount + 1 invariant after borrowing', () => {
      const parent = new InternalNode<number, string>(4);
      const leftChild = new InternalNode<number, string>(4);
      const rightChild = new InternalNode<number, string>(4);

      const leaves = Array.from({ length: 6 }, () => new LeafNode<number, string>(4));

      leftChild['children'] = [leaves[0]];
      leftChild.insertKeyAndChild(10, leaves[1]);

      rightChild['children'] = [leaves[2]];
      rightChild.insertKeyAndChild(40, leaves[3]);
      rightChild.insertKeyAndChild(50, leaves[4]);
      rightChild.insertKeyAndChild(60, leaves[5]);

      parent['children'] = [leftChild];
      parent.insertKeyAndChild(30, rightChild);
      leftChild.setParent(parent as any);
      rightChild.setParent(parent as any);

      leftChild.borrowFromRight(rightChild, 1);

      // Both nodes must maintain invariant
      expect(leftChild.getChildCount()).toBe(leftChild.getKeyCount() + 1);
      expect(rightChild.getChildCount()).toBe(rightChild.getKeyCount() + 1);
    });

    it('should handle borrowing when right has multiple extra keys', () => {
      const parent = new InternalNode<number, string>(6);
      const leftChild = new InternalNode<number, string>(6);
      const rightChild = new InternalNode<number, string>(6);

      const leaves = Array.from({ length: 8 }, () => new LeafNode<number, string>(6));

      // Left has 1 key (at minimum for order 6)
      leftChild['children'] = [leaves[0]];
      leftChild.insertKeyAndChild(10, leaves[1]);

      // Right has 5 keys (well above minimum)
      rightChild['children'] = [leaves[2]];
      rightChild.insertKeyAndChild(35, leaves[3]);
      rightChild.insertKeyAndChild(40, leaves[4]);
      rightChild.insertKeyAndChild(45, leaves[5]);
      rightChild.insertKeyAndChild(50, leaves[6]);
      rightChild.insertKeyAndChild(55, leaves[7]);

      parent['children'] = [leftChild];
      parent.insertKeyAndChild(30, rightChild);
      leftChild.setParent(parent as any);
      rightChild.setParent(parent as any);

      leftChild.borrowFromRight(rightChild, 1);

      // Left gains parent key (30) at end
      expect(leftChild.getKeys()).toEqual([10, 30]);

      // Right loses leftmost key (35)
      expect(rightChild.getKeys()).toEqual([40, 45, 50, 55]);

      // Parent separator updated to 35
      expect(parent.getKey(0)).toBe(35);
    });

    it('should correctly handle the rotation mechanism', () => {
      // This test specifically validates the 3-way rotation:
      // 1. Right's leftmost key goes to parent
      // 2. Parent's separator goes to left as rightmost key
      // 3. Right's leftmost child goes to left as rightmost child

      const parent = new InternalNode<number, string>(4);
      const leftChild = new InternalNode<number, string>(4);
      const rightChild = new InternalNode<number, string>(4);

      const leaves = Array.from({ length: 5 }, () => new LeafNode<number, string>(4));

      leftChild['children'] = [leaves[0]];
      leftChild.insertKeyAndChild(10, leaves[1]);

      rightChild['children'] = [leaves[2]];
      rightChild.insertKeyAndChild(40, leaves[3]);
      rightChild.insertKeyAndChild(50, leaves[4]);

      parent['children'] = [leftChild];
      parent.insertKeyAndChild(30, rightChild);
      leftChild.setParent(parent as any);
      rightChild.setParent(parent as any);

      // Before:
      // Left: keys [10], children [c0, c1]
      // Parent: keys [30]
      // Right: keys [40, 50], children [c2, c3, c4]

      leftChild.borrowFromRight(rightChild, 1);

      // After rotation:
      // Left: keys [10, 30], children [c0, c1, c2] (c2 moved from right)
      // Parent: keys [40] (was 30, replaced by right's 40)
      // Right: keys [50], children [c3, c4]

      expect(leftChild.getKeys()).toEqual([10, 30]);
      expect(leftChild.getChildren()).toEqual([leaves[0], leaves[1], leaves[2]]);

      expect(parent.getKeys()).toEqual([40]);

      expect(rightChild.getKeys()).toEqual([50]);
      expect(rightChild.getChildren()).toEqual([leaves[3], leaves[4]]);
    });

    it('should handle borrowing from right with different parent key index', () => {
      // Test with non-zero parent key index
      const parent = new InternalNode<number, string>(4);
      const child1 = new InternalNode<number, string>(4);
      const child2 = new InternalNode<number, string>(4);
      const child3 = new InternalNode<number, string>(4);

      const leaves = Array.from({ length: 9 }, () => new LeafNode<number, string>(4));

      // Setup three children
      child1['children'] = [leaves[0]];
      child1.insertKeyAndChild(5, leaves[1]);
      child1.insertKeyAndChild(10, leaves[2]);

      child2['children'] = [leaves[3]];
      child2.insertKeyAndChild(25, leaves[4]); // Needs to borrow

      child3['children'] = [leaves[5]];
      child3.insertKeyAndChild(45, leaves[6]);
      child3.insertKeyAndChild(50, leaves[7]);
      child3.insertKeyAndChild(55, leaves[8]); // Can lend

      // Parent: keys [20, 40], children [child1, child2, child3]
      parent['children'] = [child1];
      parent.insertKeyAndChild(20, child2);
      parent.insertKeyAndChild(40, child3);
      child1.setParent(parent as any);
      child2.setParent(parent as any);
      child3.setParent(parent as any);

      // child2 borrows from child3 using parent key at index 1
      child2.borrowFromRight(child3, 2);

      // child2 should gain parent key (40)
      expect(child2.getKeys()).toEqual([25, 40]);

      // child3 should lose leftmost key (45)
      expect(child3.getKeys()).toEqual([50, 55]);

      // Parent key at index 1 should be updated to 45
      expect(parent.getKey(1)).toBe(45);
    });
  });

  describe('mergeWithRight', () => {
    it('should combine all keys from both nodes with parent separator key', () => {
      // Setup: Create two internal nodes with minimal keys
      // Left: keys [10], children [c0, c1]
      // Right: keys [30], children [c2, c3]
      // Parent separator: 20

      const leftNode = new InternalNode<number, string>(4);
      const rightNode = new InternalNode<number, string>(4);

      const children = Array.from({ length: 4 }, () => new LeafNode<number, string>(4));

      leftNode['children'] = [children[0]];
      leftNode.insertKeyAndChild(10, children[1]);

      rightNode['children'] = [children[2]];
      rightNode.insertKeyAndChild(30, children[3]);

      const parentKey = 20;

      leftNode.mergeWithRight(rightNode, parentKey);

      // After merge: keys should be [10, 20, 30]
      expect(leftNode.getKeys()).toEqual([10, 20, 30]);
      expect(leftNode.getKeyCount()).toBe(3);
    });

    it('should combine all children from both nodes', () => {
      const leftNode = new InternalNode<number, string>(4);
      const rightNode = new InternalNode<number, string>(4);

      const children = Array.from({ length: 4 }, () => new LeafNode<number, string>(4));

      leftNode['children'] = [children[0]];
      leftNode.insertKeyAndChild(10, children[1]);

      rightNode['children'] = [children[2]];
      rightNode.insertKeyAndChild(30, children[3]);

      leftNode.mergeWithRight(rightNode, 20);

      // After merge: children should be [c0, c1, c2, c3]
      expect(leftNode.getChildCount()).toBe(4);
      expect(leftNode.getChild(0)).toBe(children[0]);
      expect(leftNode.getChild(1)).toBe(children[1]);
      expect(leftNode.getChild(2)).toBe(children[2]);
      expect(leftNode.getChild(3)).toBe(children[3]);
    });

    it('should pull down parent separator key between node keys', () => {
      const leftNode = new InternalNode<number, string>(4);
      const rightNode = new InternalNode<number, string>(4);

      const children = Array.from({ length: 4 }, () => new LeafNode<number, string>(4));

      leftNode['children'] = [children[0]];
      leftNode.insertKeyAndChild(10, children[1]);

      rightNode['children'] = [children[2]];
      rightNode.insertKeyAndChild(30, children[3]);

      const parentKey = 20;

      leftNode.mergeWithRight(rightNode, parentKey);

      // The parent key should be in the middle: [10, 20, 30]
      const keys = leftNode.getKeys();
      expect(keys).toContain(parentKey);
      expect(keys.indexOf(parentKey)).toBe(1); // Middle position

      // Keys should be sorted
      expect(keys).toEqual([10, 20, 30]);
    });

    it('should update parent pointers of all moved children', () => {
      const leftNode = new InternalNode<number, string>(4);
      const rightNode = new InternalNode<number, string>(4);

      const children = Array.from({ length: 4 }, () => new LeafNode<number, string>(4));

      leftNode['children'] = [children[0]];
      leftNode.insertKeyAndChild(10, children[1]);

      rightNode['children'] = [children[2]];
      rightNode.insertKeyAndChild(30, children[3]);

      // Set parent pointers for right node's children
      children[2].setParent(rightNode as any);
      children[3].setParent(rightNode as any);

      leftNode.mergeWithRight(rightNode, 20);

      // After merge, all children should point to leftNode
      expect(children[0].getParent()).toBe(leftNode);
      expect(children[1].getParent()).toBe(leftNode);
      expect(children[2].getParent()).toBe(leftNode);
      expect(children[3].getParent()).toBe(leftNode);
    });

    it('should handle merge with various key counts (left=1, right=1)', () => {
      const leftNode = new InternalNode<number, string>(4);
      const rightNode = new InternalNode<number, string>(4);

      const children = Array.from({ length: 4 }, () => new LeafNode<number, string>(4));

      leftNode['children'] = [children[0]];
      leftNode.insertKeyAndChild(10, children[1]);

      rightNode['children'] = [children[2]];
      rightNode.insertKeyAndChild(40, children[3]);

      leftNode.mergeWithRight(rightNode, 25);

      expect(leftNode.getKeys()).toEqual([10, 25, 40]);
      expect(leftNode.getChildCount()).toBe(4);
    });

    it('should handle merge with various key counts (left=2, right=1)', () => {
      const leftNode = new InternalNode<number, string>(4);
      const rightNode = new InternalNode<number, string>(4);

      const children = Array.from({ length: 5 }, () => new LeafNode<number, string>(4));

      leftNode['children'] = [children[0]];
      leftNode.insertKeyAndChild(10, children[1]);
      leftNode.insertKeyAndChild(15, children[2]);

      rightNode['children'] = [children[3]];
      rightNode.insertKeyAndChild(40, children[4]);

      leftNode.mergeWithRight(rightNode, 25);

      expect(leftNode.getKeys()).toEqual([10, 15, 25, 40]);
      expect(leftNode.getChildCount()).toBe(5);
    });

    it('should handle merge with various key counts (left=1, right=2)', () => {
      const leftNode = new InternalNode<number, string>(4);
      const rightNode = new InternalNode<number, string>(4);

      const children = Array.from({ length: 5 }, () => new LeafNode<number, string>(4));

      leftNode['children'] = [children[0]];
      leftNode.insertKeyAndChild(10, children[1]);

      rightNode['children'] = [children[2]];
      rightNode.insertKeyAndChild(35, children[3]);
      rightNode.insertKeyAndChild(40, children[4]);

      leftNode.mergeWithRight(rightNode, 25);

      expect(leftNode.getKeys()).toEqual([10, 25, 35, 40]);
      expect(leftNode.getChildCount()).toBe(5);
    });

    it('should result in valid node after merge (childCount = keyCount + 1)', () => {
      const leftNode = new InternalNode<number, string>(4);
      const rightNode = new InternalNode<number, string>(4);

      const children = Array.from({ length: 4 }, () => new LeafNode<number, string>(4));

      leftNode['children'] = [children[0]];
      leftNode.insertKeyAndChild(10, children[1]);

      rightNode['children'] = [children[2]];
      rightNode.insertKeyAndChild(30, children[3]);

      leftNode.mergeWithRight(rightNode, 20);

      // Critical invariant: childCount = keyCount + 1
      expect(leftNode.getChildCount()).toBe(leftNode.getKeyCount() + 1);
      expect(leftNode.getChildCount()).toBe(4);
      expect(leftNode.getKeyCount()).toBe(3);
    });

    it('should maintain sorted order of keys after merge', () => {
      const leftNode = new InternalNode<number, string>(4);
      const rightNode = new InternalNode<number, string>(4);

      const children = Array.from({ length: 6 }, () => new LeafNode<number, string>(4));

      leftNode['children'] = [children[0]];
      leftNode.insertKeyAndChild(10, children[1]);
      leftNode.insertKeyAndChild(15, children[2]);

      rightNode['children'] = [children[3]];
      rightNode.insertKeyAndChild(35, children[4]);
      rightNode.insertKeyAndChild(45, children[5]);

      leftNode.mergeWithRight(rightNode, 25);

      const keys = leftNode.getKeys();

      // Verify sorted order
      for (let i = 1; i < keys.length; i++) {
        expect(keys[i]).toBeGreaterThan(keys[i - 1]);
      }

      expect(keys).toEqual([10, 15, 25, 35, 45]);
    });

    it('should preserve correct child order after merge', () => {
      const leftNode = new InternalNode<number, string>(4);
      const rightNode = new InternalNode<number, string>(4);

      const children = Array.from({ length: 4 }, () => new LeafNode<number, string>(4));

      // Give each child specific data for verification
      children[0].insert(5, 'five');
      children[1].insert(12, 'twelve');
      children[2].insert(27, 'twenty-seven');
      children[3].insert(35, 'thirty-five');

      leftNode['children'] = [children[0]];
      leftNode.insertKeyAndChild(10, children[1]);

      rightNode['children'] = [children[2]];
      rightNode.insertKeyAndChild(30, children[3]);

      leftNode.mergeWithRight(rightNode, 20);

      // Keys: [10, 20, 30]
      // Children: [c0, c1, c2, c3]
      // Verify children are in correct order
      expect(leftNode.getChild(0)).toBe(children[0]);
      expect(leftNode.getChild(1)).toBe(children[1]);
      expect(leftNode.getChild(2)).toBe(children[2]);
      expect(leftNode.getChild(3)).toBe(children[3]);
    });

    it('should handle merge with order 3 nodes', () => {
      const leftNode = new InternalNode<number, string>(3);
      const rightNode = new InternalNode<number, string>(3);

      const children = Array.from({ length: 4 }, () => new LeafNode<number, string>(3));

      leftNode['children'] = [children[0]];
      leftNode.insertKeyAndChild(10, children[1]);

      rightNode['children'] = [children[2]];
      rightNode.insertKeyAndChild(30, children[3]);

      leftNode.mergeWithRight(rightNode, 20);

      expect(leftNode.getKeys()).toEqual([10, 20, 30]);
      expect(leftNode.getChildCount()).toBe(4);
      expect(leftNode.getChildCount()).toBe(leftNode.getKeyCount() + 1);
    });

    it('should append all keys and children in correct order', () => {
      const leftNode = new InternalNode<number, string>(4);
      const rightNode = new InternalNode<number, string>(4);

      const children = Array.from({ length: 4 }, () => new LeafNode<number, string>(4));

      leftNode['children'] = [children[0]];
      leftNode.insertKeyAndChild(5, children[1]);

      rightNode['children'] = [children[2]];
      rightNode.insertKeyAndChild(25, children[3]);

      const parentKey = 15;

      leftNode.mergeWithRight(rightNode, parentKey);

      // Result should be: keys [5, 15, 25], children [c0, c1, c2, c3]
      expect(leftNode.getKeys()).toEqual([5, 15, 25]);

      // Verify children array is correctly combined
      const resultChildren = leftNode.getChildren();
      expect(resultChildren).toHaveLength(4);
      expect(resultChildren[0]).toBe(children[0]);
      expect(resultChildren[1]).toBe(children[1]);
      expect(resultChildren[2]).toBe(children[2]);
      expect(resultChildren[3]).toBe(children[3]);
    });

    it('should handle nodes at minimum capacity (floor(order/2) keys)', () => {
      // Order 4: minimum = floor(4/2) = 2 keys
      const leftNode = new InternalNode<number, string>(4);
      const rightNode = new InternalNode<number, string>(4);

      const children = Array.from({ length: 6 }, () => new LeafNode<number, string>(4));

      // Left node: 2 keys (at minimum)
      leftNode['children'] = [children[0]];
      leftNode.insertKeyAndChild(10, children[1]);
      leftNode.insertKeyAndChild(15, children[2]);

      // Right node: 1 key (below minimum, needs merge)
      rightNode['children'] = [children[3]];
      rightNode.insertKeyAndChild(30, children[4]);

      leftNode.mergeWithRight(rightNode, 20);

      // Result: 4 keys [10, 15, 20, 30]
      expect(leftNode.getKeys()).toEqual([10, 15, 20, 30]);
      expect(leftNode.getChildCount()).toBe(5);
    });

    it('should update all parent pointers even if originally null', () => {
      const leftNode = new InternalNode<number, string>(4);
      const rightNode = new InternalNode<number, string>(4);

      const children = Array.from({ length: 4 }, () => new LeafNode<number, string>(4));

      leftNode['children'] = [children[0]];
      leftNode.insertKeyAndChild(10, children[1]);

      rightNode['children'] = [children[2]];
      rightNode.insertKeyAndChild(30, children[3]);

      // Ensure some children have null parent
      children[2].setParent(null as any);
      children[3].setParent(null as any);

      leftNode.mergeWithRight(rightNode, 20);

      // After merge, all children should point to leftNode
      children.forEach(child => {
        expect(child.getParent()).toBe(leftNode);
      });
    });
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
