// Находим кнопку по id и добавляем обработчик события при клике
document.getElementById('generate').addEventListener('click', function() {
    // Находим input и textarea по id
    const textLengthInput = document.getElementById('text_length');
    const textarea = document.getElementById('textarea');
    
    // Получаем значение длины текста из input и преобразуем его в число
    const textLength = parseInt(textLengthInput.value);

    // Строка символов, из которых будем генерировать текст
    const characters = 'йцукенгшщзхъфывапролджэячсмитьбю    ,..,.,.()1234567890😭😰🥵🤪😱🤑💀';

    // Генерируем случайный текст заданной длины
    let generatedText = '';
    for (let i = 0; i < textLength; i++) {
        generatedText += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Устанавливаем сгенерированный текст в textarea
    textarea.value = generatedText;
});
