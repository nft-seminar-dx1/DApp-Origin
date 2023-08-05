const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lottery", function () {
  let lottery;
  let owner;
  let ticketBuyer1;
  let ticketBuyer2;
  let nonTicketBuyer;

  beforeEach(async function () {
    [owner, ticketBuyer1, ticketBuyer2, nonTicketBuyer] = await ethers.getSigners();

    const Lottery = await ethers.getContractFactory("Lottery");
    lottery = await Lottery.deploy();
    await lottery.deployed();
  });

  it("チケット価格が 0.01 etherであること", async function () {
    expect( await lottery.TICKET_PRICE()).to.equal(ethers.utils.parseEther("0.01"));
  });

  it("チケットは指定価格以外では購入できないこと", async function () {
    await expect(lottery.ticketbuy({ value: ethers.utils.parseEther("0.009") })).to.be.reverted;
    await expect(lottery.ticketbuy({ value: ethers.utils.parseEther("0.011") })).to.be.reverted;
  });

  it("販売期間内であればチケットを購入できること", async function () {
    await lottery.connect(ticketBuyer1).ticketbuy({ value: ethers.utils.parseEther("0.01") });
    expect(await lottery.tickets(0)).to.equal(ticketBuyer1.address);
  });

  it("販売期間内は抽選を行えないこと", async function () {
    await expect(lottery.drawWinner()).to.be.reverted;
  });

  it("販売期間終了後はチケットが購入できないこと、また抽選は宝くじ発行者しか行えないこと", async function () {
    await sleepByPromise(4);
    await expect(lottery.connect(ticketBuyer1).ticketbuy({ value: ethers.utils.parseEther("0.01") })).to.be.reverted;
    await expect(lottery.connect(ticketBuyer1).drawWinner()).to.be.reverted;
  });

  it("当選者のみが当選金を引き出せること", async function () {
    await lottery.connect(ticketBuyer1).ticketbuy({ value: ethers.utils.parseEther("0.01") });
    await lottery.connect(ticketBuyer2).ticketbuy({ value: ethers.utils.parseEther("0.01") });
    await sleepByPromise(4);
    // オーナーは抽選が可能
    await lottery.connect(owner).drawWinner();
    // 二度目はエラーになるはず
    
    await expect(lottery.connect(owner).drawWinner()).to.be.reverted;

    const winner = await lottery.winner();
    console.log('winner is '+winner);
    if (winner == ticketBuyer1.address) {
        console.log('ticketBuyer1('+ ticketBuyer1.address +')');
        await expect(lottery.connect(owner).withdraw()).to.be.reverted;
        await expect(lottery.connect(ticketBuyer2).withdraw()).to.be.reverted;
        await expect(lottery.connect(nonTicketBuyer).withdraw()).to.be.reverted;

        const initialBalance = await ethers.provider.getBalance(ticketBuyer1.address);

        const trans = await lottery.connect(ticketBuyer1).withdraw();
        const receipt = await trans.wait();
        const gasCost = receipt.gasUsed;

        const finalBalance = await ethers.provider.getBalance(ticketBuyer1.address);
        expect(finalBalance.sub(initialBalance)).to.equal(ethers.utils.parseEther("0.02").sub(gasCost));

    } else {
        console.log('ticketBuyer2('+ ticketBuyer2.address +')');
        await expect(lottery.connect(owner).withdraw()).to.be.reverted;
        await expect(lottery.connect(ticketBuyer1).withdraw()).to.be.reverted;
        await expect(lottery.connect(nonTicketBuyer).withdraw()).to.be.reverted;

        const initialBalance = await ethers.provider.getBalance(ticketBuyer2.address);

        const trans = await lottery.connect(ticketBuyer2).withdraw();
        const receipt = await trans.wait();
        const gasCost = receipt.gasUsed;

        const finalBalance = await ethers.provider.getBalance(ticketBuyer2.address);
        expect(finalBalance.sub(initialBalance)).to.equal(ethers.utils.parseEther("0.02").sub(gasCost));

    }
  });


});

function sleepByPromise(sec) {
    console.log('    '+sec+' 秒間待ちます');
    return new Promise(resolve => setTimeout(resolve, sec*1000));

};