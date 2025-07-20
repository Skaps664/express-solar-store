"use client"

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { format, parseISO } from 'date-fns';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, BarChart, Bar,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { EntitySearch } from '@/components/entity-search';
import { DateRange } from "react-day-picker";

// Define types for entity analytics
interface SearchableEntity {
  _id: string;
  name: string;
  slug: string;
}

interface EntitySearchProps {
  onSearch: (query: string) => Promise<SearchableEntity[]>;
  onSelect: (entity: SearchableEntity) => void;
  placeholder: string;
  loading: boolean;
}

// Define types for analytics data
interface SiteAnalytics {
  totalVisits: number;
  uniqueVisitors: number;
  pageViews: { _id: string; count: number }[];
  dailyData: {
    date: string;
    metrics: { views: number };
  }[];
}

interface TopEntity {
  _id: string;
  entitySlug: string;
  total: number;
  name?: string;
}

interface TimeSeriesData {
  data: {
    date: string;
    value: number;
  }[];
}

interface EntityAnalytics {
  name: string;
  type: 'product' | 'brand';
  data: {
    date: string;
    value: number;
  }[];
}

// Empty initial states - will be populated from API
const DEFAULT_SITE_ANALYTICS: SiteAnalytics = {
  totalVisits: 0,
  uniqueVisitors: 0,
  pageViews: [],
  dailyData: []
};

interface SelectedEntity {
  _id: string;
  name: string;
  slug: string;
  type: 'product' | 'brand';
}

// Helper function to format dates for the API
const formatDateForAPI = (date: Date | undefined) => {
  return date ? date.toISOString().split('T')[0] : undefined;
};

const DEFAULT_DATE_RANGE: DateRange = {
  from: new Date(new Date().setDate(new Date().getDate() - 30)),
  to: new Date()
};

// Format date for charts
const formatDate = (dateString: string) => {
  const date = parseISO(dateString);
  return format(date, 'MMM dd');
};

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<DateRange>(DEFAULT_DATE_RANGE);
  const [siteAnalytics, setSiteAnalytics] = useState<SiteAnalytics>(DEFAULT_SITE_ANALYTICS);
  const [topBrands, setTopBrands] = useState<TopEntity[]>([]);
  const [topProducts, setTopProducts] = useState<TopEntity[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData | null>(null);
  const [entityAnalytics, setEntityAnalytics] = useState<EntityAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity | null>(null);

  // Handle entity search using the new unified search endpoint
  const handleEntitySearch = async (searchTerm: string, type: 'product' | 'brand') => {
    if (!searchTerm) return [];
    
    setSearchLoading(true);
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';
      
      const response = await axios.get(`${apiBaseUrl}/api/entity-search/search`, {
        params: {
          search: searchTerm,
          type
        },
        withCredentials: true
      });
      
      if (response.data.success) {
        // Data is already in the correct format with names, slugs, and view counts
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error(`Error searching ${type}s:`, error);
      return [];
    } finally {
      setSearchLoading(false);
    }
  };

  // Fetch site analytics when date range changes
  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      fetchSiteAnalytics();
    }
  }, [dateRange]);

  // Fetch site analytics
  const fetchSiteAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE;
      
      const response = await axios.get(`${apiBaseUrl}/api/analytics/site`, {
        params: {
          startDate: formatDateForAPI(dateRange.from),
          endDate: formatDateForAPI(dateRange.to)
        },
        withCredentials: true
      });
      
      setSiteAnalytics(response.data.data);
      
      // Also fetch top brands and products
      await Promise.all([
        fetchTopBrands(),
        fetchTopProducts(),
        fetchTimeSeriesData()
      ]);
      
    } catch (error) {
      console.error('Error fetching site analytics:', error);
      setError('Failed to fetch analytics data. Please try again later.');
      setSiteAnalytics(DEFAULT_SITE_ANALYTICS);
      setTopBrands([]);
      setTopProducts([]);
      setTimeSeriesData(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch analytics for a specific entity (product or brand)
  const fetchEntityAnalytics = async (entity: SelectedEntity) => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';
      const response = await axios.get(`${apiBaseUrl}/api/analytics/entity/${entity.type}/${entity.slug}`, {
        params: {
          startDate: formatDateForAPI(dateRange.from),
          endDate: formatDateForAPI(dateRange.to)
        },
        withCredentials: true
      });
      
      if (response.data.success) {
        setEntityAnalytics(response.data.data);
      } else {
        throw new Error(response.data.message || `Failed to fetch ${entity.type} analytics`);
      }
    } catch (error) {
      console.error(`Error fetching ${entity.type} analytics:`, error);
      setEntityAnalytics(null);
    }
  };

  // Handle entity selection
  const handleEntitySelect = (entity: SearchableEntity, type: 'product' | 'brand') => {
    const selected = { ...entity, type };
    setSelectedEntity(selected);
    fetchEntityAnalytics(selected);
  };

  // Fetch top brands
  const fetchTopBrands = async () => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';
      const response = await axios.get(`${apiBaseUrl}/api/analytics/top/brands`, {
        params: {
          metric: 'views',
          startDate: formatDateForAPI(dateRange.from),
          endDate: formatDateForAPI(dateRange.to),
          limit: 10
        },
        withCredentials: true
      });
      
      if (response.data.success) {
        setTopBrands(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch brand data');
      }
    } catch (error) {
      console.error('Error fetching top brands:', error);
      setTopBrands([]);
    }
  };

  // Fetch top products
  const fetchTopProducts = async () => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';
      const response = await axios.get(`${apiBaseUrl}/api/analytics/top/products`, {
        params: {
          metric: 'views',
          startDate: formatDateForAPI(dateRange.from),
          endDate: formatDateForAPI(dateRange.to),
          limit: 10
        },
        withCredentials: true
      });
      
      if (response.data.success) {
        setTopProducts(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch product data');
      }
    } catch (error) {
      console.error('Error fetching top products:', error);
      setTopProducts([]);
    }
  };

  // Fetch time series data
  const fetchTimeSeriesData = async () => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';
      const response = await axios.get(`${apiBaseUrl}/api/analytics/report/time-series`, {
        params: {
          entityType: 'site',
          metric: 'views',
          startDate: formatDateForAPI(dateRange.from),
          endDate: formatDateForAPI(dateRange.to),
          interval: 'day'
        },
        withCredentials: true
      });
      
      if (response.data.success) {
        setTimeSeriesData(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch time series data');
      }
    } catch (error) {
      console.error('Error fetching time series data:', error);
      setTimeSeriesData(null);
    }
  };

  // Quick date range buttons
  const setQuickDateRange = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    setDateRange({ from, to });
  };
  
  // Prepare time series chart data
  const prepareTimeSeriesData = () => {
    if (!siteAnalytics?.dailyData) return [];
    
    return siteAnalytics.dailyData.map(item => ({
      date: formatDate(item.date),
      views: item.metrics.views
    }));
  };
  
  // Prepare page views chart data
  const preparePageViewsData = () => {
    if (!siteAnalytics?.pageViews) return [];
    
    return siteAnalytics.pageViews.slice(0, 5).map(page => ({
      name: page._id.replace(/^\//, '').substring(0, 15) + (page._id.length > 15 ? '...' : ''),
      views: page.count
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Showing analytics data for the selected period
          </p>
          {error && (
            <p className="text-sm text-red-500 mt-1">
              {error}
            </p>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <DatePickerWithRange 
            date={dateRange} 
            setDate={(date) => date && setDateRange(date)}
          />
          
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setQuickDateRange(7)}
            >
              Last 7 days
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setQuickDateRange(30)}
            >
              Last 30 days
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setQuickDateRange(90)}
            >
              Last 90 days
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <p>Loading analytics data...</p>
        </div>
      ) : (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="brands">Brands</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {/* Entity Search */}
            <Card>
              <CardHeader>
                <CardTitle>Search Analytics</CardTitle>
                <CardDescription>Search for specific product or brand analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <h4 className="mb-2 text-sm font-medium">Product Analytics</h4>
                    <EntitySearch
                      onSearch={(query) => handleEntitySearch(query, 'product')}
                      onSelect={(entity) => handleEntitySelect(entity, 'product')}
                      placeholder="Search for a product..."
                      loading={searchLoading}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-2 text-sm font-medium">Brand Analytics</h4>
                    <EntitySearch
                      onSearch={(query) => handleEntitySearch(query, 'brand')}
                      onSelect={(entity) => handleEntitySelect(entity, 'brand')}
                      placeholder="Search for a brand..."
                      loading={searchLoading}
                    />
                  </div>
                </div>
                
                {entityAnalytics && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {entityAnalytics.name} Analytics
                    </h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={entityAnalytics.data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={formatDate}
                          />
                          <YAxis />
                          <Tooltip 
                            formatter={(value: number) => [value.toLocaleString(), 'Views']}
                            labelFormatter={(label) => formatDate(label.toString())}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#2563eb" 
                            fill="#3b82f6" 
                            fillOpacity={0.2} 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Visits</CardTitle>
                  <CardDescription>Site visits in selected period</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{siteAnalytics?.totalVisits?.toLocaleString() || 0}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Unique Visitors</CardTitle>
                  <CardDescription>Distinct visitors in selected period</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{siteAnalytics?.uniqueVisitors?.toLocaleString() || 0}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Top Page</CardTitle>
                  <CardDescription>Most viewed page</CardDescription>
                </CardHeader>
                <CardContent>
                  {siteAnalytics?.pageViews && siteAnalytics.pageViews.length > 0 ? (
                    <div>
                      <p className="text-lg font-semibold">{siteAnalytics.pageViews[0]._id}</p>
                      <p className="text-sm text-muted-foreground">
                        {siteAnalytics.pageViews[0].count.toLocaleString()} views
                      </p>
                    </div>
                  ) : (
                    <p>No page views data</p>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Page Views Over Time</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={prepareTimeSeriesData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => value}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="views"
                        name="Page Views"
                        stroke="#3b82f6"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Pages</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={preparePageViewsData()}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        width={100}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="views" 
                        name="Page Views" 
                        fill="#3b82f6" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="brands" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Search Brand Analytics</CardTitle>
                <CardDescription>View detailed analytics for a specific brand</CardDescription>
              </CardHeader>
              <CardContent>
                <EntitySearch
                  onSearch={(query) => handleEntitySearch(query, 'brand')}
                  onSelect={(entity) => handleEntitySelect(entity, 'brand')}
                  placeholder="Search for a brand..."
                  loading={searchLoading}
                />
                
                {selectedEntity?.type === 'brand' && entityAnalytics && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {entityAnalytics.name} Analytics
                    </h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={entityAnalytics.data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={formatDate}
                          />
                          <YAxis />
                          <Tooltip 
                            formatter={(value: number) => [value.toLocaleString(), 'Views']}
                            labelFormatter={(label) => formatDate(label.toString())}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#2563eb" 
                            fill="#3b82f6" 
                            fillOpacity={0.2} 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Top Brands</CardTitle>
                  <CardDescription>Most viewed brands in the selected period</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {topBrands.map((brand, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{index + 1}.</span>
                          <span>{brand.entitySlug || brand._id}</span>
                        </div>
                        <span className="text-muted-foreground">{brand.total.toLocaleString()} views</span>
                      </li>
                    ))}
                    {topBrands.length === 0 && <p>No brand data available</p>}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Brand Performance</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topBrands.map(brand => ({
                        name: brand.entitySlug || brand._id,
                        views: brand.total
                      }))}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="views" name="Views" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Search Product Analytics</CardTitle>
                <CardDescription>View detailed analytics for a specific product</CardDescription>
              </CardHeader>
              <CardContent>
                <EntitySearch
                  onSearch={(query) => handleEntitySearch(query, 'product')}
                  onSelect={(entity) => handleEntitySelect(entity, 'product')}
                  placeholder="Search for a product..."
                  loading={searchLoading}
                />
                
                {selectedEntity?.type === 'product' && entityAnalytics && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {entityAnalytics.name} Analytics
                    </h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={entityAnalytics.data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={formatDate}
                          />
                          <YAxis />
                          <Tooltip 
                            formatter={(value: number) => [value.toLocaleString(), 'Views']}
                            labelFormatter={(label) => formatDate(label.toString())}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#2563eb" 
                            fill="#3b82f6" 
                            fillOpacity={0.2} 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>Most viewed products in the selected period</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {topProducts.map((product, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{index + 1}.</span>
                          <span>{product.entitySlug || product._id}</span>
                        </div>
                        <span className="text-muted-foreground">{product.total.toLocaleString()} views</span>
                      </li>
                    ))}
                    {topProducts.length === 0 && <p>No product data available</p>}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Product Performance</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topProducts.map(product => ({
                        name: product.entitySlug || product._id,
                        views: product.total
                      }))}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="views" name="Views" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
