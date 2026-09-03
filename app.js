import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// Replace with your Firebase Web App config.
const firebaseConfig={apiKey:"YOUR_API_KEY",authDomain:"YOUR_PROJECT.firebaseapp.com",projectId:"YOUR_PROJECT_ID",storageBucket:"YOUR_PROJECT.firebasestorage.app",messagingSenderId:"YOUR_SENDER_ID",appId:"YOUR_APP_ID"};
const app=initializeApp(firebaseConfig); const auth=getAuth(app); const db=getFirestore(app);

const subjectSets={
  "6-7":[["📖","Telugu"],["अ","Hindi"],["A","English"],["➗","Maths"],["🔬","Science"],["🌍","Social"]],
  "8-10":[["📖","Telugu"],["अ","Hindi"],["A","English"],["➗","Maths"],["🔬","Science"],["🌍","Social"],["🧬","Biology"]],
  "mpc":[["➗","Maths"],["⚛️","Physics"],["🧪","Chemistry"],["📖","Telugu"],["A","English"]],
  "bipc":[["⚛️","Physics"],["🧪","Chemistry"],["🌱","Botany"],["🧬","Zoology"],["📖","Telugu"],["A","English"]],
  "cec":[["💼","Commerce"],["📈","Economics"],["🧾","Accountancy"],["🏛️","Political Science"],["📖","Telugu"],["A","English"]]
};
function render(key="6-7"){document.querySelector("#subjects").innerHTML=subjectSets[key].map(s=>`<article class="subject"><div>${s[0]}</div><h3>${s[1]}</h3><p>Videos · PDFs · DPPs · Quizzes</p></article>`).join("")}
render();

window.go=id=>document.getElementById(id).scrollIntoView({behavior:"smooth"});
window.modal=id=>document.getElementById(id).classList.add("open");
window.closeModal=id=>document.getElementById(id).classList.remove("open");
document.querySelectorAll(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.remove("open")}));

document.querySelector("#accountForm").addEventListener("submit",async e=>{e.preventDefault();const f=new FormData(e.target);try{await addDoc(collection(db,"accountRequests"),{name:f.get("name"),category:f.get("category"),className:f.get("class"),sectionStream:f.get("section"),studentId:f.get("studentId"),guardian:f.get("guardian"),status:"pending",createdAt:serverTimestamp()});alert("Request sent to Admin successfully.");e.target.reset();closeModal("account")}catch(err){alert("Firebase is not configured yet. Add your Firebase Web App config first.")}});
document.querySelector("#groupForm").addEventListener("submit",async e=>{e.preventDefault();const f=new FormData(e.target);try{await addDoc(collection(db,"groupRequests"),{name:f.get("name"),studentId:f.get("studentId"),className:f.get("class"),sectionStream:f.get("section"),group:f.get("group"),status:"pending",createdAt:serverTimestamp()});alert("Group registration sent to Admin.");e.target.reset();closeModal("group")}catch(err){alert("Firebase is not configured yet. Add your Firebase Web App config first.")}});
document.querySelector("#loginForm").addEventListener("submit",async e=>{e.preventDefault();alert("Connect the school's Firebase Authentication credentials to enable live login.")});
