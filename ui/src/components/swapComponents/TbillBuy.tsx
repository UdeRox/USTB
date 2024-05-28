import React, { useState, useEffect } from "react";
import Web3 from "web3";
import type { AbiItem } from "web3-utils";

// Import the contract ABIs
import authorizeContractABI from "../../abi/AuthorizeContract.json";
import mockUSDCABI from "../../abi/MockUSDC.json";

const BuyTBills = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [authorizeContractInstance, setAuthorizeContractInstance] =
    useState<any>(null);
  const [mockUSDCInstance, setMockUSDCInstance] = useState<any>(null);

  const authorizeContractAddress = import.meta.env.PUBLIC_AUTHORIZED_CONTRACT; // Replace with the actual contract address
  const mockUSDCAddress = import.meta.env.PUBLIC_MOCK_USDC_ADDRESS; // Replace with the actual MockUSDC contract address

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const accounts = await web3Instance.eth.requestAccounts();
          setAccounts(accounts);

          const authorizeContract = new web3Instance.eth.Contract(
            authorizeContractABI as AbiItem[],
            authorizeContractAddress
          );
          setAuthorizeContractInstance(authorizeContract);

          const mockUSDCContract = new web3Instance.eth.Contract(
            mockUSDCABI as AbiItem[],
            mockUSDCAddress
          );
          setMockUSDCInstance(mockUSDCContract);
        } catch (error) {
          console.error("Error initializing Web3:", error);
        }
      } else {
        console.error("MetaMask is not installed");
      }
    };

    initWeb3();
  }, []);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const approveSpending = async () => {
    if (!mockUSDCInstance || !accounts[0]) return;

    const amountToApprove = parseFloat(amount) * 1000000;
    await mockUSDCInstance.methods
      .approve(authorizeContractAddress, amountToApprove.toString())
      .send({ from: accounts[0] });
  };

  const buyTBills = async () => {
    if (!authorizeContractInstance || !accounts[0]) return;

    const amountToSpend = parseFloat(amount) * 1000000;
    await authorizeContractInstance.methods
      .buy(amountToSpend.toString())
      .send({ from: accounts[0] });
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Enter amount of TBills to buy"
        />{" "}
        <span>{amount}</span>
      </div>
      <div>
        <button onClick={approveSpending}>Approve Spending</button>
      </div>
      <div>
        <button onClick={buyTBills}>Buy TBills</button>
      </div>
    </div>
  );
};

export default BuyTBills;
