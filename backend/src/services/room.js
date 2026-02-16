import Room from "../db/models/room.js";

export const getAllRoomsService = () => {
  return Room.find();
};

export const getRoomByIdService = (id) => {
  return Room.findById(id);
};

export const createRoomService = (roomData) => {
  return Room.create(roomData);
};

export const updateRoomService = (id, updateData) => {
  return Room.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteRoomService = (id) => {
  return Room.findByIdAndDelete(id);
};
