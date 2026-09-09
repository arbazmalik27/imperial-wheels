
const SectionHeader = ({ badge, title, subtitle, align = 'center' }) => {
  const alignmentClass = align === 'center' ? 'mx-auto text-center' : 'text-left';
  
  return (
    <div className={`mb-12 max-w-3xl ${alignmentClass}`}>
      {badge && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mb-4 uppercase">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-slate-900 mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
