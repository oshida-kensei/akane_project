import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages用のパス設定（相対パスにする）
  base: './', 
  
  build: {
    // 出力先を gh-pages が読み取る 'dist' に指定（通常はデフォルトでOK）
    outDir: 'dist',
  }
});