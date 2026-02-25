import Phaser from "phaser";
import { day1Scenario } from "../scenario/day1";
import { TextBox } from "../ui/textBox"
import { ChoiceBox } from "../ui/choiceBox"
import { EffectManager } from "../logic/effectManger";
import { TagParser } from "../logic/tagParser";

export class Day1Scene extends Phaser.Scene{

    private currentSceneId: string = "scene1";
    private currentLineIndex: number = 0;
    private textBox!: TextBox
    private choiceBox?: ChoiceBox
    private effectManager!: EffectManager;
    private backgroundLayer!: Phaser.GameObjects.Image;
    private characterLayer!: Phaser.GameObjects.Image;

    init(){
        this.currentSceneId = "scene1";
        this.currentLineIndex = 0;
    }
    

    constructor() {
    super({ key: "Day1Scene" });
    }

    preload(){
        this.load.image("bg_train", "assets/train.png")
    }

    create(){
        this.backgroundLayer = this.add.image(640, 360, "bg_train").setScale(1);
        this.tweens.add({
            targets: this.backgroundLayer,
            y: 360 + 4,                // 中心(360)から2pxだけ下に動く
            duration: 100,            // 2秒かけて往復
            ease: 'Cubic.easeOut',    // 滑らかな動き
            yoyo: true,
            yoyoDelay: 150,
            hold: 3000,                // 行って戻ってくる
            repeat: -1,                // 無限に繰り返す
        });
        this.characterLayer = this.add.image(640, 360, "bg_train").setVisible(false);
        this.effectManager = new EffectManager(this, this.backgroundLayer, this.characterLayer);

        this.textBox = new TextBox(this, 120, 540, 1040, 160)
        this.add.existing(this.textBox)

        this.showCurrentLine()
            //クリック（タッチ）したときに次の行に進む
        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer, gameObjects: any[]) => {

            if (gameObjects.length > 0) return;

            if (this.textBox.isTyping) {
                    // タイプ中なら全文表示
                 this.textBox.finishTyping()
            } else {
                    // 完了していたら次の行に進む
                this.onAdvance()
            }            
        });
        
        

    }

    private showCurrentLine(){
        //day1のday1Scenarioに現在のcurrentSceneIdを使ってアクセス
        const sceneData = day1Scenario[this.currentSceneId];
        if (!sceneData) return;
        //day1Scenarioのlineに現在のcurrentlineIndexを使ってアクセス
        const line = sceneData.lines[this.currentLineIndex];
        if (!line) return;

        const cleanText = TagParser.parse(line.text, (cmd, val) => {
            this.effectManager.execute(cmd, val);
        });

        //textbocにtextをセット
        this.textBox.typeLine(cleanText, line.speaker);

    }

    private onAdvance() {
        const scene = day1Scenario[this.currentSceneId]

        // 次の行があれば進む
        if (this.currentLineIndex < scene.lines.length - 1) {
            this.currentLineIndex++
            this.showCurrentLine()
            return
        }  

        // 行が終わっていて選択肢があれば表示
        if (scene.choices) {
            this.openChoices(scene.choices)
            return
        }

        // 自動遷移
        if (scene.next) {
            this.moveToScene(scene.next)
        }
    }

    private openChoices(
        choices: { text: string; next: string }[]
        ) {
            // 二重生成防止
            if (this.choiceBox) return
            this.choiceBox = new ChoiceBox(
                this,
                choices,
                (nextSceneId) => {
                    this.choiceBox?.destroy();  
                    this.choiceBox = undefined;    
                    this.moveToScene(nextSceneId);                    
                }
            )
    }

    private moveToScene(sceneId: string) {
        
        if (sceneId.startsWith("BADEND_")) {
            this.cameras.main.fadeOut(1500);
            this.cameras.main.once("camerafadeoutcomplete", () => {
                // IDだけを渡す。タイトルの解決は BadEndScene が行う。
                this.scene.start("BadEndScene", { id: sceneId });
            });
            return;
        }
        
        this.currentSceneId = sceneId
        this.currentLineIndex = 0
        this.showCurrentLine()
        
    }
}