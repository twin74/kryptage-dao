require('dotenv').config();
process.env.HARDHAT_CONFIG = require('path').resolve(__dirname, '../hardhat.config.cjs');
process.env.HARDHAT_NETWORK = 'sepolia';
const hre = require('hardhat');

async function main() {
  const address = '0xb59fA75A904f307B442dBc82C0999854f649dd58';
  const constructorArguments = [
    '0x978B79bABA047441BAD5B3Be66242a03a356b08f',
    '0xC5E090EA380C6DF938b6920B78B574c58C2029B',
    '0x8129fc1c000000000000000000000000abc00c1ad0c57878d116dfce50172055557af97b'
  ];
  await hre.run('verify:verify', {
    address,
    constructorArguments,
    contract: 'contracts/ProxyArtifacts.sol:MyTransparentUpgradeableProxy',
  });
  console.log('Proxy verified');
}

main().catch((e) => { console.error(e); process.exit(1); });
