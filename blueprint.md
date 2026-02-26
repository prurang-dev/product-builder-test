# **Blueprint: AI & Global Utility Tools**

## **Overview**

A premium, multi-functional web application featuring a Global Lotto Generator and an AI Animal Face Test, designed with a sophisticated gold-accented aesthetic.

## **Project Outline**

### **Design & Style**

*   **Aesthetic:** Modern, clean, and premium with a white/dark card UI and gold (`#b8860b`) accents.
*   **Architecture:** Framework-less SPA (Single Page Application) using Web Components.
*   **Responsiveness:** Optimized for mobile and desktop with a centered container approach.
*   **Typography:** 'Pretendard' and 'Noto Sans JP' for high-quality multilingual display.

### **Features**

*   **Global Lotto (Main):** Supports KR, US (Powerball), JP (Lotto 7), and EU (EuroMillions) rules with wish-number inclusion and multilingual UI (KO, EN, JA).
*   **AI Animal Face Test:** File-upload based face classification (Dog vs Cat) using Teachable Machine.
*   **Theme Support:** Seamless Dark/Light mode transition.
*   **Multilingual:** Full UI translation for Korean, English, and Japanese.

## **Current Plan**

1.  **Apply New Premium Design:**
    *   Update `style.css` with the new gold-themed variable system and polished animations.
2.  **Implement Global Lotto Component:**
    *   Refactor the provided lotto logic into the `LottoGenerator` component.
    *   Integrate multi-language support and country-specific rules.
3.  **Synchronize Navigation:**
    *   Update `ThemeToggle` (Top Nav) to include language selection and view switching.
4.  **Deployment:**
    *   Push to GitHub for automatic Cloudflare Pages deployment.
