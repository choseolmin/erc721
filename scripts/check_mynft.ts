import { ethers } from "hardhat";
import { MyNFT2 } from "../typechain-types/contracts/MyNFT2";

async function main() {
  // 배포된 MyNFT2 컨트랙트 주소를 입력하세요
  const contractAddress = "0x05137b7eB4F5E35d535D4A4a93Ce189f1246Ec2a";

  // 내 지갑 주소
  const [owner] = await ethers.getSigners();
  const myAddress = owner.address;

  // MyNFT2 컨트랙트 인스턴스 생성 (타입 적용)
  const myNFT2 = (await ethers.getContractAt("MyNFT2", contractAddress, owner)) as MyNFT2;

  // 1. 내가 가진 NFT 개수
  const balance = await myNFT2.balanceOf(myAddress);
  console.log(`내가 가진 NFT 개수: ${balance.toString()}`);

  // 2. 내가 가진 NFT의 아이디(토큰ID)와 3. 각 NFT의 URI 출력
  if (balance > 0n) {
    let found = 0n;
    let tokenIds: bigint[] = [];
    // MyNFT2는 토큰ID가 1부터 시작해서 연속적으로 증가한다고 가정
    // 1번부터 balance만큼 ownerOf로 소유자 체크
    for (let tokenId = 1n; found < balance; tokenId++) {
      try {
        const ownerOfToken = await myNFT2.ownerOf(tokenId);
        if (ownerOfToken.toLowerCase() === myAddress.toLowerCase()) {
          tokenIds.push(tokenId);
          found++;
        }
      } catch (e) {
        // 존재하지 않는 토큰ID는 무시
      }
    }
    for (const tokenId of tokenIds) {
      const uri = await myNFT2.tokenURI(tokenId);
      console.log(`내 NFT 토큰ID: ${tokenId.toString()}, URI: ${uri}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 