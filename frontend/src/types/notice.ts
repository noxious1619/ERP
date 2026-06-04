export interface Notice {
  id: string;
  title: string;
  content: string;
  targetType: "GLOBAL" | "ROLE" | "CLASS" | "SECTION";
  targetId: string | null;
  priority: "STANDARD" | "HIGH" | "URGENT";
  category: string;
  createdAt: string;
  author: { name: string; role: string };
}