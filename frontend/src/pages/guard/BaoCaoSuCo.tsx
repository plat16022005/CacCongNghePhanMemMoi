import { useState } from "react";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export default function BaoCaoSuCo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !location) {
      setErrorMsg("Vui lòng nhập đầy đủ tiêu đề, mô tả và vị trí sự cố");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/guard/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          location,
          images: images ? images.split(",").map(i => i.trim()) : []
        })
      });

      const result = await res.json();
      if (res.ok) {
        setSuccessMsg("Báo cáo sự cố an ninh thành công!");
        setTitle("");
        setDescription("");
        setLocation("");
        setImages("");
      } else {
        setErrorMsg(result.message || "Không thể gửi báo cáo");
      }
    } catch (err) {
      setErrorMsg("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-primary)] flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-red-600 animate-pulse" />
          <span>Ghi nhận sự cố an ninh</span>
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">Lập biên bản sự cố mất an ninh trật tự, hỏa hoạn, hỏng hóc nghiêm trọng</p>
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

      <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase mb-1">
              Tiêu đề sự cố <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Đột nhập trái phép tầng 4 block B"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] outline-none text-sm focus:border-[var(--color-primary-light)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase mb-1">
              Vị trí xảy ra <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Hành lang thang máy block B, Tầng 4"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] outline-none text-sm focus:border-[var(--color-primary-light)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase mb-1">
              Mô tả chi tiết sự việc <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Mô tả cụ thể sự việc, diễn biến, thiệt hại (nếu có)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] outline-none text-sm focus:border-[var(--color-primary-light)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase mb-1">
              Hình ảnh hiện trường (Link ảnh, cách nhau bằng dấu phẩy)
            </label>
            <input
              type="text"
              placeholder="Ví dụ: https://images.com/pic1.jpg, https://images.com/pic2.jpg"
              value={images}
              onChange={(e) => setImages(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] outline-none text-sm focus:border-[var(--color-primary-light)]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2.5 rounded-[var(--radius-md)] text-sm font-semibold hover:bg-red-700 transition-colors shadow-sm"
          >
            {loading ? "Đang gửi báo cáo..." : "Gửi báo cáo biên bản sự cố"}
          </button>
        </form>
      </div>
    </div>
  );
}
