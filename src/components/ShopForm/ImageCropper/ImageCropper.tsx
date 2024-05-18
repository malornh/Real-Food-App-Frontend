import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Cropper, { Area, Point } from 'react-easy-crop';
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb, Button, Box, Icon, Image } from '@chakra-ui/react';
import { getOrientation } from 'get-orientation/browser';
import { getCroppedImg, getRotatedImage } from './canvasUtils';
import './ImageCropper.css';
import { TbRotateClockwise, TbZoomIn } from 'react-icons/tb';

const ORIENTATION_TO_ANGLE: { [key: number]: number } = {
  3: 180,
  6: 90,
  8: -90,
};

const ImageCropper: React.FC<{ handlePhotoChange: (imgSrc: string | null) => void }> = ({ handlePhotoChange }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploaded, SetUploaded] = useState(false);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      if (imageSrc && croppedAreaPixels) {
        const croppedImageBase64 = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
        handlePhotoChange(croppedImageBase64);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onClose = () => {
    setImageSrc(null);
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readFile(file);

      try {
        const orientation = await getOrientation(file);
        const rotation = ORIENTATION_TO_ANGLE[orientation];
        if (rotation) {
          imageDataUrl = await getRotatedImage(imageDataUrl, rotation);
        }
      } catch (e) {
        console.warn('Failed to detect the orientation');
      }

      setImageSrc(imageDataUrl);
    }
  };

  const handleSave = async () => {
    try {
      if (imageSrc && croppedAreaPixels) {
        const croppedImageBase64 = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
        handlePhotoChange(croppedImageBase64);
        SetUploaded(true);
        setImageSrc(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box p={4} sx={{ marginLeft: "10px" }}>
      {imageSrc ? (
        <>
          <Box className="crop-container">
            <Cropper
              image={imageSrc}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
            <Button
              className="reset-button"
              onClick={() => (setImageSrc(null), SetUploaded(false), handlePhotoChange(null))}
              colorScheme="red"
              position="absolute"
              top="0"
              right="0"
              zIndex="1">
              X
            </Button>
          </Box>
          <Box className="controls">
            <Box className="slider-container">
              <Slider
                className="slider"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(value) => setZoom(value as number)}>
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
              <Icon as={TbZoomIn} className="slider-icon" />
            </Box>

            <Button
              className="crop-button"
              onClick={showCroppedImage}
              colorScheme="teal">
              Show Result
            </Button>

            <Button
              className="save-button"
              onClick={handleSave}
              colorScheme="blue">
              Save
            </Button>
          </Box>
        </>
      ) : (
        <div style={{ padding: "30px" }}>
          <label
            style={{
              borderRadius: "10px",
              background: "teal",
              padding: "10px",
            }}>
            <input name="" type="file" onChange={onFileChange} hidden />
            Upload Photo
          </label>
          {uploaded && (
            <p style={{ color: "lime", marginLeft: "10px" }}>Photo saved!</p>
          )}
        </div>
      )}
    </Box>
  );
};

function readFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result as string), false);
    reader.readAsDataURL(file);
  });
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.render(<ImageCropper handlePhotoChange={(imgSrc) => console.log('Cropped Image:', imgSrc)} />, rootElement);
}

export default ImageCropper;
