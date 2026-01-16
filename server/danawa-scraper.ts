import type { RadarModel, Nation } from "@shared/schema";

interface RawModelData {
  rank: number;
  modelName: string;
  manufacturer: string;
  sales: number;
  momAbs: number;
  momPct: number;
}

function generateDanawaUrl(nation: Nation, month: string): string {
  const nationParam = nation === "domestic" ? "domestic" : "export";
  return `https://auto.danawa.com/auto/?Month=${month}-00&Nation=${nationParam}&Tab=Model&Work=record`;
}

function parseHtmlForModels(html: string, nation: Nation): RawModelData[] {
  const models: RawModelData[] = [];
  
  const modelRowRegex = /<tr[^>]*class="[^"]*model[^"]*"[^>]*>[\s\S]*?<\/tr>/gi;
  const rows = html.match(modelRowRegex) || [];
  
  for (let i = 0; i < rows.length && models.length < 100; i++) {
    const row = rows[i];
    
    const rankMatch = row.match(/<td[^>]*class="[^"]*rank[^"]*"[^>]*>\s*(\d+)\s*<\/td>/i);
    const nameMatch = row.match(/<a[^>]*class="[^"]*name[^"]*"[^>]*>([^<]+)<\/a>/i);
    const makerMatch = row.match(/<span[^>]*class="[^"]*maker[^"]*"[^>]*>([^<]+)<\/span>/i);
    const salesMatch = row.match(/<td[^>]*class="[^"]*num[^"]*"[^>]*>\s*([\d,]+)\s*<\/td>/i);
    const changeMatch = row.match(/([+-]?[\d,]+)\s*\([+-]?[\d.]+%?\)/i);
    
    if (rankMatch && nameMatch) {
      const rank = parseInt(rankMatch[1]);
      const modelName = nameMatch[1].trim();
      const manufacturer = makerMatch ? makerMatch[1].trim() : "Unknown";
      const sales = salesMatch ? parseInt(salesMatch[1].replace(/,/g, "")) : 0;
      const momAbs = changeMatch ? parseInt(changeMatch[1].replace(/,/g, "")) : 0;
      const momPct = sales > 0 && sales - momAbs > 0 
        ? momAbs / (sales - momAbs) 
        : 0;

      models.push({
        rank,
        modelName,
        manufacturer,
        sales,
        momAbs,
        momPct,
      });
    }
  }
  
  return models;
}

function generateMockData(nation: Nation, month: string): RadarModel[] {
  const domesticModels = [
    { modelName: "그랜저", manufacturer: "현대" },
    { modelName: "쏘나타", manufacturer: "현대" },
    { modelName: "아반떼", manufacturer: "현대" },
    { modelName: "투싼", manufacturer: "현대" },
    { modelName: "싼타페", manufacturer: "현대" },
    { modelName: "팰리세이드", manufacturer: "현대" },
    { modelName: "아이오닉5", manufacturer: "현대" },
    { modelName: "아이오닉6", manufacturer: "현대" },
    { modelName: "K8", manufacturer: "기아" },
    { modelName: "K5", manufacturer: "기아" },
    { modelName: "K3", manufacturer: "기아" },
    { modelName: "스포티지", manufacturer: "기아" },
    { modelName: "쏘렌토", manufacturer: "기아" },
    { modelName: "카니발", manufacturer: "기아" },
    { modelName: "EV6", manufacturer: "기아" },
    { modelName: "EV9", manufacturer: "기아" },
    { modelName: "G80", manufacturer: "제네시스" },
    { modelName: "GV80", manufacturer: "제네시스" },
    { modelName: "G90", manufacturer: "제네시스" },
    { modelName: "GV70", manufacturer: "제네시스" },
    { modelName: "토레스", manufacturer: "쌍용" },
    { modelName: "티볼리", manufacturer: "쌍용" },
    { modelName: "레이", manufacturer: "기아" },
    { modelName: "모닝", manufacturer: "기아" },
    { modelName: "스타리아", manufacturer: "현대" },
  ];

  const importModels = [
    { modelName: "E-Class", manufacturer: "Mercedes-Benz" },
    { modelName: "S-Class", manufacturer: "Mercedes-Benz" },
    { modelName: "GLE", manufacturer: "Mercedes-Benz" },
    { modelName: "C-Class", manufacturer: "Mercedes-Benz" },
    { modelName: "5시리즈", manufacturer: "BMW" },
    { modelName: "3시리즈", manufacturer: "BMW" },
    { modelName: "X5", manufacturer: "BMW" },
    { modelName: "X3", manufacturer: "BMW" },
    { modelName: "7시리즈", manufacturer: "BMW" },
    { modelName: "iX", manufacturer: "BMW" },
    { modelName: "A6", manufacturer: "Audi" },
    { modelName: "A4", manufacturer: "Audi" },
    { modelName: "Q5", manufacturer: "Audi" },
    { modelName: "Q7", manufacturer: "Audi" },
    { modelName: "Model Y", manufacturer: "Tesla" },
    { modelName: "Model 3", manufacturer: "Tesla" },
    { modelName: "ES", manufacturer: "Lexus" },
    { modelName: "RX", manufacturer: "Lexus" },
    { modelName: "Cayenne", manufacturer: "Porsche" },
    { modelName: "Macan", manufacturer: "Porsche" },
    { modelName: "Range Rover", manufacturer: "Land Rover" },
    { modelName: "XC60", manufacturer: "Volvo" },
    { modelName: "XC90", manufacturer: "Volvo" },
    { modelName: "Accord", manufacturer: "Honda" },
    { modelName: "CR-V", manufacturer: "Honda" },
  ];

  const baseModels = nation === "domestic" ? domesticModels : importModels;
  const baseUrl = generateDanawaUrl(nation, month);
  
  const seed = month.split("-").reduce((a, b) => a + parseInt(b), 0) + (nation === "import" ? 100 : 0);
  const random = (n: number) => {
    const x = Math.sin(seed + n) * 10000;
    return x - Math.floor(x);
  };

  const models: RadarModel[] = baseModels.map((base, i) => {
    const baseSales = nation === "domestic" 
      ? Math.floor(1000 + random(i) * 8000)
      : Math.floor(200 + random(i) * 3000);
    
    const prevSales = Math.floor(baseSales * (0.7 + random(i + 100) * 0.6));
    const sales = baseSales;
    const momAbs = sales - prevSales;
    const momPct = prevSales > 0 ? momAbs / prevSales : 0;
    const isNew = prevSales === 0 || random(i + 200) > 0.95;
    
    const prevRank = Math.floor(1 + random(i + 300) * 25);
    const currentRank = i + 1;
    const rankChange = prevRank - currentRank;

    return {
      id: `${nation}-${month}-${i + 1}`,
      rank: currentRank,
      prevRank: isNew ? null : prevRank,
      modelName: base.modelName,
      manufacturer: base.manufacturer,
      sales,
      prevSales: isNew ? 0 : prevSales,
      momAbs,
      momPct: isNew ? 5 : Math.min(momPct, 5),
      rankChange: isNew ? 0 : rankChange,
      score: 0,
      isNew,
      nation,
      month,
      danawaUrl: baseUrl,
    };
  });

  return calculateScores(models);
}

function calculateScores(models: RadarModel[]): RadarModel[] {
  const candidates = models.filter((m) => m.momAbs > 0);
  
  if (candidates.length === 0) {
    return models.sort((a, b) => b.sales - a.sales);
  }

  const momAbsValues = candidates.map((m) => m.momAbs);
  const momPctValues = candidates.map((m) => m.momPct);
  const rankChangeValues = candidates.map((m) => m.rankChange);

  const zScore = (values: number[], value: number): number => {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(
      values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
    );
    return stdDev === 0 ? 0 : (value - mean) / stdDev;
  };

  const scoredModels = models.map((model) => {
    if (model.momAbs <= 0) {
      return { ...model, score: -999 };
    }

    const zMomAbs = zScore(momAbsValues, model.momAbs);
    const zMomPct = zScore(momPctValues, model.momPct);
    const zRankChange = zScore(rankChangeValues, model.rankChange);

    const score = 0.55 * zMomAbs + 0.35 * zMomPct + 0.10 * zRankChange;

    return { ...model, score };
  });

  return scoredModels.sort((a, b) => b.score - a.score);
}

export async function fetchRadarData(nation: Nation, month: string): Promise<RadarModel[]> {
  try {
    const url = generateDanawaUrl(nation, month);
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    });

    if (!response.ok) {
      console.log(`Failed to fetch Danawa data: ${response.status}, using mock data`);
      return generateMockData(nation, month);
    }

    const html = await response.text();
    const rawModels = parseHtmlForModels(html, nation);

    if (rawModels.length === 0) {
      console.log("No models parsed from Danawa, using mock data");
      return generateMockData(nation, month);
    }

    const models: RadarModel[] = rawModels.map((raw, i) => ({
      id: `${nation}-${month}-${raw.rank}`,
      rank: raw.rank,
      prevRank: null,
      modelName: raw.modelName,
      manufacturer: raw.manufacturer,
      sales: raw.sales,
      prevSales: Math.max(0, raw.sales - raw.momAbs),
      momAbs: raw.momAbs,
      momPct: raw.momPct,
      rankChange: 0,
      score: 0,
      isNew: raw.sales - raw.momAbs <= 0,
      nation,
      month,
      danawaUrl: generateDanawaUrl(nation, month),
    }));

    return calculateScores(models);
  } catch (error) {
    console.log(`Error fetching Danawa data: ${error}, using mock data`);
    return generateMockData(nation, month);
  }
}

export function getAvailableMonths(): string[] {
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

export function getLatestMonth(): string {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const year = lastMonth.getFullYear();
  const month = String(lastMonth.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}
