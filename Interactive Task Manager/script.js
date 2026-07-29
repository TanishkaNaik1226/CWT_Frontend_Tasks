const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

displayTasks();

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

searchInput.addEventListener("keyup", searchTasks);

function addTask() {

    const text = taskInput.value.trim();
    const date = dueDate.value;

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    tasks.push({
        text: text,
        dueDate: date,
        completed: false
    });

    saveTasks();
    displayTasks();

    taskInput.value = "";
    dueDate.value = "";
}

function displayTasks() {

    taskList.innerHTML = "";

    const emptyMessage = document.getElementById("emptyMessage");

    if (tasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    tasks.forEach((task, index) => {

        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        // ---------- Task Info ----------

        const taskInfo = document.createElement("div");
        taskInfo.className = "task-info";

        const title = document.createElement("h4");
        title.textContent = task.text;

        const date = document.createElement("small");

        if (task.dueDate !== "") {
            date.innerHTML = "📅 Due: " + formatDate(task.dueDate);
        } else {
            date.innerHTML = "📅 No Due Date";
        }

        taskInfo.appendChild(title);
        taskInfo.appendChild(date);

        // ---------- Buttons ----------

        const actions = document.createElement("div");
        actions.className = "actions";

        const completeBtn = document.createElement("button");
        completeBtn.innerHTML = task.completed ? "↺" : "✔";
        completeBtn.className = "complete-btn";

        completeBtn.onclick = function () {

            task.completed = !task.completed;

            saveTasks();
            displayTasks();

        };

        const editBtn = document.createElement("button");
        editBtn.innerHTML = "&#9998;";
        editBtn.className = "edit-btn";

        editBtn.onclick = function () {

            const updated = prompt("Edit Task", task.text);

            if (updated !== null && updated.trim() !== "") {

                task.text = updated.trim();

                saveTasks();
                displayTasks();

            }

        };

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "&#x1F5D1;";
        deleteBtn.className = "delete-btn";

        deleteBtn.onclick = function () {

            const confirmDelete = confirm("Delete this task?");

            if (confirmDelete) {

                tasks.splice(index, 1);

                saveTasks();
                displayTasks();

            }

        };

        actions.appendChild(completeBtn);
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(taskInfo);
        li.appendChild(actions);

        taskList.appendChild(li);

    });

    updateCounter();

}

function updateCounter() {

    const total = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    const pending = total - completed;

    document.getElementById("totalCount").textContent = total;
    document.getElementById("completedCount").textContent = completed;
    document.getElementById("pendingCount").textContent = pending;

}

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

function searchTasks() {

    const value = searchInput.value.toLowerCase();

    const items = document.querySelectorAll("#taskList li");

    items.forEach(item => {

        const text = item.querySelector("h4").textContent.toLowerCase();

        if (text.includes(value)) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }

    });

}

function formatDate(dateString) {

    if (!dateString) return "";

    const options = {
        day: "numeric",
        month: "short",
        year: "numeric"
    };

    return new Date(dateString).toLocaleDateString("en-GB", options);

}