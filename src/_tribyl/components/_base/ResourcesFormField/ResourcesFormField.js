import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './styles/ResourcesFormField.style.scss';
import { uploadFile } from '../../../../util/promises/playbooks_promise';
import Collapsible from '../../../../basecomponents/Collapsible/Collapsible';

export class ResourcesFormField extends PureComponent {
  state = {
    url: '',
    urlSet: this.props.urlSet || [],
    file: { name: 'Choose a file' },
    fileSet: this.props.fileSet || [],
  };

  setUrl = (elem) => {
    elem.preventDefault();
    const { url, urlSet } = this.state;
    const newUrls = Array.from(urlSet);
    const { setUrl } = this.props;
    newUrls.push(url);
    if (url.length > 0) {
      this.setState({ url: '', urlSet: newUrls }, () => {
        if (setUrl) setUrl(newUrls);
      });
    }
  };

  unsetUrl = (index) => {
    const { setUrl } = this.props;
    const { urlSet } = this.state;
    const newUrls = Array.from(urlSet).filter((_, i) => i !== index);
    this.setState({ urlSet: newUrls }, () => {
      if (setUrl) setUrl(newUrls);
    });
  };

  handleFileSelection = (e) => {
    this.setState({ file: e.target.files[0] });
  };

  uploadFile = (elem) => {
    elem.preventDefault();
    const { setFile } = this.props;
    const { file } = this.state;
    if (file) {
      uploadFile(file).then((res) => {
        const { fileSet } = this.state;
        const newFileSet = Array.from(fileSet);
        const { location, name } = res.data;
        newFileSet.push({ location, name });
        this.setState({ fileSet: newFileSet, file: { name: 'Choose a file' } });
        if (setFile) setFile(newFileSet);
      });
    }
  };

  removeFile = (index) => {
    const { setFile, fileInputId } = this.props;
    const { fileSet } = this.state;
    // ANCHOR remove the selected file
    const newFileSet = Array.from(fileSet).filter((_, i) => i !== index);
    this.setState(
      { fileSet: newFileSet, file: { name: 'Choose a file' } },
      () => {
        document.getElementById(`${fileInputId}`).value = '';
        if (setFile) setFile(newFileSet);
      }
    );
  };

  renderResources = (resource, type) => {
    // const noncollapsibleArray = dealResource.length > 0 ? dealResource[0] : [];
    // const collapsibleArray = dealResource.filter((item, index) => index !== 0) || [];
    const collapsibleArray = resource;
    return (
      <React.Fragment>
        {type === 'file' ? (
          <Collapsible
            title={
              <label className="heading">File {`(${resource.length})`}</label>
            }
            // noCollapsible={noncollapsibleArray.length > 0 ? (
            //     <p className="data-pill">
            //         {/* ANCHOR Parse name of the file */}
            //         <span>{noncollapsibleArray.name}</span>
            //         <i className="material-icons" role="button" onClick={() => this.removeFile(index)}>close</i>
            //     </p>) : <div />
            // }
            // ANCHOR  collapsible content
            Collapsible={collapsibleArray.map((item, index) => (
              <p className="data-pill">
                {/* ANCHOR Parse name of the file */}
                <span>{item.name}</span>
                <i
                  className="material-icons"
                  role="button"
                  onClick={() => this.removeFile(index)}
                >
                  close
                </i>
              </p>
            ))}
          />
        ) : (
          <Collapsible
            title={
              <label className="heading">Urls {` (${resource.length})`}</label>
            }
            // noCollapsible={noncollapsibleArray.length > 0 ? (
            //     <div className="d-flex justify-content-end pt-2">
            //         <p
            //             className="mr-auto description link">
            //             <a href={noncollapsibleArray.indexOf('http') > -1 ? noncollapsibleArray : `https://${noncollapsibleArray}`} target="_blank" rel="noopener noreferrer">{noncollapsibleArray}</a>
            //         </p>
            //         {<div className="counter-pill view-counter-pill">{`${Math.floor(Math.random() * (50 - 10)) + 10} Views`}</div>}
            //         {<div className="counter-pill match-counter-pill">{`${Math.floor(Math.random() * (50 - 10)) + 10} Matches`}</div>}
            //     </div>) : <div />
            // }
            // ANCHOR collapsible content
            Collapsible={collapsibleArray.map((item, index) => (
              <p className="data-pill">
                <span>{item}</span>
                <i
                  className="material-icons"
                  role="button"
                  onClick={() => this.unsetUrl(index)}
                >
                  close
                </i>
              </p>
            ))}
          />
        )}
      </React.Fragment>
    );
  };

  render() {
    const { url, urlSet, file, fileSet } = this.state;
    const { id, className, label, fileInputId } = this.props;
    return (
      <section className={`resources-form-field ${className}`} id={id}>
        <label>{label}</label>
        <div className="resource-field-body">
          <div className="form-group d-flex align-items-center">
            <label className="sub-label">URL</label>
            <input
              type="text"
              className="form-control"
              value={url}
              onChange={(e) => this.setState({ url: e.target.value })}
            />
            <button
              className="btn save-btn save-url-btn"
              onClick={(e) => this.setUrl(e)}
              title="Add URL"
            >
              <i className="material-icons">add</i>
            </button>
          </div>
          <div className="data-pill-section">
            {this.renderResources(urlSet, 'url')}
            {/* {urlSet.length > 0 &&
                            urlSet.map((item, index) => (
                                <p className="data-pill">
                                    <span>{item}</span>
                                    <i className="material-icons" role="button" onClick={() => this.unsetUrl(index)}>close</i>
                                </p>
                            ))
                        } */}
          </div>
          <div className="form-group d-flex align-items-center">
            <label className="sub-label">File</label>
            <input
              type="file"
              id={fileInputId}
              className="custom-file-input"
              onChange={(e) => this.handleFileSelection(e)}
            />
            <label className="file-label" htmlFor={fileInputId}>
              {file.name}
            </label>
            <button
              className="btn save-btn save-file-btn"
              onClick={(e) => this.uploadFile(e)}
              title="Upload file"
            >
              <i className="material-icons">cloud_upload</i>
            </button>
          </div>
          <div className="data-pill-section">
            {this.renderResources(fileSet, 'file')}
            {
              // fileSet.length > 0 &&
              //     fileSet.map((item, index) => (
              //         <p className="data-pill">
              //             {/* ANCHOR Parse name of the file */}
              //             <span>{item.name}</span>
              //             <i className="material-icons" role="button" onClick={() => this.removeFile(index)}>close</i>
              //         </p>
              //     ))
            }
          </div>
        </div>
      </section>
    );
  }
}

ResourcesFormField.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  fileInputId: PropTypes.string,
};

ResourcesFormField.defaultProps = {
  id: '',
  className: '',
  label: 'Resources',
  fileInputId: 'custom-file-input',
};
