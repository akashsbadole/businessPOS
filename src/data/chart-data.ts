interface SalesData {
  date: string;
  sales: number;
}

interface SalesChartData {
  daily: SalesData[];
  weekly: SalesData[];
  monthly: SalesData[];
}

export const sampleSalesData: SalesChartData = {
  daily: [
    { date: "01 May", sales: 24500 },
    { date: "02 May", sales: 18700 },
    { date: "03 May", sales: 22300 },
    { date: "04 May", sales: 29800 },
    { date: "05 May", sales: 32500 },
    { date: "06 May", sales: 28900 },
    { date: "07 May", sales: 26700 }
  ],
  weekly: [
    { date: "Week 1", sales: 152000 },
    { date: "Week 2", sales: 168000 },
    { date: "Week 3", sales: 179000 },
    { date: "Week 4", sales: 184000 }
  ],
  monthly: [
    { date: "Jan", sales: 580000 },
    { date: "Feb", sales: 620000 },
    { date: "Mar", sales: 710000 },
    { date: "Apr", sales: 680000 },
    { date: "May", sales: 450000 }
  ]
};
