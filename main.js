// Language and Rules Configuration
const RULES = {
    kr: { main: 6, max: 45, b: 1, bm: 45, bSame: true },
    us: { main: 5, max: 69, b: 1, bm: 26, bSame: false },
    jp: { main: 7, max: 37, b: 0, bm: 0, bSame: false },
    eu: { main: 5, max: 50, b: 2, bm: 12, bSame: false }
};

const TRANSLATIONS = {
    ko: {
        title: "Global Lotto", subtitle: "당신을 위한 행운의 한 세트",
        lblCountry: "국가 선택", lblWish: "희망 번호 (쉼표 구분)",
        btn: "번호 추출하기", msg: "Good Luck!",
        guideTitle: "사용법 안내", 
        guideBody: "1. 원하는 <b>국가</b>를 선택하세요.<br>2. 꼭 포함하고 싶은 <b>희망 번호</b>가 있다면 쉼표(,)로 구분해 적어주세요.<br>3. 버튼을 누르면 실제 규칙에 맞는 번호가 생성됩니다.",
        guideClose: "확인", alert: "희망 번호가 너무 많습니다.",
        countries: { kr: "대한민국 (6/45)", us: "미국 파워볼", jp: "일본 로또 7", eu: "유럽 유로밀리언즈" }
    },
    en: {
        title: "Global Lotto", subtitle: "Lucky Number for You",
        lblCountry: "Select Country", lblWish: "Wish Numbers (Comma sep.)",
        btn: "Generate Numbers", msg: "Good Luck!",
        guideTitle: "How to Use", 
        guideBody: "1. Select your <b>Country</b>.<br>2. Enter <b>Wish Numbers</b> separated by commas if you have any.<br>3. Click the button to get 1 set of numbers based on actual rules.",
        guideClose: "Got it", alert: "Too many wish numbers.",
        countries: { kr: "South Korea (6/45)", us: "USA Powerball", jp: "Japan Lotto 7", eu: "EuroMillions" }
    },
    ja: {
        title: "グローバル・ロト", subtitle: "あなたのための幸運のセット",
        lblCountry: "国を選択", lblWish: "希望番号 (コンマ区切り)",
        btn: "番号を抽出する", msg: "Good Luck!",
        guideTitle: "使い方ガイド", 
        guideBody: "1. <b>国</b>を選択してください。<br>2. <b>希望番号</b>がある場合は、コンマ(,)で구切って入力してください。<br>3. 버튼を押すと、実際のルールに基づいた番号が生成されます。",
        guideClose: "確認", alert: "希望番号が多すぎます。",
        countries: { kr: "韓国 (6/45)", us: "アメリカ パワーボール", jp: "日本 ロト 7", eu: "欧州 ユーロミリオンズ" }
    }
};

// View Switcher Utility
window.switchView = (viewName) => {
    const homeView = document.getElementById('view-home');
    const animalTestView = document.getElementById('view-animal-test');
    
    if (viewName === 'animal-test') {
        homeView.style.display = 'none';
        animalTestView.style.display = 'flex';
        const animalTestComponent = document.querySelector('animal-face-test');
        if (animalTestComponent) animalTestComponent.reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        homeView.style.display = 'flex';
        animalTestView.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

class ThemeToggle extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.theme = localStorage.getItem('theme') || 'dark';
        this.lang = localStorage.getItem('lang') || 'ko';
    }

    connectedCallback() {
        this.render();
        this.applyTheme();
    }

    applyTheme() {
        document.body.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.render();
    }

    changeLang(lang) {
        this.lang = lang;
        localStorage.setItem('lang', lang);
        document.dispatchEvent(new CustomEvent('langChanged', { detail: { lang } }));
        this.render();
    }

    render() {
        const isDark = this.theme === 'dark';
        this.shadowRoot.innerHTML = `
            <style>
                .top-nav { display: flex; gap: 10px; align-items: center; }
                .nav-btn, .lang-select {
                    background-color: var(--nav-btn-bg);
                    color: var(--text-color);
                    border: 1px solid var(--gold);
                    padding: 8px 12px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    font-weight: bold;
                    box-shadow: 0 4px 6px var(--shadow);
                    transition: 0.2s;
                    appearance: none;
                }
                .btn-face { background: linear-gradient(135deg, #ff6b6b, #f06595); color: white; border: none; }
            </style>
            <div class="top-nav">
                <button class="nav-btn btn-face" id="go-face-btn">🐶</button>
                <select class="lang-select" id="lang-select">
                    <option value="ko" ${this.lang === 'ko' ? 'selected' : ''}>🇰🇷</option>
                    <option value="en" ${this.lang === 'en' ? 'selected' : ''}>🇺🇸</option>
                    <option value="ja" ${this.lang === 'ja' ? 'selected' : ''}>🇯🇵</option>
                </select>
                <button class="nav-btn" id="theme-btn">${isDark ? '🌙' : '☀️'}</button>
            </div>
        `;

        this.shadowRoot.getElementById('theme-btn').onclick = () => this.toggleTheme();
        this.shadowRoot.getElementById('go-face-btn').onclick = () => window.switchView('animal-test');
        this.shadowRoot.getElementById('lang-select').onchange = (e) => this.changeLang(e.target.value);
    }
}
customElements.define('theme-toggle', ThemeToggle);

class LottoGenerator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.lang = localStorage.getItem('lang') || 'ko';
    }

    connectedCallback() {
        this.render();
        document.addEventListener('langChanged', (e) => {
            this.lang = e.detail.lang;
            this.render();
        });
    }

    getBallColor(n) {
        if (n <= 10) return 'c1'; if (n <= 20) return 'c2';
        if (n <= 30) return 'c3'; if (n <= 40) return 'c4';
        return 'c5';
    }

    generate() {
        const countryKey = this.shadowRoot.getElementById('country').value;
        const rule = RULES[countryKey];
        const wishVal = this.shadowRoot.getElementById('wishInput').value;
        const display = this.shadowRoot.getElementById('display');

        let wishNums = [...new Set(wishVal.split(',')
            .map(n => parseInt(n.trim()))
            .filter(n => !isNaN(n) && n >= 1 && n <= rule.max))];

        if (wishNums.length > rule.main) {
            alert(TRANSLATIONS[this.lang].alert);
            return;
        }

        let mainSet = [...wishNums];
        while(mainSet.length < rule.main) {
            let r = Math.floor(Math.random() * rule.max) + 1;
            if(!mainSet.includes(r)) mainSet.push(r);
        }
        mainSet.sort((a, b) => a - b);

        let bSet = [];
        while(bSet.length < rule.b) {
            let r = Math.floor(Math.random() * rule.bm) + 1;
            if (rule.bSame) { if(!mainSet.includes(r) && !bSet.includes(r)) bSet.push(r); }
            else { if(!bSet.includes(r)) bSet.push(r); }
        }
        bSet.sort((a, b) => a - b);

        display.innerHTML = '';
        const row = document.createElement('div');
        row.className = 'lotto-set';
        mainSet.forEach(n => {
            const b = document.createElement('div');
            b.className = `ball ${this.getBallColor(n)}`;
            b.innerText = n;
            row.appendChild(b);
        });
        if (bSet.length > 0) {
            const p = document.createElement('span');
            p.innerText = '+'; p.className = 'plus-sign';
            row.appendChild(p);
            bSet.forEach(n => {
                const b = document.createElement('div');
                b.className = 'ball bonus-ball';
                b.innerText = n;
                row.appendChild(b);
            });
        }
        display.appendChild(row);
    }

    openModal() { this.shadowRoot.getElementById('guideModal').style.display = 'flex'; }
    closeModal() { this.shadowRoot.getElementById('guideModal').style.display = 'none'; }

    render() {
        const t = TRANSLATIONS[this.lang];
        this.shadowRoot.innerHTML = `
            <style>
                .container { width: 100%; max-width: 450px; text-align: center; font-family: inherit; }
                h1 { margin-bottom: 5px; color: var(--gold); font-size: 2.2rem; font-weight: 800; }
                .subtitle { color: #888; margin-bottom: 25px; font-size: 0.95rem; }
                .config-box { background: var(--card-bg); padding: 30px; border-radius: 24px; box-shadow: 0 15px 35px var(--shadow); margin-bottom: 20px; }
                .group { margin-bottom: 20px; text-align: left; }
                label { display: block; font-size: 0.85rem; margin-bottom: 8px; font-weight: 800; color: var(--gold); }
                input, .main-select { width: 100%; padding: 14px; background: var(--input-bg); border: 2px solid transparent; border-radius: 14px; color: var(--text-color); box-sizing: border-box; font-size: 1rem; outline: none; }
                .display-area { min-height: 120px; display: flex; justify-content: center; align-items: center; margin-bottom: 20px; }
                .lotto-set { display: flex; justify-content: center; align-items: center; gap: 8px; flex-wrap: wrap; }
                .ball { width: 44px; height: 44px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: 800; color: white; box-shadow: 0 5px 10px var(--shadow); animation: pop 0.4s ease; font-size: 1.1rem; }
                @keyframes pop { from { transform: scale(0); } to { transform: scale(1); } }
                .c1 { background: linear-gradient(135deg, #fbc400, #f68b1f); }
                .c2 { background: linear-gradient(135deg, #69c8f2, #0099ff); }
                .c3 { background: linear-gradient(135deg, #ff7272, #d32f2f); }
                .c4 { background: linear-gradient(135deg, #aaaaaa, #616161); }
                .c5 { background: linear-gradient(135deg, #b0d840, #388e3c); }
                .plus-sign { font-weight: bold; color: var(--gold); }
                .bonus-ball { background: radial-gradient(circle at 30% 30%, #ff4081, #c2185b) !important; border: 2px solid white; box-sizing: border-box; }
                .btn-draw { background: var(--gold); color: #000; border: none; width: 100%; padding: 20px; font-size: 1.25rem; font-weight: 900; border-radius: 18px; cursor: pointer; box-shadow: 0 8px 20px rgba(184, 134, 11, 0.3); transition: 0.2s; }
                .btn-draw:hover { transform: scale(1.02); }
                .help-link { color: var(--gold); font-size: 0.8rem; text-decoration: underline; cursor: pointer; margin-top: 10px; display: block; font-weight: bold; }
                .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: var(--overlay); z-index: 3000; justify-content: center; align-items: center; backdrop-filter: blur(5px); }
                .modal-content { background: var(--card-bg); padding: 30px; border-radius: 20px; max-width: 350px; width: 85%; text-align: left; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
                .close-btn { background: var(--gold); color: #000; border: none; padding: 12px; border-radius: 10px; cursor: pointer; width: 100%; margin-top: 15px; font-weight: 900; }
            </style>
            <div class="container">
                <h1>${t.title}</h1>
                <p class="subtitle">${t.subtitle}</p>
                <div class="config-box">
                    <div class="group">
                        <label>${t.lblCountry}</label>
                        <select id="country" class="main-select">
                            ${Object.entries(t.countries).map(([k,v]) => `<option value="${k}">${v}</option>`).join('')}
                        </select>
                    </div>
                    <div class="group">
                        <label>${t.lblWish}</label>
                        <input type="text" id="wishInput" placeholder="ex) 7, 14">
                    </div>
                </div>
                <div id="display" class="display-area">
                    <span style="color: #888;">${t.msg}</span>
                </div>
                <button class="btn-draw" id="draw-btn">${t.btn}</button>
                <span class="help-link" id="help-link">How to use?</span>
            </div>
            <div id="guideModal" class="modal">
                <div class="modal-content">
                    <h2>${t.guideTitle}</h2>
                    <p>${t.guideBody}</p>
                    <button class="close-btn" id="modal-close">${t.guideClose}</button>
                </div>
            </div>
        `;

        this.shadowRoot.getElementById('draw-btn').onclick = () => this.generate();
        this.shadowRoot.getElementById('help-link').onclick = () => this.openModal();
        this.shadowRoot.getElementById('modal-close').onclick = () => this.closeModal();
    }
}
customElements.define('lotto-generator', LottoGenerator);

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
        try {
            const modelURL = this.URL + "model.json";
            const metadataURL = this.URL + "metadata.json";
            this.model = await tmImage.load(modelURL, metadataURL);
        } catch (e) { console.error(e); }
    }

    setupEventListeners() {
        const fileInput = this.shadowRoot.getElementById('file-input');
        const uploadArea = this.shadowRoot.getElementById('upload-area');
        const backBtn = this.shadowRoot.getElementById('back-home-btn');
        uploadArea.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        if (backBtn) backBtn.addEventListener('click', () => window.switchView('home'));
    }

    reset() {
        const preview = this.shadowRoot.getElementById('preview-container');
        const labels = this.shadowRoot.getElementById('label-container');
        const input = this.shadowRoot.getElementById('file-input');
        if (preview) preview.innerHTML = `<span style="font-size: 40px;">📁</span><div style="color: var(--text-color); font-weight: 600; margin-top: 10px;">Select Photo</div>`;
        if (labels) labels.innerHTML = '';
        if (input) input.value = '';
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
        prediction.sort((a, b) => b.probability - a.probability);
        const container = this.shadowRoot.getElementById('label-container');
        container.innerHTML = '';
        const map = { '강아지': '🐶 강아지상', '고양이': '🐱 고양이상', 'dog': '🐶 강아지상', 'cat': '🐱 고양이상', 'class1': '🐶 강아지상', 'class2': '🐱 고양이상' };
        
        prediction.forEach((p, i) => {
            const norm = p.className.toLowerCase().replace(/\s/g, '');
            const name = map[norm] || p.className;
            const prob = (p.probability * 100).toFixed(0);
            const div = document.createElement('div');
            div.className = 'bar-wrapper';
            div.innerHTML = `
                <div class="label-name">${name}</div>
                <div class="bar-container"><div class="bar" style="width: ${prob}%; background: ${i === 0 ? 'var(--gold)' : '#dee2e6'}"></div></div>
                <div class="percentage">${prob}%</div>
            `;
            container.appendChild(div);
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .container { text-align: center; padding: 40px; background: var(--card-bg); border-radius: 24px; box-shadow: 0 15px 35px var(--shadow); max-width: 450px; width: calc(100% - 80px); margin: 0 auto; }
                h2 { color: var(--gold); font-weight: 800; margin-bottom: 20px; }
                #upload-area { border: 3px dashed var(--gold); border-radius: 15px; padding: 40px 20px; cursor: pointer; transition: 0.3s; margin-bottom: 20px; }
                #upload-area:hover { background: rgba(184, 134, 11, 0.05); }
                img { max-width: 100%; border-radius: 10px; }
                #label-container { text-align: left; margin-top: 20px; }
                .bar-wrapper { margin-bottom: 12px; display: flex; align-items: center; gap: 10px; }
                .label-name { width: 90px; font-weight: 800; font-size: 0.85rem; color: var(--gold); }
                .bar-container { flex-grow: 1; height: 10px; background: var(--input-bg); border-radius: 5px; overflow: hidden; }
                .bar { height: 100%; transition: width 0.5s ease; }
                .percentage { width: 35px; text-align: right; font-size: 0.8rem; font-weight: 800; color: var(--text-color); }
                .back-btn { margin-top: 20px; background: none; border: none; color: var(--gold); cursor: pointer; font-weight: 800; text-decoration: underline; font-size: 0.9rem; }
            </style>
            <div class="container">
                <h2>AI Animal Face</h2>
                <div id="upload-area">
                    <div id="preview-container">
                        <span style="font-size: 40px;">📁</span>
                        <div style="color: var(--text-color); font-weight: 800; margin-top: 10px;">Select Photo</div>
                    </div>
                </div>
                <input type="file" id="file-input" style="display: none;" accept="image/*">
                <div id="label-container"></div>
                <button class="back-btn" id="back-home-btn">← Back to Tools</button>
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
                .container { text-align: left; padding: 30px; background: var(--card-bg); border-radius: 24px; box-shadow: 0 15px 35px var(--shadow); max-width: 450px; width: calc(100% - 60px); margin: 0 auto; }
                h2 { color: var(--gold); text-align: center; margin-bottom: 20px; font-weight: 800; }
                .group { margin-bottom: 15px; }
                label { display: block; font-size: 0.85rem; margin-bottom: 5px; font-weight: 800; color: var(--gold); }
                input, textarea { width: 100%; padding: 12px; border-radius: 12px; border: 2px solid transparent; background: var(--input-bg); color: var(--text-color); box-sizing: border-box; }
                button { width: 100%; background: var(--gold); color: #000; border: none; padding: 15px; border-radius: 14px; cursor: pointer; font-weight: 900; margin-top: 10px; }
            </style>
            <div class="container">
                <h2>Contact</h2>
                <form action="https://formspree.io/f/xojnrkwa" method="POST">
                    <div class="group"><label>Name</label><input type="text" name="name" required></div>
                    <div class="group"><label>Email</label><input type="email" name="email" required></div>
                    <div class="group"><label>Message</label><textarea name="message" rows="4" required></textarea></div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        `;
    }
}
customElements.define('contact-form', ContactForm);
