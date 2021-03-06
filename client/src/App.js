import { useEffect, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { useFetchBufferUrl, useGetVideos } from "./hooks";
import { copyTextToClipboard, downloadUrl } from "./utils";

const App = () => {
  const [modalShow, setModalShow] = useState(false);
  const [videos, size, getVideos, setVideos] = useGetVideos("");
  const [buffer, getBuffer, setBuffer] = useFetchBufferUrl("");
  const [isOverSize, setIsOverSize] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalShow(true);
    await getVideos(e.target.text.value);
    setModalShow(false);
  };
  const handleReset = () => {
    setVideos([]);
  };
  const handleClose = () => {
    setModalShow(false);
  };

  const handleCopy = async (text = "") => {
    const message = await copyTextToClipboard(text);
    alert(message);
  };

  const handleDownload = async (url = "") => {
    setModalShow(true);
    try {
      const buffer = await getBuffer(url);
      downloadUrl(buffer);
    } catch (e) {
      alert(e.message);
    }
    setModalShow(false);
  };
  const handleTextChange = (e) => {
    const urlRegex = /https:\/\/v\.douyin\.com\/[a-z0-9]+/gi;
    if (urlRegex.test(e.target.value) && videos.length) {
      setVideos([]);
    }
  };

  useEffect(() => {
    setIsOverSize(size / 1024 / 1024 >= 6);
  }, [size]);
  return (
    <>
      <div className="container">
        <h1 className="text-center">无水印下载抖音小视频</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="text" className="form-label">
              抖音分享的链接:
            </Form.Label>
            <Form.Control
              as="textarea"
              name="text"
              id="text"
              className="form-control"
              placeholder="请填入抖音分享的链接"
              cols="15"
              rows="5"
              required
              onChange={handleTextChange}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="text-end">
            <Button
              type="reset"
              variant="secondary"
              className="mx-2"
              onClick={handleReset}
            >
              重置
            </Button>
            <Button variant="primary" type="submit" disabled={videos.length}>
              获取
            </Button>
          </Form.Group>
        </Form>
      </div>
      <Modal
        show={modalShow}
        centered
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Modal.Body>
      </Modal>
      <div className="container mt-5">
        {videos &&
          videos.map((address, index) => {
            return (
              <div key={index}>
                <Button
                  variant="link"
                  className="mx-2"
                  title="点击复制下载链接"
                  onClick={() => handleCopy(address)}
                >
                  链接 {index + 1}
                </Button>
                {!isOverSize && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleDownload(address)}
                  >
                    远程下载
                  </Button>
                )}
              </div>
            );
          })}
      </div>
      {videos.length > 0 && (
        <div className="container">
          点击链接复制链接到新窗口打开可以下载当前视频
        </div>
      )}
      <footer className="position-absolute bottom-0 text-center w-100 mb-1">
        <a href="https://beian.miit.gov.cn" target="_blank" rel="noreferrer">
          ICP主体备案号:粤ICP备17043808号
        </a>
      </footer>
    </>
  );
};

export default App;
