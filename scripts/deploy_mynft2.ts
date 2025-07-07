import { ethers } from "hardhat";

async function main() {
  const MyNFT2 = await ethers.getContractFactory("MyNFT2");
  const myNFT2 = await MyNFT2.deploy("MyNFT2", "MNFT2");
  await myNFT2.waitForDeployment();

  console.log("MyNFT2 deployed to:", await myNFT2.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 