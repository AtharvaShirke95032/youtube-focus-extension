import API_KEY from "./config.js";

const QUOTES = [
  "You sure this is how you wanna spend your time? 🤔",
  "Just one video? Famous last words. 😅",
  "Do your future self a favor. ✨",
  "This video won’t help you level up. 📉",
  "Break’s over, let’s get back to it. 🧠",
  "This won’t get you closer to your goals. 🎯",
  "You’re not missing much, promise. 😉",
  "Watch now, regret later. 😬",
  "Another video? You got stuff to do. 🛠️",
  "Don’t let autoplay steal your time. ⏳",
  "That to-do list isn’t gonna finish itself. 📝",
  "Bet you’ll forget this video in an hour. 🤷",
  "Fun now, stress later? Nah. 🚫",
  "You’ve seen stuff like this before. Skip it. 💤",
  "One step closer to wasting the day. 👀",
  "It’s giving procrastination vibes. 😬",
  "Scroll less, do more. 🔁➡️✅",
  "Not today, distractions. 🙅",
  "This moment? Could be progress instead. 🔄",
  "Be honest: is this actually worth it? 🧐"
];


let quotePool = [...QUOTES];
function getRandomQuote() {
  if (quotePool.length === 0) quotePool = [...QUOTES];
  const index = Math.floor(Math.random() * quotePool.length);
  const quote = quotePool[index];
  quotePool.splice(index, 1);
  return quote;
}

function getVideoId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("v");
}

async function getCategoryId(videoId) {
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${API_KEY}&fields=items(snippet(categoryId))&part=snippet`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.items[0]?.snippet?.categoryId || null;
  } catch (err) {
    console.error("Error fetching category ID:", err);
    return null;
  }
}

function showQuotePopup(quote) {
  const modal = document.createElement("div");
  modal.innerHTML = `
    <div style="
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.95);
      color: white;
      padding: 4rem 5rem;
      border-radius: 2rem;
      z-index: 9999;
      font-size: 2rem;
      text-align: center;
      max-width: 800px;
      width: 95%;
      box-shadow: 0 0 40px rgba(0, 0, 0, 0.9);
      line-height: 1.6;
      font-family: system-ui, 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif;
    ">
      <p style="
        font-weight: bold;
        font-size: 2.2rem;
        margin-bottom: 2rem;
        text-shadow: 0 0 4px rgba(255, 255, 255, 0.2);
      ">
        ${quote}
      </p>
         <div style="display: flex; gap: 1rem; justify-content: center;">
        <button style="
          padding: 1rem 2rem;
          font-size: 1.2rem;
          background: white;
          color: black;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        " id="continueBtn">Watch anyway and waste my time</button>

        <button style="
          padding: 1rem 2rem;
          font-size: 1.2rem;
          background: red;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        " id="closeBtn">Go to YouTube Home</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector("button").addEventListener("click", () => modal.remove());
   modal.querySelector("#closeBtn").addEventListener("click", () => {
    window.location.href = "https://www.youtube.com";
  });
}

let lastVideoId = null;

async function runCheck() {
  const videoId = getVideoId();
  if (!videoId || videoId === lastVideoId) return;
  lastVideoId = videoId;

  const categoryId = await getCategoryId(videoId);
  console.log("Video category ID:", categoryId);

  const allowedCategories = ["27", "28"]; // Education, Science & Technology
  if (categoryId && !allowedCategories.includes(categoryId)) {
    const quote = getRandomQuote();
    showQuotePopup(quote);
  }
}

let currentUrl = location.href;
setInterval(() => {
  if (location.href !== currentUrl) {
    currentUrl = location.href;
    setTimeout(runCheck, 1000);
  }
}, 1000);

setTimeout(runCheck, 3000);
