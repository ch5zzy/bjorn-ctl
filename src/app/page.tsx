"use client";

import { CloudUploadOutlined } from "@ant-design/icons";
import { Layout, Typography, UploadFile, FloatButton, message, Radio, Divider } from "antd";
import Link from "next/link";
import { CSSProperties, useEffect, useState } from "react";
import { RcFile } from "antd/es/upload";
import BrightnessSettings from "./sections/BrightnessSettings";
import { Config, ConfigGraphicsMode, ConfigScript, ConfigTime } from "./types/Config";
import DimSettings from "./sections/DimSettings";
import ImageSettings from "./sections/ImageSettings";
import { useSearchParams } from "next/navigation";

import getAdminPassword from "./util/admin";
import { fetchConfig, uploadConfig, uploadImage } from "./util/upload";
import ScriptSettings from "./sections/ScriptSettings";
import GraphicsSettings from "./sections/GraphicsSettings";
const { Header, Footer, Content } = Layout;
const { Title } = Typography;

const headerStyle: CSSProperties = {
	textAlign: "center",
	backgroundColor: "black"
};

const titleStyle: CSSProperties = {
	color: "white",
	height: "50px",
	marginTop: 12
};

const logoStyle: CSSProperties = {
	background: "linear-gradient(45deg, rgba(97,230,196,1) 0%, rgba(255,143,252,1) 100%)",
	backgroundClip: "text",
	WebkitTextFillColor: "transparent"
};

const contentStyle: CSSProperties = {
	margin: 20,
	padding: 30,
	height: "calc(100dvh - 170px)",
	backgroundColor: "white",
	borderRadius: 20,
	overflow: "scroll",
	scrollbarWidth: "none"
};

const footerStyle: CSSProperties = {
	position: "fixed",
	bottom: 0,
	width: "100%",
	height: "70px"
};

const floatButtonStyle: CSSProperties = {
	position: "absolute",
	bottom: 20,
	right: 50
};

export default function App() {
	const [config, setConfig] = useState<Config | undefined>(undefined);
	const [graphicsMode, setGraphicsMode] = useState<ConfigGraphicsMode>();
	const [brightness, setBrightness] = useState<number | undefined>(undefined);
	const [dimStartTime, setDimStartTime] = useState<ConfigTime | undefined>(undefined);
	const [dimEndTime, setDimEndTime] = useState<ConfigTime | undefined>(undefined);
	const [dimBrightness, setDimBrightness] = useState<number | undefined>(undefined);
	const [isAdmin, setIsAdmin] = useState<boolean>(false);

	const searchParams = useSearchParams();

	const [messageApi, contextHolder] = message.useMessage();

	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [script, setScript] = useState<ConfigScript>({
		setup: "",
		loop: ""
	});
	const setSetupScript = (setup: string) => {
		setScript((script) => {
			script.setup = setup;
			return script;
		});
	};
	const setLoopScript = (loop: string) => {
		setScript((script) => {
			script.loop = loop;
			return script;
		});
	};

	async function updateConfig() {
		let config = await fetchConfig();

		setConfig(config);
		setBrightness(config.brightness);
		setDimStartTime(config.dim_start ?? {});
		setDimEndTime(config.dim_end ?? {});
		setDimBrightness(config.dim_brightness ?? 0.05);
		setGraphicsMode(config.graphics_mode ?? ConfigGraphicsMode.Image);
		setScript(config.script ?? {
			setup: "",
			loop: ""
		});

		let response;
		try {
			response = await fetch(config.image_url ?? "");
		} catch (error) {
			return;
		}

		const currentImage: UploadFile = {
			uid: "0",
			url: config.image_url,
			name: config.image_url ?? "",
			originFileObj: await response.blob() as RcFile
		};

		if (fileList.length > 0 && fileList[0].url === undefined) return;

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
	async function applyConfig() {
		let config = await fetchConfig();

		config.graphics_mode = graphicsMode;
		config.brightness = brightness;
		config.dim_start = dimStartTime;
		config.dim_end = dimEndTime;
		config.dim_brightness = dimBrightness;

		switch (config.graphics_mode) {
			case ConfigGraphicsMode.Image:
				if (fileList.length > 0 && (config.image_url !== fileList[0].url ?? ""))
					config.image_url = await uploadImage(fileList[0].preview ?? "");
				break;
			case ConfigGraphicsMode.Script:
				config.script = script;
				break;
		}

		const ok = await uploadConfig(JSON.stringify(config))
		if (ok) {
			messageApi.destroy();
			messageApi.success("Successfully updated settings", 2);
		} else {
			messageApi.destroy();
			messageApi.error("Failed to update settings", 2);
		}

		setConfig(config);
		updateConfig();
	}

	return (
		<Layout>
			{contextHolder}

			<Header style={headerStyle}><Title style={titleStyle} level={2}>🦄 <span style={logoStyle}>bjorn</span></Title></Header>
			<Content style={contentStyle}>
				<BrightnessSettings brightness={brightness} setBrightness={setBrightness} />
				<DimSettings dimStartTime={dimStartTime} dimEndTime={dimEndTime} dimBrightness={dimBrightness} setDimStartTime={setDimStartTime} setDimEndTime={setDimEndTime} setDimBrightness={setDimBrightness} />
				<GraphicsSettings graphicsMode={graphicsMode} script={script} setGraphicsMode={setGraphicsMode} fileList={fileList} setFileList={setFileList} setSetupScriptContents={setSetupScript} setLoopScriptContents={setLoopScript} isAdmin={isAdmin} />
				<FloatButton style={floatButtonStyle} type="primary" tooltip="Apply settings" icon={<CloudUploadOutlined />} onClick={applyConfig} />
			</Content>
			<Footer style={footerStyle}>Made with ❤️ by <Link href="https://github.com/ch5zzy">ch5zzy</Link></Footer>
		</Layout>
	);
}
