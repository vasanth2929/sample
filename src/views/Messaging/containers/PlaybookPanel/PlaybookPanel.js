import React, { PureComponent } from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { selectPlaybook } from '../../../../action/playbookSelectionActions';
import './styles/PlaybookPanel.style.scss';

class PlaybookPanel extends PureComponent {
  formatTopicNameForURL = (topic) => {
    return topic.toLowerCase().replace(/\s/g, '-');
  };

  handleClick = (data) => {
    const { history, selectedPlaybookId, selectedMarketName } = this.props;
    selectPlaybook(data);
    history.push(
      `messaging/details?market_id=${selectedPlaybookId}&market_name=${selectedMarketName}`
    );
  };

  render() {
    const { topic, finalCardCount, archivedCardCount, cardData, testCount } =
      this.props;
    return (
      <Card
        className="messaging-cards"
        onClick={() => this.handleClick(cardData)}
        role="link"
      >
        <Card.Body>
          <Card.Title className="messaging-cards--title">
            <div>{topic}</div>
            <div>
              <span className="material-icons ">keyboard_arrow_right</span>
            </div>
          </Card.Title>
          <Button variant="success" size="sm" style={{ marginBottom: '5px' }}>
            Approved ({finalCardCount})
          </Button>
          <Button
            className="test-c-b"
            size="sm"
            style={{ marginBottom: '5px' }}
          >
            Test ({testCount})
          </Button>
          <Button
            style={{ background: '#ffebea', marginBottom: '5px' }}
            variant="success"
            size="sm"
          >
            Archived ({archivedCardCount})
          </Button>
        </Card.Body>
      </Card>
    );
  }
}

export default withRouter(PlaybookPanel);
