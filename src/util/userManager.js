import { createUserManager } from 'redux-oidc';

const origin = document.location.origin;

let clientData = { clientId: '', authority: '' };

const config = JSON.parse(process.env.CLIENT_CONFIG);
Object.keys(config).map(
  (client) => origin.includes(client) && (clientData = config[client])
);

const userManagerConfig = {
  client_id: clientData.clientId,
  redirect_uri: `${origin}/authentication/callback`,
  response_type: 'code',
  post_logout_redirect_uri: `${origin}/`,
  scope: 'openid profile',
  authority: clientData.authority,
  silent_redirect_uri: `${origin}/authentication/silent_callback`,
  end_session_endpoint: `${origin}/`,
  automaticSilentRenew: true,
  loadUserInfo: true,
  checkSessionInterval: 3600,
};

const userManager = createUserManager(userManagerConfig);

export default userManager;
