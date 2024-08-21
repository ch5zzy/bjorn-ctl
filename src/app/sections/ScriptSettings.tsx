import { Divider, Typography, TimePicker, Spin, Slider, SliderSingleProps, Card, Switch, theme } from "antd";
import CodeMirror, { BasicSetupOptions } from "@uiw/react-codemirror";
import { CSSProperties } from "react";
import { ConfigScript } from "../types/Config";
import { consoleLight } from "@uiw/codemirror-theme-console";

const { Paragraph, Title, Link } = Typography;

const { useToken } = theme;

const editorSetup: BasicSetupOptions = {
    searchKeymap: true,
    bracketMatching: true,
    foldKeymap: true,
    foldGutter: true,
    tabSize: 2,
    highlightActiveLine: false,
}

export default function ScriptSettings(props: {
    scriptContents?: ConfigScript,
    setSetupScriptContents?: (code: string) => void,
    setLoopScriptContents?: (code: string) => void,
    isAdmin: boolean
}) {
    const { token } = useToken();

    const editorStyle: CSSProperties = {
        border: `2px solid ${token.colorBorder}`
    };
    
    return (
        <>
            <Paragraph>
                The scripts below will be run on the device. The <b>Setup script</b> will be run once, and the <b>Loop script</b> will be run continuously. See <Link href="https://github.com/ch5zzy/bjorn-rgb/blob/main/lang/README.md">Bjornlang documentation</Link> for help.
            </Paragraph>
            <Title level={5}>Setup script</Title>
            <Paragraph>Use this script to initialize any variables or define macros.</Paragraph>
            <CodeMirror
                className="editor"
                theme={consoleLight}
                width={"100%"}
                height={"250px"}
                value={props.scriptContents?.setup}
                onChange={props.setSetupScriptContents}
                readOnly={!props.isAdmin}
                basicSetup={editorSetup}
                style={editorStyle} />
            <Title level={5}>Loop script</Title>
            <Paragraph>Use this script for code that should run continuously.</Paragraph>
            <CodeMirror
                className="editor"
                theme={consoleLight}
                width={"100%"}
                height={"400px"}
                value={props.scriptContents?.loop}
                onChange={props.setLoopScriptContents}
                readOnly={!props.isAdmin}
                basicSetup={editorSetup}
                style={editorStyle} />
        </>
    )
}