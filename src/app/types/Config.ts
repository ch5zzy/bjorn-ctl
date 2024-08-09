export interface ConfigTime {
    hour?: number,
    minute?: number
};

export interface ConfigScript {
    setup?: string,
    loop?: string
};

export enum ConfigGraphicsMode {
    Image = "IMAGE",
    Script = "SCRIPT"
};

export interface Config {
    graphics_mode?: ConfigGraphicsMode,
    image_url?: string,
    script?: ConfigScript,
    brightness?: number,
    rotation?: number,
    dim_start?: ConfigTime,
    dim_end?: ConfigTime,
    dim_brightness?: number
};