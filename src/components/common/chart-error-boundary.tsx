import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';

interface ChartErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ChartErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ChartErrorBoundary extends React.Component<
  ChartErrorBoundaryProps,
  ChartErrorBoundaryState
> {
  constructor(props: ChartErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ChartErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Chart Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="h-full">
          <CardBody className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <Icon 
                icon="lucide:bar-chart-3" 
                width={48} 
                height={48} 
                className="text-default-300 mx-auto" 
              />
              <div>
                <p className="text-default-600 font-medium">Chart Error</p>
                <p className="text-sm text-default-500">
                  Unable to display chart data
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export const useChartErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error) => {
    console.error('Chart Error:', error);
    setError(error);
  }, []);

  return { error, resetError, handleError };
};

// Safe Chart Wrapper Component
export const SafeChart: React.FC<{
  children: React.ReactNode;
  height?: number | string;
  fallback?: React.ReactNode;
}> = ({ children, height = 300, fallback }) => {
  return (
    <ChartErrorBoundary fallback={fallback}>
      <div style={{ height, width: '100%' }}>
        {children}
      </div>
    </ChartErrorBoundary>
  );
};
