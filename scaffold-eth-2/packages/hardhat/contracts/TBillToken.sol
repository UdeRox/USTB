//SPDX-License-Identifier: MIT
pragma solidity 0.8.25;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// 0x2C032Aa43D119D7bf4Adc42583F1f94f3bf3023a USDC contract
contract TBillToken is ERC20, Ownable {
	using SafeERC20 for IERC20;
	//@dev remove this hardcoded contract address
	address public USDC_ADDRESS = 0x779877A7B0D9E8603169DdbD7836e478b4624789;
	IERC20 public stableToken;

	event Minted(address indexed user, uint256 amount);
	event Burned(address indexed user, uint256 amount);

	constructor(address _stableToken) ERC20("USDB TBill", "TBill") {
		stableToken = IERC20(_stableToken);
	}

	function mint(uint256 _amount) external {
		require(_amount > 0, "Amount must be greater than 0");
		// Transfer USDC from the user to the contract
		stableToken.safeTransferFrom(msg.sender, address(this), _amount);
		// Mint the same amount of TBill tokens to the user
		_mint(msg.sender, _amount);

		emit Minted(msg.sender, _amount);
	}

	function burn(uint256 _amount) external {
		require(_amount > 0, "Amount must be greater than 0");
		require(
			balanceOf(msg.sender) >= _amount,
			"Insufficient balance to burn"
		);

		// Burn the MNT tokens from the user
		_burn(msg.sender, _amount);

		// Transfer the same amount of USDC back to the user
		stableToken.safeTransfer(msg.sender, _amount);

		emit Burned(msg.sender, _amount);
	}
}
