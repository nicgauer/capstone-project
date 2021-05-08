import React, {useEffect, useState} from 'react';

import styles from './GameChat.module.css';

const GameChat = ({socket, username, room_id}) => {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [toggle, setToggle] = useState(false)
    const [unreads, setUnreads] = useState(0)

    useEffect(() => {
        socket.on("chat_message", data => {
            console.log('reciever log', toggle)
            setMessages((prev) => [...prev, data.message])
        })
    },[])

    useEffect(() => {
        unreadHandler()
    }, [messages.length])

    const sendMessage = (e) => {
        e.preventDefault()
        console.log('sender log', toggle)
        socket.emit("message_chat", {
            room_id: room_id,
            message: {
                username: username,
                body: newMessage
            },
        })
        setNewMessage('')
    }

    const unreadHandler = () => {
        if(!toggle){
            setUnreads((prev) => prev += 1)
        }
    }

    const toggleChat = () => {
        if(!toggle){
            setUnreads(0)
            setToggle(true)
        }else{
            setToggle(false);
        }
        console.log("Toggle chat", toggle)
    }

    return (
        <div className={styles.chatRoom}>
            <div className={toggle ? styles.chatWrapperVisible : styles.chatWrapperHidden}>
                <div className={styles.messageContainer}>
                    {messages && messages.map(message => (
                        <div className={styles.messageBox}>
                            <h3>{message.username}</h3>
                            <p>{message.body}</p>
                        </div>
                    ))}
                </div>
                <form onSubmit={sendMessage}>
                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                    <button type='submit'>=></button>
                </form>
            </div>
            <button onClick={toggleChat} className={styles.chatToggle}>Chat ({unreads})</button>
        </div>
    )
}

export default GameChat;