// ===== БАЗА ДАННЫХ ABA_pro (localStorage) =====

const DB = {
    // Инициализация
    init() {
        if (!localStorage.getItem('aba_clients')) {
            localStorage.setItem('aba_clients', JSON.stringify([
                {
                    id: 'client1',
                    name: 'Иванова Мария',
                    email: 'client@aba-pro.ru',
                    status: 'consultation',
                    startDate: '2026-01-15',
                    progress: 25,
                    steps: {
                        clarification: true,
                        immersion: false,
                        program: false,
                        support: false
                    }
                }
            ]));
        }
        
        if (!localStorage.getItem('aba_meetings')) {
            localStorage.setItem('aba_meetings', JSON.stringify([
                {
                    id: 1,
                    title: 'Поведение как коммуникация',
                    date: '2026-02-10',
                    time: '19:00',
                    description: 'Почему ребёнок ведёт себя так, а не иначе — и как понять его сигналы.',
                    link: 'https://zoom.us/j/123456789',
                    access: 'all'
                },
                {
                    id: 2,
                    title: 'Перенос навыков в жизнь',
                    date: '2026-02-17',
                    time: '18:30',
                    description: 'Как сделать так, чтобы ребёнок использовал новые умения не только на занятиях.',
                    link: 'https://zoom.us/j/987654321',
                    access: 'all'
                }
            ]));
        }
        
        if (!localStorage.getItem('aba_documents')) {
            localStorage.setItem('aba_documents', JSON.stringify([
                {
                    id: 1,
                    clientId: 'client1',
                    name: 'Информированное согласие.pdf',
                    type: 'consent',
                    uploadDate: '2026-01-15',
                    url: '#'
                },
                {
                    id: 2,
                    clientId: 'client1',
                    name: 'Индивидуальная программа.pdf',
                    type: 'program',
                    uploadDate: '2026-01-20',
                    url: '#'
                }
            ]));
        }
        
        if (!localStorage.getItem('aba_messages')) {
            localStorage.setItem('aba_messages', JSON.stringify([
                {
                    id: 1,
                    clientId: 'client1',
                    from: 'owner',
                    subject: 'Ваш запрос получен',
                    message: 'Спасибо за ваше обращение и доверие. Я внимательно ознакомлюсь с вашим запросом и свяжусь с вами в ближайшее время.',
                    date: '2026-01-15',
                    read: false
                }
            ]));
        }
    },
    
    // Клиенты
    getClients() {
        return JSON.parse(localStorage.getItem('aba_clients') || '[]');
    },
    
    addClient(client) {
        const clients = this.getClients();
        client.id = 'client' + (clients.length + 1);
        clients.push(client);
        localStorage.setItem('aba_clients', JSON.stringify(clients));
    },
    
    updateClient(id, data) {
        const clients = this.getClients();
        const index = clients.findIndex(c => c.id === id);
        if (index !== -1) {
            clients[index] = { ...clients[index], ...data };
            localStorage.setItem('aba_clients', JSON.stringify(clients));
        }
    },
    
    // Встречи
    getMeetings() {
        return JSON.parse(localStorage.getItem('aba_meetings') || '[]');
    },
    
    addMeeting(meeting) {
        const meetings = this.getMeetings();
        meeting.id = meetings.length + 1;
        meetings.push(meeting);
        localStorage.setItem('aba_meetings', JSON.stringify(meetings));
    },
    
    // Документы
    getDocuments(clientId) {
        const docs = JSON.parse(localStorage.getItem('aba_documents') || '[]');
        return docs.filter(d => d.clientId === clientId || d.clientId === 'all');
    },
    
    addDocument(doc) {
        const docs = JSON.parse(localStorage.getItem('aba_documents') || '[]');
        doc.id = docs.length + 1;
        docs.push(doc);
        localStorage.setItem('aba_documents', JSON.stringify(docs));
    },
    
    // Сообщения
    getMessages(clientId) {
        const msgs = JSON.parse(localStorage.getItem('aba_messages') || '[]');
        return msgs.filter(m => m.clientId === clientId);
    },
    
    addMessage(msg) {
        const msgs = JSON.parse(localStorage.getItem('aba_messages') || '[]');
        msg.id = msgs.length + 1;
        msg.date = new Date().toISOString().split('T')[0];
        msgs.push(msg);
        localStorage.setItem('aba_messages', JSON.stringify(msgs));
    }
};

// Инициализация при загрузке
DB.init();

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

function logout() {
    localStorage.removeItem('aba_user');
    localStorage.removeItem('aba_remember');
    window.location.href = 'login.html';
}

function checkAuth(requiredRole) {
    const user = JSON.parse(localStorage.getItem('aba_user'));
    if (!user) {
        window.location.href = 'login.html';
        return false;
    }
    if (requiredRole && user.role !== requiredRole) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Проверка авторизации
checkAuth();