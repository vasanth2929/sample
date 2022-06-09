import React from 'react';
import { connect } from 'react-redux';
import { TextBlock } from 'react-placeholder-shimmer';
import { showAlert } from '../../../../../components/MessageModal/MessageModal';
import { KeywordPanel } from '../../containers/KeywordsPanel/KeywordsPanel';
import { PlaybookKeywordModels } from '../../../../../model/keywordModels/KeywordModels';
import { getKeywordsForObject, updateKeywordsForObject } from '../../../../../util/promises/keywords_management';

class PlaybookKeywordManagementTabImpl extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { isLoading: props.playbookKeywords.length === 0 || false };
    }

    componentDidMount() {
        if (this.props.playbookKeywords.length === 0) {
            this.getKeywordsForObject('playbook');
        }
    }

    async getKeywordsForObject(selectedObject) {
        PlaybookKeywordModels.deleteAll();
        const response = await getKeywordsForObject(selectedObject);

        if (response.data && response.data.length > 0) {
            const keywordObjects = response.data.map(keyword =>
                new PlaybookKeywordModels({ id: `${keyword.objectType}_${keyword.objectId}`, ...keyword }));
                PlaybookKeywordModels.saveAll(keywordObjects);
        }

        this.setState({ isLoading: false });
    }

    updateKeywordsForObject = (keywords, objectId, objectType) => {
        const payload = {
            keywords,
            objectId,
            objectType
        };
        updateKeywordsForObject(payload).then(() => {
            this.getKeywordsForObject('playbook');
        }).catch(() => {
            showAlert('Something went wrong. Please try later.', 'error');
        });
    }

    render() {
        const { isLoading } = this.state;
        const { playbookKeywords } = this.props;
        return (
            <section className="playbook-keyword-mgmt-tab">
                <div className="row">
                    <div className="col-10">
                        {isLoading ? (
                            [1, 2, 3, 4].map(item => (
                                <div key={item} className="keyword-panel">
                                    <TextBlock textLines={[98, 98, 98, 98]} />
                                </div>
                            ))
                        ) : (
                            playbookKeywords.map((item, key) => (
                                <div key={key}>
                                    <KeywordPanel
                                        isLoading={isLoading}
                                        objectId={item.objectId}
                                        objectType={item.objectType}
                                        objectName={item.objectName}
                                        keywords={item.keywords}
                                        updateKeywordsForObject={this.updateKeywordsForObject} />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        );
    }
}

function mapStateToProps() {
    return { playbookKeywords: PlaybookKeywordModels.list().map(item => item.props) };
}

export const PlaybookKeywordManagementTab = connect(mapStateToProps)(PlaybookKeywordManagementTabImpl);
