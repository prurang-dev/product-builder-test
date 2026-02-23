# **Blueprint: Lotto Number Generator**

## **Overview**

This document outlines the design and implementation of a simple, modern, and visually appealing Lotto Number Generator web application. The application will generate and display a set of unique lottery numbers, providing an engaging user experience.

## **Project Outline**

### **Design & Style**

*   **Framework-less Modern Web:** Built using native Web Components for encapsulation.
*   **Shadow DOM:** Scoped styling to prevent conflicts.
*   **Responsive Layout:** Centered using Flexbox with a modern dot-pattern background.
*   **Typography:** Clean, sans-serif font stack.
*   **Animations:** Smooth pop-in animations for number circles.

### **Features**

*   **Unique Number Generation:** Generates 6 unique numbers (1-45).
*   **Sorted Results:** Numbers are automatically sorted in ascending order.
*   **Interactive UI:** Modern gradient buttons and animated circles.

## **Current Plan**

1.  **Refactor to Web Components (`main.js`):**
    *   Implement `LottoGenerator` class extending `HTMLElement`.
    *   Use Shadow DOM for styles and structure.
    *   Add sorting logic to generated numbers.
2.  **Modernize HTML (`index.html`):**
    *   Use `<script type="module">`.
    *   Use the custom `<lotto-generator>` tag.
3.  **Refined Styling (`style.css`):**
    *   Update background to a subtle dot pattern.
    *   Ensure proper centering of the component.
