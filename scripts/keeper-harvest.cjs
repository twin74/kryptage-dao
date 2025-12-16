/*
  Keeper: calls StableController.harvestAndSync() immediately, then every 5 minutes.
  Works in repos with package.json { "type": "module" } by using .cjs (CommonJS).

  Env vars required:
    - SEPOLIA_RPC_URL
    - DEPLOY_PRIVATE_KEY
    - NEXT_PUBLIC_STABLE_CONTROLLER

  Optional:
    - KEEPER_INTERVAL_MS (default 300000)
*/

const dotenv = require("dotenv");
dotenv.config();

const { ethers } = require("ethers");

const RPC_URL =
  process.env.SEPOLIA_RPC_URL ||
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ||
  (process.env.NEXT_PUBLIC_INFURA_API_KEY
    ? `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
    : undefined);
const PRIVATE_KEY = process.env.DEPLOY_PRIVATE_KEY;
const CONTROLLER = process.env.NEXT_PUBLIC_STABLE_CONTROLLER;

const INTERVAL_MS = Number(process.env.KEEPER_INTERVAL_MS || 300_000);

if (!RPC_URL) throw new Error("Missing SEPOLIA_RPC_URL (or NEXT_PUBLIC_SEPOLIA_RPC_URL / NEXT_PUBLIC_INFURA_API_KEY) in .env");
if (!PRIVATE_KEY) throw new Error("Missing DEPLOY_PRIVATE_KEY in .env");
if (!CONTROLLER) throw new Error("Missing NEXT_PUBLIC_STABLE_CONTROLLER in .env");

const ABI = [
  "function harvestAndSync() external",
  "function lastHarvest() view returns (uint256)",
  "function harvestCooldown() view returns (uint256)",
];

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const controller = new ethers.Contract(CONTROLLER, ABI, wallet);

  console.log("keeper-harvest started");
  console.log("controller:", CONTROLLER);
  console.log("keeper:", wallet.address);
  console.log("interval(ms):", INTERVAL_MS);

  async function tick() {
    try {
      const [lastHarvest, cooldown] = await Promise.all([
        controller.lastHarvest(),
        controller.harvestCooldown(),
      ]);

      const now = Math.floor(Date.now() / 1000);
      const nextAllowed = Number(lastHarvest) + Number(cooldown);

      if (now < nextAllowed) {
        const wait = nextAllowed - now;
        console.log(`[skip] cooldown active, next in ~${wait}s (lastHarvest=${lastHarvest} cooldown=${cooldown})`);
        return;
      }

      console.log("[tx] harvestAndSync()...");
      const tx = await controller.harvestAndSync();
      console.log("[tx] hash:", tx.hash);

      const receipt = await tx.wait();
      console.log(`[ok] block=${receipt.blockNumber} gasUsed=${receipt.gasUsed.toString()}`);
    } catch (e) {
      const msg = e?.shortMessage || e?.reason || e?.message || String(e);
      console.error("[err]", msg);
      // uncomment for full dump
      // console.error(e);
    }
  }

  await tick();
  setInterval(tick, INTERVAL_MS);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
