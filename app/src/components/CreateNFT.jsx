import { useState } from 'react'
import { ethers } from "ethers"
import { uploadFileToIPFS, uploadJSONToIPFS } from '../utils/pinata'
import MarketplaceAbi from '../contracts/MarketplaceData.json'

const CreateNFT = () => {
    const [formParams, setFormParams] = useState({ name: '', description: '', price: '' });
    const [fileURL, setFileURL] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [filePreview, setFilePreview] = useState(null);

    const onChangeFile = async (e) => {
        const file = e.target.files[0];
        console.log("File selected:", file?.name, file?.type, file?.size);
        if (!file) return;

        // Show local preview immediately
        const previewUrl = URL.createObjectURL(file);
        setFilePreview(previewUrl);
        console.log("Local preview generated:", previewUrl);

        try {
            setLoading(true);
            setMessage('Uploading image to IPFS...');
            const response = await uploadFileToIPFS(file);
            console.log("IPFS Response in component:", response);

            if(response.success === true) {
                setFileURL(response.pinataURL);
                setMessage('Image uploaded! Please fill naming details.');
            } else {
                setMessage(`❌ Upload Failed: ${response.status || "Check console for details"}`);
            }
        } catch(e) {
            console.error("Error during file upload", e);
            setMessage('Upload failed. Try again.');
        } finally {
            setLoading(false);
        }
    }

    const uploadMetadataToIPFS = async () => {
        const {name, description, price} = formParams;
        if(!name || !description || !price || !fileURL) {
            setMessage('Please fill all fields!');
            return -1;
        }

        const nftJSON = {
            name, description, price, image: fileURL
        }

        try {
            const response = await uploadJSONToIPFS(nftJSON);
            if(response.success === true){
                return response.pinataURL;
            }
        } catch(e) {
            console.log("error uploading JSON metadata:", e)
        }
    }

    const createNFT = async (e) => {
        e.preventDefault();

        try {
            const metadataURL = await uploadMetadataToIPFS();
            if(metadataURL === -1) return;
            
            setMessage('Minting NFT... please wait');
            setLoading(true);
            
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            
            const nft = new ethers.Contract(MarketplaceAbi.nft.address, MarketplaceAbi.nft.abi, signer);
            let transaction = await nft.mint(metadataURL);
            await transaction.wait();

            setMessage('Listing NFT... please sign transaction');
            const marketplace = new ethers.Contract(MarketplaceAbi.marketplace.address, MarketplaceAbi.marketplace.abi, signer);
            
            const id = await nft.tokenCount();
            
            await(await nft.setApprovalForAll(marketplace.target, true)).wait();
            
            const listingPrice = ethers.parseEther(formParams.price);
            transaction = await marketplace.makeItem(nft.target, id, listingPrice);
            await transaction.wait();

            setMessage('');
            setLoading(false);
            setFormParams({ name: '', description: '', price: '' });
            alert("Successfully listed your NFT!");
            window.location.replace("/")
        }
        catch(e) {
            alert( "Upload error: " + e )
            console.log(e);
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen pt-32 pb-12 bg-slate-950 px-6">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
                    <header className="mb-10 text-center">
                        <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
                            Mint <span className="text-transparent bg-clip-text bg-blue-500">Your Masterpiece</span>
                        </h1>
                        <p className="text-slate-400">Launch your digital asset into the metaverse.</p>
                    </header>
                    
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">NFT Name</label>
                            <input 
                                className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 px-6 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600" 
                                type="text" 
                                placeholder="e.g. Genesis Cube #001" 
                                onChange={e => setFormParams({...formParams, name: e.target.value})} 
                                value={formParams.name}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                            <textarea 
                                className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 px-6 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600 h-32 resize-none" 
                                placeholder="What makes this NFT unique?" 
                                onChange={e => setFormParams({...formParams, description: e.target.value})} 
                                value={formParams.description}
                            ></textarea>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Price (ETH)</label>
                                <input 
                                    className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 px-6 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600" 
                                    type="number" 
                                    placeholder="0.01" 
                                    step="0.001" 
                                    onChange={e => setFormParams({...formParams, price: e.target.value})} 
                                    value={formParams.price}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Artwork</label>
                                <div className="relative h-[62px]">
                                    <input 
                                        type="file" 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        onChange={onChangeFile} 
                                    />
                                    <div className={`flex items-center justify-center w-full h-full border border-dashed rounded-2xl transition-all pointer-events-none overflow-hidden ${filePreview ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-white/5 hover:border-indigo-500/50'}`}>
                                        {filePreview ? (
                                            <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <p className="text-sm font-medium text-slate-500">Upload Image</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {message && (
                            <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium py-3 px-4 rounded-xl text-center animate-pulse">
                                {message}
                            </div>
                        )}
                        
                        <button 
                            onClick={createNFT} 
                            disabled={loading}
                            className={`w-full relative overflow-hidden group py-4 px-6 rounded-2xl font-black text-white transition-all transform active:scale-[0.98] ${loading ? 'bg-slate-800' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-1'}`}
                        >
                            <span className="relative z-10">{loading ? 'STAYING IN SYNC...' : 'MINT & LIST ASSET'}</span>
                            {!loading && <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateNFT;
