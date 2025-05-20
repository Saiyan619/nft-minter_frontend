import React, {useEffect} from 'react'
import { useAccount } from 'wagmi'
import { parseEther, formatEther } from 'viem';
import { Upload, Image as ImageIcon } from 'lucide-react';
import NftPreview from './NftPreview';
import FileErrorAlert from '../UIcomponents/FileErrorAlert';
import { useGlobalContext } from '../utils/GlobalContext';
import SuccessModal from '../UIcomponents/SuccessModal';
import TnxErrorModal from '../UIcomponents/TnxErrorModal';
import LoadingModal from '../UIcomponents/LoadingModal';

const MintForm = () => {
  const {
    handleMint,
    image,
        setImage,
        name,
        setName,
        desc,
        setDesc,
    setIsLoading,
    isLoading, 
    isConfirmed, 
    isPending,
    isConfirming,
    hash, 
    writeError, 
    confirmError,
    handleWithdraw,
    mintPrice,
    ownerAddress,
    handleOwnerMint
  } = useGlobalContext()
  

  //  const [mintSuccess, setMintSuccess] = useState(false)
    // const [mintedTokenId, setMintedTokenId] = useState(null)
  // const [mintError, setMintError] = useState("")


    // Get connected wallet address
    const { address } = useAccount()
  
  const handleImageChange = (e) => {
    setImage(e.target.files[0])
    console.log(e.target.files[0])
  }

  //logging transaction processes for HandleMint Function
  console.log(isLoading, isConfirming, isConfirmed, hash, writeError, confirmError)
    // Monitor transaction states
useEffect(() => {
  console.log({
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    writeError,
    confirmError
  })

}, [isPending, isConfirming, isConfirmed, hash, writeError, confirmError])
  
  //Check if the connected address is the contract owner
const isOwner = ownerAddress === address
//Log if the connected address is the contract owner
console.log("isOwner", isOwner)  
// console.log(ownerAddress)  
// console.log(address)  



  return (
    <div id='nft_section' className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* <button onClick={closeHandleFileErrorAlert}>testy</button> */}
      <FileErrorAlert />
      <SuccessModal />
      <LoadingModal />
      <TnxErrorModal />
      <div className=" border border-gray-600 rounded-lg p-6">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6">Create Your NFT</h2>

          <div className="space-y-2">
            <label htmlFor="nftImage" className="text-white block">Upload Image</label>
            <div className="relative border-2 border-dashed border-gray-500 rounded-lg p-4 flex flex-col items-center justify-center h-48 bg-gray-700 hover:bg-gray-600 transition-colors cursor-pointer">
              <input
                id="nftImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {!image ? (
                <div className="flex flex-col items-center justify-center text-gray-300">
                  <Upload size={40} className="mb-2" />
                  <p className="text-sm">Click or drag to upload image</p>
                  <p className="text-xs mt-1">PNG, JPG, GIF up to 5MB</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-white">
                  <ImageIcon size={40} className="mb-2 text-blue-400" />
                  <p className="text-sm">Image uploaded successfully</p>
                  <p className="text-xs mt-1 text-blue-400">Click to change</p>
                </div>
              )}
            </div>
          </div>


          <div className="space-y-2">
            <label htmlFor="nftName" className="text-white block">Name</label>
            <input
              id="nftName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter NFT name"
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="nftDescription" className="text-white block">Description</label>
            <textarea
              id="nftDescription"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Describe your NFT..."
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-500 text-white h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleMint}
            disabled={isPending || isConfirming}
            className="btn w-full py-3 px-6 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
          >
          {isPending ? 'Preparing Mint...' : isConfirming ? 'Confirming Mint...' : `Mint for ${mintPrice ? formatEther(mintPrice) : '0.0005'} ETH`}
          </button>  

          {isOwner && (
             <button
             onClick={handleOwnerMint}
             disabled={isLoading}
             className="w-full py-3 px-6 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
           >
             {isLoading ? 'Minting...' : 'Mint NFT Free(Owner Privildge)'}
           </button>
          )}
          
          {isOwner && (
             <button
             onClick={handleWithdraw}
             disabled={isPending || isConfirming}
             className="w-full py-3 px-6 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
           >
             {isPending || isConfirming ? 'Withdrawing Funds...' : 'Withdraw NFT Fee(Owner Privildge)'}
           </button>
          )}
        </div>
      </div>
      
{/* Component for the NFT preview */}
      <NftPreview
        name={name || 'NFT Name'}
        description={desc || 'NFT Description'}
        image={image}
      />
    </div>
  );
};

export default MintForm;
