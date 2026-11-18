import api from './api';

const roomService = {
  getAllRooms: async () => {
    const response = await api.get('/rooms');
    return response.data;
  },

  getRoomById: async (id) => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },

  getRoomsByHostel: async (hostelId) => {
    const response = await api.get(`/rooms/hostel/${hostelId}`);
    return response.data;
  },

  createRoom: async (roomData) => {
    const response = await api.post('/rooms', roomData);
    return response.data;
  },

  updateRoom: async (id, roomData) => {
    const response = await api.put(`/rooms/${id}`, roomData);
    return response.data;
  },

  deleteRoom: async (id) => {
    await api.delete(`/rooms/${id}`);
  },
};

export default roomService;