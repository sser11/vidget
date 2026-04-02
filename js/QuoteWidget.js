// js/QuoteWidget.js
import UIComponent from './UIComponent.js';

export default class QuoteWidget extends UIComponent {
    constructor(config) {
        super({ ...config, title: config.title || '✨ Мудрая цитата' });
        this.quotes = [
            { text: "Код — это поэзия.", author: "Аноним" },
            { text: "Простота — высшая степень сложности.", author: "Леонардо да Винчи" },
            { text: "Любой дурак может написать код, который поймет компьютер. Хорошие программисты пишут код, который поймут люди.", author: "Мартин Фаулер" },
            { text: "Не бойся ошибок, бойся отсутствия попыток.", author: "Стив Джобс" },
            { text: "Визуализируй свои цели, и они станут реальностью.", author: "Джим Рон" }
        ];
        this.currentQuote = this.quotes[0];
    }
    
    getRandomQuote() {
        const randomIndex = Math.floor(Math.random() * this.quotes.length);
        return this.quotes[randomIndex];
    }
    
    updateQuote() {
        this.currentQuote = this.getRandomQuote();
        if (this.element) {
            const textSpan = this.element.querySelector('.quote-text');
            const authorSpan = this.element.querySelector('.quote-author');
            if (textSpan && authorSpan) {
                textSpan.innerText = `“${this.currentQuote.text}”`;
                authorSpan.innerText = `— ${this.currentQuote.author}`;
            }
        }
    }
    
    render() {
        this.currentQuote = this.getRandomQuote();
        const widgetDiv = document.createElement('div');
        widgetDiv.className = 'widget-card';
        widgetDiv.innerHTML = `
            <div class="widget-header">
                <h3><i class="fas fa-quote-left"></i> ${this.title}</h3>
                <div class="widget-actions">
                    <button class="widget-minimize"><i class="fas fa-minus"></i></button>
                    <button class="widget-close"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div class="widget-content">
                <div class="quote-text">“${this.currentQuote.text}”</div>
                <div class="quote-author">— ${this.currentQuote.author}</div>
                <button class="refresh-quote"><i class="fas fa-sync-alt"></i> Обновить цитату</button>
            </div>
        `;
        const refreshBtn = widgetDiv.querySelector('.refresh-quote');
        refreshBtn.onclick = () => this.updateQuote();
        widgetDiv.querySelector('.widget-close').onclick = () => this.close();
        widgetDiv.querySelector('.widget-minimize').onclick = () => this.minimize();
        return widgetDiv;
    }
}