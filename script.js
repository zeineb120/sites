let tasks = JSON.parse(localStorage.getItem('sticky_tasks')) || [];
let currentFilter = 'all';

// Éléments DOM
const list = document.getElementById('taskList');
const input = document.getElementById('taskInput');
const themeToggle = document.getElementById('themeToggle');

// Sauvegarde
const save = () => localStorage.setItem('sticky_tasks', JSON.stringify(tasks));

// Rendu des notes
function render() {
    list.innerHTML = '';
    
    tasks.filter(t => {
        if (currentFilter === 'active') return !t.completed;
        if (currentFilter === 'completed') return t.completed;
        return true;
    }).forEach((task, index) => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');
        
        li.innerHTML = `
            <span>${task.text}</span>
            <button class="delete-note" style="background:none; border:none; align-self:flex-end; cursor:pointer">✕</button>
        `;

        // Toggle Terminé
        li.onclick = () => {
            task.completed = !task.completed;
            save(); render();
        };

        // Supprimer une note
        li.querySelector('.delete-note').onclick = (e) => {
            e.stopPropagation();
            tasks = tasks.filter(t => t !== task);
            save(); render();
        };

        list.appendChild(li);
    });
}

// Ajouter une tâche
function addTask() {
    const val = input.value.trim();
    if (val) {
        tasks.push({ text: val, completed: false });
        input.value = '';
        save(); render();
    }
}

// Raccourcis Clavier
window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
    if (e.key === 'Delete' && tasks.length > 0) {
        // Supprime la dernière tâche par exemple
        tasks.pop();
        save(); render();
    }
});

// Mode Sombre
themeToggle.onclick = () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('dark-mode', isDark);
};

// Gestion des filtres
document.querySelectorAll('.filters button').forEach(btn => {
    btn.onclick = () => {
        document.querySelector('.filters .active').classList.remove('active');
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        render();
    };
});

// Effacer terminées
document.getElementById('clearCompleted').onclick = () => {
    tasks = tasks.filter(t => !t.completed);
    save(); render();
};

// Init au chargement
if (localStorage.getItem('dark-mode') === 'true') document.body.classList.add('dark-mode');
render();