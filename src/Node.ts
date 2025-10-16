/**
 * Abstract base class for B+ tree nodes
 * Both internal nodes and leaf nodes share common functionality
 */
export abstract class Node<K, V> {
  /** Array of keys stored in this node */
  protected keys: K[];

  /** Parent node reference (null for root) */
  protected parent: Node<K, V> | null;

  /** Maximum number of keys this node can hold */
  protected readonly order: number;

  constructor(order: number) {
    this.keys = [];
    this.parent = null;
    this.order = order;
  }

  /**
   * Returns true if this is a leaf node
   */
  abstract isLeaf(): boolean;

  /**
   * Returns the number of keys in this node
   */
  getKeyCount(): number {
    return this.keys.length;
  }

  halfFull() {
    return this.getKeyCount() >= Math.floor(this.order / 2);
  }

  canBorrow() {
    return (this.getKeyCount() - 1) >= Math.floor(this.order / 2);
  }

  /**
   * Returns the key at the specified index
   */
  getKey(index: number): K {
    return this.keys[index + 1];
  }

  /**
   * Returns all keys in this node
   */
  getKeys(): K[] {
    return [...this.keys];
  }

  /**
   * Returns the parent node
   */
  getParent(): Node<K, V> | null {
    return this.parent;
  }

  /**
   * Sets the parent node
   */
  setParent(parent: Node<K, V> | null): void {
    this.parent = parent;
  }

  /**
   * Returns true if the node is full (has reached maximum capacity)
   * TODO: Implement logic to check if keys.length >= order
   */
  isFull(): boolean {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  /**
   * Returns true if the node has minimum required keys
   * For internal nodes: Math.ceil(order / 2) - 1
   * For leaf nodes: Math.ceil(order / 2)
   * TODO: Implement based on node type
   */
  hasMinimumKeys(): boolean {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  /**
   * Inserts a key at the appropriate position maintaining sorted order
   * TODO: Implement binary search and insertion
   * @returns The index where the key was inserted
   */
  protected insertKey(key: K): number {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  /**
   * Finds the index where a key should be inserted or exists
   * Uses binary search for efficiency
   * TODO: Implement binary search
   * @returns The index of the key or insertion point
   */
  protected findKeyIndex(key: K): number {
    // TODO: Implement binary search
    throw new Error('Not implemented');
  }

  /**
   * Removes a key at the specified index
   * TODO: Implement key removal
   */
  protected removeKeyAt(index: number): void {
    // TODO: Implement
    throw new Error('Not implemented');
  }
}
