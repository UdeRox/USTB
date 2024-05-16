import { expect } from "chai";
import { ethers } from "hardhat";
import { TestToken, TBillToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("TBillToken", function () {
  // let testToken: TestToken;
  // let tbillToken: TBillToken;
  // let deployer: SignerWithAddress;
  // let user: SignerWithAddress;

  // beforeEach(async function () {
  //   [deployer, user] = await ethers.getSigners();

  //   const TestTokenFactory = await ethers.getContractFactory("TestToken");
  //   testToken = await TestTokenFactory.deploy() as TestToken;
  //   await testToken.waitForDeployment();

  //   const TBillTokenFactory = await ethers.getContractFactory("TBillToken");
  //   tbillToken = await TBillTokenFactory.deploy(testToken.address) as TBillToken;
  //   await tbillToken.waitForDeployment();

  //   // Transfer some TestTokens to user
  //   await testToken.transfer(user.address, utils.parseEther("1000"));
  // });

  // it("should mint TBill tokens correctly", async function () {
  //   await testToken.connect(user).approve(tbillToken.address, utils.parseEther("100").toString());
  //   await tbillToken.connect(user).mint(utils.parseEther("100").toString());

  //   expect(await tbillToken.balanceOf(user.address)).to.equal(utils.parseEther("100"));
  //   expect(await testToken.balanceOf(tbillToken.address)).to.equal(utils.parseEther("100"));
  // });

  // it("should burn TBill tokens correctly", async function () {
  //   await testToken.connect(user).approve(tbillToken.address, utils.parseEther("100").toString());
  //   await tbillToken.connect(user).mint(utils.parseEther("100").toString());

  //   await tbillToken.connect(user).burn(utils.parseEther("100").toString());

  //   expect(await tbillToken.balanceOf(user.address)).to.equal(0);
  //   expect(await testToken.balanceOf(user.address)).to.equal(utils.parseEther("1000"));
  // });
});