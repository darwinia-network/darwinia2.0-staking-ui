import Chart from "../Chart";
import { useAppTranslation, localeKeys } from "@package/app-locale";

const OverviewCharts = () => {
  const { t } = useAppTranslation();
  const chartsData = [
    {
      title: t(localeKeys.ordersCount),
      timeRange: [t(localeKeys.days, { daysNumber: 7 }), t(localeKeys.days, { daysNumber: 30 }), t(localeKeys.all)],
    },
    {
      title: t(localeKeys.freeHistory, { currency: "ring" }),
      timeRange: [t(localeKeys.days, { daysNumber: 7 }), t(localeKeys.days, { daysNumber: 30 }), t(localeKeys.all)],
    },
    {
      title: t(localeKeys.ordersCount),
      timeRange: [t(localeKeys.days, { daysNumber: 7 }), t(localeKeys.days, { daysNumber: 30 }), t(localeKeys.all)],
    },
    {
      title: t(localeKeys.freeHistory, { currency: "ring" }),
      timeRange: [t(localeKeys.days, { daysNumber: 7 }), t(localeKeys.days, { daysNumber: 30 }), t(localeKeys.all)],
    },
    {
      title: t(localeKeys.ordersCount),
      timeRange: [t(localeKeys.days, { daysNumber: 7 }), t(localeKeys.days, { daysNumber: 30 }), t(localeKeys.all)],
    },
    {
      title: t(localeKeys.freeHistory, { currency: "ring" }),
      timeRange: [t(localeKeys.days, { daysNumber: 7 }), t(localeKeys.days, { daysNumber: 30 }), t(localeKeys.all)],
    },
    {
      title: t(localeKeys.ordersCount),
      timeRange: [t(localeKeys.days, { daysNumber: 7 }), t(localeKeys.days, { daysNumber: 30 }), t(localeKeys.all)],
    },
    {
      title: t(localeKeys.freeHistory, { currency: "ring" }),
      timeRange: [t(localeKeys.days, { daysNumber: 7 }), t(localeKeys.days, { daysNumber: 30 }), t(localeKeys.all)],
    },
    {
      title: t(localeKeys.ordersCount),
      timeRange: [t(localeKeys.days, { daysNumber: 7 }), t(localeKeys.days, { daysNumber: 30 }), t(localeKeys.all)],
    },
    {
      title: t(localeKeys.freeHistory, { currency: "ring" }),
      timeRange: [t(localeKeys.days, { daysNumber: 7 }), t(localeKeys.days, { daysNumber: 30 }), t(localeKeys.all)],
    },
  ];

  const charts = chartsData.map((item, index) => {
    return <Chart key={index} title={item.title} timeRange={item.timeRange} />;
  });

  return (
    <div className={"grid grid-cols-1 lg:grid-cols-2 gap-x-[0.9375rem] gap-y-[0.9375rem] lg:gap-y-[1.875rem]"}>
      {charts}
    </div>
  );
};

export default OverviewCharts;
