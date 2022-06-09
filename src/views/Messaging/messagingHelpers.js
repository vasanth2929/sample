export const getCardCountForCompetitor = (_data, status, isMyTest = false) => {
  let data = [..._data];

  if (status === 'final')
    return data.filter(
      (topic) =>
        topic.status === status &&
        topic.isTestCard !== 'Y' &&
        topic.title !== 'Us' &&
        topic.title !== 'None'
    ).length;
  if (status === 'test')
    return data.filter(
      (topic) =>
        topic.status !== 'archived' &&
        topic.isTestCard === 'Y' &&
        topic.title !== 'Us' &&
        topic.title !== 'None'
    ).length;
  return data.filter(
    (topic) =>
      topic.status === status && topic.title !== 'Us' && topic.title !== 'None'
  ).length;
};

export const getCardCount = (_data, status, isMyTest = false) => {
  let data = _data.filter((t) => t.title !== 'None');

  if (status === 'final')
    return data.filter(
      (topic) =>
        topic.status === status &&
        topic.isTestCard !== 'Y' &&
        topic.title !== 'None'
    ).length;
  if (status === 'test')
    return data.filter(
      (topic) =>
        topic.status !== 'archived' &&
        topic.isTestCard === 'Y' &&
        topic.title !== 'None'
    ).length;
  return data.filter(
    (topic) =>
      topic.status === status && topic.title !== 'Us' && topic.title !== 'None'
  ).length;
};
