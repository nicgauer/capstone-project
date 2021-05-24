import React, { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import {useHistory, NavLink} from 'react-router-dom'
import styles from './UserPageDisplay.module.css';
import { confirmFriend, sendFriendRequest, friendCodeRequest } from '../../services/friendship';
import { Modal } from '../../context/Modal';

const UserPageDisplay = ({ user, friends }) => {
    const loggedInUser = useSelector((state) => state.session.user);
    const history = useHistory();
    const [friendsList, setFriendsList] = useState([])
    const [friendRequests, setFriendRequests] = useState([]);
    const [requested, setRequested] = useState(false);
    const [currentlyFriends, setCurrentlyFriends] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [fcReq, setFCREQ] = useState('')
    const [friendsListModal, setFriendsListModal] = useState(false);

    useEffect(() => {
        const orF = friendFilter(friends)
        setFriendRequests(requestFilter(orF.requests))
        setFriendsList(orF.confirmed)
    }, [])

    const friendFilter = (arr) => {
        console.log(arr)
        let orgFriends = {
            confirmed: [],
            requests: []
        }
        arr.forEach(
            friend => {
                if(!friend.confirmed && friend.user1.id !== loggedInUser.id){
                    orgFriends.requests.push(friend)
                    if(friend.user1.id === loggedInUser.id) setRequested(true);
                }
                if((user.id != friend.user1.id) && friend.confirmed){
                    if(friend.user1.id === loggedInUser.id) setCurrentlyFriends(true);
                    orgFriends.confirmed.push(friend.user1)
                }else if((user.id != friend.user2.id) && friend.confirmed){
                    if(friend.user2.id === loggedInUser.id) setCurrentlyFriends(true);
                    orgFriends.confirmed.push(friend.user2)
                }
            }
        )
        return orgFriends
    }

    const requestFilter = (arr) => {
        let requests = [];
        arr.forEach(req => {
            if(loggedInUser.id != req.user1.id){
                requests.push({
                    id:req.id,
                    user:req.user1
                })
            }else {
                requests.push({
                    id:req.id,
                    user:req.user2
                })
            }
        })
        return requests
    }

    const sendRequestHandler = async () => {
        setRequested(true);
        await sendFriendRequest(loggedInUser.id, user.id);
    }

    const confirmRequestHandler = async (id) => {
        let fr = [ ...friendRequests ]
        let target = fr.find(t => t.id == id)
        setFriendRequests(fr.filter(r => r.id != id))
        setFriendsList([...friendsList, target.user])
        await confirmFriend(id)
    }

    const visitFriendHandler = (id) => {
        history.push(`/users/${id}`)
        window.location.reload()
    }

    const generateFC = () => {
        return `${loggedInUser.username.replace(' ', '-')}:${loggedInUser.id}`
    }

    const sendFriendCodeRequest = async (e) => {
        e.preventDefault();
        const fc = await friendCodeRequest(fcReq, loggedInUser.id,);
        setShowModal(false);
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.userContainer}>
                <h1>{user.username}</h1>
                {user.id !== loggedInUser.id && <h2>{user.status}</h2>}
                <h2>{user.wins + user.losses} total games played</h2>

                <div className={styles.recordContainer}>
                    <h4 className={styles.recordTextWin}>W - {user.wins}</h4>
                    <h4 className={styles.recordTextLoss}>L - {user.losses}</h4>
                </div>

                <h2 onClick={() => setFriendsListModal(true)} className={styles.friendsCount}>{friends.length === 1 ? `${friends.length} Friend` : `${friends.length} Friends`}</h2>
                {loggedInUser.id != user.id && !currentlyFriends && (
                                <div>
                                    <button onClick={sendRequestHandler} disabled={requested}>
                                        {requested ? 'Friend Request Sent' : 'Send Friend Request'}
                                    </button>
                                </div>
                            )}
                {loggedInUser.id === user.id && (
                    <div>
                        <button onClick={() => setShowModal(true)}>Friend Code</button>
                    </div>
                )}
            </div>
                {showModal && (<Modal onClose={() => setShowModal(false)}>
                    <div className={styles.fcModal}>
                        <h1>Friend Code System</h1>
                        <p>We use a friend code system to protect our users from unwanted requests.  To send a request to a friend, enter their friend code below.  
                            Your friend can also enter your friend code on their profile.  If they have, make sure to check your friend requests to accept it.
                        </p>
                        <h2>Your friend code is</h2>
                        <h1>{generateFC()}</h1>
                        <h1>Send Friend Request through Friend Code</h1>
                        <form onSubmit={sendFriendCodeRequest}>
                            <input type="text" value={fcReq} onChange={e => setFCREQ(e.target.value)} />
                            <button type="submit">Send Request</button>
                        </form>
                    </div>
                </Modal> )}

            {friendsListModal && (
                <Modal onClose={() => setFriendsListModal(false)}>
                    <div className={styles.friendsListModal}>
                        {friendsList.length > 0 && (
                            <div className={styles.friendsListContainer}>
                                <h1>Friends List</h1>
                                {friendsList.map(friend => (
                                    <div onClick={() => visitFriendHandler(friend.id)}>
                                        <h1>{friend.username}</h1>
                                        <h2>W - {friend.wins}</h2>
                                        <h2>L - {friend.losses}</h2>
                                    </div>
                                ))}
                            </div>
                            )}
                        {friendsList.length === 0 && (
                            <div>
                                <h2>You have no friends!!</h2>
                                <p>Add friends using the friend code system, or add your opponents as friends after games in random multiplayer!</p>
                            </div>
                        )}
                    </div>
                </Modal>
            )}                   
            {loggedInUser.id === user.id && (
                <div>
                    <h1>Friend Requests</h1>
                    {friendRequests.length > 0 && (
                        friendRequests.map(req => (
                            <div onClick={() => visitFriendHandler(req.user.id)}>
                                <h1>{req.user.username}</h1>
                                <h2>W - {req.user.wins}</h2>
                                <h2>L - {req.user.losses}</h2>
                                <button onClick={() => confirmRequestHandler(req.id)}>Confirm {req.user.username} as a friend</button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

export default UserPageDisplay