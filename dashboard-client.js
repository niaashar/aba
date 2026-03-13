// ===== КАБИНЕТ КЛИЕНТА =====

// Проверка авторизации
const user = JSON.parse(localStorage.getItem('aba_user'));
if (!user || user.role !== 'client') {
    window.location.href = 'login.html';
}

// Инициализация данных
if (!localStorage.getItem('aba_users')) {
    localStorage.setItem('aba_users', JSON.stringify([]));
}
if (!localStorage.getItem('aba_meetings')) {
    localStorage.setItem('aba_meetings', JSON.stringify([]));
}
if (!localStorage.getItem('aba_documents')) {
    localStorage.setItem('aba_documents', JSON.stringify([]));
}
if (!localStorage.getItem('aba_messages')) {
    localStorage.setItem('aba_messages', JSON.stringify([]));
}

// Обновление имени пользователя
const clientNameEl = document.getElementById('clientName');
if (clientNameEl && user) {
    clientNameEl.textContent = `${user.name} | ${user.email}`;
}

// ===== ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК =====
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Убираем активные классы
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Добавляем активный класс к нажатой кнопке
        btn.classList.add('active');
        
        // Показываем соответствующий контент
        const tabName = btn.dataset.tab;
        document.getElementById(tabName + '-tab').classList.add('active');
        
        // Загружаем данные при переключении
        if (tabName === 'meetings') loadClientMeetings();
        if (tabName === 'documents') loadClientDocuments();
        if (tabName === 'messages') loadClientMessages();
    });
});

// ===== ЗАГРУЗКА СТАТУСА КЛИЕНТА =====
function loadClientStatus() {
    const users = JSON.parse(localStorage.getItem('aba_users'));
    const client = users.find(u => u.id === user.id);
    
    if (!client) return;
    
    // Обновляем бейдж статуса
    const statusBadge = document.querySelector('.status-badge');
    if (statusBadge) {
        statusBadge.textContent = getStatusText(client.status);
        statusBadge.className = `status-badge status-${client.status}`;
    }
    
    // Обновляем прогресс
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.status-progress p');
    if (progressFill && progressText) {
        const progress = client.progress || 0;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${progress}% пути пройдено`;
    }
    
    // Обновляем шаги
    const steps = document.querySelectorAll('.status-steps .step');
    if (steps.length >= 4 && client.steps) {
        steps[0].className = client.steps.clarification ? 'step completed' : 'step';
        steps[0].textContent = client.steps.clarification ? '✅ Прояснение' : '⏳ Прояснение';
        
        steps[1].className = client.steps.immersion ? 'step completed' : 'step active';
        steps[1].textContent = client.steps.immersion ? '✅ Погружение' : '🔄 Погружение';
        
        steps[2].className = client.steps.program ? 'step completed' : 'step';
        steps[2].textContent = client.steps.program ? '✅ Программа' : '⏳ Программа';
        
        steps[3].className = client.steps.support ? 'step completed' : 'step';
        steps[3].textContent = client.steps.support ? '✅ Сопровождение' : '⏳ Сопровождение';
    }
}

function getStatusText(status) {
    const statuses = { 
        'new': '🆕 Новый', 
        'consultation': '💬 Консультация', 
        'program': '📋 Программа', 
        'support': '🤝 Сопровождение',
        'completed': '✅ Завершён'
    };
    return statuses[status] || '🆕 Новый';
}

// ===== ЗАГРУЗКА ВСТРЕЧ ДЛЯ КЛИЕНТА =====
function loadClientMeetings() {
    const meetings = JSON.parse(localStorage.getItem('aba_meetings'));
    const container = document.getElementById('clientMeetings');
    
    // Фильтруем будущие встречи
    const today = new Date().toISOString().split('T')[0];
    const upcoming = meetings.filter(m => m.date >= today);
    
    if (upcoming.length === 0) {
        container.innerHTML = '<p style="color: #718096; text-align: center; padding: 40px;">Пока нет предстоящих встреч</p>';
        return;
    }
    
    container.innerHTML = upcoming.map(meeting => `
        <div class="client-card">
            <h3>${meeting.title}</h3>
            <p>📅 ${formatDate(meeting.date)} | ⏰ ${meeting.time}</p>
            ${meeting.description ? `<p style="margin: 10px 0; color: #718096;">${meeting.description}</p>` : ''}
            ${meeting.link ? `
                <a href="${meeting.link}" target="_blank" class="btn btn-primary" style="margin-top: 10px; display: inline-block;">
                    🔗 Подключиться к встрече
                </a>
            ` : ''}
        </div>
    `).join('');
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ===== ЗАГРУЗКА ДОКУМЕНТОВ ДЛЯ КЛИЕНТА =====
function loadClientDocuments() {
    const docs = JSON.parse(localStorage.getItem('aba_documents'));
    const container = document.getElementById('clientDocuments');
    
    // Фильтруем документы для текущего клиента
    const clientDocs = docs.filter(d => d.clientId === user.id || d.clientId === 'all');
    
    if (clientDocs.length === 0) {
        container.innerHTML = '<p style="color: #718096; text-align: center; padding: 40px;">Пока нет доступных документов</p>';
        return;
    }
    
    container.innerHTML = clientDocs.map(doc => `
        <div class="client-card" style="display: flex; align-items: center; gap: 15px;">
            <div style="font-size: 2rem;">📄</div>
            <div style="flex: 1;">
                <h4 style="margin: 0 0 5px 0;">${doc.name}</h4>
                <p style="margin: 0; color: #718096; font-size: 0.9rem;">📅 ${doc.uploadDate}</p>
            </div>
            <a href="${doc.url || '#'}" class="btn btn-secondary" download>⬇️ Скачать</a>
        </div>
    `).join('');
}

// ===== ЗАГРУЗКА СООБЩЕНИЙ ДЛЯ КЛИЕНТА =====
function loadClientMessages() {
    const messages = JSON.parse(localStorage.getItem('aba_messages'));
    const container = document.getElementById('clientMessages');
    
    // Фильтруем сообщения для текущего клиента
    const clientMessages = messages.filter(m => m.clientId === user.id);
    
    if (clientMessages.length === 0) {
        container.innerHTML = '<p style="color: #718096; text-align: center; padding: 40px;">Пока нет новых сообщений</p>';
        return;
    }
    
    container.innerHTML = clientMessages.map(msg => `
        <div class="client-card ${!msg.read ? 'unread' : ''}">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                <h4 style="margin: 0;">${msg.subject}</h4>
                <span style="font-size: 0.85rem; color: #718096;">${formatDate(msg.date)}</span>
            </div>
            <p style="margin: 0; color: #4A5568; line-height: 1.6;">${msg.message}</p>
            ${!msg.read ? '<p style="margin-top: 10px; font-size: 0.85rem; color: #9FB8C4;">🔹 Новое</p>' : ''}
        </div>
    `).join('');
    
    // Помечаем сообщения как прочитанные
    clientMessages.forEach(msg => {
        if (!msg.read) {
            msg.read = true;
        }
    });
    localStorage.setItem('aba_messages', JSON.stringify(messages));
}

// ===== ВЫХОД =====
function logout() {
    localStorage.removeItem('aba_user');
    window.location.href = 'login.html';
}

// ===== ЗАГРУЗКА ПРИ ОТКРЫТИИ СТРАНИЦЫ =====
window.addEventListener('DOMContentLoaded', function() {
    loadClientStatus();
    loadClientMeetings();
    loadClientDocuments();
    loadClientMessages();
});

// ===== УВЕДОМЛЕНИЯ =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? 'linear-gradient(135deg, #B8D4C4 0%, #9FB8C4 100%)' : 'linear-gradient(135deg, #D4A494 0%, #C49484 100%)'}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Добавляем анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);