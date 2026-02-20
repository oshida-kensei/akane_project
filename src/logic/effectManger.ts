import Phaser from "phaser";

export class EffectManager {
    private scene: Phaser.Scene;
    private bg: Phaser.GameObjects.Image;
    private char: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, bg: Phaser.GameObjects.Image, char: Phaser.GameObjects.Image) {
        this.scene = scene;
        this.bg = bg;
        this.char = char;
    }

    /**
     * 解析されたコマンドを実行
     */
    execute(command: string, value: string) {
        switch (command) {
            case "bg":   
                this.changeBackground(value); 
                break;
            case "char": 
                this.handleCharacter(value); 
                break;
            case "se":   
                this.playSE(value); 
                break;
            case "shake": 
                this.scene.cameras.main.shake(200, parseFloat(value) || 0.01); 
                break;
            default:
                console.warn(`未定義のコマンド: ${command}`);
        }
    }

    /**
     * SEを再生する (命名規則: [se:door_open] -> "door_open" というキーの音を鳴らす)
     */
    private playSE(key: string) {
        if (this.scene.cache.audio.exists(key)) {
            this.scene.sound.play(key);
        } else {
            console.error(`SEアセット "${key}" が見つかりません。`);
        }
    }

    private changeBackground(key: string) {
        if (this.scene.textures.exists(key)) {
            this.bg.setTexture(key);
        } else {
            console.error(`背景 "${key}" が見つかりません。`);
        }
    }

    private handleCharacter(value: string) {
        if (value === "hide" || value === "none") {
            this.char.setVisible(false);
        } else if (this.scene.textures.exists(value)) {
            this.char.setTexture(value).setVisible(true);
        } else {
            console.error(`キャラ "${value}" が見つかりません。`);
        }
    }
}