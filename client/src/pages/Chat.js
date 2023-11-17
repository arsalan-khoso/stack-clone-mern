import React, { useState, useEffect } from "react";
import "./Chat.css";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  push, // Import push from "firebase/database"
  set, // Import set from "firebase/database"
  onValue,
  off,
} from "firebase/database";
import { Link } from "react-router-dom";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCH8V_EIwgDBIVF_S5iV0U0v-9lQNAUcs4",
  authDomain: "chat-applicaton-7eabc.firebaseapp.com",
  databaseURL: "https://chat-applicaton-7eabc-default-rtdb.firebaseio.com",
  projectId: "chat-applicaton-7eabc",
  storageBucket: "chat-applicaton-7eabc.appspot.com",
  messagingSenderId: "494178419875",
  appId: "1:494178419875:web:7ebbf28de98c278be0eb16",
  measurementId: "G-BWQEBMWST1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const Chat = ({
  userName,
  userId,
  currentUserLog,
  usersSentMessagesTo,
  addUserToSentList,
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesRef = ref(database, "messages");

  useEffect(() => {
    const clearMessages = () => setMessages([]);

    if (!currentUserLog) {
      clearMessages();
    } else {
      const messagesListener = onValue(messagesRef, (snapshot) => {
        const messagesData = snapshot.val();
        if (messagesData) {
          const messagesArray = Object.values(messagesData);
          setMessages(messagesArray);
        }
      });

      return () => {
        off(messagesRef, "value", messagesListener);
      };
    }
  }, [currentUserLog, userId]); // Add userId to the dependency array

  const pushMessage = async () => {
    if (!currentUserLog) {
      alert("Please login to continue chatting.");
      return;
    }

    if (message.trim() !== "") {
      const newMessageRef = await push(messagesRef);
      await set(newMessageRef, {
        text: message,
        sender: currentUserLog,
        receiverName: userName,
        receiverId: userId,
        timestamp: new Date().getTime(),
      });
      setMessage("");
      addUserToSentList({ _id: userId, name: userName });
    }
  };

  return (
    <div className="chat-box">
      <>
        <div className="username">
          <p>User Name: {userName}</p>
        </div>
        {currentUserLog ? (
          <div className="chat-messages">
            {messages
              .filter((msg) => {
                return (
                  (msg.receiverName === currentUserLog &&
                    msg.sender === userName) || // Only show messages sent to and received from the current user
                  (msg.sender === currentUserLog &&
                    msg.receiverName === userName)
                );
              })
              .map((msg, index) => (
                <div key={index} className="message">
                  {msg.sender}: {msg.text}
                </div>
              ))}
          </div>
        ) : (
          <div className="message">
            Please{" "}
            <Link to="/Auth" className="login-link">
              login
            </Link>{" "}
            to continue chatting.
          </div>
        )}
        <div className="input-box">
          {currentUserLog ? (
            <>
              <input
                type="text"
                className="message-input"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="send-button" onClick={pushMessage}>
                Send
              </button>
            </>
          ) : null}
        </div>
      </>
    </div>
  );
};

export default Chat;
