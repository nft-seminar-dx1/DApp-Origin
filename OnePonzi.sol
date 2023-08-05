// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract OnePonzi {
    // 枠の保有者をステート変数investorとして宣言します
    // 最低投資金額をステート変数investmentとして宣言し、初期値を0.01ethにします

    constructor() {
        // 初回の枠はコントラクトの作成者が所有します
    }
    
    function invest() payable public {
        // 送金金額は最低投資金額以上とする必要があります
        // 枠の所有者に投資金額の全額を送金します
        // 枠の所有者を交代します
        // 次回の最低投資金額を設定します
    }
}