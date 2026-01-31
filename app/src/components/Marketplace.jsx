import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import MarketplaceAbi from '../contracts/MarketplaceData.json'

const Marketplace = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  
  const loadMarketplaceItems = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const marketplace = new ethers.Contract(MarketplaceAbi.marketplace.address, MarketplaceAbi.marketplace.abi, signer)
      const nft = new ethers.Contract(MarketplaceAbi.nft.address, MarketplaceAbi.nft.abi, signer)

      const itemCount = await marketplace.itemCount()
      let items = []
      
      for (let i = 1; i <= itemCount; i++) {
        const item = await marketplace.items(i)
        if (!item.sold) {
          const uri = await nft.tokenURI(item.tokenId)
          const response = await fetch(uri)
          const metadata = await response.json()
          const totalPrice = await marketplace.getTotalPrice(item.itemId)
          items.push({
            totalPrice,
            itemId: item.itemId,
            seller: item.seller,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image
          })
        }
      }
      setItems(items)
      setLoading(false)
    } catch (error) {
      console.log("Error fetching items", error)
      setLoading(false)
    }
  }

  const buyMarketItem = async (item) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const marketplace = new ethers.Contract(MarketplaceAbi.marketplace.address, MarketplaceAbi.marketplace.abi, signer)
      
      const tx = await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })
      await tx.wait()
      loadMarketplaceItems()
    } catch (error) {
      console.log("Error buying item", error)
      alert("Purchase failed. Check console for details.")
    }
  }

  useEffect(() => {
    loadMarketplaceItems()
  }, [])

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950">
      <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-indigo-400 font-medium animate-pulse">Loading amazing NFTs...</p>
    </div>
  )
  
  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Explore <span className="text-transparent bg-clip-text bg-blue-500">Digital Art</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Discover, collect, and sell extraordinary NFTs from the world's most creative artists.
          </p>
        </header>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item, idx) => (
              <div key={idx} className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20">
                <div className="relative h-72 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    <p className="text-white text-xs font-bold">ERC-721</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{item.name}</h3>
                  <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-0.5">Price</p>
                      <div className="flex items-center gap-1">
                        <span className="text-xl font-black text-indigo-400">{ethers.formatEther(item.totalPrice)}</span>
                        <span className="text-xs font-bold text-slate-400">ETH</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => buyMarketItem(item)} 
                      className="relative overflow-hidden bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold py-3 px-6 rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
                    >
                      Collect Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No active listings</h2>
            <p className="text-slate-400 text-center max-w-sm px-6">
              Be the first to create something extraordinary and list it on the marketplace!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
export default Marketplace
