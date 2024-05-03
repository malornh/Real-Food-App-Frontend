import React, { Component } from "react";

interface Props {
  setImageSrc: (value: string | null) => void;
}

class ImageUploader extends Component<Props> {
    constructor(props: Props) {
        super(props);
        this.state = {
          imageSrc: null
        };
        this.handleImageUpload = this.handleImageUpload.bind(this);
      }

  handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if the file size exceeds the maximum allowed size (in bytes)
    const maxSize = 2000000; // 2MB
    if (file.size > maxSize) {
      console.log("File too large");
      return;
    }

    // Check if the file type is an image (you can add more specific checks if needed)
    if (!file.type.startsWith("image/")) {
      console.log("Invalid file type");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const { setImageSrc } = this.props;
      setImageSrc(reader.result as string);
      // You can also set the imageSrc directly in the state if needed
      // this.setState({ imageSrc: reader.result as string });
    };

    reader.readAsDataURL(file);
  }

  render() {
    return (
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={this.handleImageUpload}
        />
      </div>
    );
  }
}

export default ImageUploader;




