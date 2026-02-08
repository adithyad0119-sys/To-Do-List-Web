let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let darkMode = localStorage.getItem("darkMode") === "true";

const taskInput = document.getElementById("taskInput");
const searchInput = document.getElementById("searchInput");
const taskList = document.getElementById("taskList");
const sortSelect = document.getElementById("sortSelect");

const totalEl = document.getElementById("total");
const activeEl = document.getElementById("active");
const completedEl = document.getElementById("completed");

if (darkMode) document.body.classList.add("dark");

function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", darkMode);
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function sortTasks() {
  if (sortSelect.value === "az") {
    tasks.sort((a, b) => a.text.localeCompare(b.text));
  } else {
    tasks.sort((a, b) => b.created - a.created);
  }
  tasks.sort((a, b) => a.completed - b.completed);
}

function updateStats() {
  totalEl.textContent = tasks.length;
  activeEl.textContent = tasks.filter(t => !t.completed).length;
  completedEl.textContent = tasks.filter(t => t.completed).length;
}

function renderTasks() {
  sortTasks();
  updateStats();
  taskList.innerHTML = "";

  const query = searchInput.value.toLowerCase();

  tasks.filter(t => t.text.toLowerCase().includes(query))
    .forEach((task, index) => {

      const li = document.createElement("li");
      if (task.completed) li.classList.add("completed");

      li.innerHTML = `
        <span>
          <input type="checkbox" ${task.completed ? "checked" : ""}>
          ${task.text}
        </span>
        <div class="actions">
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>
        </div>
      `;

      li.querySelector("input").onclick = () => {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
      };

      li.querySelector(".edit").onclick = () => {
        const text = prompt("Edit task:", task.text);
        if (text && text.trim()) {
          task.text = text.trim();
          saveTasks();
          renderTasks();
        }
      };

      li.querySelector(".delete").onclick = () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      };

      taskList.appendChild(li);
    });
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ text, completed: false, created: Date.now() });
  taskInput.value = "";
  saveTasks();
  renderTasks();
}

function searchTasks() {
  renderTasks();
}

taskInput.addEventListener("keydown", e => {
  if (e.key === "Enter") addTask();
});

searchInput.addEventListener("input", renderTasks);

renderTasks();
