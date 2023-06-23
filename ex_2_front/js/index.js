import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

import {getMessagesByUser, sendMessage, editMessage, deleteMessage} from './message.js';

const loginInput = document.getElementById('login');
const passwordInput = document.getElementById('password');
const button = document.getElementById('send');
const msg = document.getElementById('msg');
const loggedBlock = document.getElementById('logged');
const logoutBlock = document.getElementById('logout');
const disconnectButton = document.getElementById('disconnect')
const userInfo = document.getElementById('userInfo');
const msgList = document.getElementById('msg-list');
const createMessage = document.getElementById('createMessage');
const sendMessageButton = document.getElementById('sendMessage');
const editBlock = document.getElementById('edit');
const editButton = document.getElementById('editButton');
const cancelButton = document.getElementById('cancelButton');


const socket = io("http://localhost:19000", { transports : ['websocket'] });




let editing = false;
let selectedMessage = null;
let userGlobal = {
    isLogged: false,
    infos: null
}

socket.on("newMessage", (data)=>{
    console.log(data)
    if(data.receiverUserId === userGlobal.infos._id) {
        const token = window.localStorage.getItem('token-auth')
        console.log("c'est moi");
        getMessagesByUser(userGlobal.infos, token)
                .then((response)=>{
                    console.log(response)
                    createMsgList(response.messages)
                });
    }
})

socket.on("updateDeleteMessage", (data)=>{
    console.log(data)
    if(data.receiverUserId === userGlobal.infos._id || data.senderUserId === userGlobal.infos._id) {
        const token = window.localStorage.getItem('token-auth')
        console.log("c'est moi");
        getMessagesByUser(userGlobal.infos, token)
                .then((response)=>{
                    console.log(response)
                    createMsgList(response.messages)
                });
    }
})


cancelButton.addEventListener('click', (e)=>{
    e.preventDefault();
    cancelEdit();
})

function cancelEdit(){
    editing = false;
    selectedMessage = null;
    editBlock.style.display = "none";
    sendMessageButton.style.display = "block";
    createMessage.value = "";
}

editButton.addEventListener('click', onClickEditMessage)

button.addEventListener('click', onClickLogin);
disconnectButton.addEventListener('click',disconnect)
sendMessageButton.addEventListener('click', onClickSendMessage)
checkToken()

function onClickLogin(e){
    e.preventDefault();

    console.log({
        email: loginInput.value, 
        password: passwordInput.value
    })

    fetch('http://localhost:19000/user/login', {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: loginInput.value, 
            password: passwordInput.value
        })
    })
    .then((response)=>{
        return response.json();      
    })
    .then((res)=>{
        console.log("res",res)
        if(res.err) {
            msg.textContent = res.err
        } else {
            window.localStorage.setItem('token-auth', res.token);
            checkToken();
        }
    })
    .catch(err=> console.log(err));
} 

function checkToken(){
    const token = window.localStorage.getItem('token-auth');
    if(!token) {
        gotToLoggout();
        return;
    }

    fetch('http://localhost:19000/checkToken', {
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authorization': token
        }
    })
    .then((response)=>{
        return response.json();      
    })
    .then((res)=>{
        console.log(res)
        if(res.msg === "token ok") {
            goToLogged(res.user);
            getMessagesByUser(res.user, token)
                .then((response)=>{
                    console.log(response)
                    createMsgList(response.messages)
                });
        } else {
            gotToLoggout();
        }
    })
    .catch((err)=>{
        gotToLoggout();
    })
}

function goToLogged(user){
    userGlobal = {
        isLogged: true,
        infos: user
    };
    loggedBlock.style.display = "block";
    logoutBlock.style.display = "none";
    const p1 = document.createElement('p');
    p1.textContent = user.firstName+" "+user.lastName;
    const p2 = document.createElement('p');
    p2.textContent = user.email;
    userInfo.appendChild(p1);
    userInfo.appendChild(p2);
}

function gotToLoggout(){
    userGlobal = {
        isLogged: false,
        infos: null
    }
    
    loggedBlock.style.display = "none";
    logoutBlock.style.display = "block"
}

function disconnect(e){
    e.preventDefault()
    window.localStorage.removeItem('token-auth');
    checkToken()
}


function createMsgList(messages){

    const ul = document.createElement('ul');
    for(const msg of messages) {
        const li = document.createElement('li');
        const span1 = document.createElement('span');
        span1.innerHTML = msg.body;
        const span2 = document.createElement('span');
        span2.textContent = "🗑️";
        span2.addEventListener('click', (e)=>{
            onClickDelete(msg._id)

        })
        li.appendChild(span1);
        li.appendChild(span2);
        if(msg.senderUserId === userGlobal.infos._id) {
            li.classList.add("me");
            span1.addEventListener('click', (e)=>{
                onClickEdit(msg)
            })
        }
        ul.appendChild(li);
    }
    
    msgList.innerHTML = "";
    msgList.appendChild(ul);

}

function onClickEdit(msg){
    editing = true;
    selectedMessage = msg;
    createMessage.value = msg.body;
    editBlock.style.display = "block";
    sendMessageButton.style.display = "none";
}


function onClickSendMessage(e){
    e.preventDefault();
    const token = window.localStorage.getItem('token-auth')
    console.log("userGlobal",userGlobal)
    if(token) {

        sendMessage(userGlobal.infos, createMessage.value, token)
        .then((res)=>{
            console.log(res)
            getMessagesByUser(userGlobal.infos, token)
                .then((response)=>{
                    console.log(response)
                    createMsgList(response.messages);
                    createMessage.value = ""
                });
        })

    }
}

function onClickEditMessage(e){
    e.preventDefault();
    const token = window.localStorage.getItem('token-auth')
    console.log("userGlobal",userGlobal)
    if(token) {

        editMessage(selectedMessage._id, createMessage.value, token)
        .then((res)=>{
            console.log(res)
            getMessagesByUser(userGlobal.infos, token)
                .then((response)=>{
                    console.log(response)
                    createMsgList(response.messages);
                    createMessage.value = "";
                    cancelEdit()
                });
        })

    }
}
function onClickDelete(id){
  
    const token = window.localStorage.getItem('token-auth')
    console.log("userGlobal",userGlobal)
    if(token) {

        deleteMessage(id, token)
        .then((res)=>{
            console.log(res)
            getMessagesByUser(userGlobal.infos, token)
                .then((response)=>{
                    console.log(response)
                    createMsgList(response.messages);
                    createMessage.value = "";
                    cancelEdit()
                });
        })

    }
}