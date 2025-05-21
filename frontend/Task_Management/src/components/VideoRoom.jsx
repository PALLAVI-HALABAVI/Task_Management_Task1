import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
//import io from 'socket.io-client';
import Peer from 'simple-peer';
import { Socket } from 'socket.io-client';

const VideoRoom = () => {
  const { roomId } = useParams();
  const [peers, setPeers] = useState([]);
  const userVideo = useRef();
  const peersRef = useRef([]);
  const userStream = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      userVideo.current.srcObject = stream;
      userStream.current = stream;

      Socket.emit('join-room', roomId);

      Socket.on('user-joined', userId => {
        const peer = createPeer(userId, Socket.id, stream);
        peersRef.current.push({ peerID: userId, peer });
        setPeers(users => [...users, peer]);
      });

      Socket.on('signal', handleSignal);
      Socket.on('receive-return-signal', handleReturnSignal);
    });
  }, []);

  function createPeer(userToSignal, callerId, stream) {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', signal => {
      Socket.emit('signal', { userToSignal, callerId, signal });
    });

    return peer;
  }

  function handleSignal({ signal, callerId }) {
    const peer = addPeer(signal, callerId, userStream.current);
    peersRef.current.push({ peerID: callerId, peer });
    setPeers(users => [...users, peer]);
  }

  function addPeer(incomingSignal, callerId, stream) {
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', signal => {
      Socket.emit('return-signal', { signal, callerId });
    });

    peer.signal(incomingSignal);
    return peer;
  }

  function handleReturnSignal({ signal, id }) {
    const item = peersRef.current.find(p => p.peerID === id);
    if (item) item.peer.signal(signal);
  }

  return (
    <div>
      <video muted ref={userVideo} autoPlay playsInline />
      {peers.map((peer, index) => (
        <Video key={index} peer={peer} />
      ))}
    </div>
  );
};

const Video = ({ peer }) => {
  const ref = useRef();

  useEffect(() => {
    peer.on('stream', stream => {
      ref.current.srcObject = stream;
    });
  }, [peer]);

  return <video ref={ref} autoPlay playsInline />;
};

export default VideoRoom;
