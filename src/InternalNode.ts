import { Node } from './Node';

/**
 * Internal (non-leaf) node in the B+ tree
 * Contains keys and pointers to child nodes
 * Keys act as separators between child subtrees
 */
export class InternalNode<K, V> extends Node<K, V> {
  /** Child node pointers (always has keys.length + 1 children) */
  private children: Node<K, V>[];

  constructor(order: number) {
    super(order);
    this.children = [];
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
    let i = 0;
    for(; i < this.keys.length; i++) {
      if ( this.keys[i] > key ) {
        break;
      }

      if ( this.keys[i] == key ) {
        break;
      }
    }

    // insert the mey
    this.keys = [
      ...this.keys.slice(0, i),
      key,
      ...this.keys.slice(i),
    ];

    const newChildren = [];

    let j = 0
    for(; j <= i; j++) {
      newChildren.push(this.children[j]);
    }

    newChildren.push(rightChild);

    for(; j < this.keys.length; j++) {
      newChildren.push(this.children[j]);
    }

    this.children = newChildren;

    rightChild.setParent(this);
  }

  /**
   * Finds the child node that should contain the given key
   * TODO: Implement search to find appropriate child
   * @returns The child node to traverse to
   */
  findChild(key: K): Node<K, V> {
    let i = 0;
    for(; i < this.keys.length; i++) {
      if ( this.keys[i] > key ) {
        break;
      }
    }

    return this.children[i];
  }

  /**
   * Finds the index of a specific child node
   * TODO: Implement child lookup
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
   * TODO: Implement split logic:
   * - Create new internal node
   * - Move half the keys and children to the new node
   * - Return the middle key (to be pushed up) and the new node
   * @returns Object with the middle key and the new right node
   */
  split(): { middleKey: K; rightNode: InternalNode<K, V> } {
    const splitKeyIndex = Math.floor(this.keys.length / 2);
    const splitKey = this.keys[splitKeyIndex];

    const newNode = new InternalNode<K, V>(this.order);

    newNode['keys'] = this.keys.slice(splitKeyIndex + 1)
    newNode['children'] = this.children.slice(splitKeyIndex + 1)
    newNode['children'].forEach((child: Node<K, V>) => {
      child.setParent(newNode);
    })
    newNode.setParent(this.getParent());

    this.keys = this.keys.slice(0, splitKeyIndex);
    this.children = this.children.slice(0, splitKeyIndex + 1);

    return {
      middleKey: splitKey,
      rightNode: newNode,
    };
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
    // TODO: Implement
    throw new Error('Not implemented');
  }
}
