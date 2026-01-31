import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import MarketplaceAbi from '../contracts/MarketplaceData.json'

export default function MyPurchases() {
  const [loading, setLoading] = useState(true)
  const [purchases, setPurchases] = useState([])

  const loadPurchasedItems = async () => {
    try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const marketplace = new ethers.Contract(MarketplaceAbi.marketplace.address, MarketplaceAbi.marketplace.abi, signer)
        const nft = new ethers.Contract(MarketplaceAbi.nft.address, MarketplaceAbi.nft.abi, signer)
        
        const filter =  marketplace.filters.Bought(null,null,null,null,null,signer.address)
        const results = await marketplace.queryFilter(filter)
        
        const purchases = await Promise.all(results.map(async i => {
            const args = i.args
            const uri = await nft.tokenURI(args.tokenId)
            const response = await fetch(uri)
            const metadata = await response.json()
            const totalPrice = await marketplace.getTotalPrice(args.itemId)
            
            return {
                totalPrice,
                price: args.price,
                itemId: args.itemId,
                name: metadata.name,
                description: metadata.description,
                image: metadata.image
            }
        }))
        setLoading(false)
        setPurchases(purchases)
    } catch (e) {
        console.log("Error loading purchases", e)
        setLoading(false)
    }
  }

  useEffect(() => {
    loadPurchasedItems()
  }, [])

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950">
      <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-indigo-400 font-medium animate-pulse">Loading your collection...</p>
    </div>
  )

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-950 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">Your <span className="text-transparent bg-clip-text bg-blue-500">Acquired Assets</span></h1>
          <p className="text-slate-400">A gallery of digital masterpieces you've collected across the marketplace.</p>
        </header>

        {purchases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {purchases.map((item, idx) => (
              <div key={idx} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300">
                <div className="h-64 overflow-hidden relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute top-4 left-4 bg-indigo-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-lg">Owned</div>
                </div>
                <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{item.name}</h3>
                    <div className="flex items-center justify-between mt-4">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-0.5">Value</p>
                            <p className="text-indigo-400 font-black text-xl">{ethers.formatEther(item.totalPrice)} <span className="text-xs text-slate-500 font-bold uppercase">ETH</span></p>
                        </div>
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 text-slate-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <h2 className="text-2xl font-bold text-white mb-2">No acquisitions yet</h2>
            <p className="text-slate-400 text-center max-w-sm px-6">Explore the marketplace to find unique digital assets to add to your collection!</p>
          </div>
        )}
      </div>
    </div>
  );
}
