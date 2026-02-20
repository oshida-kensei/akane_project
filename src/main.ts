import Phaser from 'phaser'
import { Day1Scene } from './scenes/day1scenes'
import{BadEndScene} from './scenes/badEndScene'

new Phaser.Game({
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'game',
  scene: [Day1Scene,BadEndScene]
})
