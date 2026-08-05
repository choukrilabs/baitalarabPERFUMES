import React, { ErrorInfo, ReactNode } from 'react';
import { RotateCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    // Ignore third-party wallet extension errors
    if (error?.message && error.message.includes('ethereum')) {
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (error?.message && error.message.includes('ethereum')) {
      return;
    }
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] flex items-center justify-center p-6 text-center font-['Tajawal',sans-serif]">
          <div className="max-w-md bg-white border border-[#E5E0D8] rounded-2xl p-8 shadow-lg">
            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <AlertTriangle className="w-7 h-7 text-[#8C7342]" />
            </div>
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-2 font-['Reem_Kufi',sans-serif]">
              حدث خطأ غير متوقع
            </h2>
            <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
              نعتذر عن هذا الخطأ المؤقت. يرجى إعادة تحميل الصفحة لمتابعة التسوق واستكشاف العطور.
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center justify-center gap-2 bg-[#8C7342] hover:bg-[#7A6337] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <RotateCw className="w-4 h-4" />
              <span>إعادة تحميل الصفحة</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;

