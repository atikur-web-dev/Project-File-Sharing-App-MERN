interface AppFooterProps {
  compact?: boolean;
  className?: string;
}

export const AppFooter = ({ compact = false, className = '' }: AppFooterProps) => {
  if (compact) {
    return (
      <footer
        className={`flex items-center justify-between border-t border-outline-variant bg-surface-container-low py-md px-xl ${className}`}
      >
        <p className="text-label-md text-on-surface-variant">
          © {new Date().getFullYear()} DevShare Inc. Precision File Management.
        </p>
        <div className="flex gap-md">
          <a href="#" className="text-label-md text-on-surface-variant transition-colors hover:text-secondary">
            Privacy
          </a>
          <a href="#" className="text-label-md text-on-surface-variant transition-colors hover:text-secondary">
            Terms
          </a>
          <a href="#" className="text-label-md text-on-surface-variant transition-colors hover:text-secondary">
            API
          </a>
        </div>
      </footer>
    );
  }

  return (
    <footer
      className={`grid grid-cols-2 gap-lg border-t border-outline-variant py-xl md:grid-cols-4 lg:grid-cols-6 ${className}`}
    >
      <div className="col-span-2">
        <span className="text-headline-md font-bold text-primary">DevShare</span>
        <p className="mt-sm text-label-md text-on-surface-variant">
          © {new Date().getFullYear()} DevShare Inc. Precision File Management.
        </p>
      </div>
      <div className="flex flex-col gap-xs">
        <span className="mb-xs text-label-md font-bold uppercase text-on-surface-variant">Product</span>
        <a href="#" className="text-label-md text-on-surface-variant transition-colors hover:text-secondary">
          Privacy
        </a>
        <a href="#" className="text-label-md text-on-surface-variant transition-colors hover:text-secondary">
          Terms
        </a>
      </div>
      <div className="flex flex-col gap-xs">
        <span className="mb-xs text-label-md font-bold uppercase text-on-surface-variant">Infrastructure</span>
        <a href="#" className="text-label-md text-on-surface-variant transition-colors hover:text-secondary">
          Security
        </a>
        <a href="#" className="text-label-md text-on-surface-variant transition-colors hover:text-secondary">
          Status
        </a>
      </div>
      <div className="flex flex-col gap-xs">
        <span className="mb-xs text-label-md font-bold uppercase text-on-surface-variant">Developers</span>
        <a href="#" className="text-label-md text-on-surface-variant transition-colors hover:text-secondary">
          API Docs
        </a>
        <a href="#" className="text-label-md text-on-surface-variant transition-colors hover:text-secondary">
          Support
        </a>
      </div>
    </footer>
  );
};
