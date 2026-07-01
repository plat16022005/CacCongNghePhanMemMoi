const Room = require("../models/room");
const ViewingRequest = require("../models/viewingRequest");

exports.getApartments = async (req, res, next) => {
  try {
    const {
      minPrice, maxPrice, minArea, maxArea,
      bedrooms, bathrooms, block, search,
      sortBy, page = 1, limit = 12
    } = req.query;

    const query = { status: { $in: ["available", "vacant"] } };

    if (minPrice || maxPrice) {
      query.rentalPrice = {};
      if (minPrice) query.rentalPrice.$gte = Number(minPrice);
      if (maxPrice) query.rentalPrice.$lte = Number(maxPrice);
    }

    if (minArea || maxArea) {
      query.area = {};
      if (minArea) query.area.$gte = Number(minArea);
      if (maxArea) query.area.$lte = Number(maxArea);
    }

    if (bedrooms) query.bedroomCount = Number(bedrooms);
    if (bathrooms) query.bathroomCount = Number(bathrooms);
    if (block) query.block = block;

    if (search) {
      query.roomNumber = { $regex: search, $options: "i" };
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === "price_asc") sortOption = { rentalPrice: 1 };
    else if (sortBy === "price_desc") sortOption = { rentalPrice: -1 };
    else if (sortBy === "area_desc") sortOption = { area: -1 };
    else if (sortBy === "newest") sortOption = { createdAt: -1 };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const total = await Room.countDocuments(query);
    const rooms = await Room.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.status(200).json({
      data: rooms,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getApartmentDetail = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).lean();
    if (!room) {
      return res.status(404).json({ message: "Không tìm thấy căn hộ" });
    }
    res.status(200).json({ data: room });
  } catch (err) {
    next(err);
  }
};

exports.getSimilarApartments = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Không tìm thấy căn hộ" });
    }

    const priceDiff = room.rentalPrice * 0.2; // 20% range
    const similarRooms = await Room.find({
      _id: { $ne: room._id },
      status: { $in: ["available", "vacant"] },
      $or: [
        { block: room.block },
        {
          rentalPrice: {
            $gte: room.rentalPrice - priceDiff,
            $lte: room.rentalPrice + priceDiff
          }
        }
      ]
    })
      .limit(3)
      .lean();

    res.status(200).json({ data: similarRooms });
  } catch (err) {
    next(err);
  }
};

exports.createViewingRequest = async (req, res, next) => {
  try {
    const { roomId, fullName, phoneNumber, preferredDate, preferredTimeSlot, note } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Căn hộ không tồn tại" });
    }
    if (room.status !== "available" && room.status !== "vacant") {
      return res.status(400).json({ message: "Căn hộ không ở trạng thái trống" });
    }

    const viewingRequest = await ViewingRequest.create({
      roomId,
      fullName,
      phoneNumber,
      preferredDate,
      preferredTimeSlot,
      note
    });

    res.status(201).json({
      success: true,
      message: "Đã ghi nhận yêu cầu đặt lịch xem nhà",
      data: viewingRequest
    });
  } catch (err) {
    next(err);
  }
};
