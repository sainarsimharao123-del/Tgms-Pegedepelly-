let studentsDB = JSON.parse(localStorage.getItem('tgms_students')) || null;
if (!studentsDB && window.tgmsRawStudents) {
  studentsDB = window.tgmsRawStudents.map((s, idx) => {
    const u = s.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return { id: 'S' + idx, name: s.name, class: s.class, username: u, password: u };
  });
  localStorage.setItem('tgms_students', JSON.stringify(studentsDB));
}

let houses = JSON.parse(localStorage.getItem('tgms_houses')) || [
  { name: "Sir C. V. Raman", pts: 240 },
  { name: "Albert Einstein", pts: 265 },
  { name: "Sir Isaac Newton", pts: 215 },
  { name: "Dr. APJ Abdul Kalam", pts: 290 }
];

let materials = JSON.parse(localStorage.getItem('tgms_mats')) || [];
let gallery = JSON.parse(localStorage.getItem('tgms_gal')) || [];
let currentUser = null, loginRole = 'student';

window.addEventListener('DOMContentLoaded', () => {
  renderHouses();
  renderGallery();
});

function navigateTo(id) {
  ['home', 'student', 'admin'].forEach(v => document.getElementById('view-' + v).classList.add('hidden'));
  document.getElementById('view-' + id).classList.remove('hidden');
}

function openLoginModal() { document.getElementById('login-modal').classList.remove('hidden'); }
function closeLoginModal() { document.getElementById('login-modal').classList.add('hidden'); }
function setRole(r) {
  loginRole = r;
  document.getElementById('tab-s').className = r === 'student' ? 'w-1/2 py-1 bg-indigo-900 text-white' : 'w-1/2 py-1 bg-slate-100';
  document.getElementById('tab-a').className = r === 'admin' ? 'w-1/2 py-1 bg-indigo-900 text-white' : 'w-1/2 py-1 bg-slate-100';
}

function doLogin(e) {
  e.preventDefault();
  const u = document.getElementById('login-u').value.trim().toLowerCase();
  const p = document.getElementById('login-p').value.trim();
  const err = document.getElementById('login-err');
  
  if (loginRole === 'admin') {
    if (u === 'tgmspgpl' && p === 'tgms2026') {
      currentUser = { role: 'admin', name: 'Admin' };
      closeLoginModal();
      document.getElementById('auth-btns').classList.add('hidden');
      document.getElementById('user-badge').classList.remove('hidden');
      document.getElementById('user-label').textContent = 'Admin';
      renderAdmin();
      navigateTo('admin');
      return;
    }
    err.textContent = "Invalid Admin credentials.";
    err.classList.remove('hidden');
    return;
  }

  const s = studentsDB.find(x => x.username === u && x.password === p);
  if (s) {
    currentUser = { role: 'student', data: s };
    closeLoginModal();
    document.getElementById('auth-btns').classList.add('hidden');
    document.getElementById('user-badge').classList.remove('hidden');
    document.getElementById('user-label').textContent = s.name;
    document.getElementById('stu-name').textContent = s.name;
    document.getElementById('stu-class').textContent = s.class;
    renderStudentMats();
    navigateTo('student');
  } else {
    err.textContent = "Invalid student username or password.";
    err.classList.remove('hidden');
  }
}

function handleLogout() {
  currentUser = null;
  document.getElementById('auth-btns').classList.remove('hidden');
  document.getElementById('user-badge').classList.add('hidden');
  navigateTo('home');
}

function renderStudentMats() {
  const el = document.getElementById('stu-materials');
  el.innerHTML = '';
  const match = materials.filter(m => currentUser.data.class.includes(m.cls));
  match.forEach(m => el.innerHTML += `<div class="p-2 border rounded flex justify-between"><span><b>${m.sub}:</b> ${m.tit}</span><a href="${m.url}" target="_blank" class="text-indigo-600 font-bold">Open PDF</a></div>`);
  if (!match.length) el.innerHTML = '<p class="text-slate-400">No notes posted yet.</p>';
}

function renderAdmin(list = null) {
  const tbody = document.getElementById('adm-tbody');
  tbody.innerHTML = '';
  (list || studentsDB).forEach(s => {
    tbody.innerHTML += `<tr><td class="p-2 font-bold">${s.name}</td><td class="p-2">${s.class}</td><td class="p-2 font-mono text-indigo-700">${s.username}</td><td class="p-2 text-right"><button onclick="editPass('${s.id}')" class="text-indigo-600 font-bold">Edit</button></td></tr>`;
  });
}

function filterStudents() {
  const q = document.getElementById('adm-search').value.toLowerCase();
  renderAdmin(studentsDB.filter(s => s.name.toLowerCase().includes(q) || s.class.toLowerCase().includes(q) || s.username.includes(q)));
}

function editPass(id) {
  const s = studentsDB.find(x => x.id === id);
  const u = prompt("Edit Username:", s.username);
  if (!u) return;
  const p = prompt("Edit Password:", s.password);
  if (!p) return;
  s.username = u.trim().toLowerCase();
  s.password = p.trim();
  localStorage.setItem('tgms_students', JSON.stringify(studentsDB));
  renderAdmin();
}

function addMaterial(e) {
  e.preventDefault();
  materials.unshift({ cls: document.getElementById('m-cls').value, sub: document.getElementById('m-sub').value, tit: document.getElementById('m-tit').value, url: document.getElementById('m-url').value });
  localStorage.setItem('tgms_mats', JSON.stringify(materials));
  alert("Study Material Published!");
}

function addGallery(e) {
  e.preventDefault();
  gallery.unshift({ cap: document.getElementById('g-cap').value, url: document.getElementById('g-url').value });
  localStorage.setItem('tgms_gal', JSON.stringify(gallery));
  renderGallery();
  alert("Clipping Published to Wall!");
}

function renderHouses() {
  const g = document.getElementById('houses-grid');
  g.innerHTML = '';
  houses.forEach(h => g.innerHTML += `<div class="p-3 border rounded-xl text-center"><div class="font-black text-indigo-700 text-lg">${h.pts}</div><div class="text-[10px] font-bold text-slate-700">${h.name}</div></div>`);
}

function renderGallery() {
  const g = document.getElementById('gallery-grid');
  g.innerHTML = '';
  gallery.forEach(i => g.innerHTML += `<div class="border rounded-xl overflow-hidden bg-white"><img src="${i.url}" class="h-28 w-full object-cover"><div class="p-2 text-[10px] font-bold">${i.cap}</div></div>`);
  if (!gallery.length) g.innerHTML = '<p class="text-xs text-slate-400">No clippings posted yet.</p>';
}

function broadcastMsg() {
  const m = prompt("Enter Broadcast Message for students:");
  if (m) alert("📢 Broadcast Sent:\n" + m);
    }
