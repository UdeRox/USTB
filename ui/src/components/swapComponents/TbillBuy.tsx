import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
// import Loader from "./Loader";
import ButtonSpinner from "./ButtonSpinner";

import Web3 from "web3";
import type { AbiItem } from "web3-utils";
import { Toaster, toast } from "react-hot-toast";

// Import the contract ABIs
import authorizeContractABI from "../../abi/AuthorizeContract.json";
import mockUSDCABI from "../../abi/MockUSDC.json";
import TBillABI from "../../abi/TBill.json";


const BuyTBills = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [amount, setAmount] = useState<string>("10");
  const [authorizeContractInstance, setAuthorizeContractInstance] =
    useState<any>(null);
  const [mockUSDCInstance, setMockUSDCInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
const [TBillContract, setTBillContract] = useState<any>(null);
  const [BuyTibillModal, setBuyTibillModal] = useState<boolean>(false);

  const [TransactionSuccess, setTransactionSuccess] = useState(false);

  const [transactionHash, setTransactionHash] = useState<string | null>(null); // New state for transaction hash

  const [isApprove, setIsApprove] = useState<boolean>(false);
  const [isBuyTbill, setIsBuyTbill] = useState<boolean>(false);

  const [usdcBalance, setUSDCBalance] = useState<number>(0);
  const [tbillBalance, setTBILLBalance] = useState<number>(0);



  // Function to calculate 95% of the amount value
  const calculateNinetyFivePercent = (): string => {
    if (!amount) return ""; // Return empty string if amount is empty or not a number
    const parsedAmount = parseFloat(amount); // Convert amount to a number
    if (isNaN(parsedAmount)) return ""; // Return empty string if amount is not a number
    const ninetyFivePercent = parsedAmount * 0.95; // Calculate 95% of the amount
    return ninetyFivePercent.toFixed(2); // Return the result rounded to 2 decimal places
  };

  const authorizeContractAddress = import.meta.env.PUBLIC_AUTHORIZED_CONTRACT;
  const mockUSDCAddress = import.meta.env.PUBLIC_MOCK_USDC_ADDRESS;
  const actualUSDCAddress = import.meta.env.PUBLIC_USDC_ADDRESS;

  //  const  tbillContractAddress = import.meta.env.PUBLIC_TBILL_ADDRESS;
  const tbillContractAddress = "0x47c38380d885CF94ac0a602531bdD55E29A584Ec";

  const handleCloseModal = () => {
    if (BuyTibillModal) {
      setBuyTibillModal(false);
    } else {
      setBuyTibillModal(true);
    }
  }


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

          const actualUSDCContract = new web3Instance.eth.Contract(
            mockUSDCABI as AbiItem[],
            actualUSDCAddress
          );
          setMockUSDCInstance(actualUSDCContract);

          const Tbill_Contract = new web3Instance.eth.Contract(
            TBillABI as AbiItem[],
            tbillContractAddress
          );
          setTBillContract(Tbill_Contract);



          // Fetch balances initially
          fetchBalances(accounts[0], authorizeContract, actualUSDCContract, Tbill_Contract);

        } catch (error) {
          console.error("Error initializing Web3:", error);
          toast.error("Error initializing Web3");
        }
      } else {
        console.error("MetaMask is not installed");
        toast.error("MetaMask is not installed");
      }
    };

    initWeb3();
  }, []);


  // const fetchBalances = async (account: string, web3Instance: Web3, authorizeContract: any, actualUSDCContract: any) => {

  const fetchBalances = async (account: string, authorizeContract: any, actualUSDCContract: any, Tbill_Contract: any) => {
    if (!authorizeContract || !actualUSDCContract || !Tbill_Contract) return;

    try {
      // Inside the fetchBalances function

      const usdcBalanceInBaseUnits = await actualUSDCContract.methods.balanceOf(account).call();
      const usdcBalance = parseFloat(usdcBalanceInBaseUnits) / 10 ** 6;
      setUSDCBalance(usdcBalance);

      const tbillBalanceInBaseUnits = await Tbill_Contract.methods.balanceOf(account).call();
      const tbillBalance = parseFloat(tbillBalanceInBaseUnits) / 10 ** 18;
      console.log(tbillBalance);
      setTBILLBalance(tbillBalance);

    } catch (error) {
      console.error("Error fetching balances:", error);
      // toast.error("Error fetching balances");
    }
  };


  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const approveAndBuy = async () => {
    if (!mockUSDCInstance || !authorizeContractInstance || !accounts[0]) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      setBuyTibillModal(true);
      setIsApprove(true);
      setIsLoading(true);
      const amountToApproveAndSpend = parseFloat(amount) * 1000000;

      // Approve spending
      await mockUSDCInstance.methods
        .approve(authorizeContractAddress, amountToApproveAndSpend.toString())
        .send({ from: accounts[0] });
      setIsApprove(false);
      setIsBuyTbill(true);
      toast.success("Spending approved successfully");


      // Buy TBills
      const receipt = await authorizeContractInstance.methods
        .buy(amountToApproveAndSpend.toString())
        .send({ from: accounts[0] });

      setTransactionHash(receipt.transactionHash); // Set the transaction hash

      toast.success("TBills purchased successfully");
      setIsBuyTbill(false);
    } catch (error) {
      setTransactionSuccess(true);
      console.error("Error in approve and buy process:", error);
      toast.error("Error in approve and buy process");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Toaster />
      <div className="bg-white rounded-3xl p-4  shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl text-black font-bold mb-4">Buy TBILL</h1>
          <span
            className="text-sm text-blue-700 max-h-6 font-light bg-blue-200 rounded-lg p-0.5"
          > ⚡ Instant ~30s Settlement
          </span>
        </div>
        <div className="border rounded-2xl border-1 p-2 my-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Balance:  {usdcBalance} USDC</span>
          </div>


          <div className="flex items-center mb-2">
            <input
              type="number"
              className="w-full rounded-l-md text-2xl text-black font-bold py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              value={amount}
              onChange={handleAmountChange}
              placeholder="10,000"
            />
            <span className="bg-gray-200 px-3 py-2 rounded-md text-gray-700">Max</span
            >
            <select
              className="ml-2 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option> USDC</option>
            </select>
          </div>
        </div>

        <div className="flex flex-1 justify-center item-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="text-black rounded-full p-1 border border-1"
            width="3em"
            height="3em"
            viewBox="0 0 28 28"
          // {...props}
          >
            <path
              fill="currentColor"
              d="m8.352 4.011l.058-.007L8.5 4l.075.003l.126.017l.111.03l.111.044l.098.052l.104.074l.082.073l5.5 5.5a1 1 0 0 1-1.32 1.497l-.094-.083L9.5 7.415V23a1 1 0 0 1-1.993.117L7.5 23V7.415l-3.793 3.792a1 1 0 0 1-1.32.083l-.094-.083a1 1 0 0 1-.083-1.32l.083-.094l5.5-5.5a1 1 0 0 1 .112-.097l.11-.071l.114-.054l.105-.035zM19.5 4a1 1 0 0 1 .993.883L20.5 5v15.585l3.793-3.792l.094-.083a1 1 0 0 1 1.403 1.403l-.083.094l-5.5 5.5l-.044.041l-.068.056l-.11.071l-.114.054l-.105.035l-.117.025l-.09.01h-.118l-.06-.006l-.114-.02l-.109-.033l-.081-.034l-.098-.052l-.096-.067a1 1 0 0 1-.09-.08l-5.5-5.5l-.083-.094a1 1 0 0 1 0-1.226l.083-.094l.094-.083a1 1 0 0 1 1.226 0l.094.083l3.793 3.792V5l.007-.117A1 1 0 0 1 19.5 4"
            ></path>
          </svg>
        </div>

        <div className="border rounded-2xl border-1 p-2 my-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Balance: {tbillBalance} TBILL</span>
          </div>
          <div className="flex items-center mb-2">
            <span className="w-full rounded-l-md text-2xl text-black font-bold py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
              {calculateNinetyFivePercent()}
            </span>
            <select
              className="ml-2 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option> TBILL</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Max. Slippage</span>
          <span className="text-sm text-black font-bold">0.1 %</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">Exchange rate</span>
          <span className="text-sm text-black font-bold">1 USDC = 0.95 TBILL</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">Price Impact</span>
          <span className="text-sm text-black font-bold">0.00%</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">Trade Routed Through</span>
          <span className="text-sm text-black font-bold">Curve</span>
        </div>
        <div className="text-sm text-gray-500">
          *A whitelisted address is mandatory
        </div>
        <div className="flex flex-1 item-center py-4 justify-center">
          <button onClick={approveAndBuy} disabled={isLoading}
            className="bg-gradient-to-r rounded-2xl from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-white font-bold py-2 px-4 transition duration-300 ease-in-out transform hover:scale-105"
          >
            {isLoading ? (
              <ButtonSpinner />
            ) : (
              "Approve and Buy TBills"
            )}
          </button>
        </div>
      </div>



      {BuyTibillModal ? (
        isLoading ? (

          <div>

            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <div className="flex justify-center items-center">
                  <svg
                    className="animate-spin h-16 w-16 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                </div>

                {/* <div className="text-xl my-6 text-center font-bold">
                  Please approve the transaction of 10 USDC.
                </div> */}


                {isApprove ? (<div className="text-xl my-6 text-center font-bold">
                
                  Your {amount} USDC approval transaction is in progress...
                </div>) : (<div className="text-xl my-6 text-center font-bold">
                  Your {amount} USDC approval transaction was successfully Completed! ✅
               
                  {isBuyTbill! ? (<div className="text-xl my-6 text-center font-bold">
               Please confirm, sending  {calculateNinetyFivePercent()} TBILL to your account, please wait...
                </div>
                ) : (
                  <div className="text-xl my-6 text-center font-bold">
                    {/* Please buy TBILL in exchange for 10 USDC. */}
                  </div>
                )}
               
                </div>)}




          
       





              </div>
            </div>


          </div>

        ) : (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <div className="flex flex-row justify-between item-center">
                <div></div>
                <div onClick={handleCloseModal} className="text-bold hover:bg-gray-400 rounded-3xl  "><IoMdClose style={{ fontSize: "2em" }} /></div>
              </div>



              <div className="text-center">


                <h2 className="text-2xl font-semibold mb-4">Transaction Details</h2>

                {TransactionSuccess! ? (

                  <div>
                    <p className="text-gray-600">Your transaction was not successful!</p>
                    <div className="mt-6">
                      <button onClick={handleCloseModal} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-green-700 mr-2">
                        Close
                      </button>
                    </div>
                  </div>

                ) : (


                  <div>
                    <p className="text-gray-600">Your transaction was successful!</p>
                    <div className="mt-6">
                      <button onClick={handleCloseModal} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-2">
                        Close
                      </button>
                      {transactionHash && (
                        <a
                          href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Check on Etherscan
                        </a>
                      )}
                    </div>
                  </div>
                )}





              </div>
            </div>
          </div>
        )
      ) : (
        ""
      )}



    </div>
  );
};

export default BuyTBills;
