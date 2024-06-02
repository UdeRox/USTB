import { useEffect, useState } from "react";
import Web3 from "web3";
import contractABI from "../../abi/AuthorizeContract.json";

const DisplayAvailableUSD = () => {
  const [maxUSDSupply, setMaxUSDSupply] = useState<unknown>(null);
  const [interestRate, setInterestRate] = useState<unknown>(null);
  const contractAddress = import.meta.env.PUBLIC_AUTHORIZED_CONTRACT;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiResponse = await fetch("https://ustb-api-backend.vercel.app/api/portfolio/");
        const data = await apiResponse.json();
        setMaxUSDSupply(data.portfolioUsd);

        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          const contract = new web3.eth.Contract(contractABI, contractAddress);

          const interestRate: any = await contract.methods.getInterest().call();
          setInterestRate(parseInt(interestRate) / 100);
        } else {
          console.error("MetaMask is not installed");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {`Max USD available : ${maxUSDSupply ?? ""}, Interest rate : ${interestRate}%`}
    </>
  );
};

export default DisplayAvailableUSD;