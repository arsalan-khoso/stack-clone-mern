import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBirthdayCake, faPen } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { Link } from "react-router-dom";

import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import Avatar from "../../components/Avatar/Avatar";
import EditProfileForm from "./EditProfileForm";
import ProfileBio from "./ProfileBio";
import "./UserProfile.css";
import Chat from "../Chat"; // Import the Chat component

const UserProfile = () => {
  const { id } = useParams();
  const users = useSelector((state) => state.usersReducer);

  const currentProfile = users.filter((user) => user._id === id)[0];
  const currentUser = useSelector((state) => state.currentUserReducer);
  const [showChat, setShowChat] = useState(false); // State to control chat visibility
  const [Switch, setSwitch] = useState(false);

  // Function to toggle the chat
  const handleChatClick = () => {
    setShowChat(!showChat);
  };

  const isCurrentUserProfile = currentUser?.result._id === id;
  const renderChatComponent = !isCurrentUserProfile && showChat;

  return (
    <div>
      <div className="home-container-1">
        <LeftSidebar />
        <div className="home-container-2">
          <section>
            <div className="user-details-container">
              <div className="user-details">
                <Avatar
                  backgroundColor="purple"
                  color="white"
                  fontSize="50px"
                  px="40px"
                  py="30px"
                >
                  {currentProfile?.name.charAt(0).toUpperCase()}
                </Avatar>
                <div className="user-name">
                  <h1>{currentProfile?.name}</h1>
                  <p>
                    <FontAwesomeIcon icon={faBirthdayCake} /> Joined{" "}
                    {moment(currentProfile?.joinedOn).fromNow()}
                  </p>
                </div>
              </div>
              {isCurrentUserProfile && (
                <button
                  type="button"
                  onClick={() => setSwitch(true)}
                  className="edit-profile-btn"
                >
                  <FontAwesomeIcon icon={faPen} /> Edit Profile
                </button>
              )}
              {!isCurrentUserProfile && (
                <button
                  type="button"
                  onClick={handleChatClick}
                  className="chat-now-btn"
                >
                  Chat Now
                </button>
              )}
            </div>
            <>
              {Switch ? (
                <EditProfileForm
                  currentUser={currentUser}
                  setSwitch={setSwitch}
                />
              ) : (
                <ProfileBio currentProfile={currentProfile} />
              )}
            </>

            {/* Conditionally render the Chat component */}
            {renderChatComponent && (
              <Chat
                userName={currentProfile?.name}
                userId={currentProfile?._id}
                currentUserLog={currentUser?.result.name}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
