import { Divider, UploadFile } from "antd";
import ImageSettings from "./ImageSettings";

export default function GraphicsSettings(props: {
    fileList: UploadFile[],
    setFileList: (files: UploadFile[]) => void,
    isAdmin: boolean
}) {
    return (
        <>
            <Divider orientation="left" orientationMargin="0">
                <span style={{ paddingRight: 10 }}>Image</span>
            </Divider>
            <ImageSettings fileList={props.fileList} setFileList={props.setFileList} isAdmin={props.isAdmin} />
        </>
    );
}