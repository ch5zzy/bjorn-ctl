import { Divider, Radio, RadioChangeEvent, Spin, UploadFile } from "antd";
import { ConfigGraphicsMode, ConfigScript } from "../types/Config";
import ImageSettings from "./ImageSettings";
import ScriptSettings from "./ScriptSettings";

export default function GraphicsSettings(props: {
    graphicsMode?: ConfigGraphicsMode,
    script?: ConfigScript,
    fileList: UploadFile[],
    setGraphicsMode: (mode: ConfigGraphicsMode) => void
    setFileList: (files: UploadFile[]) => void,
    setSetupScriptContents: (code: string) => void,
    setLoopScriptContents: (code: string) => void,
    isAdmin: boolean
}) {
    return (
        <>
            <Divider orientation="left" orientationMargin="0">
                <span style={{ paddingRight: 10 }}>Graphics</span>
                {
                    props.graphicsMode &&
                    <Radio.Group defaultValue={props.graphicsMode} onChange={(e: RadioChangeEvent) => props.setGraphicsMode(e.target.value)} buttonStyle="solid" disabled={!props.isAdmin}>
                        <Radio.Button value={ConfigGraphicsMode.Image}>Image</Radio.Button>
                        <Radio.Button value={ConfigGraphicsMode.Script}>Script</Radio.Button>
                    </Radio.Group>
                }
            </Divider>
            {
                props.graphicsMode ?
                    (props.graphicsMode == ConfigGraphicsMode.Image ?
                        <ImageSettings fileList={props.fileList} setFileList={props.setFileList} isAdmin={props.isAdmin} />
                        :
                        <ScriptSettings scriptContents={props.script} setSetupScriptContents={props.setSetupScriptContents} setLoopScriptContents={props.setLoopScriptContents} isAdmin={props.isAdmin} />
                    )
                    : <Spin />
            }
        </>
    );
}