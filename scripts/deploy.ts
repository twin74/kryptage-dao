import 'dotenv/config';
import { ethers } from 'ethers';
import hre from 'hardhat';

const recipient = '0xAbC00c1AD0C57878d116dFcE50172055557Af97B';

function resolveSepoliaUrl() {
  const raw = process.env.SEPOLIA_RPC_URL || '';
  if (raw.includes('${')) {
    const infura = process.env.NEXT_PUBLIC_INFURA_API_KEY;
    if (!infura) throw new Error('Missing NEXT_PUBLIC_INFURA_API_KEY');
    return `https://sepolia.infura.io/v3/${infura}`;
  }
  return raw;
}

async function getFactory(name: string) {
  const art = await hre.artifacts.readArtifact(name);
  const rpcUrl = resolveSepoliaUrl();
  const pkRaw = process.env.DEPLOY_PRIVATE_KEY || '';
  const pk = pkRaw.replace(/^0x/, '');
  console.log('Debug env:', { rpcUrl, hasPK: !!pkRaw, pkLen: pk.length });
  if (!rpcUrl || !pk) throw new Error('Missing SEPOLIA_RPC_URL or DEPLOY_PRIVATE_KEY');
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(pk, provider);
  return { factory: new ethers.ContractFactory(art.abi, art.bytecode, wallet), abi: art.abi, wallet };
}

async function deployToken(name: string, symbol: string) {
  const { factory, abi, wallet } = await getFactory('ERC20');
  const contract = await factory.deploy(name, symbol, 18);
  await contract.waitForDeployment();
  const addr = await contract.getAddress();
  console.log(`${symbol} deployed: ${addr}`);
  const erc20 = new ethers.Contract(addr, abi, wallet);
  const amount = ethers.parseUnits('100000', 18);
  const tx = await erc20.mint(recipient, amount);
  await tx.wait();
  console.log(`${symbol} minted to ${recipient}`);
  return addr;
}

async function main() {
  const usdc = await deployToken('USDC', 'USDC');
  const wbtc = await deployToken('WBTC', 'WBTC');
  const xaut = await deployToken('XAUT', 'XAUT');
  const spyon = await deployToken('SPYON', 'SPYON');
  console.log('All tokens deployed:', { usdc, wbtc, xaut, spyon });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
