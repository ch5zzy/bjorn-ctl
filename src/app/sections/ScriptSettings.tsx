import { Divider, Typography, TimePicker, Spin, Slider, SliderSingleProps, Card, Switch } from "antd";
import CodeMirror, { BasicSetupOptions } from "@uiw/react-codemirror";
import { CSSProperties } from "react";
import { ConfigScript } from "../types/Config";

const { Paragraph, Title, Link } = Typography;

const editorSetup: BasicSetupOptions = {
    searchKeymap: true,
    bracketMatching: true,
    foldKeymap: true,
    foldGutter: true,
    tabSize: 2,
    highlightActiveLine: true,
}

export default function ScriptSettings(props: {
    scriptContents?: ConfigScript,
    setSetupScriptContents?: (code: string) => void,
    setLoopScriptContents?: (code: string) => void,
}) {
    return (
        <>
            <Paragraph>
                The scripts below will be run on the device. The <b>Setup script</b> will be run once, and the <b>Loop script</b> will be run continuously. See <Link href="https://github.com/ch5zzy/bjorn-rgb/blob/main/lang/README.md">Bjornlang documentation</Link> for help.
            </Paragraph>
            <Title level={5}>Setup script</Title>
            <Paragraph>Use this script to initialize any variables or define macros.</Paragraph>
            <CodeMirror
                className="editor"
                width={"100%"}
                height={"250px"}
                value={props.scriptContents?.setup}
                onChange={props.setSetupScriptContents}
                basicSetup={editorSetup} />
            <Title level={5}>Loop script</Title>
            <Paragraph>Use this script for code that should run continuously.</Paragraph>
            <CodeMirror
                className="editor"
                width={"100%"}
                height={"400px"}
                value={props.scriptContents?.loop}
                onChange={props.setLoopScriptContents}
                basicSetup={editorSetup} />
        </>
    )
}