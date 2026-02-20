import Phaser from "phaser"

export class ChoiceBox extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    choices: { text: string; next: string }[],
    onSelect: (nextSceneId: string) => void
    ) {
        super(scene, 0, 0)

        const startY = 300
        const buttonHeight = 70
        const margin = 40

        choices.forEach((choice, index) => {
            const y = startY + index * (buttonHeight + margin)

            const bg = scene.add
            .rectangle(640, y, 800, buttonHeight, 0x333333, 1.0)
            .setInteractive()

            const label = scene.add
            .text(640, y, choice.text, {
            fontSize: "22px",
            color: "#ffffff",
            padding: { top: 4, bottom: 4 },
            })
            .setOrigin(0.5)

            bg.on("pointerover", () => {
                bg.setFillStyle(0x555555, 1.0); // 明るくする
                label.setColor("#ffff00");       // テキスト色も変更
            });

      // ポインターが離れたとき
            bg.on("pointerout", () => {
                bg.setFillStyle(0x333333, 1.0); // 元に戻す
                label.setColor("#ffffff");
            });

            bg.on("pointerdown", () => {
                onSelect(choice.next)
                this.destroy()
            })

            this.add([bg, label])
        })

        scene.add.existing(this)
    }
}
