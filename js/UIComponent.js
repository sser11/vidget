// js/UIComponent.js
export default class UIComponent {
    constructor(config = {}) {
        this.id = config.id || `widget_${Date.now()}_${Math.random()}`;
        this.title = config.title || 'Компонент';
        this.element = null; // DOM-элемент виджета
    }
    
    // Абстрактный метод рендеринга (должен быть переопределён)
    render() {
        throw new Error('Метод render() должен быть реализован в дочернем классе');
    }
    
    // Возвращает корневой DOM-элемент
    getElement() {
        if (!this.element) {
            this.element = this.render();
        }
        return this.element;
    }
    
    // Корректное удаление виджета
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
        // дополнительная очистка событий (при необходимости)
    }
    
    // Общие методы (minimize/close – close удаляет)
    close() {
        this.destroy();
    }
    
    // Можно добавить минимизацию (дополнительно)
    minimize() {
        if (this.element) {
            const content = this.element.querySelector('.widget-content');
            if (content) {
                content.style.display = content.style.display === 'none' ? 'block' : 'none';
            }
        }
    }
}