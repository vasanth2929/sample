import React, { Component } from 'react';
import { TextField, Box } from '@material-ui/core';
import { getPlaybookCardDetails } from '../../util/promises/playbookcard_details_promise';
import SuggestiveSearch from '../ProgressiveSearch/SuggestiveSearch';
import KeywordInput from '../KeywordInput/KeywordInput';
import { isEmpty } from '../../util/utils';
import './AddCardModal.style.scss';
import { ToggleButton } from '../../basecomponents/ToggleButton/ToggleButton';

const DEFAULT_CLASSNAMES = 'add-story-modal';

class AddCardModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        topic_name: props.selectedTopic.name || '',
        main_topic: props.selectedTopic.mainTopic || '',
        cardTags: [],
      },
      isCreate: false,
      selectedCardTitle: null,
      isSubmitting: false,
      isTest: this.props.isTest || false,
    };
  }

  handleChange = (data, type) => {
    const { formData } = this.state;
    if (type === 'cardTags') {
      const newTags = formData.cardTags;
      newTags.pushdata;
      this.setState({ formData: { ...formData, cardTags: newTags } });
    } else {
      this.setState({ formData: { ...formData, [type]: data } });
    }
  };

  selectTopics = (value) => {
    const { formData } = this.state;
    const selectedType = value.value;
    this.setState({ formData: { ...formData, topic_name: selectedType } });
  };

  onSubmit = (e) => {
    this.setState({ isSubmitting: true });
    e.stopPropagation();
    const { formData } = this.state;
    if (formData.cardTags?.length) {
      formData.cardTags = formData.cardTags
        ?.split(/[,+\n]/gm)
        .map((value) => value.trim())
        .filter((i) => i !== '');
    }
    const { onCreate } = this.props;
    if (onCreate)
      onCreate({ ...formData, isTestCard: this.state.isTest ? 'Y' : 'N' });
  };

  onTargetAccountSelect = async (value) => {
    const selectedCardTitle = value.id;
    const repsonse = await getPlaybookCardDetails(selectedCardTitle);
    this.setState({ selectedStory: repsonse.data, isCreate: false });
  };

  onVerify = () => {
    this.setState({ isSubmitting: true });
    const { onVerify } = this.props;
    if (onVerify) onVerify(this.state.selectedStory);
  };

  createCard = (name) => {
    const { formData } = this.state;
    this.setState({ formData: { ...formData, title: name }, isCreate: true });
  };

  handleKeywordchange = (keywords) => {
    const { formData } = this.state;
    this.setState({ formData: { ...formData, cardTags: keywords } });
  };

  toggleIsTest = (isTest) => {
    this.setState({ isTest });
  };

  render() {
    const { formData, isCreate, isSubmitting } = this.state;
    const { title = '', description = '', cardTags } = formData;
    const isFormValid =
      !isEmpty(title) && (!isEmpty(description) || !isEmpty(cardTags));
    return (
      <div className={DEFAULT_CLASSNAMES}>
        <div className={`${DEFAULT_CLASSNAMES}-form`}>
          <SuggestiveSearch
            placeholder="Enter card title..."
            label="Title"
            onSelect={this.onTargetAccountSelect}
            onCreate={this.createCard}
            InputLabelProps={{ shrink: true }}
          />
          <Box display={'flex'} className="no">
            <p style={{ marginBottom: '0px' }}>Approved</p>
            <ToggleButton
              customeClass="isApprovedToggle"
              value={this.state.isTest}
              handleToggle={this.toggleIsTest}
            />

            <p style={{ marginBottom: '0px' }}>Test</p>
          </Box>
          <TextField
            multiline
            rows={6}
            label="Messaging"
            placeholder="Messaging"
            variant="outlined"
            fullWidth
            onChange={(e) => this.handleChange(e.target.value, 'description')}
            InputLabelProps={{ shrink: true }}
          />
          <KeywordInput
            placeholder="Type/Paste multiple keywords (comma / new line separated)"
            onChange={this.handleKeywordchange}
          />
        </div>
        <div className={`${DEFAULT_CLASSNAMES}-footer`}>
          {isCreate ? (
            <button
              onClick={this.onSubmit}
              disabled={!isFormValid || isSubmitting}
              className="create-btn"
            >
              CREATE
            </button>
          ) : (
            <button
              onClick={this.onVerify}
              disabled={!isFormValid || isSubmitting}
              className="create-btn"
            >
              CREATE
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default AddCardModal;
