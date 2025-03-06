import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';
import type { TableProps } from '@/components/ui/Table';

const DoubleScrollTable: React.FC<TableProps> = ({ 
  children,
  className,
  borderlessRow,
  compact = false,
  hoverable = true,
  overflow = true,
  ...rest
}) => {
  const topScrollRef = useRef<HTMLDivElement>(null);
  const tableWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const topScroll = topScrollRef.current;
    const tableWrapper = tableWrapperRef.current;

    if (!topScroll || !tableWrapper) return;

    const handleTopScroll = () => {
      if (tableWrapper.scrollLeft !== topScroll.scrollLeft) {
        tableWrapper.scrollLeft = topScroll.scrollLeft;
      }
    };

    const handleMainScroll = () => {
      if (topScroll.scrollLeft !== tableWrapper.scrollLeft) {
        topScroll.scrollLeft = tableWrapper.scrollLeft;
      }
    };

    topScroll.addEventListener('scroll', handleTopScroll);
    tableWrapper.addEventListener('scroll', handleMainScroll);

    return () => {
      topScroll.removeEventListener('scroll', handleTopScroll);
      tableWrapper.removeEventListener('scroll', handleMainScroll);
    };
  }, []);

  const tableClass = classNames(
    'table-default',
    hoverable && 'table-hover',
    compact && 'table-compact',
    borderlessRow && 'borderless-row',
    className
  );

  return (
    <div className="flex flex-col w-full">
      {/* Top Scrollbar Container */}
      
      <div
        ref={topScrollRef}
        className="overflow-x-auto opacity-1 pointer-events-auto relative"
        style={{ height: '16px' }}
      >
        {/* Clone of the table for width synchronization */}
        <table className={tableClass} {...rest} style={{ visibility: 'hidden' }}>
          {children}
        </table>
        {/* Actual scrollbar element */}
        <div 
          className="absolute left-0 right-0 bottom-0 overflow-x-auto opacity-100 pointer-events-auto"
          style={{ height: '16px' }}
        >
          <div style={{ height: '1px', backgroundColor: '' }}>
            <div style={{ height: '1px', width: '100%' }} />
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div
        ref={tableWrapperRef}
        className={classNames(overflow && 'overflow-x-auto')}
      >
        <table className={tableClass} {...rest}>
          {children}
        </table>
      </div>
    </div>
  );
};

export default DoubleScrollTable;