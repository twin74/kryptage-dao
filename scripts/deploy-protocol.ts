import 'dotenv/config';
import hre from 'hardhat';
import { ethers } from 'ethers';

async function main() {
  const usdc = process.env.NEXT_PUBLIC_TOKEN_USDC as string;
  if (!usdc) throw new Error('Missing NEXT_PUBLIC_TOKEN_USDC');

  const rpcUrl = process.env.SEPOLIA_RPC_URL as string;
  const pk = (process.env.DEPLOY_PRIVATE_KEY || '').replace(/^0x/, '');
  if (!rpcUrl || !pk) throw new Error('Missing SEPOLIA_RPC_URL or DEPLOY_PRIVATE_KEY');

  const artOracle = await hre.artifacts.readArtifact('PriceOracle');
  const artFarm = await hre.artifacts.readArtifact('StableFarm');
  const artPool = await hre.artifacts.readArtifact('LendingPool');

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(pk, provider);

  // Deploy PriceOracle
  const OracleFactory = new ethers.ContractFactory(artOracle.abi, artOracle.bytecode, wallet);
  const oracle = await OracleFactory.deploy();
  await oracle.waitForDeployment();
  const oracleAddr = await oracle.getAddress();
  console.log('PriceOracle:', oracleAddr);

  // Deploy StableFarm with 30% APR
  const apr30 = ethers.parseUnits('0.30', 18);
  const FarmFactory = new ethers.ContractFactory(artFarm.abi, artFarm.bytecode, wallet);
  const farm = await FarmFactory.deploy(usdc, apr30);
  await farm.waitForDeployment();
  const farmAddr = await farm.getAddress();
  console.log('StableFarm:', farmAddr);

  // Deploy LendingPool
  const PoolFactory = new ethers.ContractFactory(artPool.abi, artPool.bytecode, wallet);
  const pool = await PoolFactory.deploy(usdc, oracleAddr);
  await pool.waitForDeployment();
  const poolAddr = await pool.getAddress();
  console.log('LendingPool:', poolAddr);

  // Configure collateral assets (WBTC, XAUT, SPYON) with example params
  const wbtc = process.env.NEXT_PUBLIC_TOKEN_WBTC as string;
  const xaut = process.env.NEXT_PUBLIC_TOKEN_XAUT as string;
  const spyon = process.env.NEXT_PUBLIC_TOKEN_SPYON as string;
  if (!wbtc || !xaut || !spyon) throw new Error('Missing collateral token addresses');

  const poolContract = new ethers.Contract(poolAddr, artPool.abi, wallet);
  const ltv70 = ethers.parseUnits('0.70', 18);
  const th85 = ethers.parseUnits('0.85', 18);
  const bonus05 = ethers.parseUnits('0.05', 18);
  await (await poolContract.addCollateralAsset(wbtc, ltv70, th85, bonus05)).wait();
  await (await poolContract.addCollateralAsset(xaut, ethers.parseUnits('0.60', 18), th85, bonus05)).wait();
  await (await poolContract.addCollateralAsset(spyon, ethers.parseUnits('0.40', 18), th85, bonus05)).wait();

  console.log('Configured collaterals.');

  // Output addresses for .env update
  console.log('Deployed addresses:', { oracle: oracleAddr, farm: farmAddr, lendingPool: poolAddr });
}

main().catch((e) => { console.error(e); process.exit(1); });
