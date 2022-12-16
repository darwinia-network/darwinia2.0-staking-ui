import moment from "moment";

export const formatDate = (timestamp: number, format = "YYYY-MM-DD"): string => {
  return moment(timestamp).format(format);
};
