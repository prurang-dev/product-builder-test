class ThemeToggle extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.theme = localStorage.getItem('theme') || 'light';
        this.applyTheme();
    }

    connectedCallback() {
        this.render();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.render();
    }

    render() {
        const isDark = this.theme === 'dark';
        this.shadowRoot.innerHTML = `
            <style>
                button {
                    background: var(--container-bg);
                    border: 2px solid var(--bg-pattern-color);
                    color: var(--text-color);
                    padding: 8px 12px;
                    border-radius: 20px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    transition: all var(--transition-speed);
                    box-shadow: 0 4px 6px var(--shadow-color);
                }
                button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 12px var(--shadow-color);
                }
                .icon {
                    font-size: 18px;
                }
            </style>
            <button id="theme-btn">
                <span class="icon">${isDark ? '🌙' : '☀️'}</span>
                <span>${isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
        `;

        this.shadowRoot.getElementById('theme-btn').onclick = () => this.toggleTheme();
    }
}

customElements.define('theme-toggle', ThemeToggle);

class LottoGenerator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.generateAndDisplayNumbers();
    }

    generateLottoNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    setupEventListeners() {
        const btn = this.shadowRoot.getElementById('generate-button');
        btn.addEventListener('click', () => this.generateAndDisplayNumbers());
    }

    generateAndDisplayNumbers() {
        const numbers = this.generateLottoNumbers();
        const container = this.shadowRoot.getElementById('numbers-container');
        container.innerHTML = '';
        
        numbers.forEach((num, index) => {
            const circle = document.createElement('div');
            circle.classList.add('number-circle');
            circle.textContent = num;
            circle.style.animationDelay = `${index * 0.1}s`;
            container.appendChild(circle);
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                }
                .container {
                    text-align: center;
                    padding: 40px;
                    background-color: var(--container-bg);
                    border-radius: 20px;
                    box-shadow: 0 20px 40px var(--shadow-color);
                    max-width: 500px;
                    width: calc(100% - 80px);
                    margin: 0 auto;
                    transition: all var(--transition-speed);
                }
                h1 {
                    color: var(--text-color);
                    margin-bottom: 30px;
                    font-weight: 700;
                    letter-spacing: -1px;
                    transition: color var(--transition-speed);
                }
                #numbers-container {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-bottom: 40px;
                    flex-wrap: wrap;
                }
                .number-circle {
                    width: 55px;
                    height: 55px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #6e8efb, #a777e3);
                    color: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 20px;
                    font-weight: bold;
                    box-shadow: 0 10px 20px rgba(110, 142, 251, 0.3);
                    animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
                }
                button {
                    background: linear-gradient(135deg, #00b09b, #96c93d);
                    color: white;
                    border: none;
                    padding: 16px 40px;
                    font-size: 18px;
                    font-weight: 600;
                    border-radius: 30px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 10px 20px rgba(0, 176, 155, 0.2);
                }
                button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 30px rgba(0, 176, 155, 0.3);
                }
                button:active {
                    transform: translateY(-1px);
                }
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.5) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            </style>
            <div class="container">
                <h1>Lotto Lucky Numbers</h1>
                <div id="numbers-container"></div>
                <button id="generate-button">Lucky Draw</button>
            </div>
        `;
    }
}

customElements.define('lotto-generator', LottoGenerator);
