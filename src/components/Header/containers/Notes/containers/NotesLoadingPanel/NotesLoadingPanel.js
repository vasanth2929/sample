import React, { PureComponent } from 'react';
import { TextBlock } from 'react-placeholder-shimmer';
import notesDoc from '../../../../../../assets/iconsV2/notes-doc-icon.png';
import avatar from '../../../../../../assets/images/avatar.png';
import './styles/NotesLoadingPanel.style.scss';

export class NotesLoadingPanel extends PureComponent {
    render() {
        return (
            <section className="notes-loading-panel" name={`${this.props.item}_key`}>
                <div className="row">
                    <div className="col-6">
                        <div className="text-left d-flex">
                            <img src={notesDoc} />
                            <TextBlock textLines={[100, 60]} />
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="d-flex align-items-center justify-content-end profiles" style={{ height: '100%' }}>
                            <img height="24" width="24" src={avatar} />
                            <img height="24" width="24" src={avatar} />
                            <img height="24" width="24" src={avatar} />
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
