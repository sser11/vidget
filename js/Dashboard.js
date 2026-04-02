// js/Dashboard.js
import ToDoWidget from './ToDoWidget.js';
import QuoteWidget from './QuoteWidget.js';
import MatchesWidget from './MatchesWidget.js';
import TicketsWidget from './TicketsWidget.js';

export default class Dashboard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) throw new Error(`Контейнер ${containerId} не найден`);
        this.widgets = new Map(); // id -> экземпляр виджета
    }
    
    addWidget(widgetType) {
        let widgetInstance = null;
        switch(widgetType) {
            case 'todo':
                widgetInstance = new ToDoWidget({ title: '✅ Мои задачи' });
                break;
            case 'quote':
                widgetInstance = new QuoteWidget({ title: '💡 Вдохновение' });
                break;
            case 'matches':
                widgetInstance = new MatchesWidget({ title: '🏆 HLTV Матчи (CS2)' });
                break;
            case 'tickets':
                widgetInstance = new TicketsWidget({ title: '💰 Билеты Москва → Питер' });
                break;
            default: return;
        }
        const domElement = widgetInstance.getElement();
        this.container.appendChild(domElement);
        this.widgets.set(widgetInstance.id, widgetInstance);
        
        // При удалении из виджета (close) удаляем из мапы
        const originalClose = widgetInstance.close.bind(widgetInstance);
        widgetInstance.close = () => {
            originalClose();
            this.widgets.delete(widgetInstance.id);
        };
    }
    
    removeWidget(widgetId) {
        const widget = this.widgets.get(widgetId);
        if(widget) {
            widget.close();
            this.widgets.delete(widgetId);
        }
    }
}