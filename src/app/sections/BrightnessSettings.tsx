import { Divider, Slider, SliderSingleProps, Spin, Typography } from "antd";

const { Paragraph } = Typography;

const brightnessMarks: SliderSingleProps["marks"] = {
    0.05: "Dim",
    0.4: "Default",
    1: "Bright",
};

export default function BrightnessSettings(props: {
    brightness?: number,
    setBrightness: (brightness: number) => void
}) {
    return (
        <>
            <Divider orientation="left" orientationMargin="0">Brightness</Divider>
            <Paragraph>Set the brightness of the display. The default brightness is 0.4.</Paragraph>
            {props.brightness ? <Slider marks={brightnessMarks} min={0.05} max={1} step={0.01} defaultValue={props.brightness} onChangeComplete={props.setBrightness} /> : <Spin /> }
        </>
    );
}