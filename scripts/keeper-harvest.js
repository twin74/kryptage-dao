/*
  Simple keeper script: calls StableController.harvestAndSync() every 5 minutes.

  Usage (from repo root):
    node scripts/keeper-harvest.js

  Config via env:
    - SEPOLIA_RPC_URL (already in .env)
    - DEPLOY_PRIVATE_KEY (already in .env; should be a dedicated keeper key)
    - NEXT_PUBLIC_STABLE_CONTROLLER (already in .env)

  Notes:
    - This script will keep running until stopped.
    - It will skip calls that would revert due to COOLDOWN.
*/

require("dotenv").config();
const { ethers } = require("ethers");

const RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.DEPLOY_PRIVATE_KEY;
const CONTROLLER = process.env.NEXT_PUBLIC_STABLE_CONTROLLER;

if (!RPC_URL) throw new Error("Missing SEPOLIA_RPC_URL");
if (!PRIVATE_KEY) throw new Error("Missing DEPLOY_PRIVATE_KEY");
if (!CONTROLLER) throw new Error("Missing NEXT_PUBLIC_STABLE_CONTROLLER");

const controllerAbi = ["function harvestAndSync()", "function lastHarvest() view returns (uint256)", "function harvestCooldown() view returns (uint256)"]; 

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const controller = new ethers.Contract(CONTROLLER, controllerAbi, wallet);

const FIVE_MIN_MS = 5 * 60 * 1000;

async function tryHarvest() {
  const now = new Date().toISOString();
  try {
    // Optional pre-check to avoid obvious cooldown reverts
    const [lastHarvest, cooldown] = await Promise.all([controller.lastHarvest(), controller.harvestCooldown()]);
    const nowSec = Math.floor(Date.now() / 1000);
    const nextOk = Number(lastHarvest) + Number(cooldown);
    if (cooldown > 0n && nowSec < nextOk) {
      console.log(`[${now}] cooldown: next harvest in ${nextOk - nowSec}s`);
      return;
    }

    console.log(`[${now}] sending harvestAndSync from ${wallet.address}...`);
    const tx = await controller.harvestAndSync();
    console.log(`[${now}] tx sent: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`[${now}] mined in block ${receipt.blockNumber}, gasUsed=${receipt.gasUsed.toString()}`);
  } catch (e) {
    const msg = e?.shortMessage || e?.reason || e?.message || String(e);
    if (typeof msg === "string" && msg.toLowerCase().includes("cooldown")) {
      console.log(`[${now}] cooldown revert (skipped)`);
      return;
    }
    console.error(`[${now}] harvestAndSync failed:`, msg);
  }
}

async function main() {
  const net = await provider.getNetwork();
  console.log(`Keeper starting. chainId=${net.chainId.toString()} controller=${CONTROLLER} wallet=${wallet.address}`);

  // run immediately then every 5 minutes
  await tryHarvest();
  setInterval(() => {
    void tryHarvest();
  }, FIVE_MIN_MS);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
