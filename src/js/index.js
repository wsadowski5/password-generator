const range = document.querySelector("#range")
const valueDisplay = document.querySelector("#value-display")

valueDisplay.textContent = range.value

range.addEventListener("input", () => {
    valueDisplay.textContent = range.value;
}
)

const passwordStrengthText = document.querySelector("#password-strength")
const checkboxes = document.querySelectorAll("input[type='checkbox']")
const output = document.querySelector("input[readonly]")
const generateBtn = document.querySelector("button[type='submit']")
const countChecked = () => [...checkboxes].filter(checkbox => checkbox.checked).length
const copyBtn = document.querySelector('#copy-btn');
const tooltip = document.querySelector('#tooltip');

checkboxes.forEach(checkbox =>
    checkbox.addEventListener('change', () => {
        const checkedList = countChecked()
        if (checkedList === 0) {
            checkbox.checked = true
        }
    }
    )
)

generateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const charGroups = {
        lowercase: "abcdefghijklmnopqrstuvwxyz",
        uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        numbers: "0123456789",
        symbols: "!@#$%^&*()_+-=[]{}"
    }
    let selectedGroups = [];
    let password = "";
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const group = charGroups[checkbox.name]
            if (group) {
                selectedGroups.push(group)
                const randomChar = group[Math.floor(Math.random() * group.length)]
                password += randomChar
            }
        }
    });
    const passwordLength = range.value
    while (password.length < passwordLength) {
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const group = charGroups[checkbox.name]
                if (group) {
                    selectedGroups.push(group)
                    const randomChar = group[Math.floor(Math.random() * group.length)]
                    password += randomChar
                }
            }
        });
    }
    password = password
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');
    output.value = password
    const passwordStrength = getPasswordStrength();
    updateStrengthBar(passwordStrength);
})

const getPasswordStrength = () => {
    const checkedCheckboxes = countChecked()
    const getLengthStrength = range => {
        if (range.value < 8) {
            return 1
        }
        else if (range.value < 14) {
            return 2
        }
        else {
            return 3
        }
    }
    const lengthStrength = getLengthStrength(range);
    const totalPasswordStrength = checkedCheckboxes + lengthStrength;
    return totalPasswordStrength
}

const updateStrengthBar = (passwordStrength) => {

    const boxes = document.querySelectorAll('#power-box')

    let activeBoxes = 0

    if (passwordStrength < 3) {
        activeBoxes = 1
        passwordStrengthText.textContent = 'weak';
    }
    else if (passwordStrength < 5) {
        activeBoxes = 2
        passwordStrengthText.textContent = 'medium';
    }
    else if (passwordStrength < 7) {
        activeBoxes = 3
        passwordStrengthText.textContent = 'strong';
    }
    else {
        activeBoxes = 4
        passwordStrengthText.textContent = 'very strong';
    }

    boxes.forEach(box => {
        box.classList.remove('bg-red-500', 'bg-orange-500', 'bg-green-500');
    });

    let color = 'bg-red-500';
    if (passwordStrength >= 5) color = 'bg-orange-500';
    if (passwordStrength >= 7) color = 'bg-green-500';

    boxes.forEach((box, index) => {
        if (index < activeBoxes) {
            box.classList.add(color);
        }
    });
};

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(output.value).then(() => {
      tooltip.classList.remove('opacity-0');
      tooltip.classList.add('opacity-100');
  
      setTimeout(() => {
        tooltip.classList.remove('opacity-100');
        tooltip.classList.add('opacity-0');
      }, 1000);
    });
  });


