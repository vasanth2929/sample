import React from 'react';
import { CheckBox } from '../../../../basecomponents/CheckBox/CheckBox';

export class EnvironmentFiltersView extends React.Component {
    render() {
        const { readOnly, envCategories, handleEnvSelection } = this.props;
        return (
            <div className="list-wrapper">
                {Object.keys(envCategories).map(key => (
                    <div className="category-container">
                        <p className="cb-section-title">
                            <i className="material-icons">keyboard_arrow_down</i>
                            {key}
                        </p>
                        <ul>
                            {envCategories[key]
                                .map((env, index) => (
                                    <div className={index % 2 === 0 ? "env-row even" : "env-row"}>
                                        <CheckBox
                                            key={env.id.toString()}
                                            id={env.id.toString()}
                                            label={env.appProduct}
                                            disabled={readOnly}
                                            isChecked={env.relatedToAccount === 'Y'}
                                            onChange={() => handleEnvSelection(env)} />
                                    </div>
                                ))}
                        </ul>
                    </div>
                ))}
            </div>
        );
    }
}
