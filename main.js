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
                    background-color: #ffffff;
                    border-radius: 20px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                    max-width: 500px;
                    width: 100%;
                }
                h1 {
                    color: #2c3e50;
                    margin-bottom: 30px;
                    font-weight: 700;
                    letter-spacing: -1px;
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
