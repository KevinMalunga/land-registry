// test/LandRegistry.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LandRegistry", function () {
  let contract, admin, user1, user2;

  beforeEach(async function () {
    [admin, user1, user2] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("LandRegistry");
    contract = await Factory.deploy();
  });

  // Helper: hash a string the same way the frontend does
  function hash(text) {
    return ethers.keccak256(ethers.toUtf8Bytes(text));
  }

  it("deploys with admin set", async function () {
    expect(await contract.admin()).to.equal(admin.address);
  });

  it("registers a land parcel", async function () {
    await contract.connect(user1).registerLand("ZMB-001", hash("deed1"));
    const land = await contract.lands("ZMB-001");
    expect(land.owner).to.equal(user1.address);
    expect(land.exists).to.be.true;
  });

  it("prevents duplicate land ID", async function () {
    await contract.connect(user1).registerLand("ZMB-001", hash("deed1"));
    await expect(
      contract.connect(user2).registerLand("ZMB-001", hash("deed2"))
    ).to.be.revertedWith("Land already registered");
  });

  it("prevents duplicate document hash (fraud detection)", async function () {
    await contract.connect(user1).registerLand("ZMB-001", hash("same-deed"));
    await expect(
      contract.connect(user1).registerLand("ZMB-002", hash("same-deed"))
    ).to.be.revertedWith("Duplicate document hash");
  });

  it("transfers ownership", async function () {
    await contract.connect(user1).registerLand("ZMB-001", hash("deed1"));
    await contract.connect(user1).transferOwnership("ZMB-001", user2.address);
    const land = await contract.lands("ZMB-001");
    expect(land.owner).to.equal(user2.address);
  });

  it("blocks transfer from non-owner", async function () {
    await contract.connect(user1).registerLand("ZMB-001", hash("deed1"));
    await expect(
      contract.connect(user2).transferOwnership("ZMB-001", user2.address)
    ).to.be.revertedWith("Not the owner");
  });

  it("verifies a correct document hash", async function () {
    await contract.connect(user1).registerLand("ZMB-001", hash("deed1"));
    expect(await contract.verifyTitle("ZMB-001", hash("deed1"))).to.be.true;
  });

  it("rejects a wrong (forged) document hash", async function () {
    await contract.connect(user1).registerLand("ZMB-001", hash("real-deed"));
    expect(await contract.verifyTitle("ZMB-001", hash("forged-deed"))).to.be.false;
  });

  it("stores transfer history", async function () {
    await contract.connect(user1).registerLand("ZMB-001", hash("deed1"));
    await contract.connect(user1).transferOwnership("ZMB-001", user2.address);
    expect(await contract.getHistoryCount("ZMB-001")).to.equal(2); // register + transfer
  });
});
