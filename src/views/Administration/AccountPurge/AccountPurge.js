/* eslint-disable no-underscore-dangle,no-new */
import React, { PureComponent } from 'react';
import { actions } from 'react-redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TextBlock } from 'react-placeholder-shimmer';

// import sub-components
import { MainPanel } from '../../../basecomponents/MainPanel/MainPanel';
import { ErrorBoundary } from '../../../components/ErrorBoundary/ErrorBoundary';
import { Icons } from '../../../constants/general';

import './AccountPurge.style.scss';

// import data

class AccountPurge extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            selectedAccountId: null,
            totalfields : 1
        };
    }


    handleHeaderIconClick = (action) => {
        switch (action) {
            default:
                break;
        }
    };

    Addmore=()=>{
        const {totalfields} = this.state;
        this.setState({totalfields: totalfields+1})
    }

    handleRemove=(id)=>{
        const element = document.getElementById("field-"+id);
        element.remove();
    }

    renderRows=()=>{
        const {totalfields} = this.state;
        let field = [];
        for(let i=1;i<totalfields;i++){
            field.push( <div className="account-input" id={`field-${i}`}>
            <input name="account[]" placeholder="Enter email" className="account-input" />
            <span className="material-icons" role="button" title="remove" onClick={()=>this.handleRemove(i)}>remove</span>
       </div>);
        }
        return field;
    }


    render() {
        
        return (
            <ErrorBoundary>
                <div className="account-purge-view">
                    <MainPanel
                        viewName="Account Purge Administration" 
                        icons={[Icons.MAINMENU]}
                        handleIconClick={this.handleHeaderIconClick}
                        viewHeader={
                            <div className="container">
                                <div className="title-label row">
                                    <div className="col-8">
                                        <p>Account Purge</p>
                                    </div>
                                </div>
                            </div>
                        }>
                        <div className="purge-container">
                            <span className="material-icons" title="Add new"  role="button" onClick={this.Addmore}>add</span>
                            <div className="account-input">
                                    <input name="account[]" placeholder="Enter email" className="account-input" />
                            </div>
                                {this.renderRows().map(i=> i)}
                        <div className="account-footer">
                           <div role="button" type="submit" className="purge-button">Purge</div>
                        </div>
                        </div>
                    </MainPanel>
                </div>
            </ErrorBoundary>
        );
    }
}


export default AccountPurge;
