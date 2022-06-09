export const getUserId = () => {
  let user = JSON.parse(localStorage.getItem('user'));
  return user.userId;
};
