import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface MessageProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
}

const Message: React.FC<MessageProps> = ({ variant = 'info', children }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-400',
          text: 'text-emerald-700',
          icon: <CheckCircle className="h-5 w-5 text-emerald-500" />
        };
      case 'warning':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-400',
          text: 'text-amber-700',
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />
        };
      case 'error':
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-400',
          text: 'text-rose-700',
          icon: <AlertCircle className="h-5 w-5 text-rose-500" />
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-400',
          text: 'text-blue-700',
          icon: <Info className="h-5 w-5 text-blue-500" />
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className={`${styles.bg} ${styles.border} ${styles.text} border-l-2 p-4 rounded-md mb-4`}
    >
      <div className="flex">
        <div className="flex-shrink-0">{styles.icon}</div>
        <div className="ml-3">
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Message;