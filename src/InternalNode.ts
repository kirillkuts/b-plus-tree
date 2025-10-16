import { Node } from './Node';

/**
 * Internal (non-leaf) node in the B+ tree
 * Contains keys and pointers to child nodes
 * Keys act as separators between child subtrees
 *
 * Invariant following the rules:
 * values[i].child > keys[i]
 *
 * keys[0] = NULL
 */
export class InternalNode<K, V> extends Node<K, V> {
  /** Child node pointers (always has keys.length + 1 children) */
  private children: Node<K, V>[];

  constructor(order: number) {
    super(order);
    this.children = [];

    this.keys = [null as K];
  }

  /**
   * Returns false since this is an internal node
   */
  isLeaf(): boolean {
    return false;
  }

  /**
   * Returns the number of children
   */
  getChildCount(): number {
    return this.children.length;
  }

  /**
   * Returns the child at the specified index
   */
  getChild(index: number): Node<K, V> {
    return this.children[index];
  }

  /**
   * Returns all children
   */
  getChildren(): Node<K, V>[] {
    return [...this.children];
  }

  /**
   * Inserts a key and corresponding right child pointer
   * The new key goes at the specified index, and the right child goes at index + 1
   */
  insertKeyAndChild(key: K, rightChild: Node<K, V>): void {
    rightChild.setParent(this);

    if ( this.keys.length === 1 ) {
      this.keys.push(key);
      this.children.push(rightChild);
      return;
    }

    let i = 1;
    while(key > this.keys[i]) {
      i++;
    }

    this.keys = [
      ...this.keys.slice(0, i),
      key,
      ...this.keys.slice(i),
    ];

    this.children = [
      ...this.children.slice(0, i),
      rightChild,
      ...this.children.slice(i),
    ];
  }

  /**
   * Finds the child node that should contain the given key
   * @returns The child node to traverse to
   */
  findChild(key: K): Node<K, V> {

    // example layout:
    // [NULL,   10,       20,       30,       40      ]
    // [[5, 7], [12, 15], [22, 26], [32, 39], [45, 49]]


    // task: find 22
    //
    // skip 0
    // skip 1: 10 < 22
    // skip 2: 20 < 22
    //      3: 30 > 22 (return children[3 - 1])

    let i = 1;
    for(; i < this.keys.length; i++) {
      if ( this.keys[i] > key ) {
        break;
      }
    }

    return this.children[i - 1];
  }

  /**
   * Finds the index of a specific child node
   * Keys correspond in the following format:

   * keys:  [      10,       20        ]
   * values [[3, 5], [11, 15], [25, 27]]
   *
   * i = 0, k = 10, child[0].values < 10
   * i = 1, k = 20, child[1].values < 20  && child[1].values > k[0]
   * i = 2, k = null, child[2].values > 20  && child[1].values > k[1]

   * @returns The index of the child or -1 if not found
   */
  findChildIndex(child: Node<K, V>): number {
    let i = 0;
    for(; i < this.children.length; i++) {
      if ( this.children[i] == child ) {
        break;
      }
    }

    return i === this.children.length ? -1 : i;
  }

  /**
   * Splits this internal node into two nodes
   * Used when the node overflows (too many keys)
   * @returns Object with the middle key and the new right node
   */
  split(): { middleKey: K; rightNode: InternalNode<K, V> } {
    const splitIndex = Math.ceil(this.keys.length / 2);
    const splitKey = this.keys[splitIndex];

    const newNode = new InternalNode<K, V>(this.order);

    newNode['keys'].push(
        ...this.keys.slice(splitIndex + 1)
    );

    newNode['children'] = this.children.slice(splitIndex);
    newNode.children.forEach(child => child.setParent(newNode))

    this.keys = this.keys.slice(0, splitIndex);
    this.children = this.children.slice(0, splitIndex);

    return {
      middleKey: splitKey,
      rightNode: newNode,
    };
  }

  /**
   * Removes a key and its associated child at the specified index
   */
  removeKeyAndChild(index: number): void {
    this.keys = [
        ...this.keys.slice(0, index),
        ...this.keys.slice(index + 1),
    ];

    this.children = [
        ...this.children.slice(0, index),
        ...this.children.slice(index + 1),
    ];
  }

  /**
   * Borrows a key from the left sibling
   * Used during deletion when this node has too few keys
   */
  borrowFromLeft(leftSibling: InternalNode<K, V>, parentKeyIndex: number): void {
    const parent = this.parent;

    if ( parent === null ) {
      throw new Error('Orphan node :(');
    }

    const lastKey = leftSibling.keys.pop();
    const lastChild = leftSibling.children.pop();

    if ( lastKey === undefined || lastChild === undefined ) {
      throw new Error('Well, I better hope it never happens..');
    }

    const parentKey = parent['keys'][parentKeyIndex];
    parent['keys'][parentKeyIndex] = lastKey;

    this.keys = [null as K, parentKey, ...this.keys.slice(1)];
    this.children = [lastChild, ...this.children.slice(0)];

    lastChild.setParent(this);
  }

  /**
   * Borrows a key from the right sibling
   * Used during deletion when this node has too few keys
   */
  borrowFromRight(rightSibling: InternalNode<K, V>, parentKeyIndex: number): void {
    const parent = this.parent;

    if ( parent === null ) {
      throw new Error('Orphan node :(');
    }

    const keyToSteal = rightSibling.keys[1];
    rightSibling.keys = [null as K, ...rightSibling.keys.slice(2)];

    const childToSteal = rightSibling.children[0];
    rightSibling.children = rightSibling.children.slice(1);

    const parentKey = parent['keys'][parentKeyIndex];
    parent['keys'][parentKeyIndex] = keyToSteal;

    this.keys.push(parentKey);

    this.children.push(childToSteal);
    childToSteal.setParent(this);
  }

  /**
   * Merges this node with its right sibling
   * Used during deletion when borrowing is not possible
   */
  mergeWithRight(rightSibling: InternalNode<K, V>, parentKey: K): void {
    if ( rightSibling['children'].length == 0 ) {
      return;
    }

    this.keys.push(parentKey);
    this.keys.push(...rightSibling['keys'].slice(1));
    this.children.push(...rightSibling['children']);

    this.children.forEach((child: Node<K, V>) => {
      child.setParent(this);
    })
  }

  /**
   * Returns the number of keys in this node
   */
  getKeyCount(): number {
    return this.keys.length - 1;
  }

  /**
   * Returns all keys in this node
   */
  getKeys(): K[] {
    return [...this.keys.slice(1)];
  }

  halfFull() {
    return this.keys.length >= Math.floor(this.order / 2);
  }
}
