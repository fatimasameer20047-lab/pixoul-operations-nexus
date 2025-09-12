interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export const PageHeader = ({ title, description, actions, children }: PageHeaderProps) => {
  return (
    <div className="mb-8 pixoul-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="pixoul-title">{title}</h1>
          {description && <p className="pixoul-subtitle mt-2">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
      {children}
    </div>
  );
};