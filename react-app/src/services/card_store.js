export const buyBooster = async () => {
    const response = await fetch('/api/store/boost', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return await response.json();
}