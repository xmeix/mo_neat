import { useState } from "react";
import "./ImagesInput.scss";

const ImagesInput = ({ label, name, onChange }) => {
  const [images, setImages] = useState([]);

  const handleSelectImages = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const nonDuplicateFiles = selectedFiles.filter(
      (file) => !images.some((img) => img.name === file.name)
    );

    const updatedImages = [...images, ...nonDuplicateFiles];
    setImages(updatedImages);

    if (onChange) {
      onChange({
        target: {
          name: name,
          value: updatedImages,
        },
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = Array.from(e.dataTransfer.files);

    const nonDuplicateFiles = droppedFiles.filter(
      (file) => !images.some((img) => img.name === file.name)
    );

    const updatedImages = [...images, ...nonDuplicateFiles];
    setImages(updatedImages);

    if (onChange) {
      onChange({
        target: {
          name: name,
          value: updatedImages,
        },
      });
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedImages);

    if (onChange) {
      onChange({
        target: {
          name: name,
          value: updatedImages,
        },
      });
    }
  };

  return (
    <div className="images-input-container-wrapper input-group">
      {label && <label className="group-label">{label}</label>}
      <div
        className="images-input-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          name={name}
          multiple
          accept="image/*"
          onChange={handleSelectImages}
          className="images-input"
        />
        <div className="images-input-preview">
          {images.length > 0 ? (
            images.map((image, index) => (
              <div
                key={index}
                className="image-wrapper"
                onClick={() => handleRemoveImage(index)}
                title="Click to remove"
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="image-preview"
                />
              </div>
            ))
          ) : (
            <div className="empty-upload">select or drop images here</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagesInput;
