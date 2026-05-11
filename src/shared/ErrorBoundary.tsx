import React from 'react';
import { useTranslation } from 'react-i18next';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback message={this.state.errorMessage} />;
    }

    return this.props.children;
  }
}

const ErrorFallback: React.FC<{ message: string | null }> = ({ message }) => {
  const { t } = useTranslation();
  const fallbackMessage = message || t('errors.unknownError');
  return (
    <div style={{ textAlign: 'center' }}>
      <h2>{t('errors.somethingWentWrong')}</h2>
      <p>{t('errors.refreshInstructions')}</p>
      <p>{fallbackMessage}</p>
      <button onClick={() => window.location.reload()} style={{ padding: '0.5em 1em' }}>
        {t('errors.refreshPage')}
      </button>
    </div>
  );
};

export default ErrorBoundary;
