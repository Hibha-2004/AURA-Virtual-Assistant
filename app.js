// AURA - Artificial Unified Responsive Assistant

const btn = document.querySelector('#btn');
const content = document.querySelector('#content');

// Speak function
function speak(text) {

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang === "en-US");

    if (voice) utterance.voice = voice;

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
}

// Wish user
function wishMe() {

    let hour = new Date().getHours();

    if (hour < 12) {
        speak("Good morning. I am AURA. How can I assist you?");
    }
    else if (hour < 17) {
        speak("Good afternoon. I am AURA. How can I assist you?");
    }
    else {
        speak("Good evening. I am AURA. How can I assist you?");
    }
}

// Speech Recognition setup
const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {

    alert("Please use Google Chrome for full functionality");

}
else {

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    btn.addEventListener("click", () => {

        recognition.start();
        btn.innerText = "Listening...";

    });

    recognition.onresult = (event) => {

        let transcript = event.results[0][0].transcript.toLowerCase();

        content.innerText = transcript;

        takeCommand(transcript);

    };

    recognition.onend = () => {
        btn.innerText = "Click to Speak";
    };
}

// Command handler
function takeCommand(message) {

    // Greetings
    if (message.includes("hello") || message.includes("hi")) {

        speak("Hello. How can I help you?");

    }

    else if (message.includes("how are you")) {

        speak("I am functioning perfectly. Thank you for asking.");

    }

    else if (message.includes("who are you")) {

        speak("I am AURA. Your Artificial Unified Responsive Assistant.");

    }

    else if (message.includes("who created you")) {

        speak("I was created by Hibha.");

    }

    else if (message.includes("what can you do")) {

        speak("I can open websites, tell time, answer questions, and assist you with tasks.");

    }

    // Open websites
    else if (message.includes("open youtube")) {

        speak("Opening YouTube");
        window.open("https://youtube.com", "_blank");

    }

    else if (message.includes("open google")) {

        speak("Opening Google");
        window.open("https://google.com", "_blank");

    }

    else if (message.includes("open gmail")) {

        speak("Opening Gmail");
        window.open("https://mail.google.com", "_blank");

    }

    else if (message.includes("open whatsapp")) {

        speak("Opening WhatsApp");
        window.open("https://web.whatsapp.com", "_blank");

    }

    // Open calculator (web fallback)
    else if (message.includes("open calculator")) {

        speak("Opening calculator");

        window.open("https://www.google.com/search?q=calculator", "_blank");

    }

    // Open notepad (web fallback)
    else if (message.includes("open notepad")) {

        speak("Opening notepad");

        window.open("https://anotepad.com", "_blank");

    }

    // Time
    else if (message.includes("time")) {

        let time = new Date().toLocaleTimeString();

        speak("The time is " + time);

    }

    // Date
    else if (message.includes("date")) {

        let date = new Date().toLocaleDateString();

        speak("Today's date is " + date);

    }

    // Default search
    else {

        speak("Searching Google");

        window.open(
            `https://www.google.com/search?q=${message}`,
            "_blank"
        );

    }
}

// Fix speech issue
document.addEventListener("click", () => {
    speechSynthesis.resume();
});

// Start assistant
window.onload = () => {
    wishMe();
};