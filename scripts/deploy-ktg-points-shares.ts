import "dotenv/config";
import hre from "hardhat";
import { ethers } from "ethers";

function resolveSepoliaUrl() {
  const raw = process.env.SEPOLIA_RPC_URL || "";
  if (raw.includes("${")) {
    const infura = process.env.NEXT_PUBLIC_INFURA_API_KEY;
    if (!infura) throw new Error("Missing NEXT_PUBLIC_INFURA_API_KEY");
    return `https://sepolia.infura.io/v3/${infura}`;
  }
  return raw;
}

async function main() {
  const rpcUrl = resolveSepoliaUrl();
  const pk = (process.env.DEPLOY_PRIVATE_KEY || "").replace(/^0x/, "");
  if (!rpcUrl || !pk) throw new Error("Missing SEPOLIA_RPC_URL or DEPLOY_PRIVATE_KEY");

  const STABLE_CONTROLLER = process.env.NEXT_PUBLIC_STABLE_CONTROLLER as string;
  const FAUCET = process.env.NEXT_PUBLIC_FAUCET_ADDRESS as string;
  if (!STABLE_CONTROLLER || !FAUCET) throw new Error("Missing NEXT_PUBLIC_STABLE_CONTROLLER or NEXT_PUBLIC_FAUCET_ADDRESS");

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(pk, provider);
  const deployer = await wallet.getAddress();

  console.log("Deployer:", deployer);
  console.log("StableController:", STABLE_CONTROLLER);
  console.log("Faucet:", FAUCET);

  // Config (tweakable): points per share-second.
  // Example: 1 point/day per 1 share:
  // rate = 1e18 / 86400
  const pointsPerDayPerShare1e18 = 1n * 10n ** 18n;
  const ratePerSec1e18 = pointsPerDayPerShare1e18 / 86400n;

  // Keep faucet bonus (optional)
  const bonusPerClaim1e18 = 10n * 10n ** 18n;

  const artPoints = await hre.artifacts.readArtifact("KtgPointsShares");
  const factory = new ethers.ContractFactory(artPoints.abi, artPoints.bytecode, wallet);

  const points = await factory.deploy(deployer, STABLE_CONTROLLER, FAUCET, ratePerSec1e18, bonusPerClaim1e18);
  await points.waitForDeployment();

  const pointsAddr = await points.getAddress();

  console.log("KtgPointsShares deployed at:", pointsAddr);
  console.log("ratePerSec1e18:", ratePerSec1e18.toString());
  console.log("bonusPerClaim1e18:", bonusPerClaim1e18.toString());

  // Wire into controller + faucet
  const artController = await hre.artifacts.readArtifact("StableController");
  const artFaucet = await hre.artifacts.readArtifact("KryptageFaucet");

  const controller = new ethers.Contract(STABLE_CONTROLLER, artController.abi, wallet);
  const faucet = new ethers.Contract(FAUCET, artFaucet.abi, wallet);

  console.log("Wiring StableController.setPoints(pointsAddr)...");
  const tx1 = await controller.setPoints(pointsAddr);
  await tx1.wait();

  console.log("Wiring KryptageFaucet.setPoints(pointsAddr)...");
  const tx2 = await faucet.setPoints(pointsAddr);
  await tx2.wait();

  console.log("DONE");
  console.log("Update NEXT_PUBLIC_KTG_POINTS=", pointsAddr);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
