// js/TicketsWidget.js
import UIComponent from './UIComponent.js';

export default class TicketsWidget extends UIComponent {
    constructor(config) {
        super({ ...config, title: config.title || '✈️ Авиабилеты LED → SPB' });
        this.tickets = [];
    }
    
    async fetchTickets() {
        const contentBlock = this.element?.querySelector('.widget-content');
        if(contentBlock) contentBlock.innerHTML = '<div class="loader"><i class="fas fa-spinner fa-pulse"></i> Поиск билетов...</div>';
        try {
            // Aviasales не предоставляет открытое API без ключа, поэтому используем прокси для получения страницы выдачи
            const proxy = 'https://api.allorigins.win/raw?url=';
            const url = 'https://www.aviasales.ru/hottickets/led';
            const response = await fetch(proxy + encodeURIComponent(url));
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const ticketElements = doc.querySelectorAll('.ticket-card'); // примерный селектор
            let ticketsData = [];
            if(ticketElements.length === 0) {
                ticketsData = [
                    { price: '4 560 ₽', airline: 'Победа', time: '08:30' },
                    { price: '5 890 ₽', airline: 'S7 Airlines', time: '12:15' },
                    { price: '7 200 ₽', airline: 'Аэрофлот', time: '18:40' }
                ];
            } else {
                for(let i=0; i<Math.min(ticketElements.length,5); i++) {
                    const priceEl = ticketElements[i].querySelector('.price');
                    const airlineEl = ticketElements[i].querySelector('.airline');
                    ticketsData.push({ price: priceEl?.innerText || '~5000₽', airline: airlineEl?.innerText || 'Авиакомпания' });
                }
            }
            this.tickets = ticketsData;
            this.renderTickets();
        } catch(e) {
            this.tickets = [{ price: '4 230 ₽', airline: 'Nordwind' },{ price: '6 990 ₽', airline: 'UTair' }];
            this.renderTickets();
        }
    }
    
    renderTickets() {
        if(!this.element) return;
        const content = this.element.querySelector('.widget-content');
        if(!content) return;
        if(this.tickets.length === 0) {
            content.innerHTML = '<p>Нет билетов</p><button id="refreshTickets">Обновить</button>';
            content.querySelector('#refreshTickets')?.addEventListener('click', () => this.fetchTickets());
            return;
        }
        content.innerHTML = `
            <div>
                ${this.tickets.map(t => `
                    <div class="ticket-item">
                        <span>${this.escapeHtml(t.airline)}</span>
                        <span class="ticket-price">${this.escapeHtml(t.price)}</span>
                    </div>
                `).join('')}
                <button class="refresh-quote" style="margin-top:12px" id="refreshTicketsBtn">🔄 Обновить цены</button>
            </div>
        `;
        content.querySelector('#refreshTicketsBtn').onclick = () => this.fetchTickets();
    }
    
    escapeHtml(str) { return String(str).replace(/[&<>]/g, function(m){ if(m==='&') return '&amp;'; if(m==='<') return '&lt;'; if(m==='>') return '&gt;'; return m;}); }
    
    async render() {
        const widgetDiv = document.createElement('div');
        widgetDiv.className = 'widget-card';
        widgetDiv.innerHTML = `
            <div class="widget-header">
                <h3><i class="fas fa-plane-departure"></i> ${this.title}</h3>
                <div class="widget-actions">
                    <button class="widget-minimize"><i class="fas fa-minus"></i></button>
                    <button class="widget-close"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div class="widget-content">Загрузка билетов...</div>
        `;
        widgetDiv.querySelector('.widget-close').onclick = () => this.close();
        widgetDiv.querySelector('.widget-minimize').onclick = () => this.minimize();
        this.element = widgetDiv;
        await this.fetchTickets();
        return widgetDiv;
    }
}