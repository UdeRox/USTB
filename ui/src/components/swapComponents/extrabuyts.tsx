// import React, { useState, useEffect } from "react";
// import Web3 from "web3";
// import type { AbiItem } from "web3-utils";
// import { Toaster, toast } from "react-hot-toast";

// // Import the contract ABIs
// import authorizeContractABI from "../../abi/AuthorizeContract.json";
// import mockUSDCABI from "../../abi/MockUSDC.json";

// const BuyTBills = () => {
//   const [web3, setWeb3] = useState<Web3 | null>(null);
//   const [accounts, setAccounts] = useState<string[]>([]);
//   const [amount, setAmount] = useState<string>("");
//   const [authorizeContractInstance, setAuthorizeContractInstance] =
//     useState<any>(null);
//   const [mockUSDCInstance, setMockUSDCInstance] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const authorizeContractAddress = import.meta.env.PUBLIC_AUTHORIZED_CONTRACT;
//   const mockUSDCAddress = import.meta.env.PUBLIC_MOCK_USDC_ADDRESS;

//   useEffect(() => {
//     const initWeb3 = async () => {
//       if (window.ethereum) {
//         try {
//           const web3Instance = new Web3(window.ethereum);
//           setWeb3(web3Instance);

//           const accounts = await web3Instance.eth.requestAccounts();
//           setAccounts(accounts);

//           const authorizeContract = new web3Instance.eth.Contract(
//             authorizeContractABI as AbiItem[],
//             authorizeContractAddress
//           );
//           setAuthorizeContractInstance(authorizeContract);

//           const mockUSDCContract = new web3Instance.eth.Contract(
//             mockUSDCABI as AbiItem[],
//             mockUSDCAddress
//           );
//           setMockUSDCInstance(mockUSDCContract);
//         } catch (error) {
//           console.error("Error initializing Web3:", error);
//           toast.error("Error initializing Web3");
//         }
//       } else {
//         console.error("MetaMask is not installed");
//         toast.error("MetaMask is not installed");
//       }
//     };

//     initWeb3();
//   }, []);

//   const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setAmount(event.target.value);
//   };

//   const approveAndBuy = async () => {
//     if (!mockUSDCInstance || !authorizeContractInstance || !accounts[0]) {
//       toast.error("Please connect your wallet");
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const amountToApproveAndSpend = parseFloat(amount) * 1000000;

//       // Approve spending
//       await mockUSDCInstance.methods
//         .approve(authorizeContractAddress, amountToApproveAndSpend.toString())
//         .send({ from: accounts[0] });
//       toast.success("Spending approved successfully");

//       // Buy TBills
//       await authorizeContractInstance.methods
//         .buy(amountToApproveAndSpend.toString())
//         .send({ from: accounts[0] });
//       toast.success("TBills purchased successfully");
//     } catch (error) {
//       console.error("Error in approve and buy process:", error);
//       toast.error("Error in approve and buy process");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div>
//       <Toaster />
//       <div>
//         <input
//           type="text"
//           value={amount}
//           onChange={handleAmountChange}
//           placeholder="Enter amount of TBills to buy"
//         />{" "}
//         <span>{amount}</span>
//       </div>
//       <div>
//         <button onClick={approveAndBuy} disabled={isLoading}>
//           {isLoading ? "Processing..." : "Approve and Buy TBills"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BuyTBills;
