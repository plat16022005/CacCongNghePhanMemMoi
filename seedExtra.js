const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./src/models/user');
const Room = require('./src/models/room');
const Amenity = require('./src/models/amenity');
const AmenitySlot = require('./src/models/amenitySlot');
const Guest = require('./src/models/guest');

const seedExtra = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/apartment_hub");
    console.log('Connected. Seeding extra data for Parking, Guests, and Amenity Slots...');

    // Clean old
    await Guest.deleteMany({});
    await AmenitySlot.deleteMany({});
    try {
      const Vehicle = require('./src/models/vehicle');
      await Vehicle.deleteMany({});
    } catch(e) { console.log('No Vehicle model or ignored'); }

    const residentUser = await User.findOne({ email: "resident@abc.com" });
    const residentRoom = await Room.findOne({ tenantId: residentUser._id });

    if (residentUser && residentRoom) {
      // Create Guests
      await Guest.create({
        residentId: residentUser._id,
        guestName: "Trần Thế Phong",
        cccd: "079123456789",
        phone: "0912345678",
        purpose: "Thăm gia đình",
        visitDate: new Date(),
        apartmentNumber: residentRoom.roomNumber,
        status: "approved"
      });
      await Guest.create({
        residentId: residentUser._id,
        guestName: "Hoàng Giao Hàng",
        cccd: "079987654321",
        phone: "0987654321",
        purpose: "Giao hàng Shopee",
        visitDate: new Date(),
        apartmentNumber: residentRoom.roomNumber,
        status: "pending"
      });

      // Create Vehicles
      try {
        const Vehicle = require('./src/models/vehicle');
        await Vehicle.create({
          residentId: residentUser._id,
          roomId: residentRoom._id,
          licensePlate: "59A-123.45",
          vehicleType: "car",
          color: "Đen",
          brand: "Toyota",
          status: "approved"
        });
        await Vehicle.create({
          residentId: residentUser._id,
          roomId: residentRoom._id,
          licensePlate: "59K1-987.65",
          vehicleType: "motorcycle",
          color: "Đỏ",
          brand: "Honda",
          status: "pending"
        });
      } catch (e) {}

      // Create Amenity Bookings
      const pool = await Amenity.findOne({ type: "pool" });
      if (pool) {
        const d = new Date();
        const dateStr = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;
        await AmenitySlot.create({
          amenityId: pool._id,
          date: dateStr,
          startTime: "16:00",
          endTime: "18:00",
          bookedCount: 3,
          capacity: pool.capacity,
          bookings: [
            {
              userId: residentUser._id,
              numberOfPeople: 3,
              createdAt: new Date()
            }
          ]
        });
      }
    }

    console.log('✅ EXTRA SEED SUCCESSFUL!');
    process.exit(0);
  } catch (err) {
    console.error('❌ EXTRA SEED FAILED:', err);
    process.exit(1);
  }
};

seedExtra();
