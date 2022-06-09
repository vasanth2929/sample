import React from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './styles/ImageSelector.style.scss';

export class ImageSelector extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            src: null,
            crop: {
                aspect: 1,
                width: 90,
                x: 0,
                y: 0
            },
            croppedImageUrl: null,
            selectedFileName: null,
            isUploading: false
        };
        this.selectorInput = React.createRef();
    }

    onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFileName = e.target.files[0].name;
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                this.setState({ src: reader.result, selectedFileName }));
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    onImageLoaded = (image) => {
        this.imageRef = image;
    };

    onCropComplete = (crop, pixelCrop) => {
      this.makeClientCrop(crop, pixelCrop);
    };
  
    onCropChange = (crop) => {
        this.setState({ crop });
    };
    
    getCroppedImg(image, pixelCrop, fileName) {
        const canvas = document.createElement('canvas');
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height,
        );

        return new Promise((resolve, reject) => { // eslint-disable-line
            canvas.toBlob((blob) => {
                if (!blob) {
                    return;
                }
                blob.name = fileName;
                resolve(blob);
            }, 'image/jpeg');
        });
    }

    async makeClientCrop(crop, pixelCrop) {
        if (this.imageRef && crop.width && crop.height) {
        const croppedImageUrl = await this.getCroppedImg(
            this.imageRef,
            pixelCrop,
            this.state.selectedFileName,
        );
        this.setState({ croppedImageUrl });
        }
    }

    handleClearCropper = () => {
        this.setState({ src: null }, () => {
            this.selectorInput.current.value = "";
        });
    }

    handleSaveCropper = () => {
        const timestamp = new Date().toISOString();
        const fileNameSplit = this.state.croppedImageUrl.name.split('.');
        const filename = `${fileNameSplit[0]}-${timestamp}.${fileNameSplit[fileNameSplit.length - 1]}`;
        this.setState({ isUploading: true }, () => this.props.handleFileUpload(this.state.croppedImageUrl, filename));
    }

    render () {
        const { crop, src, isUploading } = this.state;
        return (
            <div className="image-selector-modal-section">
                <div className={src === null ? 'img-cropper empty-cropper' : 'img-cropper'}>
                    {src ? (
                        <ReactCrop
                            src={src}
                            crop={crop}
                            onImageLoaded={this.onImageLoaded}
                            onComplete={this.onCropComplete}
                            onChange={this.onCropChange} />
                    ) : (
                        <React.Fragment>
                            <div className="uploader-mask">
                                <label htmlFor="selector-input">
                                    <i className="material-icons">publish</i><br />
                                    <span>Click to select an Image.</span>
                                </label>
                                <input ref={this.selectorInput} id="selector-input" type="file" accept="image/*" onChange={this.onSelectFile} />
                            </div>
                        </React.Fragment>
                    )}
                </div>
                <div className="d-flex justify-content-center actioners">
                    {isUploading ? <p>Uploading. Please wait...</p> : 
                    <React.Fragment>
                        <button className="btn clear-btn" onClick={this.handleClearCropper} disabled={src === null}>Clear</button>
                        <button className="btn save-btn" onClick={this.handleSaveCropper}>Save</button>
                    </React.Fragment>}
                </div>
            </div>
        );
    }
}
