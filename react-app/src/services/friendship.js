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