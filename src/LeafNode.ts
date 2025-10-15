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
    const index = this.keys.findIndex(k => k === key);

    if (index == -1) {
      return false;
    }

    this.keys = [
        ...this.keys.slice(0, index),
        ...this.keys.slice(index + 1),
    ];

    this.values = [
        ...this.values.slice(0, index),
        ...this.values.slice(index + 1),
    ];

    return true;
  }

  isEmpty() {
    return this.values.length === 0;
  }

  /**
   * Splits this leaf node into two nodes
   * Used when the leaf overflows (too many keys)
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
   */
  tryBorrowFromLeft(): undefined | K {
    const leftLeaf = this.getPrev() as LeafNode<K, V> | undefined;

    if ( leftLeaf && leftLeaf.canBorrow() ) {
      const key = leftLeaf['keys'].pop()
      const value = leftLeaf['values'].pop();

      if ( key === undefined || value === undefined ) {
        return undefined;
      }

      this.insert(key, value);
      return  key;
    }

    return undefined;
  }

  tryBorrowFromRight(): undefined | K {
    const rightLeaf = this.getNext() as LeafNode<K, V> | undefined;

    if ( rightLeaf && rightLeaf.canBorrow() ) {
      const key = rightLeaf['keys'].shift()
      const value = rightLeaf['values'].shift();

      if ( key === undefined || value === undefined ) {
        return undefined;
      }

      this.insert(key, value);
      return rightLeaf['keys'][0];
    }

    return undefined;
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
    this.keys.push(...rightSibling['keys']);
    this.values.push(...rightSibling['values']);

    this.next = rightSibling['next'];

    if ( this.next ) {
      this.next.prev = this;
    }
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
