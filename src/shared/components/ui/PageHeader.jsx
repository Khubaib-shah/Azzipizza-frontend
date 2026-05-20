import React from "react";

const PageHeader = ({ title, subtitle, actions }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-serif font-black !text-slate-900 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm !text-slate-500 font-medium leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-center shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
