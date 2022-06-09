/* eslint-disable no-useless-constructor */
import { BaseModel } from "../BaseModel";

export class StoryboardModel extends BaseModel {
  static resource = "storyboard";
  constructor(properties) {
    super(properties);
  }

  static updateCardDetail(data) {
    const storyCardInstance = this.last();
    if (!storyCardInstance) return;
    const story = JSON.parse(JSON.stringify(storyCardInstance.props));
    story.opptyPlanRec.topics.forEach((topic) => {
      const cardIndex = topic.cardDetails.findIndex(i => i.cardId === data.cardId);
      if (cardIndex !== -1) {
        topic.cardDetails[cardIndex] = data;
      }
    });
    new StoryboardModel(storyCardInstance).$save();
  }
}
