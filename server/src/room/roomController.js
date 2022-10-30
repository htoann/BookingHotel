import Room from "./roomModel";
import Hotel from "../hotel/hotelModel";
import { createMessage } from "../utils/createMessage";
const base = require("../utils/baseController");

export default {
  createRoom: async (req, res, next) => {
    const hotelId = req.params.hotelid;
    const newRoom = new Room(req.body);

    try {
      const savedRoom = await newRoom.save();
      try {
        await Hotel.findByIdAndUpdate(hotelId, {
          $push: { rooms: savedRoom._id },
        });
      } catch (err) {
        next(err);
      }
      res.status(200).json(savedRoom);
    } catch (err) {
      next(err);
    }
  },

  updateRoom: base.updateOne(Room),

  updateRoomAvailability: async (req, res, next) => {
    try {
      await Room.updateOne(
        { "roomNumbers._id": req.params.id },
        {
          $push: {
            "roomNumbers.$.unavailableDates": req.body.dates,
          },
        }
      );

      return createMessage(res, 200, "Updated successfully");
    } catch (err) {
      next(err);
    }
  },

  deleteRoom: async (req, res, next) => {
    const hotelId = req.params.hotelid;
    try {
      await Room.findByIdAndDelete(req.params.id);
      try {
        await Hotel.findByIdAndUpdate(hotelId, {
          $pull: { rooms: req.params.id },
        });
      } catch (err) {
        next(err);
      }
      return createMessage(res, 200, "Deleted successfully");
    } catch (err) {
      next(err);
    }
  },

  getRoom: base.getOne(Room),

  getAllRooms: base.getAll(Room),
};
