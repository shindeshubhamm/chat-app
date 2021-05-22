const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

// Join web socket tunnel // on connection is triggered on server
const socket = io();

// Join with username, room
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputRoomUsers(users);
});

// Listen for messages
socket.on('message', (data) => {
    outputMessage(data);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const message = e.target.elements.msg.value;
    socket.emit('chatMessage', message);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

const outputMessage = (data) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${data.username} <span>${data.time}</span></p>
    <p class="text">
      ${data.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
};

const outputRoomName = (room) => {
    roomName.innerText = room;
};

const outputRoomUsers = (users) => {
    userList.innerHTML = `
        ${users.map((user) => `<li>${user.username}</li>`).join('')}
    `;
};
