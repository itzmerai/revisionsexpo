declare module "react-native-clock-analog" {
  import { ReactNode } from "react";
  import { ViewProps } from "react-native";

  export interface AnalogClockProps extends ViewProps {
    colorClock?: string;
    colorNumber?: string;
    colorCenter?: string;
    colorHour?: string;
    colorMinutes?: string;
    colorSeconds?: string;
    hour?: number;
    minutes?: number;
    seconds?: number;
  }

  const AnalogClock: React.FC<AnalogClockProps>;
  export default AnalogClock;
}
