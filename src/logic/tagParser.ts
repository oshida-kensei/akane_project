export class TagParser {
    // [コマンド:値] の形式を探す正規表現
    private static readonly tagRegex = /\[(\w+):([^\]]+)\]/g;

    /**
     * テキストを解析し、タグを見つけたら演出を実行、タグなしテキストを返す
     */
    static parse(rawText: string, onTagFound: (cmd: string, val: string) => void): string {
        let displayText = rawText;
        let match: RegExpExecArray | null;

        // 全てのタグを検索
        while ((match = this.tagRegex.exec(rawText)) !== null) {
            const command = match[1];
            const value = match[2];

            // 見つけたタグを演出担当（EffectManager）に渡す
            onTagFound(command, value);

            // 表示用テキストからはタグを削除
            displayText = displayText.replace(match[0], "");
        }

        return displayText;
    }
}