// View Switcher Utility
window.switchView = (viewName) => {
    const homeView = document.getElementById('view-home');
    const animalTestView = document.getElementById('view-animal-test');
    
    if (viewName === 'animal-test') {
        homeView.style.display = 'none';
        animalTestView.style.display = 'flex';
        window.scrollTo(0, 0);
    } else {
        homeView.style.display = 'flex';
        animalTestView.style.display = 'none';
        window.scrollTo(0, 0);
    }
};

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
                .controls-wrapper { display: flex; gap: 10px; }
                button {
                    background: var(--container-bg);
                    border: 2px solid var(--bg-pattern-color);
                    color: var(--text-color);
                    padding: 8px 16px;
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
                .btn-test { background: linear-gradient(135deg, #ff6b6b, #f06595); color: white; border: none; }
                .icon { font-size: 18px; }
            </style>
            <div class="controls-wrapper">
                <button class="btn-test" id="nav-test-btn">
                    <span class="icon">🐶</span>
                    <span>동물상 확인</span>
                </button>
                <button id="theme-btn">
                    <span class="icon">${isDark ? '🌙' : '☀️'}</span>
                    <span>${isDark ? 'Dark' : 'Light'}</span>
                </button>
            </div>
        `;

        this.shadowRoot.getElementById('theme-btn').onclick = () => this.toggleTheme();
        this.shadowRoot.getElementById('nav-test-btn').onclick = () => window.switchView('animal-test');
    }
}

customElements.define('theme-toggle', ThemeToggle);

class AnimalFaceTest extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.model = null;
        this.URL = "https://teachablemachine.withgoogle.com/models/R3hX5qvrI/";
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.loadModel();
    }

    async loadModel() {
        const modelURL = this.URL + "model.json";
        const metadataURL = this.URL + "metadata.json";
        this.model = await tmImage.load(modelURL, metadataURL);
    }

    setupEventListeners() {
        const fileInput = this.shadowRoot.getElementById('file-input');
        const uploadArea = this.shadowRoot.getElementById('upload-area');
        const backBtn = this.shadowRoot.getElementById('back-home-btn');

        uploadArea.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        if (backBtn) backBtn.addEventListener('click', () => window.switchView('home'));
    }

    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.onload = async () => {
                this.shadowRoot.getElementById('preview-container').innerHTML = '';
                this.shadowRoot.getElementById('preview-container').appendChild(img);
                await this.predict(img);
            };
        };
        reader.readAsDataURL(file);
    }

    async predict(imageElement) {
        if (!this.model) return;
        const prediction = await this.model.predict(imageElement);
        
        // Sort predictions by probability (highest first)
        prediction.sort((a, b) => b.probability - a.probability);

        const labelContainer = this.shadowRoot.getElementById('label-container');
        labelContainer.innerHTML = '';

        const labelMap = {
            '강아지': '🐶 강아지상',
            '고양이': '🐱 고양이상',
            'Dog': '🐶 강아지상',
            'Cat': '🐱 고양이상'
        };

        for (let i = 0; i < prediction.length; i++) {
            const rawName = prediction[i].className;
            const classPrediction = labelMap[rawName] || rawName;
            const probability = (prediction[i].probability * 100).toFixed(0);
            
            const barWrapper = document.createElement('div');
            barWrapper.className = 'bar-wrapper';
            barWrapper.innerHTML = `
                <div class="label-name">${classPrediction}</div>
                <div class="bar-container">
                    <div class="bar" style="width: ${probability}%; background: ${i === 0 ? 'linear-gradient(90deg, #6e8efb, #a777e3)' : '#dee2e6'}"></div>
                </div>
                <div class="percentage">${probability}%</div>
            `;
            labelContainer.appendChild(barWrapper);
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
                .container {
                    text-align: center; padding: 40px; background-color: var(--container-bg);
                    border-radius: 20px; box-shadow: 0 20px 40px var(--shadow-color);
                    max-width: 500px; width: calc(100% - 80px); margin: 0 auto;
                    transition: all var(--transition-speed);
                }
                h2 { color: var(--text-color); margin-bottom: 10px; }
                p { color: var(--text-color); opacity: 0.7; margin-bottom: 30px; }
                #upload-area {
                    border: 3px dashed var(--bg-pattern-color); border-radius: 15px;
                    padding: 40px 20px; cursor: pointer; transition: all 0.3s ease; margin-bottom: 30px;
                }
                #upload-area:hover { border-color: #6e8efb; background-color: rgba(110, 142, 251, 0.05); }
                #preview-container img { max-width: 100%; max-height: 300px; border-radius: 10px; box-shadow: 0 10px 20px var(--shadow-color); }
                #label-container { margin-top: 30px; text-align: left; }
                .bar-wrapper { margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }
                .label-name { width: 90px; font-weight: 600; color: var(--text-color); font-size: 14px; }
                .bar-container { flex-grow: 1; height: 12px; background-color: var(--bg-pattern-color); border-radius: 6px; overflow: hidden; }
                .bar { height: 100%; transition: width 0.5s ease; }
                .percentage { width: 40px; text-align: right; font-size: 13px; font-weight: bold; color: var(--text-color); }
                input[type="file"] { display: none; }
                .back-btn {
                    margin-top: 20px; background: none; border: none; color: #6e8efb;
                    cursor: pointer; font-weight: 600; font-size: 14px; text-decoration: underline;
                }
            </style>
            <div class="container">
                <h2>🐶 AI 동물상 테스트 🐱</h2>
                <p>얼굴 사진을 업로드하여 결과를 확인해보세요!</p>
                <div id="upload-area">
                    <div id="preview-container">
                        <span style="font-size: 40px;">📁</span>
                        <div style="color: var(--text-color); font-weight: 600; margin-top: 10px;">사진 클릭하여 업로드</div>
                    </div>
                </div>
                <input type="file" id="file-input" accept="image/*">
                <div id="label-container"></div>
                <button class="back-btn" id="back-home-btn">← 메인 도구로 돌아가기</button>
            </div>
        `;
    }
}
customElements.define('animal-face-test', AnimalFaceTest);

class ContactForm extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); }
    connectedCallback() { this.render(); }
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; width: 100%; }
                .container {
                    text-align: left; padding: 40px; background-color: var(--container-bg);
                    border-radius: 20px; box-shadow: 0 20px 40px var(--shadow-color);
                    max-width: 500px; width: calc(100% - 80px); margin: 0 auto;
                }
                h2 { color: var(--text-color); margin-bottom: 25px; text-align: center; }
                .form-group { margin-bottom: 20px; }
                label { display: block; margin-bottom: 8px; color: var(--text-color); font-weight: 600; }
                input, textarea { width: 100%; padding: 12px; border-radius: 12px; border: 2px solid var(--bg-pattern-color); background: var(--bg-color); color: var(--text-color); box-sizing: border-box; }
                button { width: 100%; background: linear-gradient(135deg, #6e8efb, #a777e3); color: white; border: none; padding: 16px; border-radius: 12px; cursor: pointer; font-weight: 600; }
            </style>
            <div class="container">
                <h2>제휴 문의</h2>
                <form action="https://formspree.io/f/xojnrkwa" method="POST">
                    <div class="form-group"><label>성함/기업명</label><input type="text" name="name" required></div>
                    <div class="form-group"><label>이메일</label><input type="email" name="_replyto" required></div>
                    <div class="form-group"><label>문의 내용</label><textarea name="message" required></textarea></div>
                    <button type="submit">문의 보내기</button>
                </form>
            </div>
        `;
    }
}
customElements.define('contact-form', ContactForm);

class LottoGenerator extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); }
    connectedCallback() { this.render(); this.setupEventListeners(); this.generateAndDisplayNumbers(); }
    generateLottoNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) { numbers.add(Math.floor(Math.random() * 45) + 1); }
        return Array.from(numbers).sort((a, b) => a - b);
    }
    setupEventListeners() {
        this.shadowRoot.getElementById('generate-button').onclick = () => this.generateAndDisplayNumbers();
    }
    generateAndDisplayNumbers() {
        const numbers = this.generateLottoNumbers();
        const container = this.shadowRoot.getElementById('numbers-container');
        container.innerHTML = '';
        numbers.forEach((num, index) => {
            const circle = document.createElement('div');
            circle.className = 'number-circle';
            circle.textContent = num;
            circle.style.animationDelay = `${index * 0.1}s`;
            container.appendChild(circle);
        });
    }
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; width: 100%; }
                .container { text-align: center; padding: 40px; background: var(--container-bg); border-radius: 20px; box-shadow: 0 20px 40px var(--shadow-color); max-width: 500px; width: calc(100% - 80px); margin: 0 auto; }
                #numbers-container { display: flex; justify-content: center; gap: 15px; margin-bottom: 40px; flex-wrap: wrap; }
                .number-circle { width: 55px; height: 55px; border-radius: 50%; background: linear-gradient(135deg, #6e8efb, #a777e3); color: white; display: flex; justify-content: center; align-items: center; font-weight: bold; animation: pop 0.5s both; }
                button { background: linear-gradient(135deg, #00b09b, #96c93d); color: white; border: none; padding: 16px 40px; border-radius: 30px; cursor: pointer; font-weight: 600; }
                @keyframes pop { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
            </style>
            <div class="container">
                <h1>Lotto Numbers</h1>
                <div id="numbers-container"></div>
                <button id="generate-button">Lucky Draw</button>
            </div>
        `;
    }
}
customElements.define('lotto-generator', LottoGenerator);
