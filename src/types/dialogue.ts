export type speaker =
  | '主人公'
  | '茜'
  | 'アナウンス'

export type line = {
  speaker: speaker;
  text: string;
};

export type choice = {
  text: string;
  next: string;
};

export type scenarioNode = {
  id: string;
  lines: line[];
  choices?: choice[];
  next?: string; // choiceがない場合のみ
};

export type scenario = Record<string, scenarioNode>;
