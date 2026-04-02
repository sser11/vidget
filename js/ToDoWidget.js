// js/ToDoWidget.js
import UIComponent from './UIComponent.js';

export default class ToDoWidget extends UIComponent {
    constructor(config) {
        super({ ...config, title: config.title || '📝 Список дел' });
        this.tasks = []; // массив { id, text, completed }
    }
    
    addTask(text) {
        if (!text.trim()) return;
        const newTask = {
            id: Date.now() + Math.random(),
            text: text.trim(),
            completed: false
        };
        this.tasks.push(newTask);
        this.refreshTasksList();
    }
    
    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id != id);
        this.refreshTasksList();
    }
    
    toggleTask(id) {
        const task = this.tasks.find(t => t.id == id);
        if (task) {
            task.completed = !task.completed;
            this.refreshTasksList();
        }
    }
    
    refreshTasksList() {
        const container = this.element?.querySelector('.todo-list-container');
        if (!container) return;
        this.renderTasks(container);
    }
    
    renderTasks(container) {
        const ul = document.createElement('ul');
        ul.className = 'todo-list';
        this.tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `todo-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <input type="checkbox" class="todo-check" ${task.completed ? 'checked' : ''} data-id="${task.id}">
                <span class="todo-text">${this.escapeHtml(task.text)}</span>
                <button class="todo-delete" data-id="${task.id}"><i class="fas fa-trash-alt"></i></button>
            `;
            ul.appendChild(li);
        });
        
        // Добавляем форму добавления
        const form = document.createElement('div');
        form.className = 'add-todo-form';
        form.innerHTML = `
            <input type="text" placeholder="Новая задача..." class="todo-input">
            <button class="todo-add-btn"><i class="fas fa-plus"></i> Добавить</button>
        `;
        
        container.innerHTML = '';
        container.appendChild(ul);
        container.appendChild(form);
        
        // Обработчики
        form.querySelector('.todo-add-btn').onclick = () => {
            const input = form.querySelector('.todo-input');
            this.addTask(input.value);
            input.value = '';
        };
        form.querySelector('.todo-input').addEventListener('keypress', (e) => {
            if(e.key === 'Enter') {
                this.addTask(e.target.value);
                e.target.value = '';
            }
        });
        
        // делегирование чекбоксов и кнопок удаления
        ul.querySelectorAll('.todo-check').forEach(cb => {
            cb.onclick = (e) => this.toggleTask(cb.dataset.id);
        });
        ul.querySelectorAll('.todo-delete').forEach(btn => {
            btn.onclick = () => this.deleteTask(btn.dataset.id);
        });
    }
    
    escapeHtml(str) {
        return str.replace(/[&<>]/g, function(m) {
            if(m === '&') return '&amp;';
            if(m === '<') return '&lt;';
            if(m === '>') return '&gt;';
            return m;
        });
    }
    
    render() {
        const widgetDiv = document.createElement('div');
        widgetDiv.className = 'widget-card';
        widgetDiv.setAttribute('data-widget-id', this.id);
        widgetDiv.innerHTML = `
            <div class="widget-header">
                <h3><i class="fas fa-tasks"></i> ${this.title}</h3>
                <div class="widget-actions">
                    <button class="widget-minimize"><i class="fas fa-minus"></i></button>
                    <button class="widget-close"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div class="widget-content">
                <div class="todo-list-container"></div>
            </div>
        `;
        const contentDiv = widgetDiv.querySelector('.todo-list-container');
        this.renderTasks(contentDiv);
        
        // close / minimize
        widgetDiv.querySelector('.widget-close').onclick = () => this.close();
        widgetDiv.querySelector('.widget-minimize').onclick = () => this.minimize();
        
        return widgetDiv;
    }
}