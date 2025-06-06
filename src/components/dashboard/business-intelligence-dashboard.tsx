import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Progress,
  Divider,
  Tabs,
  Tab,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { businessIntelligenceService } from "../../services/business-intelligence-service";

interface BusinessIntelligenceDashboardProps {
  salesData?: any[];
  products?: any[];
  customers?: any[];
  inventory?: any[];
}

export const BusinessIntelligenceDashboard: React.FC<BusinessIntelligenceDashboardProps> = ({
  salesData = [],
  products = [],
  customers = [],
  inventory = [],
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [report, setReport] = React.useState<any>(null);
  const [selectedTab, setSelectedTab] = React.useState("overview");
  const [aiStatus, setAiStatus] = React.useState(businessIntelligenceService.isAvailable());

  React.useEffect(() => {
    setAiStatus(businessIntelligenceService.isAvailable());
  }, []);

  const generateReport = async () => {
    setIsLoading(true);
    try {
      const businessReport = await businessIntelligenceService.generateBusinessReport({
        salesData: salesData.map(s => ({
          date: s.date || new Date().toISOString().split('T')[0],
          revenue: s.total || s.revenue || 0,
          transactions: 1,
          averageOrderValue: s.total || s.revenue || 0,
          topProducts: s.items?.map((item: any) => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            revenue: item.price * item.quantity
          })) || []
        })),
        products,
        customers,
        inventory
      });
      
      setReport(businessReport);
    } catch (error) {
      console.error('Failed to generate business report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (!aiStatus) {
    return (
      <Card className="w-full">
        <CardBody>
          <div className="text-center space-y-4">
            <Icon icon="lucide:brain" className="text-6xl text-gray-400 mx-auto" />
            <h2 className="text-xl font-bold text-gray-600">AI Business Intelligence</h2>
            <p className="text-gray-500">
              Configure your Google Gemini API key to unlock powerful AI-driven business insights.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Available with AI:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Sales prediction and forecasting</li>
                <li>• Intelligent inventory optimization</li>
                <li>• Customer behavior analysis</li>
                <li>• Automated business insights</li>
                <li>• Market trend analysis</li>
              </ul>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800">
                Add <code>VITE_GOOGLE_GEMINI_API_KEY</code> to your .env file to enable AI features
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">🤖 AI Business Intelligence</h1>
          <p className="text-gray-600">Powered by Google Gemini Flash 2.0</p>
        </div>
        <div className="flex gap-2">
          <Chip color="success" variant="flat">
            AI Enabled
          </Chip>
          <Button
            color="primary"
            onPress={generateReport}
            isLoading={isLoading}
            startContent={<Icon icon="lucide:brain" />}
          >
            {isLoading ? "Generating AI Report..." : "Generate AI Report"}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      {report && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardBody className="text-center">
              <Icon icon="lucide:trending-up" className="text-2xl text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-lg font-bold">{formatCurrency(report.summary.totalRevenue)}</p>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody className="text-center">
              <Icon icon="lucide:shopping-cart" className="text-2xl text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Transactions</p>
              <p className="text-lg font-bold">{report.summary.totalTransactions}</p>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody className="text-center">
              <Icon icon="lucide:calculator" className="text-2xl text-purple-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <p className="text-lg font-bold">{formatCurrency(report.summary.averageOrderValue)}</p>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody className="text-center">
              <Icon icon="lucide:star" className="text-2xl text-yellow-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Top Product</p>
              <p className="text-lg font-bold truncate">{report.summary.topPerformingProduct}</p>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody className="text-center">
              <Icon icon="lucide:trending-up" className="text-2xl text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Growth Rate</p>
              <p className="text-lg font-bold">{formatPercentage(report.summary.growthRate)}</p>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Main Content */}
      {report ? (
        <Tabs selectedKey={selectedTab} onSelectionChange={(key) => setSelectedTab(key as string)}>
          <Tab key="overview" title="📊 Overview">
            <div className="space-y-4">
              {/* Sales Predictions */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">🔮 AI Sales Predictions</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    {report.predictions.predictions.map((prediction: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{prediction.date}</p>
                          <p className="text-sm text-gray-600">Predicted Revenue</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{formatCurrency(prediction.predictedRevenue)}</p>
                          <div className="flex items-center gap-1">
                            <Progress
                              size="sm"
                              value={prediction.confidence * 100}
                              color={prediction.confidence > 0.8 ? "success" : "warning"}
                              className="w-16"
                            />
                            <span className="text-xs">{formatPercentage(prediction.confidence * 100)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Divider className="my-4" />
                  
                  <div>
                    <h4 className="font-semibold mb-2">AI Insights:</h4>
                    <ul className="space-y-1">
                      {report.predictions.insights.map((insight: string, index: number) => (
                        <li key={index} className="text-sm text-gray-700">• {insight}</li>
                      ))}
                    </ul>
                  </div>
                </CardBody>
              </Card>

              {/* Business Insights */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">💡 AI Business Insights</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    {report.insights.map((insight: any, index: number) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{insight.title}</h4>
                          <div className="flex gap-1">
                            <Chip
                              size="sm"
                              color={
                                insight.type === 'opportunity' ? 'success' :
                                insight.type === 'warning' ? 'danger' :
                                insight.type === 'trend' ? 'primary' : 'secondary'
                              }
                              variant="flat"
                            >
                              {insight.type}
                            </Chip>
                            <Chip
                              size="sm"
                              color={insight.impact === 'high' ? 'danger' : insight.impact === 'medium' ? 'warning' : 'default'}
                              variant="flat"
                            >
                              {insight.impact} impact
                            </Chip>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                        {insight.suggestedActions.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-700 mb-1">Suggested Actions:</p>
                            <ul className="text-xs text-gray-600">
                              {insight.suggestedActions.map((action: string, actionIndex: number) => (
                                <li key={actionIndex}>• {action}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          </Tab>

          <Tab key="inventory" title="📦 Inventory AI">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">🤖 AI Inventory Optimization</h3>
              </CardHeader>
              <CardBody>
                <Table aria-label="Inventory optimization table">
                  <TableHeader>
                    <TableColumn>Product</TableColumn>
                    <TableColumn>Current Stock</TableColumn>
                    <TableColumn>Recommended</TableColumn>
                    <TableColumn>Priority</TableColumn>
                    <TableColumn>AI Reasoning</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {report.inventoryOptimization.map((item: any) => (
                      <TableRow key={item.productId}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.currentStock}</TableCell>
                        <TableCell>{item.recommendedStock}</TableCell>
                        <TableCell>
                          <Chip
                            size="sm"
                            color={item.priority === 'high' ? 'danger' : item.priority === 'medium' ? 'warning' : 'success'}
                            variant="flat"
                          >
                            {item.priority}
                          </Chip>
                        </TableCell>
                        <TableCell className="text-xs">{item.reasoning}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
          </Tab>

          <Tab key="customers" title="👥 Customer AI">
            <div className="space-y-4">
              {/* Customer Segments */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">🎯 AI Customer Segmentation</h3>
                </CardHeader>
                <CardBody>
                  <div className="grid gap-4">
                    {report.customerAnalysis.segments.map((segment: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">{segment.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{segment.description}</p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Customers</p>
                            <p className="font-medium">{segment.customerCount}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Avg Order Value</p>
                            <p className="font-medium">{formatCurrency(segment.averageOrderValue)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Frequency</p>
                            <p className="font-medium">{segment.frequency}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-xs font-medium text-gray-700 mb-1">AI Recommendations:</p>
                          <ul className="text-xs text-gray-600">
                            {segment.recommendations.map((rec: string, recIndex: number) => (
                              <li key={recIndex}>• {rec}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          </Tab>
        </Tabs>
      ) : (
        <Card>
          <CardBody className="text-center py-12">
            <Icon icon="lucide:brain" className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Ready for AI Analysis</h3>
            <p className="text-gray-500 mb-4">
              Click "Generate AI Report" to get intelligent business insights powered by Gemini Flash 2.0
            </p>
            <Button
              color="primary"
              onPress={generateReport}
              startContent={<Icon icon="lucide:brain" />}
            >
              Generate AI Report
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
};
