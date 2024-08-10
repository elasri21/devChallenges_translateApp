// Select Elements
const textBox = document.querySelector(".input-container textarea");
const outputBox = document.querySelector(".output-container textarea");
const maxChars = document.querySelector(".length span");
const translateButton = document.querySelector(".translate-btn");
const switcher = document.querySelector(".switcher");

// track characters
function trackChars() {
    let textBoxLength = textBox.value.trim().length;
    maxChars.textContent = textBoxLength;
}

// get language to translate from
let fromLang = "en";
const btns = document.querySelectorAll(".input-container .head button");
const selectBox = document.querySelector(".input-container select");
btns.forEach(btn => {
    btn.addEventListener("click", function() {
        for (let i = 0;i < btns.length; i++) {
            btns[i].classList.remove("active");
        }
        fromLang = this.dataset.lang ? this.dataset.lang : 'en';
        this.classList.add("active");
        selectBox.classList.remove("active");
    });
});
selectBox.addEventListener("input", function() {
    for (let i = 0;i < btns.length; i++) {
        btns[i].classList.remove("active");
        if (btns[i].dataset.lang == selectBox.value.trim()) {
            btns[i].classList.add("active");
        }
    }
    selectBox.classList.add("active");
    fromLang = selectBox.value.trim() ? selectBox.value.trim() : 'en';
});

// get language to translate to
let to = "fr";
const outputBtns = document.querySelectorAll(".output-container .head button");
const selectBoxOutput = document.querySelector(".output-container select");
outputBtns.forEach(btn => {
    btn.addEventListener("click", function() {
        for (let i = 0;i < outputBtns.length; i++) {
            outputBtns[i].classList.remove("active");
        }
        to = this.dataset.lang ? this.dataset.lang: 'fr';
        this.classList.add("active");
        selectBoxOutput.classList.remove("active");
    });
});
selectBoxOutput.addEventListener("input", function() {
    for (let i = 0;i < outputBtns.length; i++) {
        outputBtns[i].classList.remove("active");
        if (outputBtns[i].dataset.lang == selectBoxOutput.value.trim()) {
            outputBtns[i].classList.add("active");
        }
    }
    selectBoxOutput.classList.add("active");
    to = selectBoxOutput.value.trim() ? selectBoxOutput.value.trim() : 'fr';
});

// translate text
function translateText() {
    // const to = prompt("translate to: ");
    const textToTranslate = textBox.value.trim();
    if (textToTranslate) {
        fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=${fromLang}|${to}`)
            .then(response => response.json())
            .then(data => {
                const translation = data.responseData.translatedText;
                outputBox.value = translation;
            })
            .catch(error => {
                console.error('Error:', error);
                outputBox.value = 'Translation failed.';
            });
    } else {
        outputBox.value = 'Please enter text to translate.';
    }
}

textBox.addEventListener("keyup", function() {
    trackChars();
});
translateButton.addEventListener("click", function() {
    translateText();
});

// switcher language
function switcherLang() {
    let temp = textBox.value.trim();
    textBox.value = outputBox.value.trim();
    outputBox.value = temp;

    [fromLang, to] = [to, fromLang];
}

switcher.addEventListener("click", function() {
    switcherLang()
});

/// read text
function readOutLoud(content, language) {
    let voices = speechSynthesis.getVoices();
    let correctVoices = voices.find(voice => voice.lang.startsWith(language));
    const textToRead = content.value.trim();
    const utterance = new SpeechSynthesisUtterance(textToRead);

    // Optionally, set properties like voice, rate, and pitch
    // utterance.voice = speechSynthesis.getVoices().find(voice => voice.lang.startsWith(language));
    // utterance.rate = 1;
    // utterance.pitch = 1;
    if (correctVoices) {
        utterance.voice = correctVoices;
    }
    speechSynthesis.speak(utterance);
}

// copy text
function copyText(content) {
    const textToCopy = content.value.trim();
    navigator.clipboard.writeText(textToCopy).then(() => {
        // setTimeout(function () {
        //     this.innerHTML = `<i class="fa-solid fa-check"></i>`;
        // }, 1000);
        console.log("copied");
    }).catch(err => {
        console.log(`Failed to copy: ${err}`);
    })
}

const readerInput = document.querySelector(".input-container .sound");
const readerOutput = document.querySelector(".output-container .sound");
const copyInput = document.querySelector(".input-container .copy");
const copyOutput = document.querySelector(".output-container .copy");

readerInput.addEventListener("click", function() {
    readOutLoud(textBox, fromLang);
});
readerOutput.addEventListener("click", function() {
    readOutLoud(outputBox, to);
});

copyInput.addEventListener("click", function() {
    copyText(textBox);
    this.innerHTML = `<i class="fa-solid fa-check"></i>`;
    setTimeout(function () {
        copyInput.innerHTML = `<img src="./assets/Copy.svg">`;
    }, 1000);
});
copyOutput.addEventListener("click", function() {
    copyText(outputBox);
    this.innerHTML = `<i class="fa-solid fa-check"></i>`;
    setTimeout(function () {
        copyOutput.innerHTML = `<img src="./assets/Copy.svg">`
    }, 1000);
});
