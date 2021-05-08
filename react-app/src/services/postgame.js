export const addWin = async (id) => {
    const response = await fetch(`/api/users/w/${id}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return await response.json();
}

export const addLoss = async (id) => {
    const response = await fetch(`/api/users/l/${id}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return await response.json();
}