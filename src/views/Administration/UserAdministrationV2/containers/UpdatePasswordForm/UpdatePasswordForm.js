import React from 'react';
import { Form, actions, Control } from 'react-redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

export class UpdatePasswordFormImpl extends React.PureComponent {
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.selectedUser &&
      this.props.selectedUser !== nextProps.selectedUser
    ) {
      this.props.setFormInitialValues({ ...nextProps.selectedUser });
    }
  }

  onPasswordChange = (event) => {
    const password = event.target.value;
    if (password.length < 8) {
      event.target.setCustomValidity(
        'Password should be minimum 8 characters long.'
      );
    } else {
      event.target.setCustomValidity('');
    }
  };

  onRepeatPasswordChange = (event) => {
    const password = document.getElementById('user-password-update-form').value;
    const repeatPassword = event.target.value;
    if (password !== repeatPassword) {
      event.target.setCustomValidity("Passwords don't match.");
    } else {
      event.target.setCustomValidity('');
    }
  };

  render() {
    return (
      <div className="update-password-form">
        <Form
          model="form.userDetails"
          className="user-update-password-form"
          onSubmit={this.props.handleUpdatePasswordSubmit}
        >
          <div className="form-group">
            <label htmlFor="user-login-name-update-form">
              Login Name (Required):
            </label>
            <Control.text
              id="user-login-name-update-form"
              required
              maxLength="25"
              model=".loginname"
              type="text"
              disabled
              className="form-control login-name-input"
              placeholder="Enter Login Name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="user-repeat-password-update-form">
              Old Password (Required):
            </label>
            <Control.text
              required
              model=".currentPass"
              type="password"
              className="form-control repeat-password-input"
              defaultValue=""
              placeholder="Old Password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="user-password-update-form">
              New Password (Required):
            </label>
            <Control.text
              id="user-password-update-form"
              onChange={this.onPasswordChange}
              required
              maxLength="25"
              model=".password"
              type="password"
              className="form-control password-input"
              defaultValue=""
              placeholder="Enter New Password"
            />
            <p className="small">
              *Password should be minimum 8 characters long
            </p>
          </div>
          <div className="form-group">
            <label htmlFor="user-repeat-password-update-form">
              Repeat New Password (Required):
            </label>
            <Control.text
              id="user-repeat-password-update-form"
              onChange={this.onRepeatPasswordChange}
              required
              maxLength="25"
              model=".repeatpassword"
              type="password"
              className="form-control repeat-password-input"
              defaultValue=""
              placeholder="Repeat New Password"
            />
          </div>
          {this.props.error && (
            <div>
              <p>Password does not confirm to our minimum requirements.</p>
            </div>
          )}
          <div className="form-footer text-right">
            <button type="submit" className="btn btn-primary btn-submit">
              Submit
            </button>
          </div>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { userDetailsForm: state.form.userDetails };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setFormInitialValues: (values) =>
        actions.change('form.userDetails', values),
    },
    dispatch
  );
}

export const UpdatePasswordForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdatePasswordFormImpl);
