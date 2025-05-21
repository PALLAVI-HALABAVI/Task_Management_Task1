import React, { useEffect, useState } from 'react';
import { API_PATHS } from '../utils/apiPaths';
import axiosInstance from '../utils/axiosInstance';
import DashboardLayout from '../components/Layouts/DashboardLayout';
import toast from 'react-hot-toast';

const AdminMeet = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ taskId: '', participants: [], meetingTime: '' });

  
useEffect(() => {
  const fetchData = async () => {
      try {
        const tasksRes = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS);
        const usersRes = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
       setTasks(Array.isArray(taskRes.data) ? taskRes.data : []);
       setUsers(Array.isArray(userRes.data) ? userRes.data : []);
      } catch (err) {
        console.error(err);
        toast.error("Error loading tasks or users.");
      }
    };
    fetchData();
  }, []);

const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

   const handleParticipantsChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(
      (opt) => opt.value
    );
    setForm((prev) => ({
      ...prev,
      participants: selected,
    }));
  };


   const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.taskId || !form.meetingTime || form.participants.length === 0) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await axiosInstance.post(API_PATHS.MEETINGS.SCHEDULE, form);
      toast.success("Meeting created successfully!");
      setForm({
        taskId: "",
        participants: [],
        meetingTime:"",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create meeting");
    }
  };

  return (
    <DashboardLayout>
    <div className='mt-5'>
     <div className='max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg'>
      <div className='form-card col-span-3'>
      <h2 className="text-2xl font-semibold mb-6 text-center">Schedule Meeting</h2>
      <br />
      <form className='space-y-4' onSubmit={handleSubmit}>
      <select  className='w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-400'
      onChange={handleChange}
      value={form.taskId}
      multiple
      >
        
        <option disabled value="">Select Task</option>
        {tasks.map((task) => 
        <option key={task._id} value={task._id}>
            {task.title}
        </option>
    )}
      </select>

      <select  className='w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-400'
      value={form.participants}
      multiple
      onChange={handleParticipantsChange}>
        <option disabled value="">Select Participants</option>
        {users.map((user) => 
        <option key={user._id} value={user._id}>
            {user.name}
        </option>
    )}
      </select>
    
      
      <input type="datetime-local" 
      onChange={e => setForm({ ...form, meetingTime: e.target.value })} />
      <div className='flex justify-end mt-7'>
      <button 
        className='add-btn'
      >Create Meeting</button>
      </div>
      </form>
      </div>
     </div>
    </div>
    </DashboardLayout>
  );
};

export default AdminMeet;
