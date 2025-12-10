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
  const usdkAddress = process.env.NEXT_PUBLIC_TOKEN_USDK || '';
  if (!usdkAddress) throw new Error('Set NEXT_PUBLIC_TOKEN_USDK to the USDK proxy address');

  const usdkArt = await hre.artifacts.readArtifact('USDK');
  const usdk = new ethers.Contract(usdkAddress, usdkArt.abi, wallet);

  const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes('MINTER_ROLE'));
  const BURNER_ROLE = ethers.keccak256(ethers.toUtf8Bytes('BURNER_ROLE'));
  const PAUSER_ROLE = ethers.keccak256(ethers.toUtf8Bytes('PAUSER_ROLE'));

  // TODO: replace with actual addresses
  const vaultUSDT = '0x0000000000000000000000000000000000000001';
  const poolManager = '0x0000000000000000000000000000000000000002';
  const opsMultisig = wallet.address; // example

  await (await usdk.grantRole(MINTER_ROLE, vaultUSDT)).wait();
  await (await usdk.grantRole(MINTER_ROLE, poolManager)).wait();
  await (await usdk.grantRole(BURNER_ROLE, poolManager)).wait();
  await (await usdk.grantRole(PAUSER_ROLE, opsMultisig)).wait();

  console.log('Roles granted. Update addresses in script before running in production.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
