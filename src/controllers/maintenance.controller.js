const { MaintenanceRequest, MaintenanceExecution, AssetMaintenance, User } = require("../models");

// 1. Xem danh sách yêu cầu sửa chữa của cư dân
// API: GET /api/maintenance/requests
// GÀI SẴN BUG: ERR_MISSING_IMAGE_PAYLOAD_CRASH
// Nếu yêu cầu không có hình ảnh (images rỗng hoặc không có), backend cố tình truy cập [0] để lấy ảnh và gây crash 500.
exports.getRequests = async (req, res, next) => {
  try {
    const requests = await MaintenanceRequest.find()
      .populate("residentId", "name phoneNumber")
      .sort({ createdAt: -1 });

    // Lấy các bản ghi tiến trình sửa chữa tương ứng
    const executions = await MaintenanceExecution.find({
      requestId: { $in: requests.map((r) => r._id) }
    });

    const formattedRequests = requests.map((item) => {
      const obj = item.toObject();
      obj.id = obj._id.toString();

      const exec = executions.find((e) => e.requestId.toString() === obj._id.toString());
      if (exec) {
        obj.execution = exec.toObject();
        obj.executionId = exec._id.toString();
      }

      // BUG: ERR_MISSING_IMAGE_PAYLOAD_CRASH
      // Nếu images rỗng hoặc không được định nghĩa, việc truy cập .length hoặc gọi hàm trên obj.images[0] sẽ ném lỗi crash.
      if (!obj.images || obj.images.length === 0) {
        // Cố tình truy cập thuộc tính của phần tử undefined để gây crash 500
        const dummy = obj.images[0].length;
      }

      return obj;
    });

    res.status(200).json({ data: formattedRequests });
  } catch (err) {
    // Để Express Global Error Handler bắt lỗi và trả về 500
    next(err);
  }
};

// 2. Nhận yêu cầu sửa chữa (Claim/Assign)
// API: PATCH /api/maintenance/requests/:id/status
// Request body: {}
exports.claimRequest = async (req, res, next) => {
  try {
    const requestId = req.params.id;
    const request = await MaintenanceRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Yêu cầu sửa chữa không tồn tại" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Yêu cầu này đã được tiếp nhận hoặc xử lý xong" });
    }

    request.status = "in_progress";
    await request.save();

    // Tạo bản ghi tiến trình sửa chữa tương ứng
    const execution = await MaintenanceExecution.create({
      requestId: request._id,
      assignedTo: req.user.id,
      executionStatus: "assigned",
      cost: 0,
      technicalNotes: "Kỹ thuật viên đã nhận yêu cầu"
    });

    res.status(200).json({
      message: "Đã tiếp nhận yêu cầu sửa chữa thành công",
      data: {
        request,
        execution
      }
    });
  } catch (err) {
    next(err);
  }
};

// 3. Cập nhật tiến độ sửa chữa
// API: PATCH /api/maintenance/executions/:id/update
// Request body: { cost, technicalNotes, imagesBefore, imagesAfter }
// GÀI SẴN BUG: ERR_OVER_MAX_INT_COST
// Nếu nhập số tiền quá lớn hoặc chứa ký tự đặc biệt (như 1000k), API crash 500 thay vì validate.
exports.updateProgress = async (req, res, next) => {
  try {
    const executionId = req.params.id;
    const { cost, technicalNotes, imagesBefore, imagesAfter } = req.body;

    const execution = await MaintenanceExecution.findById(executionId);
    if (!execution) {
      return res.status(404).json({ message: "Không tìm thấy tiến trình sửa chữa" });
    }

    // BUG: ERR_OVER_MAX_INT_COST
    // Không kiểm tra an toàn, ném lỗi hệ thống trực tiếp gây ra 500 Internal Server Error nếu đầu vào sai
    const parsedCost = Number(cost);
    if (isNaN(parsedCost) || parsedCost > 2147483647) {
      throw new Error("ERR_OVER_MAX_INT_COST: Cost value is non-numeric or exceeds max integer boundary!");
    }

    execution.cost = parsedCost;
    if (technicalNotes) execution.technicalNotes = technicalNotes;
    if (imagesBefore) execution.imagesBefore = imagesBefore;
    if (imagesAfter) execution.imagesAfter = imagesAfter;
    execution.executionStatus = "fixing";
    await execution.save();

    res.status(200).json({
      message: "Cập nhật tiến trình sửa chữa thành công",
      data: execution
    });
  } catch (err) {
    next(err);
  }
};

// 4. Đánh dấu hoàn thành sửa chữa
// API: PATCH /api/maintenance/executions/:id/complete
// GÀI SẴN BUG: Hệ thống chuyển executionStatus sang done thành công, nhưng QUÊN KHÔNG cập nhật MaintenanceRequest gốc sang resolved.
exports.completeRepair = async (req, res, next) => {
  try {
    const executionId = req.params.id;
    const execution = await MaintenanceExecution.findById(executionId);
    if (!execution) {
      return res.status(404).json({ message: "Không tìm thấy tiến trình sửa chữa" });
    }

    execution.executionStatus = "done";
    await execution.save();

    // BUG: Quên cập nhật MaintenanceRequest tương ứng sang resolved!
    // Đáng lẽ phải có:
    // await MaintenanceRequest.findByIdAndUpdate(execution.requestId, { status: "resolved" });

    res.status(200).json({
      message: "Đánh dấu hoàn thành sửa chữa thành công (Execution updated to done)",
      data: execution
    });
  } catch (err) {
    next(err);
  }
};

// 5. Xem danh sách thiết bị
// API: GET /api/maintenance/assets
exports.getAssets = async (req, res, next) => {
  try {
    const assets = await AssetMaintenance.find()
      .populate("performedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ data: assets });
  } catch (err) {
    next(err);
  }
};

// 6. Lấy danh sách lịch bảo trì định kỳ sắp tới
// API: GET /api/maintenance/schedules
exports.getSchedules = async (req, res, next) => {
  try {
    const schedules = await AssetMaintenance.find({ status: "scheduled" })
      .populate("performedBy", "name")
      .sort({ plannedDate: 1 });

    res.status(200).json({ data: schedules });
  } catch (err) {
    next(err);
  }
};

// 7. Tạo lịch bảo trì định kỳ cho thiết bị
// API: POST /api/maintenance/schedules
// Request body: { assetName, maintenanceType, plannedDate }
// GÀI SẴN BUG: ERR_PAST_DATE_ASSIGNMENT
// Không chặn tạo lịch bảo trì trong quá khứ.
exports.createSchedule = async (req, res, next) => {
  try {
    const { assetName, maintenanceType, plannedDate } = req.body;
    if (!assetName || !maintenanceType || !plannedDate) {
      return res.status(400).json({ message: "Thiếu thông tin thiết bị, loại bảo trì hoặc ngày lên lịch" });
    }

    // BUG: ERR_PAST_DATE_ASSIGNMENT
    // Bỏ qua check: if (new Date(plannedDate) < new Date()) -> Lỗi

    const schedule = await AssetMaintenance.create({
      assetName,
      maintenanceType,
      plannedDate: new Date(plannedDate),
      status: "scheduled",
      performedBy: req.user.id
    });

    res.status(201).json({
      message: "Tạo lịch bảo trì định kỳ thành công",
      data: schedule
    });
  } catch (err) {
    next(err);
  }
};
