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
    // MATH.FLOOR (ROUND UP)
    // [null, 10, 20, 30]             length 4, 4/2 = 2, keys[2] = 20 (split index)
    // [null, 10, 20, 30, 40]         length 5, 5/2 = 3, keys[3] = 30 (split index)
    // [null, 10, 20, 30, 40, 50]     length 6, 6/2 = 3, keys[3] = 30 (split index)
    // [null, 10, 20, 30, 40, 50, 60] length 7, 7/2 = 4, keys[4] = 40 (split index)


    // CHILDREN.SLICE(SPLIT_INDEX)
    // [[5, 7], [12, 15], [22, 23], [32, 34]]                     keep keys [10],     keep child [[5, 7], [12, 15]]
    // [[5, 7], [12, 15], [22, 23], [32, 34], [45, 48]]           keep keys [10, 20], keep child [[5, 7], [12, 15], [22, 23]]
    // [[5, 7], [12, 15], [22, 23], [32, 34], [45, 48], [52, 54]] keep keys [10, 20], keep child [[5, 7], [12, 15], [22, 23]]

    return null as any;
  }

  /**
   * Removes a key and its associated child at the specified index
   * TODO: Implement removal maintaining the children invariant
   */
  removeKeyAndChild(index: number): void {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  /**
   * Borrows a key from the left sibling
   * Used during deletion when this node has too few keys
   * TODO: Implement borrowing logic:
   * - Take the rightmost key from left sibling
   * - Update parent's separator key
   * - Move corresponding child pointer
   */
  borrowFromLeft(leftSibling: InternalNode<K, V>, parentKeyIndex: number): void {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  /**
   * Borrows a key from the right sibling
   * Used during deletion when this node has too few keys
   * TODO: Implement borrowing logic:
   * - Take the leftmost key from right sibling
   * - Update parent's separator key
   * - Move corresponding child pointer
   */
  borrowFromRight(rightSibling: InternalNode<K, V>, parentKeyIndex: number): void {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  /**
   * Merges this node with its right sibling
   * Used during deletion when borrowing is not possible
   * TODO: Implement merge logic:
   * - Pull down the separator key from parent
   * - Combine all keys and children from both nodes
   * - Update parent pointers
   */
  mergeWithRight(rightSibling: InternalNode<K, V>, parentKey: K): void {
    if ( rightSibling['children'].length == 0 ) {
      return;
    }

    this.keys.push(parentKey);
    this.keys.push(...rightSibling['keys']);
    this.children.push(...rightSibling['children']);

    this.children.forEach((child: Node<K, V>) => {
      child.setParent(this);
    })
  }
}
