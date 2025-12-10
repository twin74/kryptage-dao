/* eslint-disable no-console */
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const tokens = [
    process.env.NEXT_PUBLIC_TOKEN_USDC,
    process.env.NEXT_PUBLIC_TOKEN_WBTC,
    process.env.NEXT_PUBLIC_TOKEN_XAUT,
    process.env.NEXT_PUBLIC_TOKEN_SPYON,
  ];
  if (tokens.some((t) => !t)) {
    throw new Error("Missing token envs");
  }

  const amounts = [
    hre.ethers.parseUnits("10000", 18),
    hre.ethers.parseUnits("0.1", 18),
    hre.ethers.parseUnits("25", 18),
    hre.ethers.parseUnits("15", 18),
  ];
  const cooldownSec = 60;

  const Faucet = await hre.ethers.getContractFactory("KryptageFaucet");
  const faucet = await Faucet.deploy(deployer.address, tokens, amounts, cooldownSec);
  await faucet.waitForDeployment();
  const addr = await faucet.getAddress();
  console.log("KryptageFaucet deployed at:", addr);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
