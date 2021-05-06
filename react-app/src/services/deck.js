export const getUserDecks = async (userId) => {
    const response = await fetch(`/api/decks/u/${userId}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return await response.json();
}

export const newDeck = async (userId) => {
    const response = await fetch(`/api/decks/new/${userId}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return await response.json();
}

export const addCardToDeck = async (cardId, deckId) => {
    const response = await fetch(`/api/decks/${cardId}/${deckId}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return await response.json();
}

export const removeCardFromDeck = async (cardId) => {
    const response = await fetch(`/api/decks/remove/${cardId}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return await response.json();
}