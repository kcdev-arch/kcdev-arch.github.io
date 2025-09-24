// Navigační funkce
function openDifficulty(operation) {
    window.location.href = `difficulty.html?operation=${operation}`;
}

function openPractice(operation, difficulty) {
    window.location.href = `practice.html?operation=${operation}&difficulty=${difficulty}`;
}

// Funkce pro generování obsahu
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const operation = params.get('operation');

    if (window.location.pathname.endsWith('difficulty.html')) {
        generateDifficultyCards(operation);
    } else if (window.location.pathname.endsWith('practice.html')) {
        setupPracticePage(operation, params.get('difficulty'));
    }
});

function getOperationName(operation) {
    switch (operation) {
        case 'addition': return 'Sčítání';
        case 'subtraction': return 'Odčítání';
        case 'multiplication': return 'Násobení';
        case 'division': return 'Dělení';
        case 'power': return 'Mocniny na druhou';
        case 'power3': return 'Mocniny na třetí';
        case 'root': return 'Odmocniny na druhou';
        case 'root3': return 'Odmocniny na třetí';
        case 'fractions': return 'Zlomky';
        case 'decimals': return 'Desetinná čísla';
        default: return 'Matematika';
    }
}

function formatDifficultyName(difficulty) {
    const names = {
        '1': '1 Místo',
        '2': '2 Místa',
        '3': '3 Místa',
        '4': '4 Místa',
        '5': '5 Míst',
        '6': '6 Míst',
        '7': '7 Míst',
        '8': '8 Míst',
        '9': '9 Míst',
        '5-5': '5 - 5 Místa',
        '6-5': '6 - 5 Míst',
        '6-6': '6 - 6 Míst',
        '7-6': '7 - 6 Míst',
        '7-7': '7 - 7 Míst',
        '8-7': '8 - 7 Míst',
        '8-8': '8 - 8 Míst',
        '9-8': '9 - 8 Míst',
        '9-9': '9 - 9 Míst',
        '1-5': '1-5',
        '6-10': '6-10',
        '11-15': '11-15',
        '16-20': '16-20',
        '21-25': '21-25',
        '26-30': '26-30',
        '1-10': '1-10',
        '1-20': '1-20',
        '1-30': '1-30',
        '1-100': '1-100',
        '1-400': '1-400',
        '1-900': '1-900',
        '1-1600': '1-1600',
        '1-1000': '1-1000',
        '1-8000': '1-8000',
        '1-27000': '1-27000',
        '1-64000': '1-64000'
    };
    return names[difficulty] || difficulty;
}

function generateDifficultyCards(operation) {
    const difficultyGrid = document.getElementById('difficulty-grid');
    const heading = document.getElementById('difficulty-heading');
    heading.textContent = `Vyberte obtížnost pro ${getOperationName(operation)}`;

    const powerDifficulties = ['1-5', '6-10', '11-15', '16-20', '21-25', '26-30', '1-10', '1-20', '1-30'];
    const rootDifficulties = ['1-100', '1-400', '1-900', '1-1600'];
    const root3Difficulties = ['1-1000', '1-8000', '1-27000', '1-64000'];

    const difficulties = {
        'addition': ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        'subtraction': ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        'multiplication': ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        'division': ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        'power': powerDifficulties,
        'power3': powerDifficulties,
        'root': rootDifficulties,
        'root3': root3Difficulties,
    };

    if (operation === 'fractions' || operation === 'decimals') {
        const subOperations = ['addition', 'subtraction', 'multiplication', 'division'];
        const numDifficulties = ['1', '2', '2-1', '2-2', '3-2', '3-3'];

        subOperations.forEach(subOp => {
            const opHeading = document.createElement('h3');
            opHeading.textContent = getOperationName(subOp);
            opHeading.style.marginTop = '20px';
            difficultyGrid.appendChild(opHeading);

            const opGrid = document.createElement('div');
            opGrid.className = 'grid';
            numDifficulties.forEach(numDiff => {
                const card = document.createElement('div');
                card.className = 'card math-card';
                card.onclick = () => openPractice(operation, `${subOp}-${numDiff}`);
                const p = document.createElement('p');
                p.textContent = formatDifficultyName(numDiff);
                card.appendChild(p);
                opGrid.appendChild(card);
            });
            difficultyGrid.appendChild(opGrid);
        });
    } else if (difficulties[operation]) {
        difficulties[operation].forEach(difficulty => {
            const card = document.createElement('div');
            card.className = 'card math-card';
            card.onclick = () => openPractice(operation, difficulty);
            const p = document.createElement('p');
            p.textContent = formatDifficultyName(difficulty);
            card.appendChild(p);
            difficultyGrid.appendChild(card);
        });
    }
}

let correctAnswer;

function getOperatorSymbol(op) {
    switch(op) {
        case 'addition': return '+';
        case 'subtraction': return '-';
        case 'multiplication': return '×';
        case 'division': return '÷';
        default: return '';
    }
}

function generateNumber(digits) {
    if (digits === 1) {
        return Math.floor(Math.random() * 9) + 1; // 1-9
    }
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDecimal(digits) {
    const intPart = generateNumber(digits);
    let decPart = Math.random().toFixed(digits);
    return parseFloat(`${intPart}${decPart.substring(1)}`);
}

function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

function simplifyFraction(numerator, denominator) {
    const commonDivisor = gcd(Math.abs(numerator), Math.abs(denominator));
    return {
        numerator: numerator / commonDivisor,
        denominator: denominator / commonDivisor
    };
}

function setupPracticePage(operation, difficulty) {
    const heading = document.getElementById('practice-heading');
    const mathProblem = document.getElementById('math-problem');
    const checkBtn = document.getElementById('check-btn');
    const nextBtn = document.getElementById('next-problem-btn');
    const resultMessage = document.getElementById('result-message');
    const userAnswer = document.getElementById('user-answer');

    heading.textContent = `${getOperationName(operation)} - ${formatDifficultyName(difficulty)}`;

    function generateProblem() {
        resultMessage.textContent = '';
        userAnswer.value = '';
        userAnswer.style.borderColor = '#ced4da';
        userAnswer.disabled = false;
        checkBtn.style.display = 'block';
        nextBtn.style.display = 'none';

        let num1, num2;
        let mainOp = operation;
        let subDiff = difficulty;

        if (operation === 'fractions' || operation === 'decimals') {
            [mainOp, subDiff] = difficulty.split('-');
            const [digits1, digits2] = subDiff.split('-').map(Number);

            if (operation === 'fractions') {
                num1 = generateNumber(digits1);
                num2 = generateNumber(1);
                let num3 = generateNumber(digits2);
                let num4 = generateNumber(1);
                if (num2 === 0) num2 = 1;
                if (num4 === 0) num4 = 1;

                let resultN, resultD;
                let problemText;
                userAnswer.type = 'text';
                userAnswer.placeholder = 'napr. 1/2';

                switch (mainOp) {
                    case 'addition':
                        resultN = num1 * num4 + num3 * num2;
                        resultD = num2 * num4;
                        problemText = `${num1}/${num2} + ${num3}/${num4} = ?`;
                        break;
                    case 'subtraction':
                        resultN = num1 * num4 - num3 * num2;
                        resultD = num2 * num4;
                        problemText = `${num1}/${num2} - ${num3}/${num4} = ?`;
                        break;
                    case 'multiplication':
                        resultN = num1 * num3;
                        resultD = num2 * num4;
                        problemText = `${num1}/${num2} × ${num3}/${num4} = ?`;
                        break;
                    case 'division':
                        resultN = num1 * num4;
                        resultD = num2 * num3;
                        problemText = `${num1}/${num2} ÷ ${num3}/${num4} = ?`;
                        break;
                }
                const simplified = simplifyFraction(resultN, resultD);
                correctAnswer = `${simplified.numerator}/${simplified.denominator}`;
                mathProblem.textContent = problemText;

            } else if (operation === 'decimals') {
                num1 = generateDecimal(digits1);
                num2 = generateDecimal(digits2);
                userAnswer.type = 'number';
                userAnswer.placeholder = 'Zadejte výsledek';

                switch (mainOp) {
                    case 'addition':
                        correctAnswer = num1 + num2;
                        mathProblem.textContent = `${num1} + ${num2} = ?`;
                        break;
                    case 'subtraction':
                        if (num1 < num2) [num1, num2] = [num2, num1];
                        correctAnswer = num1 - num2;
                    mathProblem.textContent = `${num1} - ${num2} = ?`;
                    break;
                    case 'multiplication':
                        correctAnswer = num1 * num2;
                        mathProblem.textContent = `${num1} × ${num2} = ?`;
                        break;
                    case 'division':
                        if (num2 === 0) num2 = 0.1;
                        correctAnswer = num1 / num2;
                    mathProblem.textContent = `${num1} ÷ ${num2} = ?`;
                    break;
                }
            }
        } else {
            // Logika pro základní operace, mocniny a odmocniny
            if (difficulty.includes('-')) {
                const [digits1, digits2] = difficulty.split('-').map(Number);
                num1 = generateNumber(digits1);
                num2 = generateNumber(digits2);
            } else {
                const digits = Number(difficulty);
                num1 = generateNumber(digits);
                num2 = generateNumber(digits);
            }

            switch (operation) {
                case 'addition':
                    correctAnswer = num1 + num2;
                    mathProblem.textContent = `${num1} + ${num2} = ?`;
                    break;
                case 'subtraction':
                    if (num1 < num2) [num1, num2] = [num2, num1];
                    correctAnswer = num1 - num2;
                mathProblem.textContent = `${num1} - ${num2} = ?`;
                break;
                case 'multiplication':
                    correctAnswer = num1 * num2;
                    mathProblem.textContent = `${num1} × ${num2} = ?`;
                    break;
                case 'division':
                    if (num2 === 0) num2 = 1;
                    let product = num1 * num2;
                correctAnswer = num1;
                mathProblem.textContent = `${product} ÷ ${num2} = ?`;
                break;
                case 'power':
                case 'power3':
                    let powerBase, powerExponent = operation === 'power' ? 2 : 3;
                    const ranges = difficulty.split('-').map(Number);
                    if (ranges.length === 2) {
                        const [min, max] = ranges;
                        powerBase = Math.floor(Math.random() * (max - min + 1)) + min;
                    } else {
                        powerBase = Math.floor(Math.random() * Number(difficulty)) + 1;
                    }
                    correctAnswer = Math.pow(powerBase, powerExponent);
                    mathProblem.textContent = `${powerBase}${powerExponent === 2 ? '²' : '³'} = ?`;
                    break;
                case 'root':
                case 'root3':
                    const [minRange, maxRange] = difficulty.split('-').map(Number);
                    let rootNumber;
                    if (operation === 'root') {
                        rootNumber = Math.floor(Math.random() * (Math.sqrt(maxRange) - Math.sqrt(minRange) + 1)) + Math.sqrt(minRange);
                        correctAnswer = rootNumber;
                        mathProblem.textContent = `√${rootNumber * rootNumber} = ?`;
                    } else {
                        rootNumber = Math.floor(Math.random() * (Math.cbrt(maxRange) - Math.cbrt(minRange) + 1)) + Math.cbrt(minRange);
                        correctAnswer = rootNumber;
                        mathProblem.textContent = `∛${rootNumber * rootNumber * rootNumber} = ?`;
                    }
                    break;
            }
        }
    }

    function checkAnswer() {
        let userEnteredAnswer;
        if (operation === 'fractions') {
            const userParts = userAnswer.value.split('/').map(part => parseInt(part.trim()));
            if (userParts.length === 2 && !isNaN(userParts[0]) && !isNaN(userParts[1])) {
                const simplified = simplifyFraction(userParts[0], userParts[1]);
                userEnteredAnswer = `${simplified.numerator}/${simplified.denominator}`;
            } else {
                userEnteredAnswer = null;
            }
        } else {
            userEnteredAnswer = parseFloat(userAnswer.value);
        }

        if (operation === 'fractions') {
            if (userEnteredAnswer === correctAnswer) {
                resultMessage.textContent = 'Správně';
                resultMessage.style.color = '#28a745';
                userAnswer.style.borderColor = '#28a745';
            } else {
                resultMessage.textContent = `Špatně. Správná odpověď je ${correctAnswer}`;
                resultMessage.style.color = '#dc3545';
                userAnswer.style.borderColor = '#dc3545';
            }
        } else {
            if (isNaN(userEnteredAnswer)) {
                resultMessage.textContent = 'Zadejte prosím číslo.';
                resultMessage.style.color = '#dc3545';
                return;
            }
            if (Math.abs(userEnteredAnswer - correctAnswer) < 0.001) {
                resultMessage.textContent = 'Správně';
                resultMessage.style.color = '#28a745';
                userAnswer.style.borderColor = '#28a745';
            } else {
                resultMessage.textContent = `Špatně. Správná odpověď je ${correctAnswer}`;
                resultMessage.style.color = '#dc3545';
                userAnswer.style.borderColor = '#dc3545';
            }
        }
        userAnswer.disabled = true;
        checkBtn.style.display = 'none';
        nextBtn.style.display = 'block';
    }

    checkBtn.addEventListener('click', checkAnswer);
    nextBtn.addEventListener('click', generateProblem);

    generateProblem();
}
