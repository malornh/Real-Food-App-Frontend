export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid CORS issues when downloading images from external sources
    image.src = url;
  });

interface Crop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const getCroppedImg = async (imageSrc: string, crop: Crop, rotation = 0): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx!.translate(safeArea / 2, safeArea / 2);
  ctx!.rotate((rotation * Math.PI) / 180);
  ctx!.translate(-safeArea / 2, -safeArea / 2);

  ctx!.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );
  const data = ctx!.getImageData(0, 0, safeArea, safeArea);

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx!.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - crop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - crop.y)
  );

  // Convert canvas data to Base64 string
  return canvas.toDataURL('image/png');
};

export const getRotatedImage = async (imageSrc: string, rotation: number): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const orientationChanged = rotation === 90 || rotation === -90 || rotation === 270;
  canvas.width = orientationChanged ? image.height : image.width;
  canvas.height = orientationChanged ? image.width : image.height;

  ctx!.translate(canvas.width / 2, canvas.height / 2);
  ctx!.rotate((rotation * Math.PI) / 180);
  ctx!.translate(-canvas.width / 2, -canvas.height / 2);

  ctx!.drawImage(image, 0, 0);

  // Convert canvas data to Base64 string
  return canvas.toDataURL('image/jpeg');
};
