import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  to?: string;
  className?: string;
}

export const BackButton = ({ to = '/', className = '' }: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate(to)}
      className={`flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors ${className}`}
    >
      <ArrowLeft size={16} />
      Back to Dashboard
    </Button>
  );
};