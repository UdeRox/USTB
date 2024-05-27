import { useEffect, useState } from "react";
import Web3 from "web3";
import contractABI from "../../abi/AuthorizeContract.json";

declare global {
  interface Window {
    ethereum: any;
  }
}

const DisplayAvailableUSD = () => {
  const [maxUSDSupply, setMaxUSDSupply] = useState<unknown>(null);
  //TODO: move to a global  variable
  const contractAddress = "0xC7E7cE6996e14D5e3359Cb02EB3E44C56e0A3DEC";

  useEffect(() => {
    const fetchMaxSupply = async () => {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          const contract = new web3.eth.Contract(contractABI, contractAddress);

          const maxUSDinVault = await contract.methods.getMaxUSDSupply().call();
          setMaxUSDSupply(maxUSDinVault);
        } catch (err) {
          //TODO: error handling
          console.error("Error fetching baseCurrencyContract:", err);
        }
      } else {
        //TODO error handling
        console.error("MetaMask is not installed");
      }
    };

    fetchMaxSupply();
  }, []);

  return <>{`Max USD available : ${maxUSDSupply ?? ""}`}</>;
};

export default DisplayAvailableUSD;
