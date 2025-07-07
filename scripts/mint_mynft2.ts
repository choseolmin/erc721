import { ethers } from "hardhat";
import { MyNFT2 } from "../typechain-types/contracts/MyNFT2";

async function main() {
  // Sepolia에 배포된 MyNFT2 컨트랙트 주소
  const contractAddress = "0x5A30762F52e2a6Fd924cCD107bd8Dd9f2fC0F210";

  // 실행자(본인) 지갑 정보
  const [owner] = await ethers.getSigners();
  console.log("실행자 지갑 주소:", owner.address);

  // MyNFT2 컨트랙트 인스턴스 생성
  const myNFT2 = (await ethers.getContractAt("MyNFT2", contractAddress, owner)) as MyNFT2;

  // 마지막으로 발행된 토큰ID를 컨트랙트에서 조회
  let lastMintedId = 0n;
  try {
    lastMintedId = await myNFT2.lastMintedId();
  } catch (e) {
    console.log("lastMintedId 조회 실패 (최초 배포 후 첫 민팅일 수 있음)");
  }
  const nextTokenId = lastMintedId + 1n;

  // 생성할 NFT의 URI (토큰ID에 맞게 자동 생성)
  const tokenURI = `https://cryptopunks.app/cryptopunks/cryptopunk${nextTokenId.toString().padStart(4, "0")}.png`;

  // 디버깅 정보 출력
  console.log("lastMintedId:", lastMintedId.toString());
  console.log("nextTokenId:", nextTokenId.toString());
  console.log("tokenURI:", tokenURI);

  // NFT 민팅 (실행자 지갑에 발행)
  const tx = await myNFT2.mint(owner.address, tokenURI);
  const receipt = await tx.wait();

  // Transfer 이벤트에서 tokenId 추출
  let tokenId;
  if (receipt && receipt.logs) {
    for (const log of receipt.logs) {
      try {
        const parsed = myNFT2.interface.parseLog(log);
        if (parsed && parsed.name === "Transfer") {
          tokenId = parsed.args?.tokenId;
          break;
        }
      } catch (e) {}
    }
  }

  // 결과 출력
  if (tokenId) {
    console.log(`✅ NFT 발행 완료! Token ID: ${tokenId.toString()}`);
    console.log(`Token URI: ${await myNFT2.tokenURI(tokenId)}`);
    console.log(`Owner: ${await myNFT2.ownerOf(tokenId)}`);
    if ((await myNFT2.ownerOf(tokenId)).toLowerCase() === owner.address.toLowerCase()) {
      console.log("✔️ NFT가 실행자 지갑에 정상적으로 발행되었습니다.");
    } else {
      console.log("❌ NFT 소유자가 실행자 지갑이 아닙니다. (문제 발생)");
    }
  } else {
    console.log("❌ NFT 발행에 실패했습니다.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
