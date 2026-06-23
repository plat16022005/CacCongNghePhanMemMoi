import { useState, useEffect } from "react";
import { PlusCircle, FileText, CheckCircle, XCircle } from "lucide-react";

interface Room {
  id: string;
  roomNumber: string;
  rentalPrice: number;
  tenant?: {
    name: string;
    id: string;
  };
}

export default function TaoHoaDon() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [month, setMonth] = useState("2026-06");
  const [oldElec, setOldElec] = useState(100);
  const [newElec, setNewElec] = useState(150);
  const [oldWater, setOldWater] = useState(20);
  const [newWater, setNewWater] = useState(25);
  const [serviceFee, setServiceFee] = useState(150000);
  const [vehicleFee, setVehicleFee] = useState(100000);
  const [discount, setDiscount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("/api/rooms");
        const result = await res.json();
        if (res.ok) {
          // Chỉ lấy phòng có người thuê (occupied)
          const occupied = (result.data || []).filter((r: any) => r.tenant !== null);
          setRooms(occupied);
          if (occupied.length > 0) {
            setSelectedRoomId(occupied[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRooms();
  }, []);

  const selectedRoom = rooms.find(r => r.id === selectedRoomId);

  // Live calculation of fees
  // BUG: newElec < oldElec calculation is not validated and can result in negative values
  const elecKwh = newElec - oldElec;
  const waterM3 = newWater - oldWater;
  const electricityFee = elecKwh * 2000;
  const waterFee = waterM3 * 10000;
  const basePrice = selectedRoom?.rentalPrice || 0;
  const totalBill = basePrice + electricityFee + waterFee + serviceFee + vehicleFee - discount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomId) {
      setErrorMsg("Vui lòng chọn một căn hộ");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/accountant/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: selectedRoomId,
          month,
          oldElec,
          newElec,
          oldWater,
          newWater,
          serviceFee,
          vehicleFee,
          discount
        })
      });

      const result = await res.json();
      if (res.ok) {
        setSuccessMsg("Tạo hóa đơn tháng thành công!");
      } else {
        setErrorMsg(result.message || "Tạo hóa đơn thất bại");
      }
    } catch (err) {
      setErrorMsg("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-primary)] flex items-center gap-2">
          <PlusCircle className="w-6 h-6" />
          <span>Tạo Hóa đơn hàng tháng</span>
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">Tính phí tiền phòng, điện nước và dịch vụ</p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form Form */}
        <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase mb-1">
                Chọn Căn hộ (Đang thuê) <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] outline-none text-sm focus:border-[var(--color-primary-light)] bg-white"
              >
                {rooms.length === 0 ? (
                  <option value="">Không có căn hộ nào đang có người ở</option>
                ) : (
                  rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      Phòng {r.roomNumber} - {r.tenant?.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase mb-1">
                  Kỳ hóa đơn
                </label>
                <input
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] outline-none text-sm focus:border-[var(--color-primary-light)]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase mb-1">
                  Tiền phòng cơ bản
                </label>
                <input
                  type="text"
                  value={basePrice.toLocaleString() + " đ"}
                  disabled
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] outline-none text-sm bg-[var(--color-surface)] text-[var(--color-text-muted)]"
                />
              </div>
            </div>

            {/* Electricity Indices */}
            <div className="bg-[var(--color-surface)] p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] space-y-3">
              <h3 className="text-xs font-bold text-[var(--color-primary)] uppercase">Chỉ số Điện</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] mb-1">Số cũ (kWh)</label>
                  <input
                    type="number"
                    value={oldElec}
                    onChange={(e) => setOldElec(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded bg-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] mb-1">Số mới (kWh)</label>
                  <input
                    type="number"
                    value={newElec}
                    onChange={(e) => setNewElec(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded bg-white text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Water Indices */}
            <div className="bg-[var(--color-surface)] p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] space-y-3">
              <h3 className="text-xs font-bold text-[var(--color-primary)] uppercase">Chỉ số Nước</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] mb-1">Số cũ (m3)</label>
                  <input
                    type="number"
                    value={oldWater}
                    onChange={(e) => setOldWater(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded bg-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] mb-1">Số mới (m3)</label>
                  <input
                    type="number"
                    value={newWater}
                    onChange={(e) => setNewWater(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded bg-white text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Fees and Discounts */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase mb-1">Phí quản lý</label>
                <input
                  type="number"
                  value={serviceFee}
                  onChange={(e) => setServiceFee(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase mb-1">Phí xe gửi</label>
                <input
                  type="number"
                  value={vehicleFee}
                  onChange={(e) => setVehicleFee(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase mb-1">Giảm giá chiết khấu</label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-primary)] text-white py-2.5 rounded-[var(--radius-md)] text-sm font-semibold hover:bg-[var(--color-primary-light)] transition-colors shadow-sm"
            >
              {loading ? "Đang xử lý..." : "Lập Hóa đơn và Phát hành"}
            </button>
          </form>
        </div>

        {/* Live Calculation Panel */}
        <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm md:col-span-1 h-fit space-y-4">
          <h3 className="font-bold text-sm text-[var(--color-primary)] border-b pb-2 flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            <span>Kết quả tính hóa đơn nháp</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">Tiền phòng cơ bản:</span>
              <span className="font-semibold">{basePrice.toLocaleString()} đ</span>
            </div>
            
            <div className="flex justify-between items-start">
              <span className="text-[var(--color-text-secondary)]">Tiền điện ({elecKwh} kWh):</span>
              <span className={`font-semibold ${electricityFee < 0 ? "text-red-500 font-bold" : ""}`}>
                {electricityFee.toLocaleString()} đ
              </span>
            </div>
            
            <div className="flex justify-between items-start">
              <span className="text-[var(--color-text-secondary)]">Tiền nước ({waterM3} m3):</span>
              <span className={`font-semibold ${waterFee < 0 ? "text-red-500 font-bold" : ""}`}>
                {waterFee.toLocaleString()} đ
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">Phí dịch vụ tòa nhà:</span>
              <span className="font-semibold">{serviceFee.toLocaleString()} đ</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">Phí gửi xe:</span>
              <span className="font-semibold">{vehicleFee.toLocaleString()} đ</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Chiết khấu giảm giá:</span>
                <span>-{discount.toLocaleString()} đ</span>
              </div>
            )}

            <div className="pt-3 border-t flex justify-between items-center text-sm font-bold text-[var(--color-primary)]">
              <span>TỔNG TIỀN:</span>
              <span className="text-base text-[var(--color-info)]">{totalBill.toLocaleString()} đ</span>
            </div>
          </div>

          {(electricityFee < 0 || waterFee < 0) && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-[10px] rounded leading-relaxed">
              <strong>Phát hiện Bug (Lỗi tính toán chỉ số âm):</strong> Do bạn nhập số mới nhỏ hơn số cũ, hệ thống tính ra tiền điện/nước âm và giảm trừ trực tiếp vào TỔNG TIỀN hóa đơn!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
