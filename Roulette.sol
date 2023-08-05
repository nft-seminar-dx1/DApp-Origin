// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Roulette {

    // 賭け構造体を設置します
    struct BetStruct {
        address payable gambler;            // ギャンブラーのアカウント
        uint    amount;                     // 掛け金
        uint    btype;                      // 賭けタイプ　0:番号 1:奇数偶数
        uint    choice;                     // 賭ける場所　0,1,2,....36, 37:00  0:偶数  1:奇数
    }
    
    // ステート変数を定義します
    bool public bet_on = false;             // ルーレット回転中を示すフラグ
    address public owner;                   // オーナーのアカウント
    uint public bet_id = 0;                 // 賭けID
    uint private start_id = 0;              // 賭けIDのスタート位置
    uint public roulette_number;            // 出た目
    mapping(uint => BetStruct) public bets; // 賭け構造体の実体

    constructor () {
        owner = msg.sender;
    }

    // ルーレットスタート
    function startRoulette () public{
        // オーナーのみ実行できます
        // 賭けIDのスタート位置を記録します
        // ルーレットの回転フラグをオンにします
    }

    // 賭け
    function wager (uint _btype, uint _choice) payable public {
        // ルーレットがスタートしてなければ賭けられません
        // 掛け金が必要です
        // 賭けタイプに従った場所が必要です
        // 賭けデータを保存します
        // 賭けIDを更新します
    }

    // ルーレットストップ
    function stopRoulette () public{
        // オーナーのみ実行できます
        // ルーレットの回転フラグを止めます
        // 乱数で番号を決めます
        // 出た目を記録します（外部参照用）
        // 賭けデータの配列を必要分読み込んで処理をします
            // 賭けデータを取り出します
            // 当たりの判定を行い、賞金を送金します
        }
    }

    // オーナー用の資金投入です
    function fund () public payable {
        require(msg.sender == owner,"only owner");
    }

    // オーナー用の資金回収です
    function withdrow () public {
        require(msg.sender == owner,"only owner");
        payable(msg.sender).transfer(address(this).balance);
    }
}