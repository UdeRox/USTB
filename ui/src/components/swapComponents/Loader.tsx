
const Loader = () => {
  return (
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


          <div className="text-xl my-6 text-center font-bold">
            Please approve the transaction of 10 USDC.
          </div>

          <div className="text-xl my-6 text-center font-bold">
            Your 10 USDC approval transaction is in progress.
          </div>

          <div className="text-xl my-6 text-center font-bold">
            Please buy TBILL in exchange for 10 USDC.
          </div>

          <div className="text-xl my-6 text-center font-bold">
            Sending 9.5 TBILL to your account, please wait...
          </div>




        </div>
      </div>


    </div>
  )
}

export default Loader