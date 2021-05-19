export const confirmFriend = async (id) => {
    const response = await fetch(`/api/friends/confirm/${id}`)
    return response.json();
}