import Phaser from "phaser";

// BAD ENDのIDとタイトルの対応表（ここに責務を集約）
const BAD_END_TITLES: { [key: string]: string } = {
    "BADEND_1": "いつも通りの帰り道",
    "BADEND_2": "気まずい沈黙",
    // 今後増えるバッドエンドもここに追加するだけ
};

export class BadEndScene extends Phaser.Scene {
    private canClick: boolean = false; // クリック可能フラグ

    constructor() {
        super({ key: "BadEndScene" });
    }

    create(data: { id: string }) {
        const { width, height } = this.scale;
        this.canClick = false; // 初期状態は操作不能

        // 1. 背景を真っ黒にする
        this.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0);

        // 2. IDからタイトルを取得
        const title = BAD_END_TITLES[data.id] || "ED";

        // 3. 右下にテキストを表示（ふわっと表示させる）
        const endText = this.add.text(width - 40, height - 60, `ED ${title}`, {
            fontSize: "36px",
            color: "#ffffff",
            fontFamily: "'Noto Sans JP', sans-serif",
        })
        .setOrigin(1, 1)
        .setAlpha(0);

        this.tweens.add({
            targets: endText,
            alpha: 1,
            duration: 2000, // 2秒かけて表示
            ease: "Power2"
        });

        // 4. 3秒後にクリックを有効化する
        this.time.delayedCall(3000, () => {
            this.canClick = true;
            
            // プレイヤーにクリック可能になったことを示す控えめなガイド（任意）
            this.add.text(width / 2, height - 40, "Click to Retry", {
                fontSize: "16px",
                color: "#666666"
            }).setOrigin(0.5).setAlpha(0.5);
        });

        // 5. クリックイベント
        this.input.on("pointerdown", () => {
            if (!this.canClick) return; // 3秒経つまでは何もしない

            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once("camerafadeoutcomplete", () => {
                // 現在はタイトルがないため Day1Scene の最初に戻る
                this.scene.start("Day1Scene");
            });
        });
    }
}