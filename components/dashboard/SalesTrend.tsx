import { SalesTrendPoint } from "@/types/analytics.types";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

interface Props {
  data?: SalesTrendPoint[];
  isLoading?: boolean;
}

export const SalesTrend = ({ data, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-pulse h-[400px]">
        <div className="h-6 bg-slate-100 rounded w-48 mb-8"></div>
        <div className="h-64 bg-slate-50 rounded w-full"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center h-[400px] text-slate-400">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2 self-start">Sales Performance</h3>
        <p className="text-sm font-medium">No sales data recorded for this period.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 leading-none">Performance</p>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Sales Trend</h3>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
              <span className="w-2 h-2 rounded-full bg-indigo-600" /> Revenue
           </div>
           <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-300" /> Units
           </div>
        </div>
      </div>

      <div className="flex-1 w-full mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
              labelStyle={{ fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#4f46e5" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

