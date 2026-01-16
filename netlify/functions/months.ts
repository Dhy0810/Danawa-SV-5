import type { Handler } from "@netlify/functions";

function getAvailableMonths(): string[] {
  const months: string[] = [];
  const now = new Date();
  
  for (let i = 1; i <= 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    months.push(`${year}-${month}`);
  }
  
  return months;
}

function getLatestMonth(): string {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const year = lastMonth.getFullYear();
  const month = String(lastMonth.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export const handler: Handler = async () => {
  try {
    const months = getAvailableMonths();
    const latestMonth = getLatestMonth();
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        months,
        latestMonth,
      }),
    };
  } catch (error) {
    console.error("Error getting available months:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Failed to get available months" }),
    };
  }
};
