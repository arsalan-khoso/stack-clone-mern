// MessageHistory.js

import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, off, push, set } from "firebase/database";
import { useSelector } from "react-redux";
import LeftSidebar from "../components/LeftSidebar/LeftSidebar";
import "./MessageHistory.css";

const MessageHistory = () => {
  const [messages, setMessages] = useState([]);
  const [usersWithMessages, setUsersWithMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState("");
  const currentUser = useSelector((state) => state.currentUserReducer);

  useEffect(() => {
    // Initialize Firebase and get a reference to the messages
    const database = getDatabase();
    const messagesRef = ref(database, "messages");

    // Listen for changes in the messages
    const messagesListener = onValue(messagesRef, (snapshot) => {
      const messagesData = snapshot.val();
      if (messagesData) {
        const messagesArray = Object.values(messagesData);
        setMessages(messagesArray);

        // Extract unique users who received messages from the current user
        const uniqueUsers = [
          ...new Set(
            messagesArray
              .filter((message) => message.sender === currentUser?.result.name)
              .map((message) => message.receiverName)
          ),
        ];
        setUsersWithMessages(uniqueUsers);
      }
    });

    return () => {
      // Cleanup the listener when the component unmounts
      off(messagesRef, "value", messagesListener);
    };
  }, [currentUser]);

  // Function to handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  // Function to handle sending a message
  const sendMessage = () => {
    if (messageText.trim() === "") {
      return;
    }

    const database = getDatabase();
    const messagesRef = ref(database, "messages");
    const newMessageRef = push(messagesRef);

    set(newMessageRef, {
      sender: currentUser?.result.name,
      receiverName: selectedUser,
      text: messageText,
    });

    setMessageText("");
  };

  return (
    <div className="container-message">
      <div className="message-history-container">
        <div className="user-list">
          <h2>All Messages</h2>
          <ul>
            {usersWithMessages.map((user, index) => (
              <li
                key={index}
                onClick={() => handleUserSelect(user)}
                className={selectedUser === user ? "selected" : ""}
              >
                {user}
              </li>
            ))}
          </ul>
        </div>
        <div className="chat-panel">
          {currentUser ? (
            selectedUser ? (
              <div>
                <h2>Chat with {selectedUser}</h2>
                <ul className="chat-messages">
                  {messages
                    .filter(
                      (message) =>
                        (message.sender === currentUser?.result.name &&
                          message.receiverName === selectedUser) ||
                        (message.sender === selectedUser &&
                          message.receiverName === currentUser?.result.name)
                    )
                    .map((message, index) => (
                      <li
                        key={index}
                        className={
                          message.sender === currentUser?.result.name
                            ? "current-user-message"
                            : "other-user-message"
                        }
                      >
                        <strong>{message.sender}</strong>: {message.text}
                      </li>
                    ))}
                </ul>
                <div className="message-input-container">
                  <input
                    type="text"
                    className="message-input"
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <button className="send-button" onClick={sendMessage}>
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <p>Please select a user to start chatting.</p>
            )
          ) : (
            <p>Please log in to view messages.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageHistory;
