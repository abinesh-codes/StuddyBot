// Theme toggle with localStorage 
const themeToggle = document.getElementById("themeToggle");
const currentTheme = localStorage.getItem("studdybot-theme");

if (currentTheme === "light") {
  document.body.classList.add("light-mode");
  themeToggle.textContent = "🌞";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  const theme = document.body.classList.contains("light-mode") ? "light" : "dark";
  localStorage.setItem("studdybot-theme", theme);
  themeToggle.textContent = theme === "light" ? "🌞" : "🌙";
});

// Active nav highlight 
const navLinks = document.querySelectorAll("nav ul li a");
navLinks.forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});

// Gemini Chat Integration (Frontend Only)
const API_KEY = "AIzaSyAfnJ9VleM4yx4aLyCgxyXqfpngYKkdUeM";

const chatForm = document.getElementById("chatForm");
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userText = userInput.value.trim();
  if (!userText) return;

  appendMessage("user", userText);
  userInput.value = "";
  appendMessage("ai", "Thinking...", true);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: userText }]
            }
          ]
        })
      }
    );

    const data = await res.json();
    console.log("Gemini raw response:", data);

    removeLoading();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "❌ No response from Gemini.";

    appendMessage("ai", reply);

  } catch (error) {
    removeLoading();
    appendMessage("ai", "❌ Request failed. Check console.");
    console.error("Fetch error:", error);
  }
});

// UI helpers
function appendMessage(role, text, isLoading = false) {
  const msg = document.createElement("div");
  msg.className = `chat-message ${role}`;

  if (role === "ai") {
    msg.innerHTML = text
      .replace(/### (.*?)(\n|$)/g, "<h4>$1</h4>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .split("\n\n")
      .map(p => `<p>${p.replace(/\n/g, "<br>")}</p>`)
      .join("");
  } else {
    msg.textContent = text;
  }


  if (isLoading) msg.classList.add("loading");
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeLoading() {
  const loading = chatBox.querySelector(".loading");
  if (loading) loading.remove();
}


// scroll.js
document.addEventListener("DOMContentLoaded", () => {
  const animatedEls = document.querySelectorAll('.animate');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.2
  });

  animatedEls.forEach(el => observer.observe(el));
});

// button to go to chat page
document.getElementById("startChatBtn").addEventListener("click", () => {
  window.location.href = "chat.html";
});
