import { get, post } from '../service';

export function getSurveyStats(storyIdList) {
    return get(`getSurveyStats?storyIdList=${storyIdList}`);
}
