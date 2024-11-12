import {
  EditorConfig,
  ElementNode,
  LexicalNode,
  DOMConversionMap,
  DOMConversionOutput,
  RangeSelection,
  LexicalEditor,
  $createNodeSelection,
} from 'lexical';
import { addClassNamesToElement } from '@lexical/utils';
import React from 'react';

export interface EditorComment {
  userName: string;
  time: string;
  content: string;
}

export interface EditorCommentInstance {
  uuid: string;
  textContent: string;
  comments: EditorComment[];
}

class CommentNode extends ElementNode {
  unwrap() {
    throw new Error('Method not implemented.');
  }
  __commentInstance: EditorCommentInstance;

  static getType(): string {
    return 'comment';
  }

  static clone(node: CommentNode): CommentNode {
    return new CommentNode(node.__commentInstance, node.__key);
  }

  constructor(commentInstance: EditorCommentInstance, key?: string) {
    super(key);
    this.__commentInstance = commentInstance;
  }

  // Déclaration du nœud comme inline
  isInline(): boolean {
    return true;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement('span');
    element.setAttribute('data-comment-instance', JSON.stringify(this.__commentInstance));
    addClassNamesToElement(element, config.theme.comment as string); // Utilise la classe Tailwind
    return element;
  }

  updateDOM(prevNode: CommentNode, dom: HTMLElement, config: EditorConfig): boolean {
    const commentSpan: HTMLSpanElement = dom;
    const [prevInstance, currentInstance] = [
      JSON.stringify(prevNode.__commentInstance),
      JSON.stringify(this.__commentInstance),
    ];

    if (prevInstance !== currentInstance) {
      commentSpan.setAttribute('data-comment-instance', currentInstance);
    }

    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (node: Node) => ({
        conversion: convertCommentSpan,
        priority: 1,
      }),
    };
  }

  getComment(): EditorCommentInstance {
    const self = this.getLatest();
    return (self as CommentNode).__commentInstance;
  }

  setComment(commentInstance: EditorCommentInstance): void {
    const writable = this.getWritable();
    writable.__commentInstance = commentInstance;
  }

  static importJSON(serializedNode: any): CommentNode {
    const { uuid, textContent, comments } = serializedNode;
    return new CommentNode({ uuid, textContent, comments });
  }

  exportJSON(): any {
    return {
      type: 'comment',
      version: 1,
      uuid: this.__commentInstance.uuid,
      textContent: this.__commentInstance.textContent,
      comments: this.__commentInstance.comments,
      children: [], 
    };
  }
}

function convertCommentSpan(domNode: Node): DOMConversionOutput {
  let node = null;

  if (domNode instanceof HTMLSpanElement) {
    const commentInstance = domNode.getAttribute('data-comment-instance');

    if (commentInstance) {
      const jsonCommentInstance: EditorCommentInstance = JSON.parse(commentInstance);
      node = $createCommentNode(jsonCommentInstance);
    }
  }

  return { node };
}

function $createCommentNode(commentInstance: EditorCommentInstance): CommentNode {
  return new CommentNode(commentInstance);
}

function $isCommentNode(node: LexicalNode): node is CommentNode {
  return node instanceof CommentNode;
}

export default CommentNode;
export { $createCommentNode, $isCommentNode };