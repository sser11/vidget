// main.js
import Dashboard from './js/Dashboard.js';

// Ждём полной загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    // Создаём экземпляр дашборда (контейнер #dashboard-grid)
    const dashboard = new Dashboard('dashboard-grid');
    
    // Кнопки для добавления виджетов
    document.getElementById('addTodoBtn').addEventListener('click', () => dashboard.addWidget('todo'));
    document.getElementById('addQuoteBtn').addEventListener('click', () => dashboard.addWidget('quote'));
    document.getElementById('addMatchesBtn').addEventListener('click', () => dashboard.addWidget('matches'));
    document.getElementById('addTicketsBtn').addEventListener('click', () => dashboard.addWidget('tickets'));
    
    // Можно добавить пару демо-виджетов сразу для наглядности
    setTimeout(() => {
        dashboard.addWidget('todo');
        dashboard.addWidget('quote');
        dashboard.addWidget('matches');
    }, 100);
});