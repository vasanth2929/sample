import React, { PureComponent } from 'react';
import { isEqual } from 'lodash';
import { ErrorBoundary } from '../../../../components/ErrorBoundary/ErrorBoundary';
import { getLoggedInUser } from '../../../../util/utils';
import './styles/PlaybooksList.style.scss';

const DEFUALT_CLASSNAME = 'messaging-playbook';

export class PlaybooksListV2 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { refs: [] };
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.playbooks, this.props.playbooks)) {
      this.getRefs();
    }
  }

  getRefs = () => {
    const refs = this.props.playbooks.reduce((acc, value) => {
      acc[value.id] = React.createRef();

      return acc;
    }, {});

    this.setState({ refs }, () => this.scrollIntoView());
  };

  scrollIntoView = () => {
    this.state.refs[this.props.selectedPlaybookId].current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  render() {
    const {
      loadingPlaybooks,
      playbooks,
      selectedPlaybookId,
      handleMarketNameEdit,
      loadingTopics,
    } = this.props;
    const { role } = getLoggedInUser();
    return (
      <section className={`${DEFUALT_CLASSNAME}-panel`}>
        <ErrorBoundary>
          {loadingPlaybooks ? (
            <p className="font-weight-bold" style={{ padding: '0.75em 1em' }}>
              Fetching playbooks. Please wait...
            </p>
          ) : playbooks.length === 0 ? (
            <p className="font-weight-bold" style={{ padding: '0.75em 1em' }}>
              No Market
            </p>
          ) : (
            <React.Fragment>
              <div className={`${DEFUALT_CLASSNAME}-panel-title-header`}>
                <p className="font-weight-bold">Select Market</p>
              </div>
              <div className={`${DEFUALT_CLASSNAME}-panel-playbooks-list`}>
                <ul>
                  {playbooks.map((item, key) => (
                    <div
                      className={`d-flex ${loadingTopics ? 'disabled' : ''}`}
                      key={`${item.id}`}
                      ref={this.state.refs[item.id]}
                    >
                      <li
                        key={key}
                        className={`d-flex align-items-center `}
                        onClick={() => this.props.handlePlaybookSelection(item)}
                      >
                        <i
                          className={
                            item.id === selectedPlaybookId
                              ? 'material-icons selected'
                              : `material-icons`
                          }
                        >
                          {item.id === selectedPlaybookId
                            ? 'radio_button_checked'
                            : 'radio_button_unchecked'}
                        </i>
                        <span className="ml-2">{item.name}</span>
                      </li>
                      <div className="status">
                        <span
                          className="material-icons"
                          role="button"
                          onClick={() =>
                            handleMarketNameEdit(item.id, item.name)
                          }
                        >
                          edit
                        </span>
                      </div>
                    </div>
                  ))}
                </ul>
              </div>
            </React.Fragment>
          )}
        </ErrorBoundary>
      </section>
    );
  }
}
