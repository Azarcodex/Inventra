import { POSContainer } from "@/components/pos/POSContainer";

export default function POSPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-6">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Point of Sale</h1>
            <p className="text-gray-500 font-medium mt-1">Ready for a new customer?</p>
          </div>
          <div className="text-right">
            <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold border border-blue-100 uppercase tracking-widest">
              Live Terminal 01
            </div>
          </div>
        </header>
        
        <POSContainer />
      </div>
    </main>
  );
}
