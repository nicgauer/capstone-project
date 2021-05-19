export const getUser = async (id) => {
    const user = await fetch(`/api/users/${id}`)
    return user.json();
}