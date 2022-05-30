import React from "react";
import "./App.css";
import Home from "./components/home/Home.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/navbar/NavBar";
import Mint from "./components/mint/Mint";
import OwnedNfts from "./components/myNfts/OwnedNfts";
import Marketplace from "./components/marketplace/Marketplace";
import MarketplaceContract from "./contracts/Marketplace.json";
import AccountStatus from "./components/account/AccountStatus";
import { useEffect, useState } from "react";
import { ethers } from "ethers";


const App = () => {
  const tokenAddress = "0x2996A553F2bedEce3a7009251Aacc89521b8A247";
  const marketAddress = "0x63eD3670F09A62CBC5c7DDF98FAB09C84D4e936A";

  const [listingPrice,setListingPrice] = useState();

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

      await connectToMetamask();

      const marketplaceContract = new ethers.Contract(marketAddress, MarketplaceContract.abi, provider);
    
      const signer = provider.getSigner();
    
        provider.listAccounts().then((accounts) => {
          console.log(accounts);
    
          if (accounts.length === 0) {
            setIsConnected(false)
          } else {
            setIsConnected(true);
            marketplaceContract.connect(signer).getListingPrice().then((price) => {
              price = ethers.utils.formatEther(price.toString());
              setListingPrice(price);
              console.log(price);
            })
          }
    
        })
        
    } catch (error) {
      setIsConnected(false);
    }
    

    
  }, [isConnected])

  try {
    window.ethereum.on('accountsChanged', function (accounts) {
      window.location.reload();
    })
  } catch (error) {
    console.log(error);
  }

  async function connectToMetamask(){
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log("Account:", await signer.getAddress());
 }


  return (
    <>
      {
        isConnected &&
        <div className="App">
          <Router>
            <NavBar />
            <AccountStatus isConnected={isConnected} />
            <Routes>
              <Route exact path="/" element={<Home tokenAddress={tokenAddress} />} />
              <Route path="/mint" element={<Mint tokenAddress={tokenAddress} />} />
              <Route path="/myNfts" element={<OwnedNfts tokenAddress={tokenAddress} marketAddress={marketAddress} listingPrice={listingPrice}/>} />
              <Route path="/marketplace" element={<Marketplace tokenAddress={tokenAddress} marketAddress={marketAddress} />} />
            </Routes>
          </Router>
        </div>
      }
      {
        !isConnected && <div>
          <h1 style={{'color': 'black'}}>Please connect to a metamask wallet</h1>
        </div>
      }
    </>

  );

}

export default App;
