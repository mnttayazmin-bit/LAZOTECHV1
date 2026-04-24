import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
// ===============================
// CONFIGURACIÓN FIREBASE
// ===============================

const firebaseConfig = {
  apiKey: "AIzaSyCz2Eb9I8OYdBTuOIkjsR57oqlMOTx4d0U",
  authDomain: "lazotechv1.firebaseapp.com",
  projectId: "lazotechv1",
  storageBucket: "lazotechv1.firebasestorage.app",
  messagingSenderId: "544960584377",
  appId: "1:544960584377:web:a5e4d27bb4571f19f85968",
  measurementId: "G-LXS1D5CZRY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;

// ===============================
// CUANDO CARGA LA PÁGINA
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  connectIndexButtons();
  connectHomeButtons();
  connectLinkButtons();
  connectHistoryButtons();
  connectProfileButtons();
  connectChatButtons();
});

// ===============================
// BOTONES INDEX
// ===============================
function connectIndexButtons() {
  const registerBtn = document.getElementById("registerBtn");
  const loginBtn = document.getElementById("loginBtn");

  if (registerBtn) {
    registerBtn.addEventListener("click", registerUser);
  }

  if (loginBtn) {
    loginBtn.addEventListener("click", loginUser);
  }
}

// ===============================
// BOTONES HOME
// ===============================
function connectHomeButtons() {
  const chatBtn = document.getElementById("chatBtn");
  const profileBtn = document.getElementById("profileBtn");
  const linkBtn = document.getElementById("linkBtn");
  const locationBtn = document.getElementById("locationBtn");
  const mapBtn = document.getElementById("mapBtn");
  const historyBtn = document.getElementById("historyBtn");
  const profileBottomBtn = document.getElementById("profileBottomBtn");

  if (chatBtn) {
    chatBtn.addEventListener("click", () => {
      window.location.href = "chat.html";
    });
  }

  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      window.location.href = "profile.html";
    });
  }

  if (linkBtn) {
    linkBtn.addEventListener("click", () => {
      window.location.href = "link.html";
    });
  }

  if (locationBtn) {
    locationBtn.addEventListener("click", getLocation);
  }

  if (mapBtn) {
    mapBtn.addEventListener("click", () => {
      window.location.href = "home.html";
    });
  }

  if (historyBtn) {
    historyBtn.addEventListener("click", () => {
      window.location.href = "history.html";
    });
  }

  if (profileBottomBtn) {
    profileBottomBtn.addEventListener("click", () => {
      window.location.href = "profile.html";
    });
  }
  connectPlansButtons();
}

// ===============================
// BOTONES LINK
// ===============================
function connectLinkButtons() {
  const connectBtn = document.getElementById("connectBtn");
  const backBtn = document.getElementById("backBtn");

  if (connectBtn) {
    connectBtn.addEventListener("click", linkPartner);
  }

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "home.html";
    });
  }
}

// ===============================
// BOTONES HISTORIAL
// ===============================
function connectHistoryButtons() {
  const savePlaceBtn = document.getElementById("savePlaceBtn");
  const mapBtn = document.getElementById("mapBtn");
  const historyBtn = document.getElementById("historyBtn");
  const profileBottomBtn = document.getElementById("profileBottomBtn");

  if (savePlaceBtn) {
    savePlaceBtn.addEventListener("click", saveCurrentPlace);
  }

  if (mapBtn) {
    mapBtn.addEventListener("click", () => {
      window.location.href = "home.html";
    });
  }

  if (historyBtn) {
    historyBtn.addEventListener("click", () => {
      window.location.href = "history.html";
    });
  }

  if (profileBottomBtn) {
    profileBottomBtn.addEventListener("click", () => {
      window.location.href = "profile.html";
    });
  }
}

// ===============================
// BOTONES PERFIL
// ===============================
function connectProfileButtons() {
  const mapBtn = document.getElementById("mapBtn");
  const historyBtn = document.getElementById("historyBtn");
  const profileBottomBtn = document.getElementById("profileBottomBtn");

  if (mapBtn) {
    mapBtn.addEventListener("click", () => {
      window.location.href = "home.html";
    });
  }

  if (historyBtn) {
    historyBtn.addEventListener("click", () => {
      window.location.href = "history.html";
    });
  }

  if (profileBottomBtn) {
    profileBottomBtn.addEventListener("click", () => {
      window.location.href = "profile.html";
    });
  }
}

// ===============================
// BOTONES CHAT
// ===============================
function connectChatButtons() {
  const sendBtn = document.getElementById("sendBtn");
  const backChatBtn = document.getElementById("backChatBtn");

  if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
  }

  if (backChatBtn) {
    backChatBtn.addEventListener("click", () => {
      window.location.href = "home.html";
    });
  }
}

// ===============================
// REGISTRO
// ===============================
async function registerUser() {
  const name = document.getElementById("name")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();

  if (!name || !email || !password) {
    alert("Completa todos los campos");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      createdAt: new Date().toISOString()
    });

    const code = user.uid.substring(0, 6).toUpperCase();

    await setDoc(doc(db, "codes", code), {
      owner: user.uid
    });

    alert("Registro exitoso. Tu código es: " + code);
    window.location.href = "home.html";
  } catch (error) {
    console.error("Error al registrar:", error);
    alert("Error al registrar: " + error.message);
  }
}

// ===============================
// LOGIN
// ===============================
async function loginUser() {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();

  if (!email || !password) {
    alert("Ingresa tu correo y contraseña");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Inicio de sesión exitoso");
    window.location.href = "home.html";
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("Error al iniciar sesión: " + error.message);
  }
}

// ===============================
// DETECTAR SESIÓN Y CARGAR DATOS
// ===============================
onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  currentUser = user;

  try {
    const userSnap = await getDoc(doc(db, "users", user.uid));

    if (userSnap.exists()) {
      const userData = userSnap.data();

      const myName = document.getElementById("myName");
      const myEmail = document.getElementById("myEmail");
      const profileInitial = document.getElementById("profileInitial");

      if (myName) {
        myName.textContent = userData.name || "Usuario";
      }

      if (myEmail) {
        myEmail.textContent = userData.email || "Sin correo";
      }

      if (profileInitial) {
        profileInitial.textContent = (userData.name || "U").charAt(0).toUpperCase();
      }
    }

    const pairSnap = await getDoc(doc(db, "pairs", user.uid));

    if (pairSnap.exists()) {
      watchPartnerLocation(pairData.partnerUid);
  const pairData = pairSnap.data();

      const partnerName = document.getElementById("partnerName");
      const profilePartnerName = document.getElementById("profilePartnerName");
      const chatPartnerName = document.getElementById("chatPartnerName");

      if (partnerName) {
        partnerName.textContent = pairData.partnerName || "Sin pareja vinculada";
      }

      if (profilePartnerName) {
        profilePartnerName.textContent = pairData.partnerName || "Sin pareja vinculada";
      }

      if (chatPartnerName) {
        chatPartnerName.textContent = pairData.partnerName || "Tu pareja";
      }
    }

    if (document.getElementById("plansList")) {
  loadPlans();
}

    if (document.getElementById("historyList")) {
      loadHistory();
    }

    if (document.getElementById("chatMessages")) {
      loadMessages();
    }
  } catch (error) {
    console.error("Error cargando datos del usuario:", error);
  }
});

// ===============================
// VINCULAR PAREJA
// ===============================
async function linkPartner() {
  if (!currentUser) {
    alert("No hay usuario autenticado");
    return;
  }

  const code = document.getElementById("codeInput")?.value.trim().toUpperCase();

  if (!code) {
    alert("Ingresa un código");
    return;
  }

  try {
    const codeSnap = await getDoc(doc(db, "codes", code));

    if (!codeSnap.exists()) {
      alert("Código inválido");
      return;
    }

    const partnerUid = codeSnap.data().owner;

    if (partnerUid === currentUser.uid) {
      alert("No puedes vincularte contigo mismo");
      return;
    }

    const mySnap = await getDoc(doc(db, "users", currentUser.uid));
    const partnerSnap = await getDoc(doc(db, "users", partnerUid));

    if (!mySnap.exists() || !partnerSnap.exists()) {
      alert("No se encontraron los datos del usuario");
      return;
    }

    const myData = mySnap.data();
    const partnerData = partnerSnap.data();

    await setDoc(doc(db, "pairs", currentUser.uid), {
      partnerUid: partnerUid,
      partnerName: partnerData.name || "Pareja"
    });

    await setDoc(doc(db, "pairs", partnerUid), {
      partnerUid: currentUser.uid,
      partnerName: myData.name || "Pareja"
    });

    alert("Pareja vinculada correctamente 💕");
    window.location.href = "home.html";
  } catch (error) {
    console.error("Error al vincular pareja:", error);
    alert("Error al vincular: " + error.message);
  }
}

// ===============================
// GUARDAR UBICACIÓN
// ===============================
function getLocation() {
  if (!currentUser) {
    alert("No hay usuario autenticado");
    return;
  }

  if (!navigator.geolocation) {
    alert("Tu navegador no soporta geolocalización");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      try {
        await setDoc(doc(db, "locations", currentUser.uid), {
          lat: lat,
          lng: lng,
          updatedAt: new Date().toISOString()
        });

        const map = document.getElementById("map");
        if (map) {
          map.src = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
        }

        alert("Ubicación actualizada");
      } catch (error) {
        console.error("Error guardando ubicación:", error);
        alert("No se pudo guardar la ubicación");
      }
    },
    (error) => {
      console.error("Error obteniendo ubicación:", error);
      alert("No se pudo obtener tu ubicación");
    }
  );
}

// ===============================
// GUARDAR LUGAR EN HISTORIAL
// ===============================
async function saveCurrentPlace() {
  if (!currentUser) {
    alert("No hay usuario autenticado");
    return;
  }

  const placeNameInput = document.getElementById("placeName");
  const placeName = placeNameInput?.value.trim();

  if (!placeName) {
    alert("Escribe un nombre para el lugar");
    return;
  }

  if (!navigator.geolocation) {
    alert("Tu navegador no soporta geolocalización");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      try {
        await addDoc(collection(db, "users", currentUser.uid, "history"), {
          placeName: placeName,
          lat: lat,
          lng: lng,
          createdAt: serverTimestamp()
        });

        alert("Lugar guardado correctamente");
        placeNameInput.value = "";
        loadHistory();
      } catch (error) {
        console.error("Error guardando lugar:", error);
        alert("No se pudo guardar el lugar");
      }
    },
    (error) => {
      console.error("Error obteniendo ubicación:", error);
      alert("No se pudo obtener tu ubicación");
    }
  );
}

// ===============================
// CARGAR HISTORIAL
// ===============================
async function loadHistory() {
  if (!currentUser) return;

  const historyList = document.getElementById("historyList");
  if (!historyList) return;

  historyList.innerHTML = "";

  try {
    const q = query(
      collection(db, "users", currentUser.uid, "history"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      historyList.innerHTML = "<p>No hay lugares guardados todavía.</p>";
      return;
    }

    snapshot.forEach((docItem) => {
      const data = docItem.data();

      const div = document.createElement("div");
      div.className = "history-item";
      div.innerHTML = `
        <h4>${data.placeName}</h4>
        <p>Latitud: ${data.lat}</p>
        <p>Longitud: ${data.lng}</p>
      `;

      historyList.appendChild(div);
    });
  } catch (error) {
    console.error("Error cargando historial:", error);
  }
}

// ===============================
// ENVIAR MENSAJES
// ===============================
async function sendMessage() {
  if (!currentUser) {
    alert("No hay usuario autenticado");
    return;
  }

  const input = document.getElementById("messageInput");
  const text = input?.value.trim();

  if (!text) {
    alert("Escribe un mensaje");
    return;
  }

  try {
    const pairSnap = await getDoc(doc(db, "pairs", currentUser.uid));

    if (!pairSnap.exists()) {
      alert("Primero vincula una pareja");
      return;
    }

    const pairData = pairSnap.data();
    const partnerUid = pairData.partnerUid;

    const userSnap = await getDoc(doc(db, "users", currentUser.uid));
    const userData = userSnap.exists() ? userSnap.data() : {};

    const chatId = [currentUser.uid, partnerUid].sort().join("_");

    await addDoc(collection(db, "chats", chatId, "messages"), {
      senderUid: currentUser.uid,
      senderName: userData.name || "Usuario",
      text: text,
      createdAt: serverTimestamp()
    });

    input.value = "";
    loadMessages();
  } catch (error) {
    console.error("Error enviando mensaje:", error);
    alert("No se pudo enviar el mensaje");
  }
}

// ===============================
// CARGAR MENSAJES
// ===============================
async function loadMessages() {
  if (!currentUser) return;

  const chatMessages = document.getElementById("chatMessages");
  if (!chatMessages) return;

  chatMessages.innerHTML = "";

  try {
    const pairSnap = await getDoc(doc(db, "pairs", currentUser.uid));

    if (!pairSnap.exists()) {
      chatMessages.innerHTML = "<p>Primero vincula una pareja para usar el chat.</p>";
      return;
    }

    const pairData = pairSnap.data();
    const partnerUid = pairData.partnerUid;
    const chatId = [currentUser.uid, partnerUid].sort().join("_");

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      chatMessages.innerHTML = "<p>No hay mensajes todavía.</p>";
      return;
    }

    snapshot.forEach((docItem) => {
      const data = docItem.data();

      const div = document.createElement("div");
      div.className = data.senderUid === currentUser.uid ? "my-message" : "partner-message";

      div.innerHTML = `
        <strong>${data.senderName}</strong>
        <p>${data.text}</p>
      `;

      chatMessages.appendChild(div);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
  } catch (error) {
    console.error("Error cargando mensajes:", error);
  }
}


function watchPartnerLocation(partnerUid) {
  const partnerMap = document.getElementById("partnerMap");
  const partnerStatus = document.getElementById("partnerLocationStatus");

  if (!partnerMap) return;

  onSnapshot(doc(db, "locations", partnerUid), (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();

      partnerMap.src = `https://maps.google.com/maps?q=${data.lat},${data.lng}&z=15&output=embed`;

      if (partnerStatus) {
        partnerStatus.textContent = "Ubicación de tu pareja actualizada en tiempo real";
      }
    } else {
      if (partnerStatus) {
        partnerStatus.textContent = "Tu pareja aún no ha compartido ubicación";
      }
    }
  });
}

function connectPlansButtons() {
  const savePlanBtn = document.getElementById("savePlanBtn");
  const mapBtn = document.getElementById("mapBtn");
  const historyBtn = document.getElementById("historyBtn");
  const plansBtn = document.getElementById("plansBtn");

  const restaurantBtn = document.getElementById("restaurantBtn");
  const parkBtn = document.getElementById("parkBtn");
  const cinemaBtn = document.getElementById("cinemaBtn");

  if (savePlanBtn) savePlanBtn.addEventListener("click", savePlan);

  if (mapBtn) mapBtn.addEventListener("click", () => window.location.href = "home.html");
  if (historyBtn) historyBtn.addEventListener("click", () => window.location.href = "history.html");
  if (plansBtn) plansBtn.addEventListener("click", () => window.location.href = "plans.html");

  if (restaurantBtn) restaurantBtn.addEventListener("click", () => searchNearby("restaurantes"));
  if (parkBtn) parkBtn.addEventListener("click", () => searchNearby("parques"));
  if (cinemaBtn) cinemaBtn.addEventListener("click", () => searchNearby("cines"));
}

async function savePlan() {
  if (!currentUser) {
    alert("No hay usuario autenticado");
    return;
  }

  const planName = document.getElementById("planName")?.value.trim();
  const planDate = document.getElementById("planDate")?.value;
  const planTime = document.getElementById("planTime")?.value;

  if (!planName || !planDate || !planTime) {
    alert("Completa todos los campos");
    return;
  }

  try {
    await addDoc(collection(db, "users", currentUser.uid, "plans"), {
      planName,
      planDate,
      planTime,
      createdAt: serverTimestamp()
    });

    alert("Plan guardado correctamente");
    document.getElementById("planName").value = "";
    document.getElementById("planDate").value = "";
    document.getElementById("planTime").value = "";

    loadPlans();
  } catch (error) {
    console.error(error);
    alert("No se pudo guardar el plan");
  }
}

async function loadPlans() {
  if (!currentUser) return;

  const plansList = document.getElementById("plansList");
  if (!plansList) return;

  plansList.innerHTML = "";

  const q = query(
    collection(db, "users", currentUser.uid, "plans"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    plansList.innerHTML = "<p>No hay planes guardados todavía.</p>";
    return;
  }

  snapshot.forEach((docItem) => {
    const data = docItem.data();

    const div = document.createElement("div");
    div.className = "history-item";
    div.innerHTML = `
      <h4>${data.planName}</h4>
      <p>Fecha: ${data.planDate}</p>
      <p>Hora: ${data.planTime}</p>
    `;

    plansList.appendChild(div);
  });
}

function searchNearby(type) {
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    const url = `https://www.google.com/maps/search/${type}/@${lat},${lng},15z`;
    window.open(url, "_blank");
  });
}