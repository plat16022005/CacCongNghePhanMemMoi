export default function ApartmentCardSkeleton() {
  return (
    <div className="bg-white rounded-[2rem] border border-[#e1e8f0] overflow-hidden shadow-sm flex flex-col animate-pulse">
      <div className="h-48 bg-slate-200"></div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="h-6 w-32 bg-slate-200 rounded mb-2"></div>
            <div className="h-4 w-24 bg-slate-200 rounded"></div>
          </div>
          <div className="text-right">
            <div className="h-6 w-28 bg-slate-200 rounded mb-1"></div>
            <div className="h-3 w-12 bg-slate-200 rounded ml-auto"></div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6 border-y border-slate-100 py-4">
          <div className="flex flex-col items-center">
            <div className="h-5 w-5 bg-slate-200 rounded-full mb-2"></div>
            <div className="h-4 w-12 bg-slate-200 rounded"></div>
          </div>
          <div className="flex flex-col items-center border-x border-slate-100">
            <div className="h-5 w-5 bg-slate-200 rounded-full mb-2"></div>
            <div className="h-4 w-12 bg-slate-200 rounded"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-5 w-5 bg-slate-200 rounded-full mb-2"></div>
            <div className="h-4 w-12 bg-slate-200 rounded"></div>
          </div>
        </div>

        <div className="space-y-2 mb-6 flex-1">
          <div className="h-4 w-full bg-slate-200 rounded"></div>
          <div className="h-4 w-4/5 bg-slate-200 rounded"></div>
        </div>

        <div className="w-full h-12 bg-slate-200 rounded-xl"></div>
      </div>
    </div>
  );
}
