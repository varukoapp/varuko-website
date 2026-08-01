import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

document.getElementById("year").textContent = new Date().getFullYear();

const firebaseConfig = {
  projectId: "ai-studio-applet-webapp-287b0",
  appId: "1:874011933680:web:a0f59373cdedaa8119bb35",
  apiKey: "AIzaSyCsRr_kdk-JlYUJdmcjkct1P2R8_ng9044",
  authDomain: "ai-studio-applet-webapp-287b0.firebaseapp.com",
  storageBucket: "ai-studio-applet-webapp-287b0.firebasestorage.app",
  messagingSenderId: "874011933680"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(
  app,
  "ai-studio-a4a26d0f-14d9-41b7-ae52-0ed9bf820631"
);

const form = document.getElementById("waitlist-form");
const status = document.getElementById("waitlist-status");
const submitButton = form?.querySelector(".waitlist-submit");

async function createEmailId(email) {
  const bytes = new TextEncoder().encode(email.trim().toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(digest))
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
}

form?.addEventListener("submit", async event => {
  event.preventDefault();

  const formData = new FormData(form);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const role = String(formData.get("role") || "");
  const website = String(formData.get("website") || "").trim();

  // Silent bot trap.
  if (website) return;

  status.textContent = "";
  status.removeAttribute("data-state");

  if (!name || !email || !["athlete", "trainer"].includes(role)) {
    status.textContent = "Please complete all required fields.";
    status.dataset.state = "error";
    return;
  }

  submitButton.disabled = true;
  submitButton.querySelector("span").textContent = "Joining...";

  try {
    const emailId = await createEmailId(email);

    await setDoc(doc(db, "betaWaitlist", emailId), {
      name,
      email,
      role,
      source: "varuko.com",
      status: "waiting",
      createdAt: serverTimestamp()
    });

    form.reset();
    status.textContent =
      "Welcome to the Varuko Beta. You're officially on the waitlist. We'll email you as soon as your invitation is ready.";
  } catch (error) {
    console.error("Waitlist submission failed:", error);

    if (error?.code === "permission-denied") {
      status.textContent =
        "This email is already registered, or submissions are temporarily unavailable.";
    } else {
      status.textContent =
        "We couldn't add you right now. Please try again shortly.";
    }

    status.dataset.state = "error";
  } finally {
    submitButton.disabled = false;
    submitButton.querySelector("span").textContent =
      "Join the Beta Waitlist";
  }
});
