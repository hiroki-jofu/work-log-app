// データ構造の定義
export interface InterviewRecord {
  id: string; // 各記録の一意なID
  workName: string;
  theme: string;
  count: string;
  memo: string;
}

export interface InterviewData {
  date: string;
  records: InterviewRecord[];
}
