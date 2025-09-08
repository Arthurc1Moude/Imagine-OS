// Calculator App - ImagineOS Aismira
class CalculatorApp {
    constructor() {
        this.display = '0';
        this.previousValue = null;
        this.operator = null;
        this.waitingForOperand = false;
    }

    getContent() {
        return `
            <div style="height: 100%; display: flex; flex-direction: column; padding: 20px;">
                <div style="background: var(--secondary-glass); border: 1px solid var(--border-glass); border-radius: 16px; padding: 20px; margin-bottom: 20px; text-align: right; font-size: 28px; font-weight: 600; color: var(--text-primary); min-height: 60px; display: flex; align-items: center; justify-content: flex-end; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">
                    <span id="calc-display">${this.display}</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; flex: 1;">
                    <button class="calc-btn calc-function" onclick="calcApp.input('C')">C</button>
                    <button class="calc-btn calc-function" onclick="calcApp.input('±')">±</button>
                    <button class="calc-btn calc-function" onclick="calcApp.input('%')">%</button>
                    <button class="calc-btn calc-operator" onclick="calcApp.input('÷')">÷</button>
                    <button class="calc-btn calc-number" onclick="calcApp.input('7')">7</button>
                    <button class="calc-btn calc-number" onclick="calcApp.input('8')">8</button>
                    <button class="calc-btn calc-number" onclick="calcApp.input('9')">9</button>
                    <button class="calc-btn calc-operator" onclick="calcApp.input('×')">×</button>
                    <button class="calc-btn calc-number" onclick="calcApp.input('4')">4</button>
                    <button class="calc-btn calc-number" onclick="calcApp.input('5')">5</button>
                    <button class="calc-btn calc-number" onclick="calcApp.input('6')">6</button>
                    <button class="calc-btn calc-operator" onclick="calcApp.input('-')">-</button>
                    <button class="calc-btn calc-number" onclick="calcApp.input('1')">1</button>
                    <button class="calc-btn calc-number" onclick="calcApp.input('2')">2</button>
                    <button class="calc-btn calc-number" onclick="calcApp.input('3')">3</button>
                    <button class="calc-btn calc-operator" onclick="calcApp.input('+')">+</button>
                    <button class="calc-btn calc-number" style="grid-column: span 2;" onclick="calcApp.input('0')">0</button>
                    <button class="calc-btn calc-number" onclick="calcApp.input('.')">.</button>
                    <button class="calc-btn calc-equals" onclick="calcApp.input('=')">=</button>
                </div>
            </div>
        `;
    }

    input(value) {
        const displayElement = document.getElementById('calc-display');
        
        switch (value) {
            case 'C':
                this.clear();
                break;
            case '±':
                this.toggleSign();
                break;
            case '%':
                this.percentage();
                break;
            case '÷':
            case '×':
            case '-':
            case '+':
                this.setOperator(value);
                break;
            case '=':
                this.calculate();
                break;
            case '.':
                this.inputDecimal();
                break;
            default:
                this.inputNumber(value);
                break;
        }
        
        this.updateDisplay();
    }

    clear() {
        this.display = '0';
        this.previousValue = null;
        this.operator = null;
        this.waitingForOperand = false;
    }

    toggleSign() {
        if (this.display !== '0') {
            this.display = this.display.charAt(0) === '-' ? 
                this.display.slice(1) : '-' + this.display;
        }
    }

    percentage() {
        this.display = (parseFloat(this.display) / 100).toString();
    }

    inputNumber(num) {
        if (this.waitingForOperand) {
            this.display = num;
            this.waitingForOperand = false;
        } else {
            this.display = this.display === '0' ? num : this.display + num;
        }
    }

    inputDecimal() {
        if (this.waitingForOperand) {
            this.display = '0.';
            this.waitingForOperand = false;
        } else if (this.display.indexOf('.') === -1) {
            this.display += '.';
        }
    }

    setOperator(nextOperator) {
        const inputValue = parseFloat(this.display);

        if (this.previousValue === null) {
            this.previousValue = inputValue;
        } else if (this.operator) {
            const currentValue = this.previousValue || 0;
            const newValue = this.performCalculation(currentValue, inputValue, this.operator);

            this.display = String(newValue);
            this.previousValue = newValue;
        }

        this.waitingForOperand = true;
        this.operator = nextOperator;
    }

    calculate() {
        const inputValue = parseFloat(this.display);

        if (this.previousValue !== null && this.operator) {
            const newValue = this.performCalculation(this.previousValue, inputValue, this.operator);
            this.display = String(newValue);
            this.previousValue = null;
            this.operator = null;
            this.waitingForOperand = true;
        }
    }

    performCalculation(firstValue, secondValue, operator) {
        switch (operator) {
            case '+':
                return firstValue + secondValue;
            case '-':
                return firstValue - secondValue;
            case '×':
                return firstValue * secondValue;
            case '÷':
                return secondValue !== 0 ? firstValue / secondValue : 0;
            default:
                return secondValue;
        }
    }

    updateDisplay() {
        const displayElement = document.getElementById('calc-display');
        if (displayElement) {
            // 格式化显示数字
            let displayValue = this.display;
            if (displayValue.length > 12) {
                displayValue = parseFloat(displayValue).toExponential(6);
            }
            displayElement.textContent = displayValue;
        }
    }
}

// 全局实例
let calcApp = new CalculatorApp();
