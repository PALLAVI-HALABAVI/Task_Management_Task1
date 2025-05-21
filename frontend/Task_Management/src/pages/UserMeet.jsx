import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import DashboardLayout from '../components/Layouts/DashboardLayout';

const UserMeet = ({ userId }) => {
  const [meetings, setMeetings] = useState([]);

  const fetchMeetings = async () => {
    const res = await axiosInstance.get(API_PATHS.MEETINGS.GET_BY_ID(userId));
    setMeetings(res.data);
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  return (
    <DashboardLayout>
    <div className='max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10'>
      <h2 className="text-2xl font-bold mb-6 text-center">Your Meetings</h2>
      {meetings.map(m => (
        <div key={m._id}>
          <p className="text-lg font-semibold">Task: {m.taskId?.title}</p>
          <p className="text-sm text-gray-600 mt-1">Time: {new Date(m.meetingTime).toLocaleString()}</p>
          <a href={m.meetingLink} target="_blank" rel="noreferrer">Join</a>
        </div>
      ))}
    </div>
    </DashboardLayout>
  );
};

export default UserMeet;
