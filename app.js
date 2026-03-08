const btn = document.getElementById("btn");
const content = document.getElementById("content");

let wishSpoken = false;
let micPermissionGranted = false;

// ✅ FIX 2: Speak function with Android keep-alive fix
function speak(text) {
    window.speechSynthesis.cancel();

    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;
    text_speak.lang = "en-US";

    // ✅ FIX: Android Chrome cuts off speech after ~15 seconds — this prevents it
    const keepAlive = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
            clearInterval(keepAlive);
        } else {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
        }
    }, 10000);

    window.speechSynthesis.speak(text_speak);
}

// Wish function
function wishMe() {
    const hour = new Date().getHours();

    if (hour < 12) {
        speak("Good Morning. I am Aura. How can I help you?");
    } else if (hour < 17) {
        speak("Good Afternoon. I am Aura. How can I help you?");
    } else {
        speak("Good Evening. I am Aura. How can I help you?");
    }
}

// ✅ FIX 3: Speech Recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    content.innerText = "Speech Recognition not supported. Please use Google Chrome.";
} else {

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    // ✅ KEY FIX: Request mic permission IMMEDIATELY on first click
    // getUserMedia must be called directly inside click handler — no delays, no early returns before it
    btn.addEventListener("click", () => {

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                micPermissionGranted = true;

                // Stop stream tracks — we just needed the permission grant
                stream.getTracks().forEach(track => track.stop());

                // Speak greeting on very first click
                if (!wishSpoken) {
                    wishSpoken = true;
                    wishMe();
                    content.innerText = "Click again to speak a command";
                    return;
                }

                // Start recognition on subsequent clicks
                try {
                    recognition.start();
                    content.innerText = "Listening...";
                } catch (error) {
                    console.log("Recognition already running:", error);
                }
            })
            .catch((err) => {
                console.error("Microphone permission denied:", err);
                content.innerText = "Microphone access denied. Please allow mic in browser settings.";
                speak("Please allow microphone permission to use AURA.");
            });
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        content.innerText = transcript;
        takeCommand(transcript.toLowerCase());
    };

    recognition.onerror = (event) => {
        console.error("Recognition error:", event.error);

        if (event.error === "not-allowed") {
            content.innerText = "Microphone permission denied.";
            speak("Microphone access was denied. Please allow it in your browser settings.");
        } else if (event.error === "no-speech") {
            content.innerText = "No speech detected. Try again.";
        } else {
            speak("Sorry, I could not hear you. Please try again.");
            content.innerText = "Click here to speak";
        }
    };

    recognition.onend = () => {
        content.innerText = "Click here to speak";
    };
}

// Commands
function takeCommand(message) {

    if (message.includes("hello")) {
        speak("Hello, how can I help you?");

    } else if (message.includes("hey aura")) {
        speak("Hi there, how can I help you?");

    } else if (message.includes("how are you")) {
        speak("I am working fine, thank you");

    } else if (message.includes("who created you") || message.includes("who made you")) {
        speak("I was created by Hibha, a talented developer");

    } else if (message.includes("your name")) {
        speak("My name is Aura, Artificial Unified Responsive Assistant.");

    } else if (message.includes("what can you do") || message.includes("who are you")) {
        speak("I am Aura, Artificial Unified Responsive Assistant. I can listen to your voice commands, open websites, tell time and date, search the internet, and assist you with everyday tasks.");

    } else if (message.includes("open youtube")) {
        speak("Opening YouTube");
        window.open("https://youtube.com", "_blank");

    } else if (message.includes("open google")) {
        speak("Opening Google");
        window.open("https://google.com", "_blank");

    } else if (message.includes("open instagram")) {
        speak("Opening Instagram");
        window.open("https://instagram.com", "_blank");

    } else if (message.includes("time")) {
        let time = new Date().toLocaleTimeString();
        speak("The time is " + time);

    } else if (message.includes("date")) {
        let date = new Date().toLocaleDateString();
        speak("Today's date is " + date);

    } else {
        speak("Searching Google for " + message);
        window.open("https://www.google.com/search?q=" + message, "_blank");
    }
}