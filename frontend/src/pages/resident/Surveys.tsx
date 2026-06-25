import { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Surveys() {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurvey, setSelectedSurvey] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);

  useEffect(() => { fetchSurveys(); }, []);

  const fetchSurveys = async () => {
    try {
      const res = await fetch('/api/resident/surveys');
      const json = await res.json();
      if (!json.error) setSurveys(json.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const openSurvey = (survey: any) => {
    setSelectedSurvey(survey);
    setAnswers(survey.questions.map((q: any, i: number) => ({ questionId: i + 1, value: '' })));
  };

  const updateAnswer = (index: number, value: string) => {
    const newAns = [...answers];
    newAns[index].value = value;
    setAnswers(newAns);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/resident/surveys/${selectedSurvey._id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });
      const json = await res.json();
      if (!json.error) {
        alert('Đã gửi bình chọn thành công! Cảm ơn bạn.');
        setSelectedSurvey(null);
        fetchSurveys();
      } else {
        alert(json.message);
      }
    } catch (err) { alert('Lỗi kết nối'); }
  };

  if (loading) return <div className="p-6">Đang tải...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 relative">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">Khảo sát & Bình chọn</h1>
        <p className="text-[var(--color-text-secondary)]">Tham gia đóng góp ý kiến xây dựng cộng đồng</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {surveys.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white rounded-lg border text-gray-500">Hiện tại không có khảo sát nào mở.</div>
        ) : (
          surveys.map((s) => (
            <div key={s._id} className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-6 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-light)]/20 text-[var(--color-primary)] flex items-center justify-center">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg">{s.title}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-6 flex-1">{s.description}</p>
              
              <button 
                onClick={() => openSurvey(s)}
                className="w-full bg-[var(--color-primary)] text-white py-2.5 rounded-lg font-bold hover:bg-[var(--color-primary-light)] transition"
              >
                Tham gia khảo sát
              </button>
            </div>
          ))
        )}
      </div>

      {/* Survey Modal */}
      {selectedSurvey && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[var(--radius-lg)] p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-2 text-[var(--color-primary)]">{selectedSurvey.title}</h2>
            <p className="text-gray-500 text-sm mb-6 pb-4 border-b">{selectedSurvey.description}</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {selectedSurvey.questions.map((q: any, i: number) => (
                <div key={i} className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-bold text-gray-800 mb-3">{i + 1}. {q.text}</p>
                  
                  {q.type === 'multiple_choice' ? (
                    <div className="flex flex-col gap-2">
                      {q.options.map((opt: string, idx: number) => (
                        <label key={idx} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 p-2 rounded transition">
                          <input 
                            type="radio" 
                            name={`q_${i}`} 
                            required 
                            value={opt} 
                            onChange={(e) => updateAnswer(i, e.target.value)}
                            className="w-4 h-4 text-[var(--color-primary)]" 
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <textarea 
                      required 
                      rows={3} 
                      placeholder="Nhập câu trả lời của bạn..." 
                      className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-[var(--color-primary)]"
                      onChange={(e) => updateAnswer(i, e.target.value)}
                    />
                  )}
                </div>
              ))}
              
              <div className="flex gap-3 mt-4 sticky bottom-0 bg-white py-2 border-t border-gray-100">
                <button type="button" onClick={() => setSelectedSurvey(null)} className="flex-1 py-3 border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-gray-50">Đóng</button>
                <button type="submit" className="flex-1 py-3 bg-[var(--color-primary)] text-white rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-[var(--color-primary-light)]">
                  <CheckCircle2 className="w-5 h-5" /> Nộp bài
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
