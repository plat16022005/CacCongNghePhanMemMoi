import { useState } from "react";
import { Car, Search, ShieldAlert, ShieldCheck } from "lucide-react";

export default function KiemTraXeGui() {
  const [licensePlate, setLicensePlate] = useState("");
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licensePlate) return;
    setErrorMsg("");
    setResult(null);
    setHasSearched(true);

    try {
      // BUG: ERR_CASE_SENSITIVE_LICENSE_PLATE
      // API gửi thẳng biển số thô lên backend, nếu gõ chữ thường thì backend không tìm ra
      const res = await fetch(`/api/guard/vehicles?licensePlate=${licensePlate}`);
      const data = await res.json();

      if (res.ok) {
        setResult(data.data);
      } else {
        setErrorMsg(data.message || "Không tìm thấy thông tin đăng ký xe");
      }
    } catch (err) {
      setErrorMsg("Lỗi kết nối server");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">Kiểm tra đăng ký xe gửi</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">Xác thực biển số xe ra vào căn hộ cư dân</p>
      </div>

      <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-3 max-w-xl">
          <div className="relative flex-1">
            <Car className="w-5 h-5 absolute left-3 top-3 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Nhập biển số xe (Ví dụ: 59U1-12345)"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)} // wait, it's setLicensePlate! Let's correct this.
              className="w-full pl-10 pr-4 py-2.5 border border-[var(--color-border)] rounded-[var(--radius-md)] outline-none text-sm focus:border-[var(--color-primary-light)] bg-[var(--color-surface)]"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-primary-light)] transition-all flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Kiểm tra</span>
          </button>
        </form>
        <p className="text-[11px] text-[var(--color-text-muted)] mt-2">
          Lưu ý: Hệ thống kiểm tra chính xác ký tự bao gồm chữ in hoa và chữ thường.
        </p>
      </div>

      {hasSearched && (
        <div className="transition-all duration-normal">
          {result ? (
            <div className="bg-green-50 border border-green-200 rounded-[var(--radius-lg)] p-6 flex flex-col md:flex-row gap-4 items-start">
              <div className="p-3 bg-green-100 rounded-full text-green-700">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-green-800 font-bold text-lg">Xe đã đăng ký hợp lệ!</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-900">
                  <div>
                    <p><strong>Biển số:</strong> {result.licensePlate}</p>
                    <p><strong>Loại xe:</strong> {result.vehicleType === "motorcycle" ? "Xe máy" : result.vehicleType === "car" ? "Ô tô" : "Xe đạp"}</p>
                    <p><strong>Hiệu xe/Màu sắc:</strong> {result.vehicleBrand} - {result.vehicleColor}</p>
                  </div>
                  <div>
                    <p><strong>Chủ xe (Cư dân):</strong> {result.residentId?.name || "N/A"}</p>
                    <p><strong>Số điện thoại:</strong> {result.residentId?.phoneNumber || "N/A"}</p>
                    <p><strong>Vị trí đỗ:</strong> Slot {result.slotNumber || "Chưa cấp"}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-[var(--radius-lg)] p-6 flex flex-col md:flex-row gap-4 items-start">
              <div className="p-3 bg-red-100 rounded-full text-red-700">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-red-800 font-bold text-lg">Cảnh báo: Xe chưa đăng ký hoặc không hợp lệ!</h3>
                <p className="text-sm text-red-700">{errorMsg}</p>
                <div className="mt-2 text-xs text-red-600 bg-red-100/50 p-2.5 rounded border border-red-200/50">
                  <strong>Mẹo kiểm thử:</strong> API này có Bug **ERR_CASE_SENSITIVE_LICENSE_PLATE**. Nếu bạn đã đăng ký xe với biển số `59U1-12345` (chữ in hoa U), bạn nhập `59u1-12345` (chữ thường u) sẽ bị báo lỗi không tìm thấy.
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
