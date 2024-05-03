import React from "react";

interface Props {
  src: string | null;
}

class ImageLoader extends React.Component<Props> {
  render() {
    const { src } = this.props;
    return (
      <>
        {src && <img src={src} alt="Uploaded" style={{ maxWidth: "100%" }} />}
      </>
    );
  }
}

export default ImageLoader;
