import { useEffect, useState } from "react";
import Web3 from "web3";
import contractABI from "../../abi/AuthorizeContract.json";

// declare global {
//   interface Window {
//     ethereum: any;
//   }
// }

const DisplayAvailableUSD = () => {
  const [maxUSDSupply, setMaxUSDSupply] = useState<unknown>(null);
  //TODO: move to a global  variable
  //   const contractAddress = "0xE1C149cD6999A50E3Eb186d277DfbFC8F2C5Bb3C";
  const contractAddress = import.meta.env.PUBLIC_AUTHORIZED_CONTRACT;

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
