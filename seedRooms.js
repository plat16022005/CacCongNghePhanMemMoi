const mongoose = require("mongoose");
const Room = require("./src/models/room");
const connectDB = require("./src/config/configdb");

const sampleRooms = [
  {
    roomNumber: "A-1201",
    floor: 12,
    area: 75,
    bedroomCount: 2,
    bathroomCount: 2,
    maxOccupants: 4,
    rentalPrice: 12500000,
    depositAmount: 12500000,
    description: "Căn hộ cao cấp 2 phòng ngủ với tầm nhìn Panorama toàn cảnh thành phố. Thiết kế hiện đại, ngập tràn ánh sáng tự nhiên. Nội thất cơ bản cao cấp từ chủ đầu tư.",
    status: "available",
    block: "A",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1529808119?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    roomNumber: "B-0805",
    floor: 8,
    area: 55,
    bedroomCount: 1,
    bathroomCount: 1,
    maxOccupants: 2,
    rentalPrice: 8500000,
    depositAmount: 8500000,
    description: "Căn hộ studio 1 phòng ngủ ấm cúng, phù hợp cho người độc thân hoặc cặp đôi trẻ. Đầy đủ tiện nghi cơ bản, view nội khu hồ bơi yên tĩnh.",
    status: "available",
    block: "B",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    roomNumber: "C-2502",
    floor: 25,
    area: 110,
    bedroomCount: 3,
    bathroomCount: 2,
    maxOccupants: 6,
    rentalPrice: 18000000,
    depositAmount: 18000000,
    description: "Penthouse góc siêu rộng 3 phòng ngủ. Không gian mở, ban công lớn đón nắng gió. Bếp chữ U sang trọng, hệ thống Smart Home tích hợp.",
    status: "available",
    block: "C",
    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    roomNumber: "A-0504",
    floor: 5,
    area: 65,
    bedroomCount: 2,
    bathroomCount: 1,
    maxOccupants: 3,
    rentalPrice: 10500000,
    depositAmount: 10500000,
    description: "Căn hộ tầm trung lý tưởng cho gia đình nhỏ. Nằm tại tầng 5 tiện di chuyển, gần khu vui chơi trẻ em nội khu. Thoáng mát, an ninh tốt.",
    status: "available",
    block: "A",
    images: [
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    roomNumber: "B-1509",
    floor: 15,
    area: 85,
    bedroomCount: 2,
    bathroomCount: 2,
    maxOccupants: 4,
    rentalPrice: 14000000,
    depositAmount: 14000000,
    description: "Thiết kế tân cổ điển độc đáo. Sàn gỗ sồi cao cấp, tường ốp sang trọng. Có sẵn tủ bếp trên dưới và máy lạnh các phòng.",
    status: "available",
    block: "B",
    images: [
      "https://images.unsplash.com/photo-1499916078039-922301b0eb9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    roomNumber: "C-1011",
    floor: 10,
    area: 92,
    bedroomCount: 3,
    bathroomCount: 2,
    maxOccupants: 5,
    rentalPrice: 15500000,
    depositAmount: 15500000,
    description: "Căn 3 phòng ngủ có diện tích tối ưu, đón hướng gió Đông Nam mát mẻ quanh năm. Không gian bếp tách biệt hạn chế mùi khi nấu nướng.",
    status: "available",
    block: "C",
    images: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    roomNumber: "A-2015",
    floor: 20,
    area: 45,
    bedroomCount: 1,
    bathroomCount: 1,
    maxOccupants: 2,
    rentalPrice: 7500000,
    depositAmount: 7500000,
    description: "Tổ ấm nhỏ xinh tầng cao, cực chill khi ngắm thành phố về đêm. Nội thất tối giản phong cách Japandi, tiết kiệm năng lượng.",
    status: "available",
    block: "A",
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    roomNumber: "B-0302",
    floor: 3,
    area: 120,
    bedroomCount: 3,
    bathroomCount: 3,
    maxOccupants: 6,
    rentalPrice: 16500000,
    depositAmount: 16500000,
    description: "Căn duplex tầng thấp cực hiếm. Không gian chia làm 2 tầng sinh hoạt riêng biệt. Có khoảng sân nhỏ trồng cây ngoài ban công.",
    status: "available",
    block: "B",
    images: [
      "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd28?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4ea0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ]
  }
];

async function seed() {
  try {
    await connectDB();
    console.log("Connected to DB, starting seed...");

    // Delete existing test rooms if needed, here we just insert
    // Note: roomNumber must be unique. Let's delete any rooms with these numbers first.
    const roomNumbers = sampleRooms.map(r => r.roomNumber);
    await Room.deleteMany({ roomNumber: { $in: roomNumbers } });

    await Room.insertMany(sampleRooms);
    
    console.log("Successfully inserted beautiful sample rooms!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
