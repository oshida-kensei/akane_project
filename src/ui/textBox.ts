import Phaser from "phaser"
import { settings } from "../settings/settings"

export class TextBox extends Phaser.GameObjects.Container {
  private text: Phaser.GameObjects.Text
  private speakerText?: Phaser.GameObjects.Text
  private fullText: string = ""
  private charIndex: number = 0
  private typingTimer?: Phaser.Time.TimerEvent
  public isTyping: boolean = false
  private typingSpeed=settings.typingSpeed // ms per character


  constructor(
        scene: Phaser.Scene,
        x: number = 120,
        y: number = 540,
        width: number = 1040,
        height: number = 160
    ) {
        super(scene, x, y)

        // 背景
        const bg = scene.add
        .rectangle(0, 0, width, height, 0x000000, 0.7)
        .setOrigin(0)

        // セリフ
        this.text = scene.add.text(20, 40, "", {
            fontSize: "24px",
            fontFamily: "'Noto Sans JP', sans-serif",
            color: "#ffffff",
            padding: { top: 4, bottom: 4 },
            wordWrap: { width: width - 40 },
            lineSpacing: 6
        })

        // 話者名
        this.speakerText = scene.add.text(20, 10, "", {
            padding: { top: 4, bottom: 4 },
            fontSize: "20px",
            color: "#ffffaa"
        })

        this.add([bg, this.speakerText, this.text])
        } 

  typeLine(text: string, speaker?: string) {
    // 既存タイマーがあれば破棄
    if (this.typingTimer) {
      this.typingTimer.destroy()
      this.typingTimer = undefined
    }

    // 初期化
    this.fullText = text
    this.charIndex = 0
    this.isTyping = true
    this.text.setText("")
    if (this.speakerText) {
      this.speakerText.setText(speaker ?? "")
    }

    // タイマーで1文字ずつ表示
    this.typingTimer = this.scene.time.addEvent({
      delay: this.typingSpeed,
      callback: this.addChar,
      callbackScope: this,
      loop: true,
    })
  }

  /**
   * タイマーコールバック：1文字追加
   */
  private addChar() {
    if (this.charIndex < this.fullText.length) {
      this.text.setText(this.text.text + this.fullText[this.charIndex])
      this.charIndex++
    } else {
      // 文字表示完了
      this.typingTimer?.destroy()
      this.typingTimer = undefined
      this.isTyping = false
    }
  }

  /**
   * タイプ中にクリックされたときは全文表示
   */
  finishTyping() {
    if (this.isTyping) {
      this.typingTimer?.destroy()
      this.typingTimer = undefined
      this.text.setText(this.fullText)
      this.isTyping = false
    }
  }
}
