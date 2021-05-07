export const getUserCards = async (id) => {
    const response = await fetch(`/api/cards/${id}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return await response.json();
}