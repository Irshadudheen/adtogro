import React, { useRef, useState, useEffect } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

const ImageCropper = ({ updateAvatarCallback }) => {
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [error, setError] = useState("");
  const [croppedImageUrl, setCroppedImageUrl] = useState("");
  const [showCropInterface, setShowCropInterface] = useState(false);
  const fileInputRef = useRef(null);

  // Function to set canvas preview and generate the data URL
  const setCanvasPreview = (image, canvas, crop) => {
    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to the desired output size
    canvas.width = 150;
    canvas.height = 150;

    // Draw the cropped image onto the canvas
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return canvas.toDataURL();
  };

  const onSelectFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new Image();
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;

      imageElement.addEventListener("load", (e) => {
        if (error) setError("");
        const { naturalWidth, naturalHeight } = e.currentTarget;
        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
          setError("Image must be at least 150 x 150 pixels.");
          return setImgSrc("");
        }
      });
      setImgSrc(imageUrl);
      setShowCropInterface(true);
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent > 90 ? 90 : cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  const handleCropImage = (e) => {
    e.preventDefault();
    if (!imgRef.current || !crop) return;

    const dataUrl = setCanvasPreview(
      imgRef.current,
      previewCanvasRef.current,
      convertToPixelCrop(
        crop,
        imgRef.current.width,
        imgRef.current.height
      )
    );

    setCroppedImageUrl(dataUrl);
    // If a callback was provided, send the data URL up
    if (updateAvatarCallback) {
      updateAvatarCallback(dataUrl);
    }
    
    setShowCropInterface(false);
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const cancelCrop = () => {
    setShowCropInterface(false);
    // Keep the existing cropped image if available
  };

  const resetImage = () => {
    setCroppedImageUrl("");
    setImgSrc("");
    setShowCropInterface(false);
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="image-cropper-container">
      {/* Company avatar display at the top */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "1.5rem" 
      }}>
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.25rem',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            Advertisement Image *
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <button
              type="button"
              onClick={handleBrowseClick}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              Browse Image
            </button>
            {croppedImageUrl && (
              <button
                type="button"
                onClick={resetImage}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
              >
                Reset
              </button>
            )}
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              {croppedImageUrl ? 'Image selected' : 'No file selected'}
            </span>
          </div>
          <p style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            marginTop: '0.5rem'
          }}>
            Recommended size: 1200×1200 pixels (1:1 ratio)
          </p>
        </div>

        {/* Avatar preview */}
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid #e5e7eb',
          backgroundColor: '#f3f4f6',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {croppedImageUrl ? (
            <img
              src={croppedImageUrl}
              alt="Company Avatar"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div style={{
              color: '#9ca3af',
              fontSize: '0.75rem',
              textAlign: 'center',
              padding: '0.5rem'
            }}>
              Company Logo
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        onChange={onSelectFile}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />

      {error && (
        <div style={{
          padding: '0.5rem',
          backgroundColor: '#fee2e2',
          color: '#b91c1c',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {/* Cropping interface - shown as a modal overlay */}
      {showCropInterface && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            maxWidth: '90%',
            maxHeight: '90%',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              alignSelf: 'flex-start'
            }}>
              Crop Your Image
            </h3>
            
            <div style={{ 
              maxHeight: '60vh', 
              overflow: 'hidden', 
              marginBottom: '1rem'
            }}>
              <ReactCrop
                crop={crop}
                onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
                circularCrop
                keepSelection
                aspect={ASPECT_RATIO}
                minWidth={MIN_DIMENSION}
              >
                <img
                  ref={imgRef}
                  src={imgSrc}
                  alt="Upload"
                  style={{ maxHeight: "60vh"}}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              marginTop: '1rem' 
            }}>
              <button
                onClick={cancelCrop}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCropImage}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'black',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden canvas for cropping */}
      <canvas
        ref={previewCanvasRef}
        style={{
          display: "none",
        }}
      />
    </div>
  );
};

export default ImageCropper;