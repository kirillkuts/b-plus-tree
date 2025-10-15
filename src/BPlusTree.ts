import { Node } from './Node';
import { InternalNode } from './InternalNode';
import { LeafNode } from './LeafNode';

/**
 * B+ Tree data structure
 * Properties:
 * - All data is stored in leaf nodes
 * - Internal nodes only store keys for navigation
 * - Leaf nodes are linked for efficient range queries
 * - Tree is always balanced
 * - Order determines the maximum number of keys per node
 */
export class BPlusTree<K, V> {
  /** Root node of the tree */
  private root: Node<K, V>;

  /** Order of the tree (maximum number of keys per node) */
  private readonly order: number;

  /** Comparison function for keys */
  private readonly compare: (a: K, b: K) => number;

  /**
   * Creates a new B+ tree
   * @param order Maximum number of keys per node (must be >= 3)
   * @param compare Optional comparison function (defaults to standard comparison)
   */
  constructor(order: number = 4, compare?: (a: K, b: K) => number) {
    if (order < 3) {
      throw new Error('Order must be at least 3');
    }
    this.order = order;
    this.root = new LeafNode<K, V>(order);
    this.compare = compare || this.defaultCompare;
  }

  /**
   * Default comparison function
   */
  private defaultCompare(a: K, b: K): number {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  /**
   * Inserts a key-value pair into the tree
   * TODO: Implement insertion algorithm:
   * 1. Find the appropriate leaf node
   * 2. Insert the key-value pair
   * 3. If leaf overflows, split it
   * 4. Propagate splits up the tree if necessary
   * 5. Create new root if root splits
   */
  insert(key: K, value: V): void {
    let node = this.root;

    while (!node.isLeaf()) {
      node = (node as InternalNode<K, V>).findChild(key);
    }

    const leaf = node as LeafNode<K, V>;

    leaf.insert(key, value);

    if ( leaf.getKeyCount() <= this.order ) {
      return;
    }

    let {
      splitKey,
      rightNode,
    } = leaf.split();

    let internalNode: InternalNode<K, V> | null = null;

    if ( leaf === this.root ) {
      internalNode = new InternalNode(this.order);
      internalNode['children'] = [leaf];
      leaf.setParent(internalNode as Node<K, V>);

      this.root = internalNode as any;
    }

    internalNode = leaf.getParent() as InternalNode<K, V>;

    internalNode.insertKeyAndChild(splitKey, rightNode);

    while (internalNode.getKeyCount() >= this.order) {
      let { middleKey, rightNode } = internalNode.split();

      let parentNode;

      if ( internalNode == this.root ) {
        parentNode = new InternalNode<K, V>(this.order);
        parentNode['children'] = [internalNode as Node<K, V>];
        internalNode.setParent(parentNode as Node<K, V>);

        this.root = parentNode as any;
      }

      parentNode = internalNode.getParent() as (InternalNode<K, V>);

      parentNode.insertKeyAndChild(middleKey as K, rightNode as Node<K, V>);

      internalNode = parentNode;
    }
  }

  /**
   * Searches for a value by key
   * TODO: Implement search algorithm:
   * 1. Start at root
   * 2. Navigate down to appropriate leaf
   * 3. Search in leaf node
   * @returns The value if found, undefined otherwise
   */
  search(key: K): V | undefined {
    let node = this.root;

    while (!node.isLeaf()) {
      node = (node as InternalNode<K, V>).findChild(key)
    }

    return (node as LeafNode<K, V>).search(key);
  }

  /**
   * Deletes a key-value pair from the tree
   * TODO: Implement deletion algorithm:
   * 1. Find the leaf containing the key
   * 2. Delete the key-value pair
   * 3. If leaf underflows, borrow from sibling or merge
   * 4. Propagate changes up the tree
   * 5. Update root if necessary
   * @returns true if key was found and deleted, false otherwise
   */
  delete(key: K): boolean {
    let node = this.root;

    while (!node.isLeaf()) {
      node = (node as InternalNode<K, V>).findChild(key)
    }

    const leaf =  (node as LeafNode<K, V>)

    const deleted = leaf.delete(key);

    if ( !deleted ) {
      return false; // key not found
    }

    if ( !leaf.halfFull() ) {
      const parent = (leaf.getParent() as InternalNode<K, V>);
      const splitIndex = parent.findChildIndex(leaf)

      let newSplitKey = leaf.tryBorrowFromLeft();

      if (newSplitKey != undefined) {
        parent['keys'][splitIndex - 1] = newSplitKey;
        return true;
      }

      //
      // if we are here, it means we failed to borrow left

      newSplitKey = leaf.tryBorrowFromRight();

      if (newSplitKey != undefined) {
        parent['keys'][splitIndex] = newSplitKey;
        return true;
      }

      //
      // if we are here, it means we failed to borrow


      const leftLeaf = leaf.getPrev();

      // if left leaf exists, merge with it
      if ( leftLeaf !== null ) {
        leftLeaf.mergeWithRight(leaf);
      } else {
        // merge with right leaf
      }

    }

    return true;
  }

  /**
   * Performs a range query
   * Returns all key-value pairs where startKey <= key <= endKey
   * TODO: Implement range query:
   * 1. Find leaf containing startKey
   * 2. Collect entries from that leaf
   * 3. Follow next pointers to collect from subsequent leaves
   * 4. Stop when endKey is exceeded or no more leaves
   * @returns Array of key-value pairs in the range
   */
  range(startKey: K, endKey: K): Array<[K, V]> {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  /**
   * Returns the minimum key in the tree
   * TODO: Implement by navigating to leftmost leaf
   * @returns The minimum key or undefined if tree is empty
   */
  min(): K | undefined {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  /**
   * Returns the maximum key in the tree
   * TODO: Implement by navigating to rightmost leaf
   * @returns The maximum key or undefined if tree is empty
   */
  max(): K | undefined {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  /**
   * Returns true if the tree is empty
   */
  isEmpty(): boolean {
    return this.root.isLeaf() && this.root.getKeyCount() === 0;
  }

  /**
   * Returns the height of the tree
   * TODO: Implement by traversing down to a leaf
   */
  getHeight(): number {
    let height = 1;

    let node: Node<K, V> | null = this.root;

    while(!node.isLeaf()) {
      node = (node as InternalNode<K, V>).getChild(0);
      height++;
    }

    return height;
  }

  /**
   * Returns the total number of keys in the tree
   * TODO: Implement by traversing all leaf nodes
   */
  size(): number {
    let node: Node<K, V> | null = this.root;

    while(!node.isLeaf()) {
      node = (node as InternalNode<K, V>).getChild(0);
    }

    let count = 0;
    while(node) {
      count += (node as LeafNode<K, V>).getKeyCount();
      node = (node as LeafNode<K, V>).getNext();
    }

    return count;
  }

  /**
   * Helper method to find the leaf node that should contain the key
   * TODO: Implement leaf search by traversing from root
   */
  private findLeaf(key: K): LeafNode<K, V> {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  /**
   * Helper method to handle node split
   * Inserts the split key into the parent and handles parent overflow
   * TODO: Implement split handling with recursive upward propagation
   */
  private handleSplit(
    node: Node<K, V>,
    splitKey: K,
    newNode: Node<K, V>,
  ): void {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  /**
   * Helper method to handle node underflow after deletion
   * Attempts to borrow from siblings or merge
   * TODO: Implement underflow handling
   */
  private handleUnderflow(node: Node<K, V>): void {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  /**
   * Returns all key-value pairs in sorted order
   * Useful for debugging and testing
   * TODO: Implement by traversing the leaf linked list
   */
  toArray(): Array<[K, V]> {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  /**
   * Validates the tree structure
   * Checks B+ tree invariants for debugging
   * TODO: Implement validation:
   * - All leaves at same level
   * - Keys in sorted order
   * - Node key counts within bounds
   * - Parent-child relationships correct
   * - Leaf linked list intact
   * @returns true if valid, throws error with details if invalid
   */
  validate(): boolean {
    // Empty tree is valid
    if (this.isEmpty()) {
      return true;
    }

    // Track the expected leaf level (all leaves should be at this level)
    let expectedLeafLevel: number | null = null;

    // Validate the tree recursively
    const validateNode = (
      node: Node<K, V>,
      level: number,
      minKey: K | null,
      maxKey: K | null,
    ): void => {
      // 1. Validate key count bounds
      const keyCount = node.getKeyCount();

      if (node === this.root) {
        // Root can have 0 keys (if it's a leaf) or 1+ keys (if internal)
        if (!node.isLeaf() && keyCount === 0) {
          throw new Error('Root internal node must have at least 1 key');
        }
      } else {
        if (!node.halfFull()) {
          throw new Error(
              `${node.isLeaf() ? 'Leaf node' : 'Internal node'} has ${keyCount} keys (order: ${this.order}), less then half full.`,
          );
        }
      }

      // 2. Validate keys are in sorted order
      const keys = node.getKeys();
      for (let i = 1; i < keys.length; i++) {
        if (this.compare(keys[i - 1], keys[i]) >= 0) {
          throw new Error(
            `Keys not in sorted order: ${keys[i - 1]} >= ${keys[i]} at index ${i}`,
          );
        }
      }

      // 3. Validate keys are within the allowed range [minKey, maxKey]
      if (minKey !== null && keys.length > 0) {
        if (this.compare(keys[0], minKey) < 0) {
          throw new Error(
            `Key ${keys[0]} is less than minimum allowed ${minKey}`,
          );
        }
      }

      if (maxKey !== null && keys.length > 0) {
        if (this.compare(keys[keys.length - 1], maxKey) >= 0) {
          throw new Error(
            `Key ${keys[keys.length - 1]} is >= maximum allowed ${maxKey}`,
          );
        }
      }

      if (node.isLeaf()) {
        // 4. Validate all leaves are at the same level
        if (expectedLeafLevel === null) {
          expectedLeafLevel = level;
        } else if (level !== expectedLeafLevel) {
          throw new Error(
            `Leaf at level ${level}, expected level ${expectedLeafLevel}. Tree is not balanced!`,
          );
        }
      } else {
        // Internal node validations
        const internalNode = node as InternalNode<K, V>;
        const children = internalNode.getChildren();

        // 5. Validate childCount = keyCount + 1
        if (children.length !== keys.length + 1) {
          throw new Error(
            `Internal node has ${children.length} children but ${keys.length} keys. Should be ${keys.length + 1}`,
          );
        }

        // 6. Validate parent-child relationships
        for (let i = 0; i < children.length; i++) {
          const child = children[i];

          // Check parent pointer
          if (child.getParent() !== node) {
            throw new Error(
              `Child at index ${i} has incorrect parent pointer`,
            );
          }

          // Determine the key range for this child
          // Child[i] should have keys in range:
          // - Min: keys[i-1] (or null if i === 0)
          // - Max: keys[i] (or null if i === keys.length)
          const childMinKey = i === 0 ? minKey : keys[i - 1];
          const childMaxKey = i === keys.length ? maxKey : keys[i];

          // Recursively validate child
          validateNode(child, level + 1, childMinKey, childMaxKey);
        }

        // 7. Validate separator keys
        // For each key[i], all keys in children[i] should be < key[i]
        // and all keys in children[i+1] should be >= key[i]
        for (let i = 0; i < keys.length; i++) {
          const separator = keys[i];
          const leftChild = children[i];
          const rightChild = children[i + 1];

          // Get all keys from left child subtree
          const leftKeys = this.getAllKeysInSubtree(leftChild);
          for (const key of leftKeys) {
            if (this.compare(key, separator) >= 0) {
              throw new Error(
                `Left child contains key ${key} >= separator ${separator}`,
              );
            }
          }

          // Get all keys from right child subtree
          const rightKeys = this.getAllKeysInSubtree(rightChild);
          for (const key of rightKeys) {
            if (this.compare(key, separator) < 0) {
              throw new Error(
                `Right child contains key ${key} < separator ${separator}`,
              );
            }
          }
        }
      }
    };

    // Start validation from root
    validateNode(this.root, 1, null, null);

    // 8. Validate leaf linked list
    this.validateLeafLinkedList();

    return true;
  }

  /**
   * Helper method to get all keys in a subtree
   */
  private getAllKeysInSubtree(node: Node<K, V>): K[] {
    if (node.isLeaf()) {
      return node.getKeys();
    }

    const keys: K[] = [];
    const internalNode = node as InternalNode<K, V>;
    const children = internalNode.getChildren();

    for (const child of children) {
      keys.push(...this.getAllKeysInSubtree(child));
    }

    return keys;
  }

  /**
   * Helper method to validate the leaf linked list
   */
  private validateLeafLinkedList(): void {
    // Find the leftmost leaf
    let node: Node<K, V> = this.root;
    while (!node.isLeaf()) {
      node = (node as InternalNode<K, V>).getChild(0);
    }

    let currentLeaf: LeafNode<K, V> | null = node as LeafNode<K, V>;
    let prevLeaf: LeafNode<K, V> | null = null;
    const visitedLeaves = new Set<LeafNode<K, V>>();
    let leafCount = 0;

    while (currentLeaf !== null) {
      leafCount++;

      // Check for cycles in the linked list
      if (visitedLeaves.has(currentLeaf)) {
        throw new Error('Cycle detected in leaf linked list');
      }
      visitedLeaves.add(currentLeaf);

      // Validate prev pointer
      if (currentLeaf.getPrev() !== prevLeaf) {
        throw new Error(
          `Leaf prev pointer is incorrect. Expected ${prevLeaf ? 'a leaf' : 'null'}, got ${currentLeaf.getPrev() ? 'a leaf' : 'null'}`,
        );
      }

      // Validate keys are in sorted order across the linked list
      if (prevLeaf !== null) {
        const prevKeys = prevLeaf.getKeys();
        const currentKeys = currentLeaf.getKeys();

        if (prevKeys.length > 0 && currentKeys.length > 0) {
          const lastPrevKey = prevKeys[prevKeys.length - 1];
          const firstCurrentKey = currentKeys[0];

          if (this.compare(lastPrevKey, firstCurrentKey) >= 0) {
            throw new Error(
              `Keys not in sorted order across leaf boundary: ${lastPrevKey} >= ${firstCurrentKey}`,
            );
          }
        }
      }

      // Move to next leaf
      prevLeaf = currentLeaf;
      currentLeaf = currentLeaf.getNext();
    }

    // Validate that we have at least one leaf
    if (leafCount === 0) {
      throw new Error('No leaves found in tree');
    }
  }

  /**
   * Returns a string representation of the tree structure
   * Useful for debugging
   */
  toString(): string {
    if (this.isEmpty()) {
      return 'Empty B+ Tree';
    }

    const lines: string[] = [];
    lines.push(`B+ Tree (order=${this.order}, height=${this.getHeight()}, size=${this.size()})`);
    lines.push('');

    this.printNode(this.root, '', true, lines, 0);

    // Print leaf chain
    lines.push('');
    lines.push('Leaf Chain:');
    let leaf = this.root;
    while (!leaf.isLeaf()) {
      leaf = (leaf as InternalNode<K, V>).getChild(0);
    }

    const leafKeys: K[] = [];
    let currentLeaf: LeafNode<K, V> | null = leaf as LeafNode<K, V>;
    while (currentLeaf) {
      leafKeys.push(...currentLeaf.getKeys());
      currentLeaf = currentLeaf.getNext();
    }
    lines.push(`  [${leafKeys.join(', ')}]`);

    return lines.join('\n');
  }

  /**
   * Helper method to recursively print nodes
   */
  private printNode(
    node: Node<K, V>,
    prefix: string,
    isLast: boolean,
    lines: string[],
    level: number,
  ): void {
    // Print current node
    const connector = isLast ? '└── ' : '├── ';
    const nodeType = node.isLeaf() ? 'LEAF' : 'INTERNAL';
    const keys = node.getKeys();

    if (node.isLeaf()) {
      const values = (node as LeafNode<K, V>).getValues();
      const entries = keys.map((k, i) => `${k}:${values[i]}`);
      lines.push(`${prefix}${connector}${nodeType} [${entries.join(', ')}]`);
    } else {
      lines.push(`${prefix}${connector}${nodeType} [${keys.join(', ')}]`);

      // Print children
      const children = (node as InternalNode<K, V>).getChildren();
      const newPrefix = prefix + (isLast ? '    ' : '│   ');

      children.forEach((child, index) => {
        const isLastChild = index === children.length - 1;
        this.printNode(child, newPrefix, isLastChild, lines, level + 1);
      });
    }
  }
}
