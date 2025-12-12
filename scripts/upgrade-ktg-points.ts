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

async function getWallet() {
  const rpcUrl = resolveSepoliaUrl();
  const pkRaw = process.env.DEPLOY_PRIVATE_KEY || "";
  const pk = pkRaw.replace(/^0x/, "");
  if (!rpcUrl || !pk) throw new Error("Missing SEPOLIA_RPC_URL or DEPLOY_PRIVATE_KEY");
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  return new ethers.Wallet(pk, provider);
}

async function getEip1967Admin(provider: ethers.Provider, proxy: string) {
  const slotAdmin = "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103";
  const raw = await provider.getStorage(proxy, slotAdmin);
  return ethers.getAddress("0x" + raw.slice(26));
}

async function main() {
  const pointsProxy = process.env.NEXT_PUBLIC_KTG_POINTS || "";
  if (!pointsProxy) throw new Error("Missing NEXT_PUBLIC_KTG_POINTS");

  const wallet = await getWallet();

  // ensure we are the proxy admin (Transparent proxy admin is an EOA in this deployment)
  const adminAddr = await getEip1967Admin(wallet.provider!, pointsProxy);
  if (adminAddr.toLowerCase() !== wallet.address.toLowerCase()) {
    throw new Error(`This wallet is not the proxy admin. proxyAdmin=${adminAddr} wallet=${wallet.address}`);
  }
  console.log("Proxy admin confirmed:", adminAddr);

  // 1) Deploy new implementation
  const art = await hre.artifacts.readArtifact("KtgPointsUpgradeable");
  const implFactory = new ethers.ContractFactory(art.abi, art.bytecode, wallet);
  const impl = await implFactory.deploy();
  await impl.waitForDeployment();
  const newImpl = await impl.getAddress();
  console.log("New KtgPointsUpgradeable implementation:", newImpl);

  // 2) Upgrade proxy directly (custom proxy supports upgradeTo)
  const proxyAdminIface = ["function upgradeTo(address newImplementation) external"] as const;
  const proxyAsAdmin = new ethers.Contract(pointsProxy, proxyAdminIface, wallet);

  console.log("Upgrading points proxy", pointsProxy, "->", newImpl);
  const tx = await proxyAsAdmin.upgradeTo(newImpl, { gasLimit: 250000n });
  console.log("upgrade tx:", tx.hash);
  await tx.wait();

  // 3) Quick sanity read (through proxy)
  const pointsView = new ethers.Contract(
    pointsProxy,
    [
      "function faucet() view returns (address)",
      "function controller() view returns (address)",
      "function divisor() view returns (uint256)",
      "function bonusPointsPerClaim() view returns (uint256)",
      "function minUpdateInterval() view returns (uint256)",
    ],
    wallet.provider
  );

  const [faucet, controller, divisor, bonus, interval] = await Promise.all([
    pointsView.faucet(),
    pointsView.controller(),
    pointsView.divisor(),
    pointsView.bonusPointsPerClaim(),
    pointsView.minUpdateInterval(),
  ]);

  console.log("Post-upgrade config:", {
    faucet,
    controller,
    divisor: divisor.toString(),
    bonusPointsPerClaim: bonus.toString(),
    minUpdateInterval: interval.toString(),
  });

  console.log("DONE");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
