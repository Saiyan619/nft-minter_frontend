import React, { createContext, useContext, useState } from "react";
import axios from 'axios'
import { contractAddress, contractAbi } from '../Constants/constant'
import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem';

const GlobalContextApi = createContext();

export const GlobalContext = ({ children }) => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  ////Modal functions
  //-Modal Function for calling Empty File(Image/name/desc) Error
  function handleOpenModal() {
    const modal = document.getElementById("my_modal_5");
    if (modal) {
      modal.showModal();
    }
  }
  function closeModal() {
    const modal = document.getElementById("my_modal_5");
    if (modal) {
      modal.close();
    }
  }
  //Final Functions
  const handleFileErrorAlert = () => {
    //Calls the UI modal function made earlier
    handleOpenModal();
  };
  const closeHandleFileErrorAlert = () => {
        //Calls the UI modal function made earlier
    closeModal();
  };


  //Modal Function for calling Transaction loading
  function handleOpenModal2() {
    const modal = document.getElementById("my_modal_6");
    if (modal) {
      modal.showModal();
    }
  }
  function closeModalTwo() {
    const modal = document.getElementById("my_modal_6");
    if (modal) {
      modal.close();
    }
  }
  //Final Functions
  const handleTnxLoading = () => {
    handleOpenModal2();
  };
  const closeHandleTnxLoading = () => {
    closeModalTwo();
  };
  
  //Modal Function for calling success
  function handleOpenModal3() {
    const modal = document.getElementById("my_modal_7");
    if (modal) {
      modal.showModal();
    }
  }
  const handleSuccessModal = () => {
    handleOpenModal3();
  };

  //Modal Function for calling Transaction Error
  function handleOpenModal4() {
    const modal = document.getElementById("my_modal_8");
    if (modal) {
      modal.showModal();
    }
  }
  const handleTnxErrorModal = () => {
    handleOpenModal4();
  };

  ///////////////////////////////////////////////////////////////////////////////

  // Get your Address connected to a wallet
  const { address } = useAccount()
  
  //Check Address of contract owner
    const { data: ownerAddress } = useReadContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'owner',
    })
  
  
    // Read contract hooks
    const { data: maxSupply } = useReadContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'MAX_SUPPLY'
    });
  
    //Mint Price
    // The price is in wei, but it was convert in the component to ether using formatEther
    const { data: mintPrice } = useReadContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'mintPrice'
    })
  
    //Maximum NFTs that can be minted per address
    const { data: maxMintPerAddress } = useReadContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'maxMintPerAddress'
    })
  
    //Nfts Minted By a Specific Address
    const { data: nftMintedByAddress } = useReadContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'mintCount',
      args: [address]
    })
    
    // Get total minted count from different addresses
    const { data: totalMinted } = useReadContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'totalMinted'
    })
  
    
    // Prepare contract write for withdraw
    const { writeContract: writeWithdraw } = useWriteContract()
    
  //Function Collecting collated Eths to the owner address
    const handleWithdraw = () => {
      console.log("Initiating withdraw transaction...");
      writeWithdraw({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'withdraw'
      });
    };
  

   // Contract write hook for minting the NFT
      const { 
        data: hash,
        error: writeError,
        isPending,
        writeContract 
      } = useWriteContract()
  
     // Hook for transaction step processing
      const { 
        isLoading: isConfirming, 
        isSuccess: isConfirmed,
        error: confirmError 
      } = useWaitForTransactionReceipt({
        hash,
      })
  
    //logging transaction processes for HandleMint Function to Track tnx progress
    console.log(isLoading, isConfirming, isConfirmed, hash, writeError, confirmError)

    ////////////////////////////////////////////////////////////////////////////////////////////
  // handleMint() - My Dapp Core Function - Mints images/files to the sepolia Eth Blockchain 
  //////////////////////////////////////////////////////////////////////////////////////////////
  const handleMint = async () => {
    //Images/Name/Desc must be filled before Minting Process takes place
    if (!image & !name & !desc) {
      handleFileErrorAlert();
      console.error("Please upload an image and enter a name and description.");
      return;
    }

    //If your Wallet is not connected you will be alerted to do so before minting
    if (address) {
      try {
        console.log("Starting mint process...");
  
        // Upload image to IPFS
        const formData = new FormData();
        formData.append("file", image);
        console.log("Uploading image to IPFS...");
        const fileResponse = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          formData,
          {
            maxBodyLength: Infinity,
            headers: {
              "Content-Type": "multipart/form-data",
              pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
              pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY,
            },
          }
        );
  
        const imageHash = fileResponse.data.IpfsHash;
        console.log("Image uploaded:", imageHash);
  
        // Upload metadata to IPFS
        const metadata = {
          name,
          description: desc,
          image: `ipfs://${imageHash}`,
        };
  
        console.log("Uploading metadata to IPFS...");
        const metadataResponse = await axios.post(
          "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          metadata,
          {
            headers: {
              pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
              pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY,
            },
          }
        );
  
        const metadataHash = metadataResponse.data.IpfsHash;
        const tokenURI = `ipfs://${metadataHash}`;
        console.log("Metadata uploaded. TokenURI:", tokenURI);
  
        // Call the mint function using wagmi's writeContract hook
        console.log("Sending mint transaction to contract...");
        writeContract({
          address: contractAddress,
          abi: contractAbi,
          functionName: "mintNFT",
          args: [tokenURI],
          value: mintPrice, // Make sure to include the value for payable functions
        });
  
        // The transaction hash will be available in the 'hash' variable
        // and handled by the useWaitForTransactionReceipt hook
        handleTnxLoading()
        console.log("Mint transaction submitted, waiting for confirmation...");
        
       
      } catch (err) {
        console.error("Minting failed:", err);
        handleTnxErrorModal()
        handleFileErrorAlert()
        setMintError(err.message || "Error during minting process");
      }
    } else {
      alert("Please Connet Your Wallet!")
    }

    // Reset states
    // setMintError("");
    // setMintSuccess(false);

  
  };


     // Prepare contract write for owner mint
    // const { writeContract } = useWriteContract()
    
      const handleOwnerMint = async () => {
        // setMintError("");
        // setMintSuccess(false);
        if (!image || !name || !desc) {
          console.error("Please upload an image and enter a name and description.");
          setMintError("Please upload an image and enter a name and description.");
          return;
        }
        
        try {
        
          
          console.log("Starting owner mint process...");
          setIsLoading(isPending)
          
          // Upload image and metadata to IPFS (similar to handleMint)
          const formData = new FormData();
          formData.append("file", image);
      
          const fileResponse = await axios.post(
            'https://api.pinata.cloud/pinning/pinFileToIPFS',
            formData,
            {
              maxBodyLength: Infinity,
              headers: {
                'Content-Type': 'multipart/form-data',
                pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
                pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY,
              },
            }
          );
      
          const imageHash = fileResponse.data.IpfsHash;
          console.log("Image uploaded:", imageHash);
          
          const metadata = {
            name,
            description: desc,
            image: `ipfs://${imageHash}`,
          };
      
          const metadataResponse = await axios.post(
            'https://api.pinata.cloud/pinning/pinJSONToIPFS',
            metadata,
            {
              headers: {
                pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
                pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY,
              },
            }
          );
      
          const metadataHash = metadataResponse.data.IpfsHash;
          const tokenURI = `ipfs://${metadataHash}`;
          console.log("Metadata uploaded. TokenURI:", tokenURI);
          
          // Call the ownerMint function with the correct arguments
          console.log("Sending owner mint transaction...");
          // writeOwnerMint({
          //   address: contractAddress,
          //   abi: contractAbi,
          //   functionName: 'ownerMint',
          //   args: [ownerAddress, tokenURI]
          // });
          writeContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'ownerMint',
            args: [ownerAddress, tokenURI]
            // value: mintPrice, // Make sure to include the value for payable functions
          });
          
          console.log("Owner mint transaction submitted, waiting for confirmation...");
          if (isConfirmed) {
            console.log("confirmation done")
          }
        } catch (err) {
          console.error("Owner mint failed:", err);
          // setMintError(err.message || "Error during owner minting process");
        }

      };
  



  //Check if Transaction was succesfull(Conneted to wallet -> Paid -> Hash provided)
  //If the the above is done Calls Modal Function For UI display of certain information
  if (isConfirmed) {
    closeHandleTnxLoading()
    console.log("transaction succesfull")
    handleSuccessModal()
  }

  return (
    <GlobalContextApi.Provider
      value={{
        handleMint,
        handleFileErrorAlert,
        handleTnxLoading,
        closeHandleFileErrorAlert,
        image,
        setImage,
        name,
        setName,
        desc,
        setDesc,
        isLoading,
        isPending,
        setIsLoading,
        isLoading, 
        isConfirming, 
        isConfirmed, 
        hash, 
        writeError, 
        confirmError,
        maxSupply,
mintPrice,
maxMintPerAddress,
nftMintedByAddress,
totalMinted,
        handleWithdraw,
        ownerAddress,
        handleOwnerMint
      }}
    >
      {children}
    </GlobalContextApi.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContextApi);
