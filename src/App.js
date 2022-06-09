import React, { Suspense, lazy } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { LinkedInPopUp } from 'react-linkedin-login-oauth2';
import { getLoggedInUser } from './util/utils';
import { getNotificationsForUser } from './util/promises/leads_prospects_promise';
import { NotificationBar } from './basecomponents/NotificationBar/NotificationBar';
import { ConversationAnalysis, VoiceOfCustomer } from './tribyl_components';
import { Loader } from './_tribyl/components/_base/Loader/Loader';
import { getCookie } from './util/cookieUtils';
import UploadCSV from './views/Administration/UploadCSV/UploadCSV';
import ScrollUpButton from './components/ScrollUpButton/ScrollUpButton';

const AccountAdministration = lazy(() =>
  import('./views/Administration/AccountAdministration/AccountAdministration')
);
const AccountPurge = lazy(() =>
  import('./views/Administration/AccountPurge/AccountPurge')
);
const AccountResearchTopicAdministration = lazy(() =>
  import(
    './views/Administration/AccountResearchTopicAdministration/AccountResearchTopicAdministration'
  )
);
const CallbackPage = lazy(() => import('./views/CallbackPage/CallbackPage'));
const ConfigurationProperties = lazy(() =>
  import(
    './views/Administration/ConfigurationProperties/ConfigurationProperties'
  )
);
const ConversationDetail = lazy(() =>
  import('./views/ConversationDetail/ConversationDetail')
);
const CRMMappingAdministration = lazy(() =>
  import('./views/CRMMappingAdministration/CRMMappingAdministration')
);
const CustomerAnalytics = lazy(() =>
  import('./views/CustomerAnalytics/CustomerAnalytics')
);
const DealGameTape = lazy(() => import('./views/DealGameTape/DealGameTape'));
const EvaluationQuestionAdmin = lazy(() =>
  import(
    './views/Administration/EvaluationQuestionAdministration/EvaluationQuestionAdmin'
  )
);
const ExecutiveDashboard = lazy(() =>
  import('./views/ExecutiveDashBoard/ExecutiveDashboard')
);
const ShowMeTheMoney = lazy(() =>
  import('./views/ShowMeTheMoney/ShowMetheMoney')
);
const HomePage = lazy(() => import('./views/HomePage'));
const IndustryManagement = lazy(() =>
  import('./views/Administration/IndustryManagement/IndustryManagement')
);
const KeywordManagement = lazy(() =>
  import('./views/Administration/KeywordManagement/KeywordManagement')
);
const Login = lazy(() => import('./views/Login/Login'));
const LoginExpert = lazy(() => import('./views/Login/LoginExpert'));
const Loginpicker = lazy(() =>
  import('./tribyl_components/Loginpicker/Loginpicker')
);
const Logout = lazy(() => import('./views/Logout/Logout'));
const ManageSurvey = lazy(() =>
  import('./views/DealGameTape/component/ManageSurvey/ManageSurvey')
);
const Messaging = lazy(() => import('./views/Messaging/Messaging'));
const MessagingDetail = lazy(() =>
  import('./views/MessagingDetail/MessagingDetail')
);
const MyProfileV2 = lazy(() => import('./views/MyProfileV2/MyProfileV2'));
const OutreachAdministration = lazy(() =>
  import('./views/Administration/OutreachAdministration/OutreachAdministration')
);
const RedirectUri = lazy(() => import('./views/RedirectUri/RedirectUri'));
const SmartSurvey = lazy(() => import('./views/SmartSurvey/SmartSurvey'));
const SplashScreen = lazy(() => import('./views/SplashScreen/SplashScreen'));
const Support = lazy(() => import('./views/Support/Coaching'));
const Survey = lazy(() => import('./views/Survey/Survey'));
const TribylExpertNetwork = lazy(() =>
  import('./tribyl_exper_network/TribylExpertNetwork')
);
const TutorialsAdministration = lazy(() =>
  import('./views/TutorialsAdministration/TutorialsAdministration')
);
const UserProfile = lazy(() =>
  import('./tribyl_exper_network/UserProfile/UserProfile')
);
const UserAdministration = lazy(() =>
  import('./views/Administration/UserAdministration/UserAdministration')
);

class App extends React.Component {
  constructor(props) {
    super();
    this.state = { currentUser: null };
    this.mounted = false;
  }

  componentDidMount() {
    const session = getCookie('jwt');
    if (session) {
      this.getCurrentUser();
    }
  }

  getCurrentUser = async () => {
    this.mounted = true;

    if (localStorage.getItem('user') && this.mounted) {
      const currentUser = getLoggedInUser();
      const resp = await getNotificationsForUser(currentUser.userId);
      const { notificationText, notificationType } = resp?.data[0] || {};

      this.setState({
        notificationType,
        notificationText,
        userId: currentUser.userId,
        currentUser,
      });
    }
  };

  render() {
    const { currentUser } = this.state;

    return (
      <>
        <div style={{ height: '100%' }}>
          {this.state.notificationText && (
            <NotificationBar
              message={this.state.notificationText}
              type={this.state.notificationType}
              onClose={() => this.setState({ notificationText: null })}
            />
          )}
          <Suspense fallback={<Loader />}>
            <Switch>
              <Route
                exact
                path="/"
                render={(props) => (
                  <HomePage {...props} onUserLoad={this.getCurrentUser} />
                )}
              />
              <Route path="/authentication/callback" component={CallbackPage} />
              <Route path="/implicit/callback" component={CallbackPage} />
              <Route
                exact
                path="/admin"
                render={(props) => (
                  <Login {...props} onUserLoad={this.getCurrentUser} />
                )}
              />
              <Route path="/expert" component={LoginExpert} />
              <Route path="/expert/:form" component={LoginExpert} />
              <Route path="/login" component={Loginpicker} />
              <Route path="/expert/linkedin" component={LinkedInPopUp} />
              <Route path="/redirect" component={RedirectUri} />
              <Route exact path="/splash-screen" component={SplashScreen} />
              <Route path="/splash-screen-expert" component={SplashScreen} />
              <Route path="/support-center" component={Support} />
              <Route
                exact
                path="/market-performance"
                component={CustomerAnalytics}
              />
              <Route
                path="/market-performance/:tabIndex"
                component={CustomerAnalytics}
              />
              <Route
                path="/account-research-topic-administration"
                component={AccountResearchTopicAdministration}
              />
              <Route path="/my-profile" component={MyProfileV2} />
              <Route path="/logout" component={Logout} />
              <Route
                path="/customer-voice/:title/:subtitle/:cardId"
                component={VoiceOfCustomer}
              />
              <Route
                path="/customer-voice/:title"
                component={VoiceOfCustomer}
              />
              <Route
                path="/conversation-analysis/:storyId/:cardId"
                component={ConversationAnalysis}
              />
              <Route
                path="/conversation-analysiss/:storyId/:cardId/user/:userId"
                component={ConversationAnalysis}
              />
              <Route path="/expert-network" component={TribylExpertNetwork} />
              <Route
                path="/expert-network-user-profile"
                component={UserProfile}
              />
              <Route path="/survey" component={Survey} />
              <Route
                path="/dealgametape/storyId/:storyId/opptyId/:opptyId"
                component={DealGameTape}
              />
              <Route exact path="/messaging" component={Messaging} />
              <Route
                exact
                path="/messaging/details"
                component={MessagingDetail}
              />
              <Route
                path="/executive-dashboard"
                component={ExecutiveDashboard}
              />
              <Route path="/show-me-the-money" component={ShowMeTheMoney} />
              <Route exact path="/smart-survey" component={SmartSurvey} />
              <Route
                path="/manage-survey/:storyId/:opptyId"
                component={ManageSurvey}
              />
              <Route
                path="/conversation-detail/:storyId"
                component={ConversationDetail}
              />
              {currentUser && currentUser.role === 'ADMIN' && (
                <Switch>
                  <Route
                    path="/tutorials-administration"
                    component={TutorialsAdministration}
                  />
                  <Route
                    path="/crm-mapping-administration"
                    component={CRMMappingAdministration}
                  />
                  <Route
                    path="/outreach-administration"
                    component={OutreachAdministration}
                  />
                  <Route
                    path="/configuration-properties"
                    component={ConfigurationProperties}
                  />
                  <Route
                    path="/industry-management"
                    component={IndustryManagement}
                  />
                  <Route
                    path="/evaluation-questions-admin"
                    component={EvaluationQuestionAdmin}
                  />
                  <Route
                    path="/keyword-management"
                    component={KeywordManagement}
                  />
                  <Route
                    path="/account-administration"
                    component={AccountAdministration}
                  />
                  <Route path="/account-purge" component={AccountPurge} />
                  <Route
                    path="/user-administration"
                    component={UserAdministration}
                  />
                  <Route path="/upload-csv" component={UploadCSV} />
                </Switch>
              )}
              <Route path="*" component={Login} />
            </Switch>
          </Suspense>
          <ScrollUpButton />
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.oidc.user,
});

export default connect(mapStateToProps)(App);
