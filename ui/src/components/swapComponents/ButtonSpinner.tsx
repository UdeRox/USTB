import React from 'react'

const ButtonSpinner = () => {
  return (
    <div>
        <div className="flex flex-row ">
                <svg
                  className="animate-spin h-5 w-5 mr-3"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zM2 16a8 8 0 0016 0h4c0 6.627-5.373 12-12 12V16z"
                  ></path>
                </svg> Processing...
              </div>

    </div>
  )
}

export default ButtonSpinner