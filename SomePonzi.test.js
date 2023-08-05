const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SomePonzi", function () {
  let somePonzi;

  beforeEach(async function () {
    const SomePonzi = await ethers.getContractFactory("SomePonzi");
    somePonzi = await SomePonzi.deploy();
    await somePonzi.deployed();
  });

  it("コントラクトの作成者は最初の投資者である", async function () {
    const invester0 = await somePonzi.investors(0);
    expect(invester0).to.equal(await ethers.provider.getSigner(0).getAddress());
  });

  it("最低投資金額に満たない投資はエラーとなる", async function () {
    const [owner, investor1] = await ethers.getSigners();
    await expect( somePonzi.connect(investor1).invest({ value: 0 })).to.be.reverted;
  });

  it("投資は１度しかできない", async function () {
    const [owner, investor1] = await ethers.getSigners();
    await somePonzi.connect(investor1).invest({ value: ethers.utils.parseEther("0.01")  })
    await expect( somePonzi.connect(investor1).invest({ value: ethers.utils.parseEther("0.01")  })).to.be.reverted;
  });

  it("3人が1etherづつ投資すると、３人の残高は 1.5, 0.5, 0 増える", async function () {
    const [investor0, investor1,investor2] = await ethers.getSigners();
    const investor0Initial = await somePonzi.balances(investor0.address);
    const investor1Initial = await somePonzi.balances(investor1.address);
    const investor2Initial = await somePonzi.balances(investor2.address);

    await somePonzi.connect(investor1).invest({ value: ethers.utils.parseEther("1") });
    await somePonzi.connect(investor2).invest({ value: ethers.utils.parseEther("1") });

    const investor0After = await somePonzi.balances(investor0.address);
    const investor1After = await somePonzi.balances(investor1.address);
    const investor2After = await somePonzi.balances(investor2.address);
        
    expect(investor0After.sub(investor0Initial)).to.equal(ethers.utils.parseEther("1.5"));
    expect(investor1After.sub(investor1Initial)).to.equal(ethers.utils.parseEther("0.5"));
    expect(investor2After.sub(investor2Initial)).to.equal(ethers.utils.parseEther("0.0"));
  });

  it("儲けを引き出すことができる", async function () {
    const [investor0, investor1,investor2] = await ethers.getSigners();
    const initialBalance = await ethers.provider.getBalance(investor0.address);

    await somePonzi.connect(investor1).invest({ value: ethers.utils.parseEther("1") });
    await somePonzi.connect(investor2).invest({ value: ethers.utils.parseEther("1") });

    const trans = await somePonzi.connect(investor0).withdraw();
    const receipt = await trans.wait();
    const gasCost = receipt.gasUsed;

    const finalBalance = await ethers.provider.getBalance(investor0.address);
    expect(finalBalance.sub(initialBalance)).to.equal(ethers.utils.parseEther("1.5").sub(gasCost));

  });

});