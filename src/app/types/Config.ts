export interface ConfigTime {
  hour?: number;
  minute?: number;
}

export interface Config {
  image_url?: string;
  brightness?: number;
  rotation?: number;
  dim_start?: ConfigTime;
  dim_end?: ConfigTime;
  dim_brightness?: number;
  detect_timezone_from_ip?: boolean;
}

export const defaultConfig: Config = {
  image_url: undefined,
  brightness: 0.4,
  rotation: 0,
  dim_start: {
    hour: 22,
    minute: 0,
  },
  dim_end: {
    hour: 8,
    minute: 0,
  },
  dim_brightness: 0.05,
  detect_timezone_from_ip: true,
};
