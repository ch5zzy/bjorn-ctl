/* eslint-disable jsx-a11y/alt-text */
"use client";

import { Divider, Modal, Radio, RadioChangeEvent, Typography, Upload, UploadFile, UploadProps, ColorPicker, Card } from "antd";
import { CSSProperties, MouseEventHandler, useState } from "react";
import minify from "../util/minify";
import { KernelEnum } from "sharp";
import { CameraTwoTone } from "@ant-design/icons";
import { Color } from "antd/es/color-picker";
import Search from "antd/es/input/Search";
import { searchGiphyGifs, searchTenorGifs } from "../util/gif";
import { Gallery, Image, ThumbnailImageProps } from "react-grid-gallery";
import { RcFile } from "antd/es/upload";

const { Paragraph } = Typography;

const cardStyle: CSSProperties = {
    marginTop: 10
};

function ImageCard(props: ThumbnailImageProps) {
    const [hover, setHover] = useState(false);

    const onSelectHandler: MouseEventHandler<HTMLImageElement> = (event) => {
        props.onSelect(props.index, event);
    };

    props.imageProps.style.transition = "filter 0.2s ease";
    props.imageProps.style.filter = `brightness(${hover ? "50" : "100"}%)`;
    props.imageProps.style.cursor = "pointer";

    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props.imageProps}
        onMouseOver={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={onSelectHandler}
        title={props.imageProps.alt} />;
};

enum GIFSearchEngine {
    Giphy,
    Tenor
};

export default function ImageSettings(props: {
    fileList: UploadFile[],
    setFileList: (files: UploadFile[]) => void,
    isAdmin: boolean,
}) {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [kernel, setKernel] = useState<keyof KernelEnum>("nearest");
    const [searchEngine, setSearchEngine] = useState(GIFSearchEngine.Tenor);
    const [backgroundColor, setBackgroundColor] = useState<Color>();
    const [gifs, setGifs] = useState<Image[]>([]);

    const handleCancel = () => setPreviewOpen(false);

    const getPreview = async (file: File | Blob) => {
        const imgBase64 = Buffer.from(await file.arrayBuffer()).toString("base64");
        return minify(imgBase64, kernel, JSON.stringify(backgroundColor?.toRgb()));
    }

    const handlePreview = async (file: UploadFile) => {
        file.preview = file.preview ?? await getPreview(file.originFileObj as File);

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name);
    };

    const handleChange: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
        newFileList.map(async (file) => {
            file.preview = file.preview ?? await getPreview(file.originFileObj as File);
        });
        props.setFileList(newFileList);
    };

    async function updateGifSearch(term: string) {
        let results;
        switch (searchEngine) {
            case GIFSearchEngine.Tenor:
                results = await searchTenorGifs(term);
                break;
            case GIFSearchEngine.Giphy:
                results = await searchGiphyGifs(term);
                break;
            default:
                return;
        }

        const thumbnails = results.map((gif) => {
            const galleryImage: Image = {
                src: gif.url,
                alt: gif.caption,
                width: gif.width,
                height: gif.height
            };

            return galleryImage;
        })

        setGifs(thumbnails);
    }

    function onSelectImage(index: number, image: Image) {
        selectGif(image.src, image.alt);
    }

    async function selectGif(url: string, name?: string) {
        let response = await fetch(url ?? "");
        if (response.status != 200) return;

        const currentImage: UploadFile = {
            uid: "0",
            name: name ?? url,
            originFileObj: await response.blob() as RcFile
        };
        currentImage.preview = await getPreview(currentImage.originFileObj as File);

        props.setFileList([currentImage]);
    }

    return (
        <>
            <Divider orientation="left" orientationMargin="0">Image</Divider>
            {!props.isAdmin && props.fileList.length == 0 && <Paragraph>No image configured.</Paragraph>}
            <Upload
                listType="picture-card"
                fileList={props.fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                maxCount={1}
                accept="image/png,image/jpg,image/gif,image/webp"
                showUploadList={{
                    showPreviewIcon: true,
                    showRemoveIcon: false
                }}
                previewFile={(file: File | Blob) => getPreview(file)}
            >
                {
                    props.isAdmin &&
                    <button>
                        <CameraTwoTone />
                        <div style={{ marginTop: 8 }}>{props.fileList.length >= 1 ? "Replace" : "Upload"}</div>
                    </button>
                }
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="preview" style={{ width: '100%' }} src={previewImage} />
            </Modal>
            {
                props.isAdmin &&
                <>
                    <ColorPicker
                        defaultValue="#000000"
                        showText={(color) => <span>Background color ({color.toHexString()})</span>}
                        onChangeComplete={setBackgroundColor}
                        disabledAlpha
                    />
                    <Card title="Interpolation type" size="small" style={cardStyle}>
                        <Paragraph>Select an interpolation type to use when resizing the image.</Paragraph>
                        <Radio.Group defaultValue="nearest" buttonStyle="solid" onChange={(e: RadioChangeEvent) => setKernel(e.target.value)}>
                            <Radio.Button value="nearest">Nearest</Radio.Button>
                            <Radio.Button value="cubic">Cubic</Radio.Button>
                            <Radio.Button value="mitchell">Mitchell</Radio.Button>
                            <Radio.Button value="lanczos2">Lanczos2</Radio.Button>
                            <Radio.Button value="lanczos3">Lanczos3</Radio.Button>
                        </Radio.Group>
                    </Card>
                    <Card title="GIFs" size="small" style={cardStyle}>
                        <Search placeholder="Search for GIFs" onSearch={updateGifSearch} style={{ marginBottom: 10 }} enterButton />
                        <Radio.Group defaultValue={GIFSearchEngine.Tenor} buttonStyle="solid" onChange={(e: RadioChangeEvent) => setSearchEngine(e.target.value)} style={{ marginBottom: gifs.length > 0 ? 10 : 0 }}>
                            <Radio.Button value={GIFSearchEngine.Tenor}>Tenor</Radio.Button>
                            <Radio.Button value={GIFSearchEngine.Giphy}>GIPHY</Radio.Button>
                        </Radio.Group>
                        <Gallery images={gifs} onSelect={onSelectImage} thumbnailImageComponent={ImageCard} />
                    </Card>
                </>
            }
        </>
    )
}