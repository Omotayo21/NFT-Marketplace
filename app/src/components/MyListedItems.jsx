import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import MarketplaceAbi from '../contracts/MarketplaceData.json'

function renderSoldItems(items) {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
        <span className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </span>
        Successfully Sold
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
            <div className="h-48 overflow-hidden">
               <img src={item.image} alt="item" className="w-full h-full object-cover" />
            </div>
            <div className="p-4 bg-black/40 backdrop-blur-md">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Sold For</p>
              <p className="text-green-400 font-black text-lg">{ethers.formatEther(item.totalPrice)} ETH</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function MyListedItems() {
  const [loading, setLoading] = useState(true)
  const [listedItems, setListedItems] = useState([])
  const [soldItems, setSoldItems] = useState([])

  const loadListedItems = async () => {
    try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const marketplace = new ethers.Contract(MarketplaceAbi.marketplace.address, MarketplaceAbi.marketplace.abi, signer)
        const nft = new ethers.Contract(MarketplaceAbi.nft.address, MarketplaceAbi.nft.abi, signer)
        const itemCount = await marketplace.itemCount()
        let listedItems = []
        let soldItems = []

        for (let i = 1; i <= itemCount; i++) {
            const item = await marketplace.items(i)
            if (item.seller.toLowerCase() === signer.address.toLowerCase()) {
                const uri = await nft.tokenURI(item.tokenId)
                const response = await fetch(uri)
                const metadata = await response.json()
                const totalPrice = await marketplace.getTotalPrice(item.itemId)
                let itemData = {
                    totalPrice,
                    price: item.price,
                    itemId: item.itemId,
                    name: metadata.name,
                    description: metadata.description,
                    image: metadata.image,
                    sold: item.sold
                }
                listedItems.push(itemData)
                if (item.sold) soldItems.push(itemData)
            }
        }
        setLoading(false)
        setListedItems(listedItems)
        setSoldItems(soldItems)
    } catch(e) {
        console.log("Error loading listed items", e)
        setLoading(false)
    }
  }

  useEffect(() => {
    loadListedItems()
  }, [])

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950">
      <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-indigo-400 font-medium animate-pulse">Loading items...</p>
    </div>
  )

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-950 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">Your <span className="text-transparent bg-clip-text bg-blue-500">NFT Collection</span></h1>
          <p className="text-slate-400">Manage all the masterpieces you've listed in the marketplace.</p>
        </header>

        {listedItems.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {listedItems.map((item, idx) => (
                <div key={idx} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300">
                  <div className="h-64 overflow-hidden relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    {item.sold && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-green-500 text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">Sold</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{item.name}</h3>
                    <div className="flex items-center justify-between">
                        <p className="text-indigo-400 font-black text-xl">{ethers.formatEther(item.totalPrice)} <span className="text-xs text-slate-500 font-bold uppercase ml-1">ETH</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {soldItems.length > 0 && renderSoldItems(soldItems)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <h2 className="text-2xl font-bold text-white mb-2">Your shop is empty</h2>
            <p className="text-slate-400 text-center max-w-sm px-6">Haven't listed anything yet? Head over to the mint page and start your journey!</p>
          </div>
        )}
      </div>
    </div>
  );
}
