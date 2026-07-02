export const confirmFriend = async (id) => {
    const response = await fetch(`/api/friends/confirm/${id}`, {
        method: 'POST'
    })
    return response.json();
}

export const sendFriendRequest = async (recipientId) => {
    const response = await fetch(`/api/friends/send/${recipientId}`, {
        method: 'POST'
    })
    return response.json();
}

export const getFriends = async (id) => {
    const response = await fetch(`/api/friends/${id}`)
    return response.json();
}

export const friendCodeRequest = async (code) => {
    const response = await fetch(`/api/friends/friendcode`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code
        })
    })
    return await response.json();
}