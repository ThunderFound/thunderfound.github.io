document.getElementById('generate').addEventListener('click', function() {
    const textLengthInput = document.getElementById('text_length');
    const textarea = document.getElementById('textarea');
    
    const textLength = parseInt(textLengthInput.value);

    const characters = 'йцукенгшщзхъфывапролджэячсмитьбю    ,..,.,.()1234567890%}{:>';

    let generatedText = '';
    for (let i = 0; i < textLength; i++) {
        generatedText += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    textarea.value = generatedText;
});



const randomHeading = document.getElementById('random_heading');

function generateRandomString(length) {
    const characters = 'йцукенгшщзхъфывапролджэячсмитьбю    ,..,.,.()1234567890%}{:>';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const textLength = 19;

const randomText = generateRandomString(textLength);

randomHeading.textContent = randomText;

setInterval(function() {
    const randomText = generateRandomString(textLength);
    randomHeading.textContent = randomText;
}, 500);