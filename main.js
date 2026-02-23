const numbersContainer = document.getElementById('numbers-container');
const generateButton = document.getElementById('generate-button');

function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers);
}

function displayNumbers(numbers) {
    numbersContainer.innerHTML = '';
    for (const number of numbers) {
        const circle = document.createElement('div');
        circle.classList.add('number-circle');
        circle.textContent = number;
        numbersContainer.appendChild(circle);
    }
}

function generateAndDisplayNumbers() {
    const lottoNumbers = generateLottoNumbers();
    displayNumbers(lottoNumbers);
}

generateButton.addEventListener('click', generateAndDisplayNumbers);

// Initial generation
generateAndDisplayNumbers();
