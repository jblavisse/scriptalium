
import { DecoratorNode } from 'lexical';
import * as React from 'react';

export type ImagePayload = {
  src: string;
  altText: string;
  key?: string;
};

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__key);
  }

  constructor(src: string, altText: string, key?: string) {
    super(key);
    this.__src = src;
    this.__altText = altText;
  }

  createDOM(): HTMLElement {
    const span = document.createElement('span');
    return span;
  }

  updateDOM(): false {
    return false;
  }

  static importJSON(serializedNode: any): ImageNode {
    const { src, altText } = serializedNode;
    return new ImageNode(src, altText);
  }

  exportJSON(): any {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
      altText: this.__altText,
    };
  }

  decorate(): JSX.Element {
    return <span>{this.__altText}</span>;
  }
}

export function $createImageNode(payload: ImagePayload): ImageNode {
  const { src, altText, key } = payload;
  return new ImageNode(src, altText, key);
}

export function $isImageNode(node: any): node is ImageNode {
  return node instanceof ImageNode;
}
