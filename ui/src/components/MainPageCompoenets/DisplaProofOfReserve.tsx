// src/components/DisplaProofOfReserve.tsx
import { useEffect, useState } from "react";

const DisplaProofOfReserve = () => {
  const [maxUSDSupply, setMaxUSDSupply] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiResponse = await fetch("https://ustb-api-backend.vercel.app/api/portfolio/");
        const data = await apiResponse.json();
        setMaxUSDSupply(data.portfolioUsd);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const formatNumber = (value: number) => {
    const formattedNumber = value.toLocaleString("en-US", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });
    const parts = formattedNumber.split(".");
    const wholeNumber = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const decimalPart = parts[1];
    return `${wholeNumber}.${decimalPart}`;
  };

  return (
    <>
      <div className="text-3xl text-green-600 font-bold">
        ${maxUSDSupply !== null ? formatNumber(maxUSDSupply) : ""}
      </div>
    </>
  );
};

export default DisplaProofOfReserve;