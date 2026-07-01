const RoomInvoice = require("../models/roomInvoice");
const Room = require("../models/room");
const ServiceFee = require("../models/serviceFee");

class AccountantInvoiceService {
  async getInvoices(query) {
    const { status, type, month, apartmentId, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (month) filter.period = month;
    if (apartmentId) filter.roomId = apartmentId;

    const invoices = await RoomInvoice.find(filter)
      .populate("room", "roomNumber area")
      .populate("tenant", "name phone")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await RoomInvoice.countDocuments(filter);

    return {
      data: invoices,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    };
  }

  async getInvoiceById(id) {
    const invoice = await RoomInvoice.findById(id)
      .populate("room", "roomNumber area")
      .populate("tenant", "name phone");
    if (!invoice) throw { status: 404, message: "Không tìm thấy hóa đơn" };
    return invoice;
  }

  async createInvoice(data) {
    if (data.amount < 0) {
      throw { status: 400, message: "Số tiền không được âm" };
    }

    // Retrieve room to get tenantId
    const room = await Room.findById(data.apartmentId);
    if (!room) throw { status: 404, message: "Không tìm thấy căn hộ" };

    const invoice = new RoomInvoice({
      roomId: room._id,
      tenantId: room.tenantId, // might be null if vacant, should handle
      type: data.type,
      period: data.period,
      month: data.period, // for backward compatibility with existing schema
      amount: data.amount,
      totalBill: data.amount,
      dueDate: data.dueDate,
      details: data.details,
      status: "unpaid" // Set as unpaid immediately or draft
    });

    await invoice.save();
    return invoice;
  }

  async createBulkInvoices(data) {
    const { period, type, dueDate, pricePerSqm, targetApartments } = data;
    
    let rooms = [];
    if (targetApartments === "all") {
      rooms = await Room.find({ status: "occupied" }); // Only occupied rooms
    } else {
      rooms = await Room.find({ _id: { $in: targetApartments } });
    }

    let created = 0;
    let skipped = 0;
    const invoicesToInsert = [];

    for (const room of rooms) {
      if (!room.tenantId) {
        skipped++;
        continue;
      }

      // Loại bỏ việc check tay từng bản ghi vì có index ở Database xử lý atomic rồi
      if (pricePerSqm < 0) {
        throw { status: 400, message: "Số tiền không được âm" };
      }

      const amount = (room.area || 0) * pricePerSqm;
      
      invoicesToInsert.push({
        roomId: room._id,
        tenantId: room.tenantId,
        type: type,
        period: period,
        month: period,
        amount: amount,
        totalBill: amount,
        dueDate: dueDate,
        status: "unpaid"
      });
    }

    if (invoicesToInsert.length > 0) {
      try {
        const result = await RoomInvoice.insertMany(invoicesToInsert, { ordered: false });
        created = result.length;
      } catch (err) {
        if (err.code === 11000 || err.writeErrors) {
          const insertedCount = err.result?.nInserted ?? 0;
          created = insertedCount;
          skipped = invoicesToInsert.length - insertedCount;
          console.warn(`Bulk invoice: ${insertedCount} tạo mới, ${skipped} bị trùng kỳ - đã bỏ qua`);
        } else {
          throw err;
        }
      }
    }

    return { created, skipped, errors: [] };
  }

  async updateInvoice(id, data) {
    const invoice = await RoomInvoice.findById(id);
    if (!invoice) throw { status: 404, message: "Không tìm thấy" };
    if (invoice.status === "paid") throw { status: 400, message: "Không thể sửa hóa đơn đã thanh toán" };

    Object.assign(invoice, data);
    if (data.amount) invoice.totalBill = data.amount;
    
    await invoice.save();
    return invoice;
  }

  async deleteInvoice(id) {
    const invoice = await RoomInvoice.findById(id);
    if (!invoice) throw { status: 404, message: "Không tìm thấy" };
    if (invoice.status !== "draft" && invoice.status !== "unpaid") {
      throw { status: 400, message: "Chỉ được xóa hóa đơn nháp hoặc chưa thanh toán" };
    }
    await RoomInvoice.findByIdAndDelete(id);
    return { success: true };
  }

  // --- SERVICE FEES CRUD ---
  async getServiceFees() {
    return await ServiceFee.find().sort({ type: 1 });
  }

  async createServiceFee(data) {
    const fee = new ServiceFee(data);
    await fee.save();
    return fee;
  }

  async updateServiceFee(id, data) {
    return await ServiceFee.findByIdAndUpdate(id, data, { new: true });
  }
}

module.exports = new AccountantInvoiceService();
