import React, { Component } from 'react';
import { getUserId } from '../../util';
import './TopicPanel.style.scss';

const DEFAULT_CLASSNAME = "topic-panel";


class TopicPanel extends Component {
    onSelect = (data) => {
        const { onSelect } = this.props;
        onSelect(data);
    }

    getCount = (array, status) => {
        if (status !== "") {
            if (status === 'final')
              return (
                array &&
                array.filter(
                  (item) => item.status === status && item.isTestCard !== 'Y'
                ).length
              );
            else if (status === 'test')
              return (
                array &&
                array.filter(
                  (item) =>
                    item.status !== 'archived' && item.isTestCard === 'Y'
                ).length
              );
            else
              return (
                array && array.filter((item) => item.status === status).length
              );
        } 
            return array && array.length;
    }

    render() {
        const { selectedTopic, topicList, status } = this.props;
        const visibleTopicList = topicList.filter(topic => topic.name !== "Partners");

        return (
            <div className={DEFAULT_CLASSNAME}>
                {visibleTopicList && visibleTopicList.map(topic => (
                    <div key={topic.id} onClick={() => this.onSelect(topic)} className={`${DEFAULT_CLASSNAME}-items ${topic.name === selectedTopic.name ? "selected" : ""}`} role="link">
                        {topic.name} ({this.getCount(topic.cards, status)})
                    </div>
                ))
                }
            </div>
        );
    }
}

export default TopicPanel;
