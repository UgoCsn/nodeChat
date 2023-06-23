export function getMessagesByUser(user, token) {
    return fetch('http://localhost:19000/messageByUser/'+user._id, {
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authorization': token
        },
    })
    .then((response)=>{
        return response.json();      
    })
    .catch((err)=>{
        console.log(err)
    })
}


export function sendMessage(user, body, token) {
    const userId1 = "6492ce03c29364279f5d025b";
    const userId2 = "6494034774968b23e7943228"
    console.log(user)
    const data = {
        senderUserId: user._id,
        receiverUserId: user._id === userId1 ? userId2 : userId1,
        body: body
    }

    console.log('data', data)

    return fetch('http://localhost:19000/message/add', {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authorization': token
        },
        body: JSON.stringify(data)
    })
    .then((response)=>{
        return response.json();      
    })
}

export function editMessage(id, body, token) {

    const data = {
        body: body
    }

    return fetch('http://localhost:19000/message/'+id, {
        method: 'PUT',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authorization': token
        },
        body: JSON.stringify(data)
    })
    .then((response)=>{
        return response.json();      
    })
}

export function deleteMessage(id, token) {

    return fetch('http://localhost:19000/message/'+id, {
        method: 'DELETE',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authorization': token
        },
    })
    .then((response)=>{
        return response.json();      
    })
}