import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import ButtonSpinner from "./ButtonSpinner";
import Web3 from "web3";
import type { AbiItem } from "web3-utils";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

import authorizeContractABI from "../../abi/AuthorizeContract.json";
import mockUSDCABI from "../../abi/MockUSDC.json";
import TBillABI from "../../abi/TBill.json";

const BuyTBills = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [amount, setAmount] = useState<string>("10");
  const [authorizeContractInstance, setAuthorizeContractInstance] = useState<any>(null);
  const [mockUSDCInstance, setMockUSDCInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [TBillContract, setTBillContract] = useState<any>(null);
  const [BuyTibillModal, setBuyTibillModal] = useState<boolean>(false);
  const [TransactionSuccess, setTransactionSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [isApprove, setIsApprove] = useState<boolean>(false);
  const [isBuyTbill, setIsBuyTbill] = useState<boolean>(false);
  const [usdcBalance, setUSDCBalance] = useState<number>(0);
  const [tbillBalance, setTBILLBalance] = useState<number>(0);
  const [portfolio, setPortfolio] = useState({ portfolioUsd: 0, tbillValue: 0 });

  const calculateNinetyFivePercent = (): string => {
    if (!amount) return "";
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) return "";
    const ninetyFivePercent = parsedAmount * 0.95;
    return ninetyFivePercent.toFixed(2);
  };

  const authorizeContractAddress = import.meta.env.PUBLIC_AUTHORIZED_CONTRACT;
  const mockUSDCAddress = import.meta.env.PUBLIC_MOCK_USDC_ADDRESS;
  const actualUSDCAddress = import.meta.env.PUBLIC_USDC_ADDRESS;
  const tbillContractAddress = "0x47c38380d885CF94ac0a602531bdD55E29A584Ec";

  const handleCloseModal = () => {
    setBuyTibillModal(!BuyTibillModal);
  };

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

          fetchBalances(accounts[0], authorizeContract, actualUSDCContract, Tbill_Contract);
          fetchPortfolioValues();

          const intervalId = setInterval(fetchPortfolioValues, 2000);
          return () => clearInterval(intervalId);
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

  const fetchBalances = async (account: string, authorizeContract: any, actualUSDCContract: any, Tbill_Contract: any) => {
    if (!authorizeContract || !actualUSDCContract || !Tbill_Contract) return;
    try {
      const usdcBalanceInBaseUnits = await actualUSDCContract.methods.balanceOf(account).call();
      const usdcBalance = parseFloat(usdcBalanceInBaseUnits) / 10 ** 6;
      setUSDCBalance(usdcBalance);

      const tbillBalanceInBaseUnits = await Tbill_Contract.methods.balanceOf(account).call();
      const tbillBalance = parseFloat(tbillBalanceInBaseUnits) / 10 ** 18;
      setTBILLBalance(tbillBalance);
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };

  const fetchPortfolioValues = async () => {
    try {
      const response = await axios.get('https://ustb-api-backend.vercel.app/api/portfolio/');
      setPortfolio(response.data);
    } catch (error) {
      console.error("Error fetching portfolio values:", error);
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

      await mockUSDCInstance.methods
        .approve(authorizeContractAddress, amountToApproveAndSpend.toString())
        .send({ from: accounts[0] });
      setIsApprove(false);
      setIsBuyTbill(true);
      toast.success("Spending approved successfully");

      const receipt = await authorizeContractInstance.methods
        .buy(amountToApproveAndSpend.toString())
        .send({ from: accounts[0] });
      setIsLoading(false);
      setTransactionHash(receipt.transactionHash);
      setTransactionSuccess(true);
      toast.success("TBills purchased successfully");

      await axios.post('https://ustb-api-backend.vercel.app/api/buy/', {
        buyAmount: parseFloat(amount),
        userAddress: accounts[0],
      });

      fetchBalances(accounts[0], authorizeContractInstance, mockUSDCInstance, TBillContract);

    } catch (error) {
      setIsLoading(false);
      setTransactionSuccess(false);
      toast.error("Error approving or buying TBills");
      console.error("Error approving or buying TBills:", error);
    }
  };

  return (
    <div>
      <Toaster />
      <div className="bg-white rounded-3xl p-4 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl text-black font-bold mb-4">Buy TBILL</h1>
          <span className="text-sm text-blue-700 max-h-6 font-light bg-blue-200 rounded-lg p-0.5">
            ⚡ Instant ~30s Settlement
          </span>
        </div>
        <div className="border rounded-2xl border-1 p-2 my-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Balance: {usdcBalance} USDC</span>
          </div>
          <div className="flex items-center mb-2">
            <input
              type="number"
              className="w-full rounded-l-md text-2xl text-black font-bold py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              value={amount}
              onChange={handleAmountChange}
              placeholder="10,000"
            />
            <span className="bg-gray-200 px-3 py-2 rounded-md text-gray-700">Max</span>
            <select className="ml-2 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option>USDC</option>
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
          >
            <path
              fill="currentColor"
              d="m8.352 4.011l.058-.007L8.5 4l.075.003l.126.017l.111.03l.111.044l.098.052l.104.074l.082.073l5.5 5.5a1 1 0 0 1-1.32 1.497l-.094-.083L9.5 7.415V23a1 1 0 0 1-1.993.117L7.5 23V7.415l-3.793 3.792a1 1 0 0 1-1.32.083l-.094-.083a1 1 0 0 1-.083-1.32l.083-.094l5.5-5.5a1 1 0 0 1 .24-.17l.064-.03l.112-.037Z"
            />
          </svg>
        </div>

        <div className="border rounded-2xl border-1 p-2 my-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Balance: {tbillBalance} TBILL</span>
          </div>
          <div className="flex items-center mb-2">
            <input
              type="text"
              className="w-full rounded-l-md text-2xl text-black font-bold py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              value={calculateNinetyFivePercent()}
              placeholder="TBill Amount"
              disabled
            />
            <span className="bg-gray-200 px-3 py-2 rounded-md text-gray-700">Max</span>
            <select className="ml-2 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option>TBILL</option>
            </select>
          </div>
        </div>

        <button
          onClick={approveAndBuy}
          className="flex items-center justify-center w-full p-2 my-2 text-white bg-blue-600 rounded-2xl shadow-md"
        >
          {isLoading ? <ButtonSpinner /> : "Buy TBILL"}
        </button>
      </div>

      {BuyTibillModal && (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto bg-black bg-opacity-50 md:inset-0 h-modal md:h-full">
          <div className="relative w-full h-full max-w-md md:h-auto">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                onClick={handleCloseModal}
              >
                <IoMdClose className="w-5 h-5" />
              </button>
              <div className="px-6 py-6 lg:px-8">
                <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Buy TBILL</h3>
                <form className="space-y-6">
                  <div className="mb-4">
                    <label
                      htmlFor="transactionHash"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Transaction Hash
                    </label>
                    <input
                      type="text"
                      id="transactionHash"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      value={transactionHash || ""}
                      readOnly
                    />
                  </div>
                  {TransactionSuccess ? (
                    <p className="text-green-500">Transaction was successful!</p>
                  ) : (
                    <p className="text-red-500">Transaction failed.</p>
                  )}
                  <button
                    type="button"
                    className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyTBills;
