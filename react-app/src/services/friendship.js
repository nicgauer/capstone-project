export const confirmFriend = async (id) => {
    const response = await fetch(`/api/friends/confirm/${id}`)
    return response.json();
}

export const sendFriendRequest = async (senderId, recipientId) => {
    const response = await fetch(`/api/friends/send/${senderId}/${recipientId}`)
    return response.json();
}

export const getFriends = async (id) => {
    const response = await fetch(`/api/friends/${id}`)
    return response.json();
}

export const friendCodeRequest = async (code, sender) => {
    const response = await fetch(`/api/friends/friendcode`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code,
            sender
        })
    })
    return await response.json();
}