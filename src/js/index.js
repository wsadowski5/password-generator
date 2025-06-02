const range = document.querySelector("#range")
const valueDisplay = document.querySelector("#value-display")
const passwordStrengthText = document.querySelector("#password-strength")
const passwordStrengthBoxes = document.querySelectorAll('#power-box')
// transform nodelist into array //
const checkboxes = [...document.querySelectorAll("input[type='checkbox']")];
const output = document.querySelector("input[readonly]")
const generateBtn = document.querySelector("button[type='submit']")
const copyBtn = document.querySelector('#copy-btn');
const tooltip = document.querySelector('#tooltip');


// characters groups //

const charGroups = {
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}"
}


// display password length //

valueDisplay.textContent = range.value
range.addEventListener("input", () => {
    valueDisplay.textContent = range.value;
});


// check how much checkboxes are checked and keep at least one selected //

const countChecked = () => checkboxes.filter(checkbox => checkbox.checked).length
checkboxes.forEach(checkbox =>
    checkbox.addEventListener('change', () => {
        const checkedList = countChecked()
        if (checkedList === 0) {
            checkbox.checked = true
        }
    }
    )
)


// function that returns selected characters groups (checkboxes) //

const getSelectedCharGroups = () => {
    return checkboxes.filter(checkbox => checkbox.checked).map(checkbox => charGroups[checkbox.name]).join('');

}

// generate initial password - meets the checkboxes conditions //

const generateInitialPassword = () => {
    return checkboxes
        .filter(checkbox => checkbox.checked)
        .map(checkbox => {
            const group = charGroups[checkbox.name]
            return group[Math.floor(Math.random() * group.length)]
        })
        .join('')
}

// generate full password - meets the password length condition //

const generateFullPassword = (currentLength, targetLength, selectedChars) => {
    let result = "";
    while (currentLength + result.length < targetLength) {
        result += selectedChars[Math.floor(Math.random() * selectedChars.length)]
    }
    return result
}

// shuffle characters in password //

const shuffle = (fullPassword) => {
    return fullPassword.split('').sort(() => Math.random() - 0.5).join('')
}



// this function checks the password strength //

const getPasswordStrength = () => {
    const checkedCheckboxes = countChecked();
    const lengthValue = range.value;

    let lengthScore = 1;
    if (lengthValue >= 14) {
        lengthScore = 3;
    } else if (lengthValue >= 8) {
        lengthScore = 2;
    }

    return checkedCheckboxes + lengthScore;
}


// function that 'paints' strength bar //

const updateStrengthBar = (passwordStrength) => {
    let activeBoxes = 0
    let color = 'bg-red-500';
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
    passwordStrengthBoxes.forEach(box => {
        box.classList.remove('bg-red-500', 'bg-orange-500', 'bg-green-500');
    });
    if (passwordStrength >= 5) color = 'bg-orange-500';
    if (passwordStrength >= 7) color = 'bg-green-500';
    passwordStrengthBoxes.forEach((box, index) => {
        if (index < activeBoxes) {
            box.classList.add(color);
        }
    });
};

// display tooltip //

const showTooltip = message => {
    tooltip.textContent = message;
    tooltip.classList.remove('opacity-0');
    tooltip.classList.add('opacity-100');

    setTimeout(() => {
        tooltip.classList.remove('opacity-100');
        tooltip.classList.add('opacity-0');
    }, 1000);
}

// copy button functionality //

copyBtn.addEventListener('click', () => {
    if (!output.value) {
        showTooltip("No password to copy");
        return;
    }
    navigator.clipboard.writeText(output.value).then(() => {
        showTooltip("Copied!");
    });
});

// button with password generation fuction //

generateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const selectedChars = getSelectedCharGroups();
    const initialPassword = generateInitialPassword()
    const currentLength = initialPassword.length
    const targetLength = range.value
    const fullPassword = initialPassword + generateFullPassword(currentLength, targetLength, selectedChars);
    const password = shuffle(fullPassword)
    const passwordStrength = getPasswordStrength();
    output.value = password
    updateStrengthBar(passwordStrength);
})
