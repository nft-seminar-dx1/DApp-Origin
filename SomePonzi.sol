// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract SomePonzi {
    // ステート変数として投資者の配列investorsと投資者のアカウントをキーとした残高マップbalancesを設定します
    // 最低投資額を設定します

    constructor () {
    	// コントラクト作成者は無料で投資枠を確保できます
    }

    function invest() public payable {
    	  // 最低投資額未満はエラーとします
    	  // 投資は1度のみです
        // 投資額を均等に枠に加算します
        // 投資者を配列に加えます
    }

    function withdraw () public {
        // 引き出し額を取得します
        // 引き出し者の残高をクリアします
        // 送金します
    }
}