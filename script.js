const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');
const taskList = document.getElementById('task-list');

const API_URL = 'https://backendrpl.netlify.app/.netlify/functions'; // Update with your backend URL

async function fetchTasks() {
    const response = await fetch(`${API_URL}/getTasks.js`);
    const tasks = await response.json();
    renderTasks(tasks);
}

function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.title;

        // Edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-button');
        editButton.onclick = () => editTask(task.id, task.title);
        li.appendChild(editButton);

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTask(task.id);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });
}

async function addTask(event) {
    event.preventDefault();
    const title = taskTitleInput.value;

    await fetch(`${API_URL}/createTask.js`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
    });

    taskTitleInput.value = '';
    fetchTasks();
}

async function deleteTask(id) {
    await fetch(`${API_URL}/deleteTask.js`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    });

    fetchTasks();
}

async function editTask(id, currentTitle) {
    const newTitle = prompt('Edit Task Title:', currentTitle);
    if (newTitle) {
        await fetch(`${API_URL}/updateTask.js`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, title: newTitle }),
        });

        fetchTasks();
    }
}

// Event listeners
taskForm.addEventListener('submit', addTask);

// Initial fetch to load tasks
fetchTasks();
