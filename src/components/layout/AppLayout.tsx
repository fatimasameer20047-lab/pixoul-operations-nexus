import { useAuth } from '@/auth/AuthProvider';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { SidebarProvider } from '@/components/ui/sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export const AppLayout = ({ children, title, description, actions }: AppLayoutProps) => {
  const { user } = useAuth();

  if (!user) {
    return <div>{children}</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader title={title} actions={actions} />
          <main className="flex-1 pixoul-page">
            <div className="p-6">
              {(title || description) && (
                <div className="mb-8 pixoul-fade-in">
                  {title && <h1 className="pixoul-title mb-2">{title}</h1>}
                  {description && <p className="pixoul-subtitle">{description}</p>}
                </div>
              )}
              <div className="pixoul-fade-in">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};