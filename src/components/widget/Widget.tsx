// Widget.jsx
import React from 'react';
import Card from 'components/card';
import LoadingSkeleton from 'components/loading/LoadingSkeleton';

const Widget = (props: {
  icon: JSX.Element;
  title: string;
  subtitle: any;
  isLoading: boolean;
}) => {
  const { icon, title, subtitle, isLoading } = props;

  return (
    <Card extra="!flex-row flex-grow items-center rounded-[20px] border-l-4 border-green-700 dark:border-orange-500">
      <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
        <div className="rounded-full bg-lightPrimary p-3 dark:bg-gradient-to-tl from-navy-800 to-navy-900">
          <span className="flex items-center text-green-500 dark:text-orange-400">
            {icon}
          </span>
        </div>
      </div>

      <div className="h-50 ml-4 flex w-full flex-col justify-center pr-5">
        <p className="font-dm text-sm font-medium text-gray-600">{title}</p>
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <h4 className="text-xl font-bold text-navy-700 dark:text-white">
            {subtitle}
          </h4>
        )}
      </div>
    </Card>
  );
};

export default Widget;
