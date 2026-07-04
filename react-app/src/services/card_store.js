export const buyBooster = async () => {
    const response = await fetch('/api/store/boost', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return await response.json();
}

export const getStoreCards = async () => {
    const response = await fetch('/api/store/');
    return await response.json();
}

export const buyCard = async (cardTypeId) => {
    const response = await fetch(`/api/store/buy/${cardTypeId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return await response.json();
}