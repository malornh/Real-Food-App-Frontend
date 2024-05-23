import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Cropper, { Area, Point } from 'react-easy-crop';
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb, Button, Box, Icon, Image, Flex } from '@chakra-ui/react';
import { getOrientation } from 'get-orientation/browser';
import { getCroppedImg, getRotatedImage } from './canvasUtils';
import './ImageCropper.css';
import { TbRotateClockwise, TbZoomIn } from 'react-icons/tb';
import ImageDialog from './ImageDialog/ImageDialog';

const ORIENTATION_TO_ANGLE: { [key: number]: number } = {
  3: 180,
  6: 90,
  8: -90,
};

interface ImageCropperProps {
  handlePhotoChange: (imgSrc: string | null) => void; // Function to handle image changes
  initialImage: string | undefined; // Initial value for the image
}

const ImageCropper: React.FC<ImageCropperProps> = ({ handlePhotoChange, initialImage }) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(initialImage);
  const [newImageSrc, setNewImageSrc] = useState<string | undefined>();
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      if (newImageSrc && croppedAreaPixels) {
        const croppedImageBase64 = await getCroppedImg(newImageSrc, croppedAreaPixels, rotation);
        handlePhotoChange(croppedImageBase64);
        setCroppedImage(croppedImageBase64);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onClose = () => {
    setCroppedImage(null);
    handlePhotoChange(null);
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

      setNewImageSrc(imageDataUrl);
      setIsEditMode(true);
    }
  };

  const handleSave = async () => {
    try {
      if (newImageSrc && croppedAreaPixels) {
        const croppedImageBase64 = await getCroppedImg(newImageSrc, croppedAreaPixels, rotation);
        //handlePhotoChange(croppedImageBase64);
        //setSelectedImage(croppedImageBase64);
        setImageSrc(croppedImageBase64);
        setIsEditMode(false);
        //setCroppedImage(croppedImageBase64);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box mt={4} mb={2} sx={{ marginLeft: "20px" }}>
      {!isEditMode ? (
        <div>
          <div>
            {imageSrc && (
              <Image
                src={imageSrc}
                style={{
                  width: "380px",
                  height: '267px',
                  borderRadius: "10px",
                  border: "2px solid black",
                }}
              />
            )}
          </div>
          <div style={{ marginTop: "20px", marginBottom: "21px" }}>
            <Button
              as="label"
              htmlFor="file-upload"
              colorScheme="teal"
              borderRadius="10px"
              padding="10px"
              cursor="pointer">
              Upload Photo
              <input
                id="file-upload"
                type="file"
                onChange={onFileChange}
                hidden
              />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Box className="crop-container">
            <Cropper
              image={newImageSrc}
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
              onClick={() => {
                setIsEditMode(false);
              }}
              colorScheme="red"
              position="absolute"
              top="1"
              right="1"
              zIndex="1">
              X
            </Button>
          </Box>
          <Box className="controls">
            <Box className="slider-container" mb={3} mt={1}>
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

            {/*
          //Rotation slider. To be optimized before u
          <Box className="slider-container">
            <Slider
              className="slider"
              value={rotation}
              min={0}
              max={360}
              step={1}
              onChange={(value) => setRotation(value as number)}>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <Icon as={TbRotateClockwise} className="slider-icon" />
          </Box>
        */}

            <Flex justify="space-between">
              <Button
                className="crop-button"
                onClick={showCroppedImage}
                colorScheme="teal">
                Show Result
              </Button>

              <Button
                className="save-button"
                onClick={handleSave}
                colorScheme="teal">
                Save
              </Button>
            </Flex>
          </Box>
        </>
      )}
      <ImageDialog img={croppedImage} onClose={onClose} />
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
  ReactDOM.render(<ImageCropper initialImage={undefined} handlePhotoChange={(imgSrc) => console.log('Cropped Image:', imgSrc)} />, rootElement);
}

export default ImageCropper;
