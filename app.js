const btn = document.getElementById("btn");
const content = document.getElementById("content");

// Speak function
function speak(text) {

    const text_speak = new SpeechSynthesisUtterance(text);

    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;

    window.speechSynthesis.speak(text_speak);
}

// Wish function
function wishMe() {

    const hour = new Date().getHours();

    if (hour < 12) {
        speak("Good Morning. I am Aura. How can I help you?");
    }

    else if (hour < 17) {
        speak("Good Afternoon. I am Aura. How can I help you?");
    }

    else {
        speak("Good Evening. I am Aura. How can I help you?");
    }
}

window.addEventListener('load', () => {

    speechSynthesis.cancel();
    wishMe();

});

// Speech Recognition Fix
const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {

    alert("Speech Recognition not supported. Use Google Chrome.");

} else {

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    btn.addEventListener("click", () => {

        recognition.start();

        content.innerText = "Listening...";

    });

    recognition.onresult = (event) => {

        const transcript = event.results[0][0].transcript;

        content.innerText = transcript;

        takeCommand(transcript.toLowerCase());

    };
}

// Commands
function takeCommand(message) {

    if (message.includes("hello")) {

        speak("Hello, how can I help you?");

    }

    else if (message.includes("open youtube")) {

        speak("Opening YouTube");
        window.open("https://youtube.com");

    }

    else if (message.includes("open google")) {

        speak("Opening Google");
        window.open("https://google.com");

    }

    else if (message.includes("time")) {

        let time = new Date().toLocaleTimeString();
        speak("The time is " + time);

    }

    else {

        speak("Searching Google");
        window.open(
            "https://www.google.com/search?q=" + message
        );
    }
}