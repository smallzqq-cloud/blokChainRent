const {ethers} = require("hardhat");
const { expect } = require('chai');
const helpers = require("@nomicfoundation/hardhat-network-helpers");


let owner, other, another;

describe("LandlordItem", async function () {
  beforeEach(async () => {
    [owner, other, another] = await ethers.getSigners();
    const LandlordItems = await ethers.getContractFactory("LandlordItems");
    let landlordItems = await LandlordItems.deploy();
  
    const TenantsItems = await ethers.getContractFactory("TenantsItems");
    let tenantsItems = await TenantsItems.deploy();
  
    const HouseItems = await ethers.getContractFactory("HouseItems");
    let houseItems = await HouseItems.deploy();

    const RentManagement = await ethers.getContractFactory("RentManagement");
    this.rentManagement = await RentManagement.deploy(landlordItems.address, tenantsItems.address, houseItems.address);
	});

    it("LandlordItem createItem", async() => {
      await this.rentManagement.registerLandlord("zsc",1,1,"1","xx");
      await this.rentManagement.connect(other).registerTenant("zssc",1,1,"1","xx");
      let rentInfo = ["4124",142, 24 ,1,2 ,42 ,24, 24, 200000, 10000,"0"]
      await this.rentManagement.createItem(rentInfo);
      await this.rentManagement.createItem(rentInfo);
      let lanlordInfo = await this.rentManagement.getLordInfo(0);
      expect(lanlordInfo.name).to.equal("zsc");
    });

    it("LandlordItem rentHouse", async() => {
      await this.rentManagement.registerLandlord("zsc",1,1,"1","xx");
      await this.rentManagement.connect(other).registerTenant("zssc",1,1,"1","xx");
      let rentInfo = ["4124",142, 24 ,1,2 ,42 ,24, 24, 200000, 10000,"0"]
      await this.rentManagement.createItem(rentInfo);
      await this.rentManagement.connect(other).MintHouseToken(2011314);
      await this.rentManagement.connect(other).rentHouse(0);
      expect(await this.rentManagement.isRent(0)).to.equal(true);
    });

    it("LandlordItem payrent", async() => {
      await this.rentManagement.registerLandlord("zsc",1,1,"1","xx");
      await this.rentManagement.connect(other).registerTenant("zssc",1,1,"1","xx");
      let rentInfo = ["4124",142, 24 ,1,2 ,42 ,24, 24, 200000, 10000,"0"]
      await this.rentManagement.createItem(rentInfo);
      await this.rentManagement.connect(other).MintHouseToken(2011314);
      await this.rentManagement.connect(other).rentHouse(0);
      await this.rentManagement.connect(other).payRent(0);
      let res = await this.rentManagement.getBillInfo(0);
      expect(res.rentPayStatus[1]).to.equal(true);
    });

    it("LandlordItem removehouse", async() => {
      await this.rentManagement.registerLandlord("zsc",1,1,"1","xx");
      await this.rentManagement.connect(other).registerTenant("zssc",1,1,"1","xx");
      let rentInfo = ["4124",142, 24 ,1,2 ,42 ,24, 24, 200000, 10000,"0"]
      await this.rentManagement.createItem(rentInfo);
      await this.rentManagement.createItem(rentInfo);
      await this.rentManagement.removeHouse(1);
      let lanID = await this.rentManagement.getLandlordRent(owner.address);
      expect(lanID.length).to.equal(1);
    });

 });

