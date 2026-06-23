import { useState, useEffect } from "react";
import { QrCode, Search, CheckCircle, XCircle, ArrowRightLeft } from "lucide-react";

interface Guest {
  _id: string;
  guestName: string;
  cccd: string;
  phone: string;
  visitDate: string;
  leaveDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected" | "arrived" | "left";
  residentId?: {
    name: string;
    phoneNumber: string;
    room?: {
      roomNumber: string;
      floor: number;
    };
  };
}

export default function QuetQRKhach() {
  const [qrInput, setQrInput] = useState("");
  const [scannedResult, setScannedResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);

  // Load guests list
  const fetchGuests = async () => {
    try {
      const res = await fetch("/api/guard/guests");
      const result = await res.json();
      if (res.ok) {
        setGuests(result.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrInput) return;
    setErrorMsg("");
    setScannedResult(null);

    try {
      const res = await fetch("/api/guard/guests/scan-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrCodeToken: qrInput }),
      });
      const result = await res.json();
      if (res.ok) {
        setScannedResult(result.data);
      } else {
        setErrorMsg(result.message || "Quét QR thất bại");
      }
    } catch (err) {
      setErrorMsg("Lỗi kết nối server");
    }
  };

  // Check-in guest
  const handleCheckin = async (guestId: string) => {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch(`/api/guard/guests/${guestId}/checkin`, {
        method: "POST",
      });
      const result = await res.json();
      if (res.ok) {
        setSuccessMsg("Xác nhận khách vào cổng thành công!");
        fetchGuests();
        // Clear scan result
        setScannedResult(null);
        setQrInput("");
      } else {
        setErrorMsg(result.message || "Check-in thất bại");
      }
    } catch (err) {
      setErrorMsg("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  // Check-out guest
  const handleCheckout = async (guestId: string) => {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch(`/api/guard/guests/${guestId}/checkout`, {
        method: "POST",
      });
      const result = await res.json();
      if (res.ok) {
        setSuccessMsg("Xác nhận khách ra cổng thành công!");
        fetchGuests();
        setScannedResult(null);
        setQrInput("");
      } else {
        setErrorMsg(result.message || "Check-out thất bại");
      }
    } catch (err) {
      setErrorMsg("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">Quét QR & Xác nhận ra vào</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">Kiểm soát dòng khách ghé thăm chung cư</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 border border-green-200">
          <CheckCircle className="w-5 h-5" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 border border-red-200">
          <XCircle className="w-5 h-5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* QR Input / Scanner Mock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <QrCode className="w-5 h-5 text-[var(--color-info)]" />
            <h2 className="font-semibold text-lg">Giả lập Quét QR Code</h2>
          </div>
          
          <form onSubmit={handleScan} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                Nhập Token QR khách cung cấp
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ví dụ: QR_64cb7... hoặc QR_OUT_..."
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] outline-none text-sm focus:border-[var(--color-primary-light)]"
                />
                <button type="submit" className="absolute right-2 top-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-[var(--color-primary)] text-white py-2 rounded-[var(--radius-md)] text-sm font-semibold hover:bg-[var(--color-primary-light)] transition-colors shadow-sm"
            >
              Kiểm tra Token
            </button>
          </form>

          {/* Scanned Result */}
          {scannedResult && (
            <div className="mt-6 p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] space-y-3">
              <h3 className="font-bold text-sm text-[var(--color-primary)] border-b pb-1.5 flex items-center justify-between">
                <span>Thông tin khách thăm</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-700 capitalize">
                  {scannedResult.status}
                </span>
              </h3>
              <div className="text-xs space-y-1.5">
                <p><strong className="text-[var(--color-text-secondary)]">Họ tên:</strong> {scannedResult.guestName}</p>
                <p><strong className="text-[var(--color-text-secondary)]">Số điện thoại:</strong> {scannedResult.phone}</p>
                <p><strong className="text-[var(--color-text-secondary)]">CCCD:</strong> {scannedResult.cccd}</p>
                <p><strong className="text-[var(--color-text-secondary)]">Cư dân tiếp đón:</strong> {scannedResult.residentName}</p>
                <p><strong className="text-[var(--color-text-secondary)]">Lý do:</strong> {scannedResult.reason || "Không ghi"}</p>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => handleCheckin(scannedResult.guestId)}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white text-xs font-bold py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Vào cổng
                </button>
                <button
                  onClick={() => handleCheckout(scannedResult.guestId)}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white text-xs font-bold py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Ra cổng
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Registered Guests list for quick action */}
        <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-[var(--color-primary)]" />
              <span>Danh sách đăng ký khách hôm nay</span>
            </h2>
            <button onClick={fetchGuests} className="text-xs text-[var(--color-info)] hover:underline">
              Làm mới
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-[var(--color-text-secondary)] bg-[var(--color-surface)]">
                  <th className="py-2.5 px-3">Tên khách</th>
                  <th className="py-2.5 px-3">Liên hệ</th>
                  <th className="py-2.5 px-3">Cư dân tiếp</th>
                  <th className="py-2.5 px-3">Trạng thái</th>
                  <th className="py-2.5 px-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {guests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-[var(--color-text-muted)]">
                      Không có khách đăng ký nào hôm nay.
                    </td>
                  </tr>
                ) : (
                  guests.map((g) => (
                    <tr key={g._id} className="hover:bg-[var(--color-surface)] transition-colors">
                      <td className="py-3 px-3 font-semibold text-[var(--color-text-primary)]">
                        {g.guestName}
                        <span className="block text-[10px] text-[var(--color-text-muted)] font-normal">
                          CCCD: {g.cccd}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[var(--color-text-secondary)]">{g.phone}</td>
                      <td className="py-3 px-3">
                        {g.residentId?.name || "Không rõ"}
                        <span className="block text-[10px] text-[var(--color-text-muted)]">
                          Phòng: {g.residentId?.room?.roomNumber || "N/A"}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          g.status === "arrived" ? "bg-green-100 text-green-700" :
                          g.status === "left" ? "bg-gray-100 text-gray-600" :
                          g.status === "approved" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {g.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex justify-center gap-1.5">
                          {/* BUG Double checkin / checkin trùng lặp: Bảo vệ có thể bấm checkin liên tục */}
                          <button
                            onClick={() => handleCheckin(g._id)}
                            className="bg-green-100 text-green-800 hover:bg-green-200 px-2 py-1 rounded text-[10px] font-semibold transition-colors"
                          >
                            Vào
                          </button>
                          
                          {/* BUG ERR_CHECKOUT_WITHOUT_CHECKIN: Cho phép click checkout thoải mái khi trạng thái không phải arrived */}
                          <button
                            onClick={() => handleCheckout(g._id)}
                            className="bg-red-100 text-red-800 hover:bg-red-200 px-2 py-1 rounded text-[10px] font-semibold transition-colors"
                          >
                            Ra
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
