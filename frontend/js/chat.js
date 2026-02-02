/**
 * ================================================
 * CHAT POR ESTADO - JavaScript
 * Plug-and-play chat widget for Brasil-API-Hub
 * ================================================
 */

// FUTURE BACKEND
// const API_BASE_URL = "http://localhost:8080";
// WebSocket endpoint: ws://localhost:8080/chat
// const socket = new WebSocket(`${API_BASE_URL.replace('http', 'ws')}/chat`);
// 
// socket.onopen = () => console.log('WebSocket connected');
// socket.onmessage = (event) => {
//   const data = JSON.parse(event.data);
//   addMessageToUI(data.room, data.message);
// };
// socket.onclose = () => console.log('WebSocket disconnected');

(function () {
  'use strict';

  // ============ DATA ============
  const rooms = [
    { id: 'geral', name: 'Geral', emoji: '🌎', shortName: 'Geral' },
    { id: 'mg', name: 'Minas Gerais', emoji: '🏔️', shortName: 'MG' },
    { id: 'sp', name: 'São Paulo', emoji: '🏙️', shortName: 'SP' },
    { id: 'rj', name: 'Rio de Janeiro', emoji: '🏖️', shortName: 'RJ' },
    { id: 'ba', name: 'Bahia', emoji: '🎭', shortName: 'BA' },
    { id: 'pr', name: 'Paraná', emoji: '🌲', shortName: 'PR' },
    { id: 'rs', name: 'Rio Grande do Sul', emoji: '🧉', shortName: 'RS' }
  ];

  const messages = {
    geral: [
      { id: '1', sender: 'Sistema', text: 'Bem-vindo ao chat 🌍', time: '14:10', isOwn: false },
      { id: '2', sender: 'Juliana', text: 'Boa tarde, pessoal! ☀️', time: '14:12', isOwn: false, avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: '3', sender: 'Você', text: 'Olá Juliana! Como vai?', time: '14:15', isOwn: true },
      { id: '4', sender: 'Lucas', text: 'Oi pessoal! Alguma novidade em São Paulo? ✋', time: '14:16', isOwn: false, avatar: 'https://i.pravatar.cc/150?img=3' }
    ],
    mg: [],
    sp: [],
    rj: [],
    ba: [],
    pr: [],
    rs: []
  };

  let currentRoom = 'geral';
  let isOpen = false;

  // ============ DOM ELEMENTS ============
  const toggleBtn = document.getElementById('chatToggleBtn');
  const modal = document.getElementById('chatModal');
  const closeBtn = document.getElementById('chatCloseBtn');
  const menuBtn = document.getElementById('chatMenuBtn');
  const roomsContainer = document.getElementById('chatRooms');
  const messagesContainer = document.getElementById('chatMessagesList');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSendBtn');
  const backdrop = document.getElementById('chatBackdrop');

  // ============ INITIALIZATION ============
  function init() {
    renderRooms();
    renderMessages();
    bindEvents();
  }

  // ============ RENDER FUNCTIONS ============
  function renderRooms() {
    roomsContainer.innerHTML = rooms.map(room => `
      <button 
        class="room-btn ${room.id === currentRoom ? 'active' : ''}" 
        data-room="${room.id}"
      >
        <span>${room.emoji}</span>
        <span>${room.shortName}</span>
      </button>
    `).join('');
  }

  function renderMessages() {
    const roomMessages = messages[currentRoom] || [];
    
    if (roomMessages.length === 0) {
      messagesContainer.innerHTML = `
        <div style="text-align: center; color: #9ca3af; padding: 40px 20px;">
          <p>Nenhuma mensagem ainda.</p>
          <p>Seja o primeiro a enviar! 💬</p>
        </div>
      `;
      return;
    }

    messagesContainer.innerHTML = roomMessages.map(msg => `
      <div class="message ${msg.isOwn ? 'own' : ''}">
        ${!msg.isOwn && msg.avatar ? `<img src="${msg.avatar}" alt="${msg.sender}" class="message-avatar">` : ''}
        <div class="message-bubble">
          ${!msg.isOwn && msg.sender !== 'Sistema' ? `<p class="message-sender">${msg.sender}</p>` : ''}
          <p class="message-text">${msg.text}</p>
          <div class="message-meta">
            <span>${msg.time}</span>
            ${msg.isOwn ? `
              <svg class="message-check" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            ` : ''}
          </div>
        </div>
      </div>
    `).join('');

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // ============ EVENT HANDLERS ============
  function bindEvents() {
    // Toggle chat
    toggleBtn.addEventListener('click', openChat);
    closeBtn.addEventListener('click', closeChat);
    backdrop.addEventListener('click', closeChat);

    // Room selection
    roomsContainer.addEventListener('click', (e) => {
      const roomBtn = e.target.closest('.room-btn');
      if (roomBtn) {
        currentRoom = roomBtn.dataset.room;
        renderRooms();
        renderMessages();
      }
    });

    // Send message
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Update send button state
    input.addEventListener('input', updateSendButton);

    // Menu button (placeholder for future)
    menuBtn.addEventListener('click', () => {
      // FUTURE: Open menu/settings
      console.log('Menu clicked - implement menu functionality');
    });
  }

  function openChat() {
    isOpen = true;
    modal.classList.remove('hidden');
    backdrop.classList.add('visible');
    toggleBtn.classList.add('hidden');
    input.focus();
  }

  function closeChat() {
    isOpen = false;
    modal.classList.add('hidden');
    backdrop.classList.remove('visible');
    toggleBtn.classList.remove('hidden');
  }

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    const now = new Date();
    const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const newMessage = {
      id: Date.now().toString(),
      sender: 'Você',
      text: text,
      time: time,
      isOwn: true
    };

    // FUTURE BACKEND
    // socket.send(JSON.stringify({ room: currentRoom, message: newMessage }));

    // Add message locally
    if (!messages[currentRoom]) {
      messages[currentRoom] = [];
    }
    messages[currentRoom].push(newMessage);

    // Clear input and re-render
    input.value = '';
    updateSendButton();
    renderMessages();
  }

  function updateSendButton() {
    if (input.value.trim()) {
      sendBtn.classList.add('active');
    } else {
      sendBtn.classList.remove('active');
    }
  }

  // ============ START ============
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();