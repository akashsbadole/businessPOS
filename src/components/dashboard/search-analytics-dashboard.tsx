import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Progress,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tabs,
  Tab,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { searchAnalyticsService } from "../../services/search-analytics-service";

export const SearchAnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = React.useState<any>(null);
  const [popularProducts, setPopularProducts] = React.useState<any[]>([]);
  const [searchSuggestions, setSearchSuggestions] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    setIsLoading(true);
    try {
      const analyticsData = searchAnalyticsService.getAnalytics();
      const popularProductsData = searchAnalyticsService.getPopularProducts(10);
      const suggestionsData = searchAnalyticsService.getSearchSuggestions("", 10);
      
      setAnalytics(analyticsData);
      setPopularProducts(popularProductsData);
      setSearchSuggestions(suggestionsData);
    } catch (error) {
      console.error('Error loading search analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAnalytics = () => {
    if (confirm('Are you sure you want to clear all search analytics data?')) {
      searchAnalyticsService.clearAllData();
      loadAnalytics();
    }
  };

  const exportAnalytics = () => {
    const data = searchAnalyticsService.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `search-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!analytics) {
    return (
      <Card>
        <CardBody className="text-center py-8">
          <Icon icon="lucide:search" className="text-4xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Search Analytics</h3>
          <p className="text-gray-500 mb-4">
            Track search patterns and improve product discovery
          </p>
          <Button
            color="primary"
            onPress={loadAnalytics}
            isLoading={isLoading}
            startContent={<Icon icon="lucide:refresh-cw" />}
          >
            Load Analytics
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">🔍 Search Analytics</h1>
          <p className="text-gray-600">Insights into search patterns and product discovery</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="flat"
            onPress={exportAnalytics}
            startContent={<Icon icon="lucide:download" />}
          >
            Export Data
          </Button>
          <Button
            color="danger"
            variant="flat"
            onPress={clearAnalytics}
            startContent={<Icon icon="lucide:trash-2" />}
          >
            Clear Data
          </Button>
          <Button
            color="primary"
            onPress={loadAnalytics}
            isLoading={isLoading}
            startContent={<Icon icon="lucide:refresh-cw" />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center">
            <Icon icon="lucide:search" className="text-2xl text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Total Searches</p>
            <p className="text-2xl font-bold">{analytics.totalSearches}</p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="text-center">
            <Icon icon="lucide:hash" className="text-2xl text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Unique Terms</p>
            <p className="text-2xl font-bold">{analytics.uniqueSearchTerms}</p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="text-center">
            <Icon icon="lucide:target" className="text-2xl text-purple-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Conversion Rate</p>
            <p className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="text-center">
            <Icon icon="lucide:bar-chart" className="text-2xl text-orange-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Avg Results</p>
            <p className="text-2xl font-bold">{analytics.averageResultsPerSearch.toFixed(1)}</p>
          </CardBody>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultSelectedKey="trends">
        <Tab key="trends" title="📈 Search Trends">
          <div className="space-y-4">
            {/* Search Trends Chart */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Search Volume (Last 7 Days)</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-2">
                  {analytics.searchTrends.map((trend: any, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-sm w-20">{trend.date}</span>
                      <div className="flex-1">
                        <Progress
                          value={(trend.count / Math.max(...analytics.searchTrends.map((t: any) => t.count))) * 100}
                          color="primary"
                          size="sm"
                        />
                      </div>
                      <span className="text-sm font-medium w-12">{trend.count}</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Top Search Terms */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Top Search Terms</h3>
              </CardHeader>
              <CardBody>
                <div className="flex flex-wrap gap-2">
                  {analytics.topSearchTerms.map((term: string, index: number) => (
                    <Chip
                      key={index}
                      color={index < 3 ? "primary" : "default"}
                      variant={index < 3 ? "solid" : "flat"}
                    >
                      {term}
                    </Chip>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>

        <Tab key="products" title="📦 Popular Products">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Most Searched Products</h3>
            </CardHeader>
            <CardBody>
              <Table aria-label="Popular products table">
                <TableHeader>
                  <TableColumn>Rank</TableColumn>
                  <TableColumn>Product Name</TableColumn>
                  <TableColumn>Search Count</TableColumn>
                  <TableColumn>Selection Count</TableColumn>
                  <TableColumn>Success Rate</TableColumn>
                  <TableColumn>Last Searched</TableColumn>
                </TableHeader>
                <TableBody>
                  {popularProducts.map((product, index) => (
                    <TableRow key={product.productId}>
                      <TableCell>
                        <Chip
                          size="sm"
                          color={index < 3 ? "warning" : "default"}
                          variant="flat"
                        >
                          #{index + 1}
                        </Chip>
                      </TableCell>
                      <TableCell>{product.productName}</TableCell>
                      <TableCell>{product.searchCount}</TableCell>
                      <TableCell>{product.selectCount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={(product.selectCount / product.searchCount) * 100}
                            color="success"
                            size="sm"
                            className="w-16"
                          />
                          <span className="text-sm">
                            {((product.selectCount / product.searchCount) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(product.lastSearched).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="suggestions" title="💡 Search Suggestions">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Active Search Suggestions</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-2">
                  {searchSuggestions.length > 0 ? (
                    searchSuggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium">{suggestion}</span>
                        <Chip size="sm" color="primary" variant="flat">
                          Suggestion
                        </Chip>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No search suggestions available yet. Start searching to build suggestions.
                    </p>
                  )}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Search Tips</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Icon icon="lucide:lightbulb" className="text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Improve Search Performance</p>
                      <p className="text-gray-600">
                        Current conversion rate: {analytics.conversionRate.toFixed(1)}%. 
                        {analytics.conversionRate < 50 ? ' Consider improving product names and descriptions.' : ' Great job!'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Icon icon="lucide:trending-up" className="text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Popular Search Patterns</p>
                      <p className="text-gray-600">
                        Users search for {analytics.averageResultsPerSearch.toFixed(1)} products on average per search.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Icon icon="lucide:target" className="text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Optimization Opportunities</p>
                      <p className="text-gray-600">
                        Focus on improving search results for top terms to increase conversion rates.
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};
