import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Safeguard against Chrome / Google Translate or browser extensions modifying DOM nodes
// which causes React to throw 'NotFoundError: Failed to execute removeChild on Node'
if (typeof Node === 'function' && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('Safeguard: Blocked removeChild on non-child node:', child);
      }
      return child;
    }
    return originalRemoveChild.apply(this, arguments as unknown as [T]) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('Safeguard: Blocked insertBefore with non-child reference node:', referenceNode);
      }
      return newNode;
    }
    return originalInsertBefore.apply(this, arguments as unknown as [T, Node | null]) as T;
  };
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

