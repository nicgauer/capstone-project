export const getUserDecks = async (userId) => {
    const response = await fetch(`/api/decks/u/${userId}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return await response.json();
}

export const newDeck = async (deckName) => {
    const response = await fetch('/api/decks/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(deckName)
    })
    return await response.json();
}

export const addCardToDeck = async (cardId, deckId) => {
    const response = await fetch(`/api/decks/${cardId}/${deckId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return await response.json();
}

export const removeCardFromDeck = async (cardId) => {
    const response = await fetch(`/api/decks/remove/${cardId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return await response.json();
}