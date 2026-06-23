import { useState, useEffect } from "react";
import { Wrench, RefreshCw } from "lucide-react";

interface MaintenanceRequest {
  id: string;
  _id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "resolved";
  images?: string[];
  residentId?: {
    name: string;
    phoneNumber: string;
  };
  createdAt: string;
}

export default function YeuCauSuaChua() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // States for updating progress modal
  const [activeRequest, setActiveRequest] = useState<any>(null);
  const [cost, setCost] = useState("");
  const [notes, setNotes] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch("/api/maintenance/requests");
      const result = await res.json();
      if (res.ok) {
        setRequests(result.data || []);
      } else {
        // BUG: ERR_MISSING_IMAGE_PAYLOAD_CRASH
        // Nếu có đơn không có ảnh, API backend crash 500 và trả về lỗi
        setErrorMsg(result.message || "Lỗi tải yêu cầu (ERR_MISSING_IMAGE_PAYLOAD_CRASH)");
      }
    } catch (err) {
      setErrorMsg("Lỗi kết nối hoặc API bị crash 500 do lỗi truy cập mảng ảnh rỗng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Claim/Accept repair request
  const handleClaim = async (id: string) => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch(`/api/maintenance/requests/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      });
      const result = await res.json();
      if (res.ok) {
        setSuccessMsg("Đã nhận sửa chữa thành công!");
        fetchRequests();
      } else {
        setErrorMsg(result.message || "Không thể nhận yêu cầu");
      }
    } catch (err) {
      setErrorMsg("Lỗi kết nối");
    }
  };

  // Open update progress panel
  const openUpdatePanel = async (reqItem: MaintenanceRequest) => {
    setErrorMsg("");
    setSuccessMsg("");
    
    // Tìm execution tương ứng của request này
    try {
      await fetch("/api/maintenance/assets"); // Mock/fetch chung hoặc lấy tạm thông tin
      setActiveRequest(reqItem);
      setCost("150000"); // Mặc định phí linh kiện nháp
      setNotes("Đang tiến hành tháo kiểm tra linh kiện.");
    } catch (err) {
      console.error(err);
    }
  };

  // Submit update progress hoặc hoàn thành sửa chữa
  const handleUpdateProgress = async (isComplete: boolean) => {
    if (!activeRequest || !activeRequest.executionId) {
      setErrorMsg("Không tìm thấy thông tin tiến trình sửa chữa tương ứng");
      return;
    }
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const endpoint = isComplete 
        ? `/api/maintenance/executions/${activeRequest.executionId}/complete`
        : `/api/maintenance/executions/${activeRequest.executionId}/update`;

      const body = isComplete ? {} : { cost, technicalNotes: notes };

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      if (res.ok) {
        setSuccessMsg(isComplete ? "Xác nhận hoàn thành sửa chữa thành công!" : "Cập nhật tiến trình sửa chữa thành công!");
        setActiveRequest(null);
        fetchRequests();
      } else {
        setErrorMsg(result.message || "Thao tác thất bại");
      }
    } catch (err) {
      setErrorMsg("Lỗi: Máy chủ bị crash 500 do số tiền vượt quá giới hạn (ERR_OVER_MAX_INT_COST) hoặc lỗi kết nối!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">Phiếu phản ánh sự cố & sửa chữa</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">Tiếp nhận yêu cầu báo hỏng và cập nhật tiến trình sửa chữa</p>
        </div>
        <button
          onClick={fetchRequests}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] text-xs font-semibold hover:bg-[var(--color-surface)]"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Làm mới</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 text-sm">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm space-y-2">
          <div>{errorMsg}</div>
          <div className="text-[10px] text-red-600 bg-red-100 p-2.5 rounded border border-red-200">
            <strong>Bug gài sẵn (ERR_MISSING_IMAGE_PAYLOAD_CRASH):</strong> Khi lấy danh sách yêu cầu, nếu có bất kỳ phiếu nào cư dân không gửi ảnh kèm theo, server sẽ bị crash 500 do cố gắng truy cập phần tử ảnh rỗng.
          </div>
        </div>
      )}

      {/* Requests list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((r) => (
          <div key={r._id} className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  r.status === "resolved" ? "bg-green-100 text-green-700" :
                  r.status === "in_progress" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                }`}>
                  {r.status === "resolved" ? "Đã sửa xong" : r.status === "in_progress" ? "Đang sửa" : "Chờ tiếp nhận"}
                </span>
                <span className="text-[10px] text-[var(--color-text-muted)]">
                  {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-[var(--color-text-primary)]">{r.title}</h3>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1.5 line-clamp-3">{r.description}</p>
              </div>

              <div className="text-xs bg-[var(--color-surface)] p-3 rounded">
                <p><strong>Cư dân báo:</strong> {r.residentId?.name || "N/A"}</p>
                <p><strong>Liên hệ:</strong> {r.residentId?.phoneNumber || "N/A"}</p>
              </div>
            </div>

            <div className="p-4 bg-[var(--color-surface)] border-t border-[var(--color-border)] flex gap-2">
              {r.status === "pending" && (
                <button
                  onClick={() => handleClaim(r._id)}
                  className="w-full bg-[var(--color-primary)] text-white text-xs font-semibold py-2 rounded hover:bg-[var(--color-primary-light)] transition-colors"
                >
                  Tiếp nhận sửa chữa
                </button>
              )}

              {r.status === "in_progress" && (
                <button
                  onClick={() => openUpdatePanel(r)}
                  className="w-full bg-yellow-500 text-white text-xs font-semibold py-2 rounded hover:bg-yellow-600 transition-colors"
                >
                  Cập nhật tiến trình & Hoàn thành
                </button>
              )}

              {r.status === "resolved" && (
                <div className="w-full text-center text-green-700 text-xs font-bold py-2">
                  ✓ Đã khắc phục sự cố
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Progress update section */}
      {activeRequest && (
        <div className="bg-yellow-50/50 p-6 rounded-[var(--radius-lg)] border border-yellow-200 space-y-4 max-w-xl">
          <div className="flex justify-between items-center border-b border-yellow-200 pb-2">
            <h3 className="font-bold text-yellow-800 flex items-center gap-1.5 text-sm">
              <Wrench className="w-4 h-4" />
              <span>Tiến độ sửa chữa: {activeRequest.title}</span>
            </h3>
            <button onClick={() => setActiveRequest(null)} className="text-xs text-yellow-800 font-bold hover:underline">
              Hủy bỏ
            </button>
          </div>

          <div className="text-xs text-yellow-700 leading-relaxed">
            Nhập chi phí linh kiện vật tư thực tế và ghi chú kỹ thuật để lưu tiến độ hoặc kết thúc phiếu yêu cầu này.
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-yellow-800 mb-1">
                Chi phí linh kiện phát sinh (VND) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full px-3 py-2 border border-yellow-300 rounded bg-white text-sm outline-none"
                placeholder="Ví dụ: 150000"
              />
              <p className="text-[10px] text-red-500 font-semibold mt-1">
                * Bug gài sẵn (ERR_OVER_MAX_INT_COST): Nếu bạn gõ chữ (ví dụ "150k") hoặc số vượt quá giới hạn integer, API backend sẽ crash 500 thay vì báo lỗi validate.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-yellow-800 mb-1">Ghi chú kỹ thuật</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-yellow-300 rounded bg-white text-sm outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleUpdateProgress(false)}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-bold py-2 rounded transition-colors"
              >
                Lưu tiến độ (Fixing)
              </button>
              <button
                onClick={() => handleUpdateProgress(true)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 rounded transition-colors"
              >
                Hoàn thành sửa chữa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
