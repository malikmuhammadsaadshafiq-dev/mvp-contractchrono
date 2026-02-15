export interface DateEntry {
  type: "Payment Due" | "Termination Window" | "Delivery Date" | "Renewal" | "Effective Date" | "Expiration";
  date: string;
  description: string;
  reminderDays?: number;
}

export interface Contract {
  id: string;
  name: string;
  vendor: string;
  type: string;
  extractedDates: DateEntry[];
  status: "active" | "expired" | "pending";
  uploadDate: string;
  fileName: string;
  content?: string;
}