import moment from "moment";

/*Use this to format the time ago to your own needs*/
/*moment.updateLocale("en", {
  relativeTime: {
    d: "%d day",
  },
});*/

export const formatDate = (timestamp: number, outputFormat = "YYYY-MM-DD"): string => {
  return moment(timestamp).format(outputFormat);
};

export const toTimeAgo = (time: string | number, format = "YYYY-MM-DDTHH:mm:ss.SSS") => {
  if (typeof time === "number") {
    return moment(time).fromNow();
  }
  return moment(time, format).fromNow();
};
