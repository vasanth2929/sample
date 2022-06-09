import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SearchInput.style.scss';

const DEFAULT_CLASSNAME = 'search-input';

class SearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: props.value ? props.value : '',
      placeholder: this.getPlaceHolder(),
      isHide: this.isHide(),
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tabId !== this.props.tabId) {
      this.setState({ searchText: '',placeholder: this.getPlaceHolder() });
    }
  }

  isHide = () => {
    return location.pathname === '/executive-dashboard';
  };

  getPlaceHolder = () => {
    if (location.pathname === '/smart-survey' || this.props.tabId === 2)
      return 'Search account name';
    else return 'Search cards';
  };

  hadleSearchChange = (searchString) => {
    this.setState({ searchText: searchString });
  };

  submitSearch = (e) => {
    e.preventDefault();
    const { onSearch } = this.props;
    const { searchText } = this.state;
    if (onSearch) onSearch(searchText);
  };

  clearSearch = () => {
    const { onSearch } = this.props;
    this.setState({ searchText: '' });
    if (onSearch) onSearch('');
  };

  render() {
    const { searchText, placeholder, isHide } = this.state;
    const { customClass } = this.props;
    return (
      <>
        {!isHide && (
          <div className={`${DEFAULT_CLASSNAME}-search ${customClass}`}>
            <input
              className={`${DEFAULT_CLASSNAME}-search-question`}
              placeholder={placeholder}
              value={searchText}
              onKeyPress={(e) => e.key === 'Enter' && this.submitSearch(e)}
              onChange={(e) => this.hadleSearchChange(e.target.value)}
            />
            <React.Fragment>
              <span
                title="Search"
                role="button"
                onClick={this.submitSearch}
                className="material-icons search-icons"
              >
                search
              </span>
              {searchText !== '' && (
                <span
                  title="Clear"
                  role="button"
                  onClick={this.clearSearch}
                  className="material-icons search-icons"
                >
                  close
                </span>
              )}
            </React.Fragment>
          </div>
        )}
      </>
    );
  }
}

// Note:- component will submit on enter or clicking the search icon

SearchInput.propTypes = {
  onSearch: PropTypes.func,
  customClass: PropTypes.string,
  tabId: PropTypes.number,
};

export default SearchInput;
