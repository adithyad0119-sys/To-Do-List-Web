let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let darkMode = localStorage.getItem("darkMode") === "true";

const total = document.getElementById("total");
const active = document.getElementById("active");
const completed = document.getElementById("completed");

/* Dark Mode */
if (darkMode) {
  document.body.classList.add("dark");
  document.querySelector(".toggle-mode").textContent = "☀ Light";
}

function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", darkMode);
  document.querySelector(".toggle-mode").textContent =
    darkMode ? "☀ Light" : "🌙 Dark";
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateStats() {
  total.textContent = tasks.length;
  active.textContent = tasks.filter(t => !t.completed).length;
  completed.textContent = tasks.filter(t => t.completed).length;
}

function renderTasks(filtered = null) {
  const searchVal = document.getElementById("searchInput").value.toLowerCase();
  const sortOption = document.getElementById("sortSelect").value;

  let displayTasks = filtered || [...tasks];
  displayTasks = displayTasks.filter(t =>
    t.text.toLowerCase().includes(searchVal)
  );

  displayTasks.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed - b.completed;
    if (sortOption === "az") return a.text.localeCompare(b.text);
    return b.id - a.id;
  });

  updateStats();

  const list = document.getElementById("taskList");
  list.innerHTML = "";

  displayTasks.forEach(task => {
    list.innerHTML += `
      <li class="${task.completed ? "completed" : ""}">
        <span>
          <input type="checkbox" class="toggle"
            ${task.completed ? "checked" : ""}
            onclick="toggleTask(${task.id})">
          ${task.text}
        </span>
        <div class="actions">
          <button class="edit" onclick="editTask(${task.id})">Edit</button>
          <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
        </div>
      </li>
    `;
  });
}

function addTask() {
  const input = document.getElementById("taskInput");
  if (!input.value.trim()) return;

  tasks.push({
    id: Date.now(),
    text: input.value.trim(),
    completed: false
  });

  input.value = "";
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const newText = prompt("Edit task:", task.text);
  if (newText) task.text = newText;

  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function searchTasks() {
  const value = document.getElementById("searchInput").value.toLowerCase();
  if (!value) renderTasks();
  else renderTasks(tasks.filter(t => t.text.toLowerCase().includes(value)));
}

document.getElementById("searchInput").addEventListener("keydown", e => {
  if (e.key === "Enter") searchTasks();
});

document.getElementById("searchInput").addEventListener("input", e => {
  if (!e.target.value.trim()) renderTasks();
});

renderTasks();
