import 'dotenv/config';
import hre from 'hardhat';
import { ethers } from 'ethers';

/**
 * Deploy KtgPointsUpgradeable implementation + MyTransparentUpgradeableProxy.
 * Then wire it into StableController + KryptageFaucet, and configure points params.
 */
async function main() {
  const rpcUrl = process.env.SEPOLIA_RPC_URL as string;
  const pk = (process.env.DEPLOY_PRIVATE_KEY || '').replace(/^0x/, '');
  if (!rpcUrl || !pk) throw new Error('Missing SEPOLIA_RPC_URL or DEPLOY_PRIVATE_KEY');

  // existing deployed contracts
  const STABLE_CONTROLLER = process.env.NEXT_PUBLIC_STABLE_CONTROLLER as string;
  const FAUCET = process.env.NEXT_PUBLIC_FAUCET_ADDRESS as string;
  if (!STABLE_CONTROLLER || !FAUCET) {
    throw new Error('Missing NEXT_PUBLIC_STABLE_CONTROLLER or NEXT_PUBLIC_FAUCET_ADDRESS in env');
  }

  // tokens used for score
  const USDC = process.env.NEXT_PUBLIC_TOKEN_USDC as string;
  const USDK = process.env.NEXT_PUBLIC_TOKEN_USDK as string;
  const SUSDK = process.env.NEXT_PUBLIC_TOKEN_SUSDK as string;
  if (!USDC || !USDK || !SUSDK) {
    throw new Error('Missing token addresses in env (NEXT_PUBLIC_TOKEN_USDC/USDK/SUSDK)');
  }

  // points params
  const divisor = 10000n;
  const minUpdateInterval = 86400n; // 1 day
  const bonusPointsPerClaim = 10n * 10n ** 18n; // +10 points per faucet claim (1e18)

  const artPoints = await hre.artifacts.readArtifact('KtgPointsUpgradeable');
  const artProxy = await hre.artifacts.readArtifact('contracts/MyTransparentUpgradeableProxy.sol:MyTransparentUpgradeableProxy');
  const artController = await hre.artifacts.readArtifact('StableController');
  const artFaucet = await hre.artifacts.readArtifact('KryptageFaucet');

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(pk, provider);
  const deployer = await wallet.getAddress();

  console.log('Deployer:', deployer);
  console.log('StableController:', STABLE_CONTROLLER);
  console.log('Faucet:', FAUCET);

  // 1) deploy implementation
  const PointsFactory = new ethers.ContractFactory(artPoints.abi, artPoints.bytecode, wallet);
  const impl = await PointsFactory.deploy();
  await impl.waitForDeployment();

  // 2) encode initialize
  const pointsIface = new ethers.Interface(artPoints.abi);
  const initData = pointsIface.encodeFunctionData('initialize', [
    deployer,
    USDC,
    USDK,
    SUSDK,
    divisor,
    minUpdateInterval,
  ]);

  // 3) deploy proxy (admin = deployer EOA)
  const ProxyFactory = new ethers.ContractFactory(artProxy.abi, artProxy.bytecode, wallet);
  const proxy = await ProxyFactory.deploy(await impl.getAddress(), deployer, initData);
  await proxy.waitForDeployment();

  const pointsProxy = await proxy.getAddress();

  console.log('KtgPoints impl:', await impl.getAddress());
  console.log('KtgPoints proxy:', pointsProxy);
  console.log('Proxy admin (EOA):', deployer);

  // 4) configure points (owner is deployer, set in initialize)
  // Interact with the proxy using the implementation ABI
  const points = new ethers.Contract(pointsProxy, artPoints.abi, wallet);

  console.log('Configuring points: setController...');
  const tx1 = await points.setController(STABLE_CONTROLLER);
  await tx1.wait();

  console.log('Configuring points: setFaucet...');
  const tx2 = await points.setFaucet(FAUCET);
  await tx2.wait();

  console.log('Configuring points: setParams(divisor,minUpdateInterval,bonusPointsPerClaim)...');
  const tx3 = await points.setParams(divisor, minUpdateInterval, bonusPointsPerClaim);
  await tx3.wait();

  // 5) wire points into controller + faucet
  const controller = new ethers.Contract(STABLE_CONTROLLER, artController.abi, wallet);
  const faucet = new ethers.Contract(FAUCET, artFaucet.abi, wallet);

  console.log('Wiring StableController.setPoints(pointsProxy)...');
  const tx4 = await controller.setPoints(pointsProxy);
  await tx4.wait();

  console.log('Wiring KryptageFaucet.setPoints(pointsProxy)...');
  const tx5 = await faucet.setPoints(pointsProxy);
  await tx5.wait();

  console.log('DONE');
  console.log('Points proxy:', pointsProxy);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
