import React from 'react';
import AutosizeInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import { ErrorBoundary } from '../../../../../components/ErrorBoundary/ErrorBoundary';

export class KeywordPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      objectId: props.objectId,
      objectType: props.objectType,
      objectName: props.objectName,
      keywords: props.keywords || [],
      editMode: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.objectName !== nextProps.objectName ||
      this.props.keywords !== nextProps.keywords ||
      this.props.objectId !== nextProps.objectId ||
      this.props.objectType !== nextProps.objectTye
    ) {
      this.setState({
        objectId: nextProps.objectId,
        objectType: nextProps.objectType,
        objectName: nextProps.objectName,
        keywords: nextProps.keywords,
      });
    }
  }

  onTagRemove = (index) => {
    const originalKeywords = this.state.keywords;
    originalKeywords.splice(index, 1);
    this.setState({ keywords: [...originalKeywords] });
  };

  handleTagAdd = (keywords) => {
    const originalKeywords = this.state.keywords;
    keywords
      .slice(originalKeywords.length)
      .forEach((item) =>
        originalKeywords.push({ id: 0, value: item, status: 'active' })
      );
    this.setState({ keywords: [...originalKeywords] });
  };

  handleKeywordEdit = () => {
    this.setState({ editMode: !this.state.editMode });
  };

  render() {
    const { objectId, objectType, objectName, keywords, editMode } = this.state;
    const words = keywords ? keywords.map((item) => item.value) : [];
    return (
      <ErrorBoundary>
        <section className="keyword-panel">
          <div className="row">
            <div className="col-11">
              <div className="object-title">
                <p>{objectName}</p>
              </div>
              <AutosizeInput
                className={
                  !editMode
                    ? 'react-tagsinput react-tagsinput-disabled'
                    : 'react-tagsinput'
                }
                type="text"
                value={words}
                disabled={!editMode}
                onChange={this.handleTagAdd}
                tagProps={{
                  className: 'react-tagsinput-tag',
                  placeholder: 'Add a keyword',
                  onRemove: this.onTagRemove,
                }}
              />
            </div>
            <div className="col action-col">
              <div
                className="edit-keyword"
                role="button"
                onClick={this.handleKeywordEdit}
              >
                <i className="material-icons">{editMode ? 'close' : 'edit'}</i>
                &nbsp;&nbsp;<span>{editMode ? 'Cancel' : 'Edit'}</span>
              </div>
              {editMode && (
                <button
                  className="btn save-keyword-btn"
                  onClick={() =>
                    this.props.updateKeywordsForObject(
                      keywords,
                      objectId,
                      objectType
                    )
                  }
                >
                  <span>Save</span>
                </button>
              )}
            </div>
          </div>
        </section>
      </ErrorBoundary>
    );
  }
}
