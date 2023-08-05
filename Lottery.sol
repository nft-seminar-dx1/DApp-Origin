// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Lottery {
    // 定数として宝くじの金額 0.01 etherを設定します
    // ステート変数としてチケット購入者の配列を設定します
    // ステート変数として宝くじの当選者を設定します
    // ステート変数として宝くじの販売終了時刻を設定します
    // ステート変数としてオーナーを設定します
    
    constructor () {
        // 現在のブロックタイムスタンプに 3秒足します
        // 宝くじコントラクトの所有者を設定します
 
    }

    // 宝くじを販売します
    function ticketbuy() payable public {
        // 指定された価格が送金されているかチェックします
        // 宝くじの販売期限を過ぎていないかチェックします
        // 購入者を配列に加えます
    }

    // 宝くじの抽選を行います
    function drawWinner() public {
        // 販売期間が終了していることが条件です
        // 誰も当選していないことが条件です（二度目はエラーとなります）
        // 乱数を使って宝くじに当選したアカウントを一つ決定します
        uint rand = uint(keccak256(abi.encodePacked(block.timestamp,msg.sender)));
        winner = tickets[uint(rand) % tickets.length];
    }

    // 当選者は宝くじの全額を取得できます
    function withdraw() public {
        // 当選者のみ引き出すことができます
        // 全額を引き出せます
    }
}