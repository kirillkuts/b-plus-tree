import { Node } from './Node';

/**
 * Leaf node in the B+ tree
 * Contains key-value pairs and pointers to sibling leaves
 * All data records are stored in leaf nodes
 * Leaf nodes form a linked list for efficient range queries
 */
export class LeafNode<K, V> extends Node<K, V> {
  /** Values corresponding to the keys */
  private values: V[];

  /** Pointer to the next leaf node (for range queries) */
  private next: LeafNode<K, V> | null;

  /** Pointer to the previous leaf node (for backward traversal) */
  private prev: LeafNode<K, V> | null;

  constructor(order: number) {
    super(order);
    this.values = [];
    this.next = null;
    this.prev = null;
  }

  /**
   * Returns true since this is a leaf node
   */
  isLeaf(): boolean {
    return true;
  }

  /**
   * Returns the value at the specified index
   */
  getValue(index: number): V {
    return this.values[index];
  }

  /**
   * Returns all values in this leaf
   */
  getValues(): V[] {
    return [...this.values];
  }

  /**
   * Returns the next leaf node
   */
  getNext(): LeafNode<K, V> | null {
    return this.next;
  }

  /**
   * Sets the next leaf node
   */
  setNext(next: LeafNode<K, V> | null): void {
    this.next = next;
  }

  /**
   * Returns the previous leaf node
   */
  getPrev(): LeafNode<K, V> | null {
    return this.prev;
  }

  /**
   * Sets the previous leaf node
   */
  setPrev(prev: LeafNode<K, V> | null): void {
    this.prev = prev;
  }

  /**
   * Inserts a key-value pair into this leaf node
   * @returns true if a new key was inserted, false if existing key was updated
   */
  insert(key: K, value: V): boolean {
    let i = 0;
    let exist = false;
    for(; i < this.keys.length; i++) {
      if ( this.keys[i] > key ) {
        break;
      }

      if ( this.keys[i] == key ) {
        exist = true;
        break;
      }
    }

    if ( exist ) {
      this.values[i] = value;
      return false;
    }

    this.keys = [
        ...this.keys.slice(0, i),
        key,
        ...this.keys.slice(i),
    ];

    this.values = [
        ...this.values.slice(0, i),
        value,
        ...this.values.slice(i),
    ];

    return true;
  }

  /**
   * Searches for a value by key
   * TODO: Implement search using binary search
   * @returns The value if found, undefined otherwise
   */
  search(key: K): V | undefined {
    const index = this.keys.findIndex(k => k === key);

    return index > -1 ? this.values[index] : undefined;
  }

  /**
   * Deletes a key-value pair from this leaf
   * TODO: Implement deletion
   * @returns true if the key was found and deleted, false otherwise
   */
  delete(key: K): boolean {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  /**
   * Splits this leaf node into two nodes
   * Used when the leaf overflows (too many keys)
   * TODO: Implement split logic:
   * - Create new leaf node
   * - Move half the key-value pairs to the new node
   * - Update sibling pointers (next/prev)
   * - Return the first key of the new node and the new node
   * @returns Object with the smallest key in the new node and the new node
   */
  split(): { splitKey: K; rightNode: LeafNode<K, V> } {
    const newLeafNode = new LeafNode<K, V>(this.order);

    const keep = Math.ceil(this.values.length / 2);

    for(let i = keep; i < this.keys.length; i++) {
      newLeafNode.insert(this.keys[i], this.values[i]);
    }

    this.keys = this.keys.slice(0, keep);
    this.values = this.values.slice(0, keep);

    newLeafNode.next = this.next;
    newLeafNode.prev = this;
    this.next = newLeafNode;

    if ( newLeafNode.next ) {
      newLeafNode.next.prev = newLeafNode;
    }

    return {
      splitKey: newLeafNode.keys[0],
      rightNode: newLeafNode,
    }
  }

  /**
   * Borrows a key-value pair from the left sibling
   * Used during deletion when this node has too few keys
   * TODO: Implement borrowing logic:
   * - Take the rightmost key-value from left sibling
   * - Insert it into this node
   * - Update parent's separator key
   */
  borrowFromLeft(leftSibling: LeafNode<K, V>): K {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  /**
   * Borrows a key-value pair from the right sibling
   * Used during deletion when this node has too few keys
   * TODO: Implement borrowing logic:
   * - Take the leftmost key-value from right sibling
   * - Insert it into this node
   * - Update parent's separator key
   */
  borrowFromRight(rightSibling: LeafNode<K, V>): K {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  /**
   * Merges this node with its right sibling
   * Used during deletion when borrowing is not possible
   * TODO: Implement merge logic:
   * - Combine all key-value pairs from both nodes
   * - Update sibling pointers
   * - Update parent pointers
   */
  mergeWithRight(rightSibling: LeafNode<K, V>): void {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  /**
   * Returns all key-value pairs in order
   * Useful for range queries and debugging
   * TODO: Implement to return array of [key, value] tuples
   */
  getEntries(): Array<[K, V]> {
    // TODO: Implement
    throw new Error('Not implemented');
  }
}
