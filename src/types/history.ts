export interface HistoryEntry {
  type: "chore" | "expense";
  action: string;
  date: string;
}
