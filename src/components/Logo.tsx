'use client'

export default function Logo() {
  return (
    <div className="relative">
      {/* Ana Logo Container */}
      <div className="bg-black p-8 rounded-lg text-center min-w-[300px]">
        {/* Kenan Kadıoğlu Yazısı */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300 bg-clip-text text-transparent mb-2">
            Kenan Kadıoğlu
          </h1>
        </div>
        
        {/* Altın çizgiler */}
        <div className="space-y-3">
          <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
          
          {/* REAL ESTATE & INVESTMENT CONSULTANCY */}
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 px-4 py-2 rounded">
            <p className="text-black font-bold text-sm tracking-wide">
              REAL ESTATE & INVESTMENT CONSULTANCY
            </p>
          </div>
          
          <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
          
          {/* GAYRİMENKUL & YATIRIM DANIŞMANLIK */}
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 px-4 py-2 rounded">
            <p className="text-black font-bold text-sm tracking-wide">
              GAYRİMENKUL & YATIRIM DANIŞMANLIK
            </p>
          </div>
          
          <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
        </div>
      </div>
      
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-lg blur opacity-20"></div>
    </div>
  )
}