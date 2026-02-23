const btn = document.getElementById("btn");
const content = document.getElementById("content");

// Speak function
function speak(text) {


    window.speechSynthesis.cancel();

    const text_speak = new SpeechSynthesisUtterance(text);

    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;
    text_speak.lang = "en-US";

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

// IMPORTANT FIX: Wait for user interaction before speech
document.addEventListener("click", () => {
    speechSynthesis.resume();
});

// Load event
window.addEventListener('load', () => {

    setTimeout(() => {
        wishMe();
    }, 500);

});

// Speech Recognition Fix
const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {

    alert("Speech Recognition not supported. Please use Google Chrome.");

} else {

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    btn.addEventListener("click", () => {

        try {
            recognition.start();
            content.innerText = "Listening...";
        }
        catch (error) {
            console.log("Recognition already running");
        }

    });

    recognition.onresult = (event) => {

        const transcript = event.results[0][0].transcript;

        content.innerText = transcript;

        takeCommand(transcript.toLowerCase());

    };

    recognition.onerror = (event) => {

        console.error(event.error);
        speak("Sorry, I could not hear you.");

    };

    recognition.onend = () => {

        content.innerText = "Click here to speak";

    };
}

// Commands
function takeCommand(message) {

    if (message.includes("hello")) {

        speak("Hello, how can I help you?");

    }

    else if (message.includes("hey aura")) {

        speak("Hi there, how can I help you?");

    }

    else if (message.includes("how are you")) {

        speak("I am working fine, thank you");

    }

    else if (message.includes("who created you") || message.includes("who made you")) {

        speak("I was created by Hibha, a talented developer");

    }

    else if (message.includes("your name")) {

        speak("My name is Aura, Artificial Unified Responsive Assistant.");

    }

    else if (message.includes("what can you do") || message.includes("who are you")) {

        speak("I am Aura, Artificial Unified Responsive Assistant. I can listen to your voice commands, open websites, tell time and date, search the internet, and assist you with everyday tasks. I am designed to help you efficiently.");

    }

    else if (message.includes("open youtube")) {

        speak("Opening YouTube");
        window.open("https://youtube.com", "_blank");

    }

    else if (message.includes("open google")) {

        speak("Opening Google");
        window.open("https://google.com", "_blank");

    }

    else if (message.includes("time")) {

        let time = new Date().toLocaleTimeString();
        speak("The time is " + time);

    }

    else if (message.includes("date")) {

        let date = new Date().toLocaleDateString();
        speak("Today's date is " + date);

    }

    else {

        speak("Searching Google");
        window.open(
            "https://www.google.com/search?q=" + message,
            "_blank"
        );
    }
}