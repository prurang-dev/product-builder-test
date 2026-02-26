# **Blueprint: Lotto Number Generator & AI Animal Face Test**

## **Overview**

This document outlines the design and implementation of a multi-functional web application featuring a Lotto Number Generator and an AI-powered Animal Face Test (Dog vs Cat).

## **Project Outline**

### **Design & Style**

*   **Framework-less Modern Web:** Built using native Web Components for encapsulation.
*   **Shadow DOM:** Scoped styling to prevent conflicts.
*   **Responsive Layout:** Centered using Flexbox with a modern dot-pattern background.
*   **Theme Support:** Dark and Light mode toggle with persistent user preference.

### **Features**

*   **AI Animal Face Test:** Uses a Teachable Machine model to classify faces as Dog or Cat using the webcam.
*   **Unique Number Generation:** Generates 6 unique numbers (1-45) for Lotto.
*   **Partnership Inquiry Form:** Simple contact form integrated with Formspree.
*   **Community Support:** Integrated Disqus comment system.

## **Current Plan**

1.  **Implement AI Animal Face Test:**
    *   Add TensorFlow.js and Teachable Machine libraries.
    *   Create `<animal-face-test>` Web Component.
    *   Implement real-time webcam prediction and visual feedback (bars).
2.  **Refine Page Layout:**
    *   Stack components: Theme Toggle -> Animal Face Test -> Lotto Generator -> Contact Form -> Disqus.
3.  **Deployment:**
    *   Commit and push to the repository.
