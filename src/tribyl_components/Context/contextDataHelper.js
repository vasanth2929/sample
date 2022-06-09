export const filterContextQuestion = (data) => {
  return data.filter(
    (question) =>
      question.questionText &&
      !question.questionText.toLowerCase().includes('partner involved')
  );
};
