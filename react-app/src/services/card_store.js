export const getCards = async () => {
    const response = await fetch('/api/store/', {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return await response.json();
}

export const boosterPack = async (cards) => {
    //Cards = array of ids
    const response = await fetch('/api/store/boost', {
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cards
        })
    })
    return await response.json();
}

export const buyBoosterFC = async (id) => {
    const response = await fetch(`/api/store/boost/fc/${id}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return await response.json();
}