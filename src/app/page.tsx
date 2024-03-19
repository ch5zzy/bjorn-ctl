"use client";

import { CameraTwoTone, CloudUploadOutlined } from "@ant-design/icons";
import { Layout, Typography, TimePicker, Divider, Slider, SliderSingleProps, Upload, Modal, UploadFile, GetProp, UploadProps, Spin, Button, FloatButton } from "antd";
import Link from "next/link";
import { CSSProperties, useEffect, useState } from "react";

const { Header, Footer, Sider, Content } = Layout;
const { Title, Paragraph } = Typography;

const { RangePicker } = TimePicker;

const headerStyle: CSSProperties = {
  textAlign: "center",
  backgroundColor: "black"
};

const titleStyle: CSSProperties = {
  color: "white",
  height: "50px",
  marginTop: 12
};

const contentStyle: CSSProperties = {
  margin: 20,
  padding: 20,
  height: "calc(100vh - 170px)",
  backgroundColor: "white",
  borderRadius: 20
};

const footerStyle: CSSProperties = {
  position: "fixed",
  bottom: 0,
  width: "100%",
  height: "70px"
}

const brightnessMarks: SliderSingleProps["marks"] = {
  0.05: "Dim",
  0.4: "Default",
  0.7: "Bright",
};

interface Config {
  image_url?: string,
  brightness?: number,
  rotation?: number,
  dim_start?: Date,
  dim_end?: Date
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function Home() {
  const [config, setConfig] = useState<Config | undefined>(undefined);
  const [brightness, setBrightness] = useState<number | undefined>(undefined);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Fetch and display the current image.
  useEffect(() => {
    fetch("https://jsonblob.com/api/jsonBlob/1191846168362868736")
      .then((response: Response) => response.json()
      .then((config) => {
        setConfig(config);
        setBrightness(config.brightness);

        const imageUrl = config.image_url;
        const currentImage: UploadFile = {
          uid: "0",
          url: imageUrl,
          name: imageUrl
        };

        setFileList([currentImage]);
      }));
  }, []);

  // Update the brightness.
  useEffect(() => {
    if (brightness != undefined) {
      setConfig((config) => {
        if (config) {
          config.brightness = brightness;
          
          console.log(config);

          fetch("https://jsonblob.com/api/jsonBlob/1191846168362868736", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(config)
          });
        }

        return config;
      });
    }
  }, [brightness]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <Layout>
      <Header style={headerStyle}><Title style={titleStyle} level={2}>bjorn-ctl</Title></Header>
      <Content style={contentStyle}>
        <Divider orientation="left" orientationMargin="0">Brightness</Divider>
        <Paragraph>Brightness can be configured between 0 and 1. The default brightness is 0.4.</Paragraph>
        { brightness === undefined ? <Spin /> : <Slider marks={brightnessMarks} min={0.05} max={1} step={0.01} defaultValue={brightness} onChangeComplete={setBrightness} /> }

        <Divider orientation="left" orientationMargin="0">Dim Time</Divider>
        <Paragraph>The display will be dimmed during the selected timeslot.</Paragraph>
        <RangePicker placeholder={["Start dim time", "End dim time"]} variant="filled" showHour showMinute onChange={() => {}} />

        <Divider orientation="left" orientationMargin="0">Image</Divider>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          maxCount={1}
        >
          <button>
            <CameraTwoTone />
            <div style={{ marginTop: 8 }}>{fileList.length >= 1 ? "Replace" : "Upload"}</div>
          </button>
        </Upload>
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
          <img alt="example" style={{ width: '100%', imageRendering: "crisp-edges" }} src={previewImage} />
        </Modal>
      
        <FloatButton type="primary" tooltip="Apply settings" icon={<CloudUploadOutlined />} />
      </Content>
      <Footer style={footerStyle}>Made with ❤️ by <Link href="https://github.com/ch5zzy">ch5zzy</Link></Footer>
    </Layout>
  );
}
