import React from 'react';
import { connect } from 'react-redux';
import { TextBlock } from 'react-placeholder-shimmer';
import { showAlert } from '../../../../../components/MessageModal/MessageModal';
import { KeywordPanel } from '../../containers/KeywordsPanel/KeywordsPanel';
import { TopicKeywordModels } from '../../../../../model/keywordModels/KeywordModels';
import { getKeywordsForObject, updateKeywordsForObject } from '../../../../../util/promises/keywords_management';

class TopicKeywordManagementTabImpl extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { isLoading: props.topicKeywords.length === 0 || false };
    }

    componentDidMount() {
        if (this.props.topicKeywords.length === 0) {
            this.getKeywordsForObject('topic');
        }
    }

    async getKeywordsForObject(selectedObject) {
        TopicKeywordModels.deleteAll();
        const response = await getKeywordsForObject(selectedObject);
        if (response.data && response.data.length > 0) {
            this.setState({ isLoading: false });
            const keywordObjects = response.data.map(keyword =>
                new TopicKeywordModels({ id: `${keyword.objectType}_${keyword.objectId}`, ...keyword }));
                TopicKeywordModels.saveAll(keywordObjects);
        }
    }

    updateKeywordsForObject = (keywords, objectId, objectType) => {
        const payload = {
            keywords,
            objectId,
            objectType
        };
        updateKeywordsForObject(payload).then(() => {
            this.getKeywordsForObject('topic');
        }).catch(() => {
            showAlert('Something went wrong. Please try later.', 'error');
        });
    }

    render() {
        const { isLoading } = this.state;
        const { topicKeywords } = this.props;
        return (
            <section className="topic-keyword-mgmt-tab">
                <div className="row">
                    <div className="col-10">
                        {isLoading ? (
                            [1, 2, 3, 4].map(item => (
                                <div key={item} className="keyword-panel">
                                    <TextBlock textLines={[98, 98, 98, 98]} />
                                </div>
                            ))
                        ) : (
                            topicKeywords.map((item, key) => (
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
    return { topicKeywords: TopicKeywordModels.list().map(item => item.props) };
}

export const TopicKeywordManagementTab = connect(mapStateToProps)(TopicKeywordManagementTabImpl);
