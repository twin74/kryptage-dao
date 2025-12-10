import 'dotenv/config';
import { ethers } from 'ethers';
import hre from 'hardhat';

function resolveSepoliaUrl() {
  const raw = process.env.SEPOLIA_RPC_URL || '';
  if (raw.includes('${')) {
    const infura = process.env.NEXT_PUBLIC_INFURA_API_KEY;
    if (!infura) throw new Error('Missing NEXT_PUBLIC_INFURA_API_KEY');
    return `https://sepolia.infura.io/v3/${infura}`;
  }
  return raw;
}

async function getWallet() {
  const rpcUrl = resolveSepoliaUrl();
  const pkRaw = process.env.DEPLOY_PRIVATE_KEY || '';
  const pk = pkRaw.replace(/^0x/, '');
  if (!rpcUrl || !pk) throw new Error('Missing SEPOLIA_RPC_URL or DEPLOY_PRIVATE_KEY');
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  return new ethers.Wallet(pk, provider);
}

async function main() {
  const wallet = await getWallet();

  // Load artifacts
  const usdkArt = await hre.artifacts.readArtifact('USDK');
  const proxyArt = await hre.artifacts.readArtifact('MyTransparentUpgradeableProxy');
  const proxyAdminArt = await hre.artifacts.readArtifact('_ProxyArtifactsHolder'); // ProxyAdmin ABI

  // Deploy implementation
  const implFactory = new ethers.ContractFactory(usdkArt.abi, usdkArt.bytecode, wallet);
  const impl = await implFactory.deploy();
  await impl.waitForDeployment();
  const implAddr = await impl.getAddress();
  console.log('USDK implementation:', implAddr);

  // Deploy ProxyAdmin (owned by deployer; recommend transferring to multisig)
  const adminFactory = new ethers.ContractFactory(proxyAdminArt.abi, proxyAdminArt.bytecode, wallet);
  const proxyAdmin = await adminFactory.deploy(wallet.address);
  await proxyAdmin.waitForDeployment();
  const proxyAdminAddr = await proxyAdmin.getAddress();
  console.log('ProxyAdmin:', proxyAdminAddr);

  // Encode initialize(admin)
  const iface = new ethers.Interface(usdkArt.abi);
  const initData = iface.encodeFunctionData('initialize', [wallet.address]);

  // Deploy Transparent Proxy
  const proxyFactory = new ethers.ContractFactory(proxyArt.abi, proxyArt.bytecode, wallet);
  const proxy = await proxyFactory.deploy(implAddr, proxyAdminAddr, initData);
  await proxy.waitForDeployment();
  const proxyAddr = await proxy.getAddress();
  console.log('USDK proxy address (token address):', proxyAddr);

  // Optional: verify roles
  const usdk = new ethers.Contract(proxyAddr, usdkArt.abi, wallet);
  const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
  const hasAdmin = await usdk.hasRole(DEFAULT_ADMIN_ROLE, wallet.address);
  console.log('Admin set:', hasAdmin);

  console.log('Next steps: transfer ProxyAdmin ownership to multisig, grant MINTER/BURNER/PAUSER roles as needed.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
