// @ts-nocheck
import React, { useState } from "react";
import { CarouselProvider, Image, Slide, Slider } from "pure-react-carousel";
import { Divider } from "semantic-ui-react";
import Modal from "../Shared/Modal/Modal";
import { Container, Image as SemanticImage } from "semantic-ui-react";

import CustomDotGroup from "./CustomDotGroup";
import "pure-react-carousel/dist/react-carousel.es.css";

interface TestImageProps {
  screenshotsUris: string[];
}

const TestImageCarousel: React.FC<TestImageProps> = ({ screenshotsUris }) => {
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [modalImageSrc, setModalImageSrc] = useState<string>();

  const renderImages = (screenshotsUris: string[]) => {
    return screenshotsUris.map((screenshotUri: string, index: number) => {
      return (
        <Slide
          onFocus={() => console.log("slide click")}
          onBlur={() => console.log("blur")}
          tag="a"
          index={index}
          key={index}
        >
          <Image hasMasterSpinner={true} src={screenshotUri} />
        </Slide>
      );
    });
  };

  const onSliderImageClick = (ev) => {
    const currentSrc = ev.target.currentSrc;
    setModalImageSrc(currentSrc);
    setShowImageModal(true);
  };

  const renderImageModalContent = () => {
    return (
      <Container>
        <SemanticImage fluid src={modalImageSrc} size="massive"></SemanticImage>
      </Container>
    );
  };

  const renderImageModal = () => {
    if (showImageModal) {
      return (
        <Modal
          content={renderImageModalContent()}
          onDismiss={() => setShowImageModal(false)}
        />
      );
    }
  };

  const calculateScreenshotMaxWidth = () => {
    return screenshotsUris.length === 1
      ? "20em"
      : screenshotsUris.length === 2
      ? "40em"
      : "60em";
  };

  return (
    <>
      <CarouselProvider
        naturalSlideWidth={800}
        naturalSlideHeight={600}
        totalSlides={screenshotsUris.length}
        visibleSlides={Math.min(3, screenshotsUris.length)}
        orientation="horizontal"
        style={{
          maxWidth: calculateScreenshotMaxWidth(),
          display: "inline-block",
        }}
      >
        <Slider
          trayProps={{
            onClick: onSliderImageClick,
          }}
        >
          {renderImages(screenshotsUris)}
        </Slider>

        <Divider />
        <CustomDotGroup slides={screenshotsUris.length} />
      </CarouselProvider>
      {renderImageModal()}
    </>
  );
};

export default TestImageCarousel;
