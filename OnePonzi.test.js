const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OnePonzi", function () {
  let onePonzi;

  beforeEach(async function () {
    const OnePonzi = await ethers.getContractFactory("OnePonzi");
    onePonzi = await OnePonzi.deploy();
    await onePonzi.deployed();
  });

  it("最初の枠の所有者はコントラクトの作成者である", async function () {
    const initialInvestor = await onePonzi.investor();
    expect(initialInvestor).to.equal(await ethers.provider.getSigner(0).getAddress());
  });

  it("最低投資金額に満たない投資はエラーとなる", async function () {
    //const [owner, investor1] = await ethers.getSigners();
    await expect( onePonzi.invest({ value: 0 })).to.be.reverted;
    //await expect( onePonzi.connect(investor1).invest({ value: 0 })).to.be.revertedWith("The investment amount is not enough.");
  });

  it("最低投資金額を満たす投資を行うと、新しい投資者になる", async function () {
    const [owner, investor1] = await ethers.getSigners();
    const investment = web3.utils.toWei("0.01", "ether");
    await onePonzi.connect(investor1).invest({ value: investment });
    //await onePonzi.invest({ from: investor1.address, value: investment });
    const newInvestor = await onePonzi.investor();
    expect(newInvestor).to.equal(investor1.address);
  });

  it("投資金額は前回の10％増しとなる", async function () {
    const [owner, investor1, investor2] = await ethers.getSigners();
    await onePonzi.connect(investor1).invest({ value: ethers.utils.parseEther("0.01") });
    const newInvestmentAmount = await onePonzi.investment();
    expect(newInvestmentAmount).to.equal(ethers.utils.parseEther("0.011"));

    await onePonzi.connect(investor2).invest({ value: ethers.utils.parseEther("0.011") });
    const newInvestmentAmount2 = await onePonzi.investment();
    expect(newInvestmentAmount2).to.equal(ethers.utils.parseEther("0.0121"));
  });

  it("投資家が投資に成功すると、その金額は全て前回の投資者に送金される", async function() {
    const [owner, investor1, investor2] = await ethers.getSigners();
    const investmentAmount1 = ethers.utils.parseEther("0.01");
    const investmentAmount2 = ethers.utils.parseEther("0.011");


    // investor1 makes the initial investment
    const ownerInitialBalance = await ethers.provider.getBalance(owner.address);
    await onePonzi.connect(investor1).invest({ value: investmentAmount1});
    const ownerAfterBalance = await ethers.provider.getBalance(owner.address);

    // Check that investor1 has received the investment amount and the new investment amount is set correctly
    expect(ownerAfterBalance).to.equal(ownerInitialBalance.add(investmentAmount1));
    expect(await onePonzi.connect(investor1).investment()).to.equal(investmentAmount2);

    // newInvestor makes the second investment
    const investor1InitialBalance = await ethers.provider.getBalance(investor1.address);
    await onePonzi.connect(investor2).invest({value: investmentAmount2});
    const investor1AfterBalance = await ethers.provider.getBalance(investor1.address);

    // Check that initialInvestor has received the second investment amount and the new investment amount is set correctly
    expect(investor1AfterBalance).to.equal(investor1InitialBalance.add(investmentAmount2));
  });  
});