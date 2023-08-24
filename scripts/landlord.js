
const { ethers } = require("hardhat");

async function main() {

  // const lockedAmount = ethers.utils.parseEther("1");
  const feeData = await ethers.provider.getFeeData();
  const costLimit = {
    maxFeePerGas: feeData.maxFeePerGas,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    gasLimit: 600000
  };
  const LandlordItems = await ethers.getContractFactory("LandlordItems");
  let landlordItems = await LandlordItems.deploy();
  console.log("LandlordItem",landlordItems.address);

  const TenantsItems = await ethers.getContractFactory("TenantsItems");
  let tenantsItems = await TenantsItems.deploy();
  console.log("tenantsItems",tenantsItems.address);

  // const HouseToken = await ethers.getContractFactory("HouseToken");
  // let houseToken = await HouseToken.deploy(201000000000000);
  // console.log("houseToken",houseToken.address);

  const HouseItems = await ethers.getContractFactory("HouseItems");
  let houseItems = await HouseItems.deploy();
  console.log("houseItems",houseItems.address);

  const RentManagement = await ethers.getContractFactory("RentManagement");
  let rentManagement = await RentManagement.deploy(landlordItems.address, tenantsItems.address, houseItems.address);
  console.log("rentManagement",rentManagement.address);

  await rentManagement.transfer("0x1EDd7e8bE62A43425aC9d53298d40C616e839d4B",2011314);
  
  // await LandlordItem.awardItem("0x3d65A3FDd246cf84147072E107c61624Cb3fC419", "https://gateway.pinata.cloud/ipfs/QmWeJUfaZpCK7q15yUr7McETtKCRaR2nG5zi97cen8EcgS", costLimit);
  // const balance = await LandlordItem.balanceOf("0x3d65A3FDd246cf84147072E107c61624Cb3fC419");
  // console.log(balance);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
