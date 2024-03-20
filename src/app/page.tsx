"use client";

import { CameraTwoTone, CloudUploadOutlined } from "@ant-design/icons";
import { Layout, Typography, TimePicker, Divider, Slider, SliderSingleProps, Upload, Modal, UploadFile, GetProp, UploadProps, Spin, Button, FloatButton, Radio, RadioChangeEvent, message } from "antd";
import Link from "next/link";
import { CSSProperties, ReactElement, useEffect, useState } from "react";
import convert from "./util/minify";
import { KernelEnum } from "sharp";
import { RcFile } from "antd/es/upload";
import dayjs from "dayjs";
import BrightnessSettings from "./sections/BrightnessSettings";
import { Config, ConfigTime } from "./types/Config";
import DimTimeSettings from "./sections/DimTimeSettings";
import ImageSettings from "./sections/ImageSettings";
import { useSearchParams } from "next/navigation";

import getAdminPassword from "./util/admin";
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
	borderRadius: 20,
	overflow: "hidden"
};

const footerStyle: CSSProperties = {
	position: "fixed",
	bottom: 0,
	width: "100%",
	height: "70px"
}

export default function App() {
	const [config, setConfig] = useState<Config | undefined>(undefined);
	const [brightness, setBrightness] = useState<number | undefined>(undefined);
	const [dimStartTime, setDimStartTime] = useState<ConfigTime | undefined>(undefined);
	const [dimEndTime, setDimEndTime] = useState<ConfigTime | undefined>(undefined);
	const [isAdmin, setIsAdmin] = useState<boolean>(false);

	const searchParams = useSearchParams();

	const [messageApi, contextHolder] = message.useMessage();

	const [fileList, setFileList] = useState<UploadFile[]>([]);

	async function updateConfig() {
		let response = await fetch("https://jsonblob.com/api/jsonBlob/1191846168362868736")
		let config: Config = await response.json();

		setConfig(config);
		setBrightness(config.brightness);
		setDimStartTime(config.dim_start);
		setDimEndTime(config.dim_end);

		response = await fetch(config.image_url ?? "");
		if (response.status != 200) return;

		const currentImage: UploadFile = {
			uid: "0",
			url: config.image_url,
			name: config.image_url ?? "",
			originFileObj: await response.blob() as RcFile
		};

		setFileList([currentImage]);
	}

	// Fetch and display the current image.
	useEffect(() => {
		updateConfig();
		getAdminPassword()
			.then((pwd) => {
				setIsAdmin(searchParams.get("pwd") === pwd);
			});
	}, [searchParams]);

	// Update the config.
	function applyConfig() {
		updateConfig()
			.then(() => {
				setConfig((config) => {
					if (config) {
						config.brightness = brightness;
						config.dim_start = dimStartTime;
						config.dim_end = dimEndTime;

						fetch("https://jsonblob.com/api/jsonBlob/1191846168362868736", {
							method: "PUT",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(config)
						})
							.then(() => {
								messageApi.destroy();
								messageApi.success("Successfully updated settings", 2)
							})
							.catch(() => {
								messageApi.destroy();
								messageApi.error("Failed to update settings", 2);
							});
					}

					return config;
				});
			});
	}

	return (
		<Layout>
			{contextHolder}

			<Header style={headerStyle}><Title style={titleStyle} level={2}>bjorn-ctl</Title></Header>
			<Content style={contentStyle}>
				<BrightnessSettings brightness={brightness} setBrightness={setBrightness} />

				<DimTimeSettings dimStartTime={dimStartTime} dimEndTime={dimEndTime} setDimStartTime={setDimStartTime} setDimEndTime={setDimEndTime} />

				<ImageSettings fileList={fileList} setFileList={setFileList} isAdmin={isAdmin} />

				<FloatButton type="primary" tooltip="Apply settings" icon={<CloudUploadOutlined />} onClick={applyConfig} />
			</Content>
			<Footer style={footerStyle}>Made with ❤️ by <Link href="https://github.com/ch5zzy">ch5zzy</Link></Footer>
		</Layout>
	);
}
