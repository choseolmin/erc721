import { ethers } from "hardhat";
import { MyNFT2 } from "../typechain-types/contracts/MyNFT2";

async function main() {
  // 배포된 MyNFT2 컨트랙트 주소
  const contractAddress = "0x05137b7eB4F5E35d535D4A4a93Ce189f1246Ec2a";

  // 하드코딩: 받을 주소와 토큰ID
  const to = "0xEE171a82CaAb56C5f1D56c3C6Ce76B3f36f32Dc6";
  const tokenId = 1n;

  // signer(지갑) 정보 가져오기
  const [owner] = await ethers.getSigners();
  const myNFT2 = (await ethers.getContractAt("MyNFT2", contractAddress, owner)) as MyNFT2;

  // 소유자 확인
  const currentOwner = await myNFT2.ownerOf(tokenId);
  if (currentOwner.toLowerCase() !== owner.address.toLowerCase()) {
    console.error(`이 토큰의 소유자가 아닙니다. (현재 소유자: ${currentOwner})`);
    process.exit(1);
  }

  // 전송
  const tx = await myNFT2.transferFrom(owner.address, to, tokenId);
  await tx.wait();
  console.log(`NFT (토큰ID: ${tokenId})를 ${to} 주소로 전송 완료!`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 