require('dotenv').config();
const { run } = require('hardhat');

async function main() {
  const which = process.argv[2];
  if (which === 'usdk') {
    await run('verify:verify', {
      address: '0x978B79bABA047441BAD5B3Be66242a03a356b08f',
      contract: 'contracts/USDK.sol:USDK',
    });
    console.log('USDK implementation verified');
  } else if (which === 'proxy') {
    await run('verify:verify', {
      address: '0xb59fA75A904f307B442dBc82C0999854f649dd58',
      constructorArguments: [
        '0x978B79bABA047441BAD5B3Be66242a03a356b08f',
        '0xC5E090EA380C6DF938b6920B78B574c58C2029B',
        '0x8129fc1c000000000000000000000000abc00c1ad0c57878d116dfce50172055557af97b'
      ],
      contract: 'contracts/ProxyArtifacts.sol:MyTransparentUpgradeableProxy',
    });
    console.log('Proxy verified');
  } else {
    console.error('Usage: node scripts/verify.js <usdk|proxy>');
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
