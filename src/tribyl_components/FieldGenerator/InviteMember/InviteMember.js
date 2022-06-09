import React from 'react';
import PropTypes from 'prop-types';
import './InviteMember.style.scss';

function InviteMember({ deleteRow, inviteList }) {
  return inviteList.map((val, idx) => {
    const firstName = `firstName-${idx}`;
    const lastName = `lastName-${idx}`;
    const email = `email-${idx}`;

    return (
      <tr key={val.index}>
        <td>
          <input
            type="text"
            placeholder="First Name"
            defaultValue={val.firstName}
            name="firstName"
            data-id={idx}
            id={firstName}
            className="form-control"
            disabled={val.disabled ? true : false}
          />
        </td>
        <td>
          <input
            type="text"
            placeholder="Last Name"
            defaultValue={val.lastName}
            name="lastName"
            data-id={idx}
            id={lastName}
            className="form-control"
            disabled={val.disabled ? true : false}
          />
        </td>
        <td>
          <input
            type="text"
            placeholder="Email address"
            defaultValue={val.email}
            name="email"
            data-id={idx}
            id={email}
            className="form-control"
            disabled={val.disabled ? true : false}
          />
        </td>
        <td style={{ width: '10px' }}>
          {
            /* idx ===0 ? <button title="Add" onClick= {()=>props.add()} type="button" className="invite_add"> <span className="material-icons add">
                add
                </span></button> : */
            idx > 1 ? (
              <button
                title="Remove"
                onClick={() => deleteRow(val)}
                type="button"
                className="invite_remove"
              >
                <span className="material-icons remove">remove</span>
              </button>
            ) : null
          }
        </td>
      </tr>
    );
  });
}

InviteMember.propTypes = {
  deleteRow: PropTypes.func,
  inviteList: PropTypes.array,
};

export default InviteMember;
