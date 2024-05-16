import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployTokens: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("Deploying TestToken...");
  const testToken = await deploy("TestToken", {
    from: deployer,
    log: true,
  });

  log("Deploying TBillToken...");
  await deploy("TBillToken", {
    from: deployer,
    args: [testToken.address],
    log: true,
  });
};

export default deployTokens;
