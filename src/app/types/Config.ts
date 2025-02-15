export interface ConfigTime {
    hour?: number,
    minute?: number
};

export interface Config {
    image_url?: string,
    brightness?: number,
    rotation?: number,
    dim_start?: ConfigTime,
    dim_end?: ConfigTime,
    dim_brightness?: number,
    detect_timezone_from_ip?: boolean
};