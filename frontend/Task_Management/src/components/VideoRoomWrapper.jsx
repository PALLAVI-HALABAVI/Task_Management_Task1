import React from "react";
import { useParams } from "react-router-dom";
import VideoRoom from "./VideoRoom";

const VideoRoomWrapper = () => {
  const { roomId } = useParams();
  const isAdmin = localStorage.getItem("role") === "admin"; 
  return <VideoRoom roomId={roomId} isAdmin={isAdmin} />;
};

export default VideoRoomWrapper;
