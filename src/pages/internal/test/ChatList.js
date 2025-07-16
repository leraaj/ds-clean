import React, { useEffect, useState } from "react";
import CreateIcon from "../../../assets/icons/newMessage.svg";
import dateTimeFormatter from "../../../hooks/dateTimeFormatter";
import Loader from "../../../components/loader/Loader";
import { useAuthContext } from "../../../hooks/context/useAuthContext";
import { toast } from "sonner";

const ChatList = ({
  size,
  rooms,
  setRooms,
  loading,
  setSelectedRoom,
  selectedRoom,
  showAddCollabModal,
  fetchRooms,
  socket,
  io,
}) => {
  const { user } = useAuthContext();
  const joinRoom = (data) => {
    setSelectedRoom(data);
  };

  // Update Chat list by adding new group
  useEffect(() => {
    const handleNewGroupChat = (data) => {
      const collaborator = data.newRoom[0].collaborator;
      const lastChat = data.newRoom[0].lastChat;
      const latestChat = data.newRoom[0].latestChat;
      const addRoom = {
        _id: collaborator._id,
        title: collaborator.title,
        client: collaborator.client,
        job: collaborator.job,
        users: collaborator.users,
        createdAt: collaborator.createdAt,
        updatedAt: collaborator.createdAt,
        latestChat: {
          timestamp: latestChat.timestamp,
        },
        lastChat: {
          _id: lastChat._id,
          sender: {
            _id: lastChat.sender._id,
            fullName: lastChat.sender.fullName,
          },
          message: [
            {
              type: lastChat.message[0].type,
              content: lastChat.message[0].content,
              _id: lastChat.message[0]._id,
              timestamp: lastChat.message[0].timestamp,
            },
          ],
        },
        timestamp: new Date().toISOString(),
      };
      setRooms((prev) => {
        const updatedRooms = [addRoom, ...prev];
        return updatedRooms.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
      });
    };
    socket.on("new_groupchat", handleNewGroupChat);

    // Cleanup listener on component unmount or socket change
    return () => {
      socket.off("new_groupchat", handleNewGroupChat);
    };
  }, [socket, setRooms]);
  // Update Chat list by recent update of sent messages

  useEffect(() => {
    const handleUpdateList = (data) => {
      const collaborator = data.newRoom[0].collaborator;
      const lastChat = data.newRoom[0].lastChat;
      const latestChat = data.newRoom[0].latestChat;
      const updatedRoom = {
        _id: collaborator._id,
        title: collaborator.title,
        client: collaborator.client,
        job: collaborator.job,
        users: collaborator.users,
        createdAt: collaborator.createdAt,
        updatedAt: collaborator.createdAt,
        latestChat: {
          timestamp: latestChat.timestamp,
        },
        lastChat: {
          _id: lastChat._id,
          sender: {
            _id: lastChat.sender._id,
            fullName: lastChat.sender.fullName,
          },
          message: [
            {
              type: lastChat.message[0].type,
              content: lastChat.message[0].content,
              _id: lastChat.message[0]._id,
              timestamp: lastChat.message[0].timestamp,
            },
          ],
        },
        timestamp: new Date().toISOString(),
      };
      // Update rooms and sort by the `lastChat.timestamp` or `latestChat.timestamp`
      const updatedRooms = rooms.map((room) => {
        if (room._id === collaborator._id) {
          return { ...room, ...updatedRoom };
        }
        return room;
      });
      const sortedRooms = updatedRooms.sort((a, b) => {
        const timestampA = a.lastChat?.timestamp || a.latestChat?.timestamp;
        const timestampB = b.lastChat?.timestamp || b.latestChat?.timestamp;
        return new Date(timestampB) - new Date(timestampA);
      });
      setRooms(sortedRooms);
    };
    socket.on("update_list", handleUpdateList);
    return () => {
      socket.off("update_list", handleUpdateList);
    };
  }, [socket, rooms, setRooms]);

  return (
    <>
      <div className={`chatList  ${size} ${selectedRoom}`}>
        <div className="header">
          <span className="title">Chats</span>
          <span className="action">
            {(user?.position === 1 || user?.position === 2) && (
              <button className="btn-send" onClick={showAddCollabModal}>
                <img src={CreateIcon} className="icon" />
              </button>
            )}
          </span>
        </div>
        <div className="body">
          {loading ? (
            <Loader />
          ) : rooms.length > 0 ? (
            rooms?.map((room, index) => {
              const { date, formattedTime } = dateTimeFormatter(
                room?.latestChat?.timestamp || room?.createdAt
              );
              return (
                <div
                  key={index}
                  className={`room ${
                    selectedRoom?.title == room?.title && "room-selected"
                  }`}
                  onClick={() => joinRoom(room)}>
                  <span className="room-title">{room?.title}</span>
                  <span className="room-latest-message ">
                    {user?._id === room?.lastChat?.sender?._id
                      ? `You: ${room?.lastChat?.message[0]?.content}`
                      : `${room?.lastChat?.sender?.fullName}: ${
                          room?.lastChat?.message[0]?.type === "file"
                            ? "Sent and attachment"
                            : room?.lastChat?.message[0]?.content
                        }`}
                  </span>
                  <span className="room-latest-time">
                    {`${date} - ${formattedTime}`}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-center">No available groups yet</p>
          )}
        </div>
        <div className="footer"></div>
      </div>
    </>
  );
};

export default ChatList;
