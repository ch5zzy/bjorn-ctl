import { Divider, Typography, TimePicker, Spin } from "antd";
import { ConfigTime } from "../types/Config";
import dayjs from "dayjs";

const { Paragraph } = Typography;
const { RangePicker } = TimePicker;

export default function DimTimeSettings(props: {
    dimStartTime?: ConfigTime,
    dimEndTime?: ConfigTime,
    setDimStartTime: (time: ConfigTime) => void,
    setDimEndTime: (time: ConfigTime) => void
}) {
    return (
        <>
            <Divider orientation="left" orientationMargin="0">Dim Time</Divider>
            <Paragraph>The display will be dimmed during the selected timeslot.</Paragraph>
            {
                props.dimStartTime && props.dimEndTime ?
                    <RangePicker defaultValue={[dayjs().hour(props.dimStartTime?.hour ?? 0).minute(props.dimStartTime?.minute ?? 0), dayjs().hour(props.dimEndTime?.hour ?? 0).minute(props.dimEndTime?.minute ?? 0)]} variant="filled" order={false} showHour showMinute onChange={(dates) => {
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
                    }} />
                    : <Spin />
            }
        </>
    )
}