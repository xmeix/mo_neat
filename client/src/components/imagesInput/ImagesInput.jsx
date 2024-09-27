import { useEffect, useState } from "react";
import "./ImagesInput.scss";
import { MEDIA_BASE_URL } from "../../store/apiCalls/apiService";

const ImagesInput = ({ label, name, onChange, error, imagesValue = [] }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (imagesValue.length > 0) {
      setImages(imagesValue);
    }
  }, [imagesValue]);

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
  const isFile = (image) => {
    return image instanceof File;
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
        className={
          error
            ? "images-input-container error-border"
            : "images-input-container"
        }
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
                  src={
                    isFile(image)
                      ? URL.createObjectURL(image)
                      : MEDIA_BASE_URL + image
                  }
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
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default ImagesInput;
