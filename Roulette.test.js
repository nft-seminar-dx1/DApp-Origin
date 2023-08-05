const { expect } = require("chai");
const { ethers } = require("hardhat");

// Rouletteコントラクトのテストコード
describe("Roulette", function() {

  // startRoulette関数のテスト
  describe("startRoulette", function() {
    // 各テストケースの実行前にコントラクトをデプロイする
    before(async function() {
        this.Roulette = await ethers.getContractFactory("Roulette");
        this.roulette = await this.Roulette.deploy();
        await this.roulette.deployed();
    });

    it("オーナー以外がstartRoulette関数を呼び出した場合、エラーが発生する", async function() {
        const [_, other] = await ethers.getSigners();
        await expect(this.roulette.connect(other).startRoulette()).to.be.reverted;
    });

    it("オーナーがstartRoulette関数を呼び出した場合、bet_onフラグがtrueになる", async function() {
        await this.roulette.startRoulette();
        expect(await this.roulette.bet_on()).to.equal(true);
    });
  });

  // wager関数のテスト
  describe("wager", function() {
    // 各テストケースの実行前にコントラクトをデプロイする
    before(async function() {
        this.Roulette = await ethers.getContractFactory("Roulette");
        this.roulette = await this.Roulette.deploy();
        await this.roulette.deployed();
    });

    it("ルーレットがスタートしてなければ賭けられない", async function() {
        await expect(this.roulette.wager(0, 0, {value: ethers.utils.parseEther("0.01")})).to.be.reverted;
    });

    it("オーナーがstartRoulette関数を呼び出した場合、bet_onフラグがtrueになる", async function() {
        await this.roulette.startRoulette();
        expect(await this.roulette.bet_on()).to.equal(true);
    });

    it("掛け金が0の場合、エラーが発生することを確認", async function() {
        await expect(this.roulette.wager(0, 0, {value: 0})).to.be.revertedWith("please bet");
    });

    it("賭けタイプが0の場合、choiceが0から37の間でない場合、エラーが発生することを確認", async function() {
        await expect(this.roulette.wager(0, 38, {value: ethers.utils.parseEther("0.01")})).to.be.reverted;
    });

    it("賭けタイプが1の場合、choiceが0または1でない場合、エラーが発生することを確認", async function() {
        await expect(this.roulette.wager(1, 2, {value: ethers.utils.parseEther("0.01")})).to.be.revertedWith("choice only 0 or 1");
    });

    it("賭けデータが正しく保存されること", async function() {
        const [owner, gambler1] = await ethers.getSigners();
        await this.roulette.startRoulette();
        await this.roulette.connect(gambler1).wager(0, 1, {value: ethers.utils.parseEther("0.01")});
        const bet = await this.roulette.bets(0);
        expect(bet.gambler).to.equal(gambler1.address);
        expect(bet.amount).to.equal(ethers.utils.parseEther("0.01"));
        expect(bet.btype).to.equal(0);
        expect(bet.choice).to.equal(1);
    });

  });


  // stopRoulette関数のテスト
  describe("stopRoulette", function() {
    // 各テストケースの実行前にコントラクトをデプロイする
    before(async function() {
        this.Roulette = await ethers.getContractFactory("Roulette");
        this.roulette = await this.Roulette.deploy();
        await this.roulette.deployed();
        await this.roulette.fund({value: ethers.utils.parseEther("10")});
    });
    it("番号指定の場合に正しく掛け金が支払われること", async function() {
        const [owner, gambler1,gambler2,gambler3] = await ethers.getSigners();
        await this.roulette.connect(owner).startRoulette();

        // gambler1は全部の目に0.01賭ける
        await this.roulette.connect(gambler1).wager(0, 0, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 1, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 2, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 3, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 4, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 5, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 6, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 7, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 8, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 9, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 10, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 11, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 12, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 13, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 14, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 15, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 16, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 17, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 18, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 19, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 20, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 21, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 22, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 23, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 24, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 25, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 26, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 27, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 28, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 29, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 30, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 31, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 32, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 33, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 34, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 35, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 36, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler1).wager(0, 37, {value: ethers.utils.parseEther("0.01")});

        // gambler2は偶数に　gambler3は奇数に賭ける
        await this.roulette.connect(gambler2).wager(1, 0, {value: ethers.utils.parseEther("0.01")});
        await this.roulette.connect(gambler3).wager(1, 1, {value: ethers.utils.parseEther("0.01")});

        // それぞれのギャンブラーの初期残高を控える
        const gambler1InitBalance = await ethers.provider.getBalance(gambler1.address);
        const gambler2InitBalance = await ethers.provider.getBalance(gambler2.address);
        const gambler3InitBalance = await ethers.provider.getBalance(gambler3.address);

        // ルーレットストップ
        await this.roulette.connect(owner).stopRoulette();
        const num = await this.roulette.roulette_number();
        console.log('   Hit number is '+num);


        // それぞれのギャンブラーのその後の残高を控える
        const gambler1AfterBalance = await ethers.provider.getBalance(gambler1.address);
        const gambler2AfterBalance = await ethers.provider.getBalance(gambler2.address);
        const gambler3AfterBalance = await ethers.provider.getBalance(gambler3.address);


        // gambler1は全目に1ether掛けているので36ether戻る
        expect(gambler1AfterBalance.sub(gambler1InitBalance)).to.equal(ethers.utils.parseEther("0.36"));

        // 偶数奇数で判定する
        if ( num == 0 || num == 37) {
            // 残高は変わらず
            expect(gambler2AfterBalance.sub(gambler2InitBalance)).to.equal(0);
            expect(gambler3AfterBalance.sub(gambler3InitBalance)).to.equal(0);
        } else if ( num % 2 == 0) {
            // 偶数なのでgambler2が勝ち掛け金の２倍が返却される
            expect(gambler2AfterBalance.sub(gambler2InitBalance)).to.equal(ethers.utils.parseEther("0.02"));
            expect(gambler3AfterBalance.sub(gambler3InitBalance)).to.equal(0);
        } else if ( num % 2 == 1) {
            // 奇数なのでgambler3が勝ち掛け金の２倍が返却される
            expect(gambler2AfterBalance.sub(gambler2InitBalance)).to.equal(0);
            expect(gambler3AfterBalance.sub(gambler3InitBalance)).to.equal(ethers.utils.parseEther("0.02"));
        }

    });
  });

});

