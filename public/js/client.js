const socket = io();
const users = document.querySelector('.users')
const form = document.querySelector('.chat form')
const input = document.querySelector('#message')
const messages = document.getElementById('Chatmessages')
const Username = document.getElementById('Username')


socket.on("connect", () => {
    console.log(`user connected ${socket.id}`)
    Username.append(socket.id)
});

socket.on('newUserConnected',(tableauUsers)=>{
    UpdateDom(tableauUsers,users)
})

socket.on('userDisconnected',(tableauUsers)=>{
    UpdateDom(tableauUsers,users)
})

function UpdateDom(tableauUsers,UserDom){
    UserDom.innerHTML = ''

    tableauUsers.forEach(id => {
        if(id !== socket.id){
            UserDom.innerHTML += `
            <div class="user">
            <h4 class="icon">${id[0]}</h4>
            <h3>${id}</h3>
            </div>
        `
        }

        
    });
}

form.addEventListener('submit',(e)=>{
    e.preventDefault()
    if (input.value) {
        let msg = input.value
        socket.emit('chat message', msg);
        input.value = '';
    }
})

socket.on('chat message', ({msg,id}) => {

    const item = document.createElement('li')
    if(socket.id === id) {
        item.classList.add('fromMe')
    }
    item.textContent = msg
    messages.appendChild(item)
    window.scrollTo(0, document.body.scrollHeight);
});