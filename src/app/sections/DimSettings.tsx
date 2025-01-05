import { Divider, Typography, TimePicker, Spin, Slider, SliderSingleProps, Checkbox } from "antd";
import { ConfigTime } from "../types/Config";
import dayjs from "dayjs";
import { CSSProperties } from "react";
import { CheckboxChangeEvent } from "antd/es/checkbox";

const { Paragraph } = Typography;
const { RangePicker } = TimePicker;

const timeSettingsStyle: CSSProperties = {
    marginBottom: 20
};

const dimBrightnessMarks: SliderSingleProps["marks"] = {
    0.01: "Faint",
    0.05: "Very dim",
    0.1: "Dim"
};

export default function DimSettings(props: {
    dimStartTime?: ConfigTime,
    dimEndTime?: ConfigTime,
    dimBrightness?: number,
    detectTimezoneFromIP?: boolean,
    setDimStartTime: (time: ConfigTime) => void,
    setDimEndTime: (time: ConfigTime) => void,
    setDimBrightness: (brightness: number) => void,
    setDetectTimezoneFromIP: (enabled: boolean) => void,
}) {
    return (
        <>
            <Divider orientation="left" orientationMargin="0">Dimming</Divider>
            <Paragraph>The display will be dimmed to the selected brightness during the selected timeslot.</Paragraph>
            {
                props.dimStartTime && props.dimEndTime && props.dimBrightness ?
                    <>
                        <div style={timeSettingsStyle}>
                            <RangePicker style={{ marginBottom: 5 }} defaultValue={[dayjs().hour(props.dimStartTime?.hour ?? 0).minute(props.dimStartTime?.minute ?? 0), dayjs().hour(props.dimEndTime?.hour ?? 0).minute(props.dimEndTime?.minute ?? 0)]} variant="filled" order={false} showHour showMinute onChange={(dates) => {
                                const start_dim = dates[0];
                                const end_dim = dates[1];

                                props.setDimStartTime({
                                    hour: start_dim?.hour(),
                                    minute: start_dim?.minute()
                                });

                                props.setDimEndTime({
                                    hour: end_dim?.hour(),
                                    minute: end_dim?.minute()
                                });
                            }} /> <br />
                            <Checkbox defaultChecked={props.detectTimezoneFromIP} onChange={(e: CheckboxChangeEvent) => props.setDetectTimezoneFromIP(e.target.checked)}>Detect timezone from IP address when powered on</Checkbox>
                        </div>
                        <Slider marks={dimBrightnessMarks} min={0.01} max={0.1} step={0.005} defaultValue={props.dimBrightness} onChangeComplete={props.setDimBrightness} />
                    </>
                    : <Spin />
            }
        </>
    )
}