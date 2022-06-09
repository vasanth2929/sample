import React from 'react';
import ReactDataGrid from 'react-data-grid';

import './styles/ExpertPanelContent.styles.scss';


class BoldHeaderRenderer extends React.PureComponent {
    render() {
        const textStyle = {
            color: '#000',
            fontSize: '1.125em !important',
            marginBottom: '0'
        };
        return (
            <div>
                <p style={textStyle}>{this.props.value}</p>
            </div>
        );
    }
}
class TextFormatter extends React.PureComponent {
    render() {
        const textStyle = {
            color: '#4D4D4D',
            fontSize: '0.875em !important',
            marginBottom: '0'
        };
        return (
            <p className="gridText" style={textStyle} title={this.props.value.displayValue}>{this.props.value.displayValue}</p>
        );
    }
}
class RoleTextFormatter extends React.PureComponent {
    render() {
        const textStyle = {
            color: '#4D4D4D',
            fontSize: '0.875em !important',
            marginBottom: '0'
        };
        // let role;
        const displayValue = this.props.value.displayValue;
        return (
            <p className="gridText" style={textStyle} title={displayValue}>{displayValue}</p>
        );
    }
}
class NumberFormatter extends React.PureComponent {
    render() {
        const textStyle = {
            color: '#4D4D4D',
            fontSize: '0.875em !important',
            marginBottom: '0'
        };
        return (
            <p className="gridText text-right" style={textStyle}>{this.props.value.displayValue}</p>
        );
    }
}
export class ExpertPanelContent extends React.PureComponent {
    constructor(props) {
        super(props); 
            this.gridColumns = [
                {
                    key: 'name',
                    name: 'Name',
                    width: 158,
                    sortable: true,
                    resizable: true,
                    headerRenderer: <BoldHeaderRenderer value="Name" />,
                    formatter: TextFormatter

                },
                {
                    key: 'functionalTeam',
                    name: 'Role',
                    sortable: true,
                    resizable: true,
                    width: 145,
                    headerRenderer: <BoldHeaderRenderer value="Role" />,
                    formatter: RoleTextFormatter

                },
                {
                    key: 'wins',
                    name: 'Wins',
                    sortable: true,
                    resizable: true,
                    width: 95,
                    headerRenderer: <BoldHeaderRenderer value="Wins" />,
                    formatter: NumberFormatter

                },
                {
                    key: 'losses',
                    name: 'Losses',
                    sortable: true,
                    resizable: true,
                    width: 95,
                    headerRenderer: <BoldHeaderRenderer value="Loses" />,
                    formatter: NumberFormatter

                },
                {
                    key: 'noDecisions',
                    name: 'No Decisions',
                    sortable: true,
                    resizable: true,
                    width: 125,
                    headerRenderer: <BoldHeaderRenderer value="No Decision" />,
                    formatter: NumberFormatter

                },
                {
                    key: 'email',
                    name: 'Email',
                    resizable: true,
                    headerRenderer: <BoldHeaderRenderer value="Email" />,
                    formatter: TextFormatter
                }
                
            ];
            const originalRows = (this.props.expertsList || []).map((item) => {                
                return {
                    name: { displayValue: item.name },
                    functionalTeam: { displayValue: item.functionalTeam },
                    wins: {
                        displayValue: item.wins,
                        rawValue: item.wins
                    },
                    losses: {
                        displayValue: item.losses,
                        rawValue: item.losses

                    },
                    noDecisions: {
                        displayValue: item.noDecisions,
                        rawValue: item.noDecisions
                    },
                    email: { displayValue: item.email },
                };
            });
            const rows = originalRows.slice(0);
            this.state = {
            originalRows,
            rows
        };
        this.gridSort = this.gridSort.bind(this);    
        }
        
        componentDidUpdate = (prevProps) => {
            if (prevProps.expertsList !== this.props.expertsList) {
                const originalRows = this.props.expertsList.map((item) => {
                    return {
                        name: { displayValue: item.name },
                        functionalTeam: { displayValue: item.functionalTeam },
                        wins: {
                            displayValue: item.wins,
                            rawValue: item.wins
                        },
                        losses: {
                            displayValue: item.losses,
                            rawValue: item.losses
    
                        },
                        noDecisions: {
                            displayValue: item.noDecisions,
                            rawValue: item.noDecisions
                        },
                        email: { displayValue: item.email },
                    };
                });
                const rows = originalRows.slice(0);
                this.setState({ originalRows, rows });
            }
        }
        rowGetter = (index) => {
            return this.state.rows[index];
        }
    
        gridSort = (sortColumn, sortDirection) => {
            let sortFunction;
            switch (sortColumn) {
                case ('name'):
                    sortFunction = this.alphabeticalSorter(sortColumn, sortDirection);
                    break;
                case ('role'):
                    sortFunction = this.alphabeticalSorter(sortColumn, sortDirection);
                    break;
                case ('wins'):
                    sortFunction = this.numberSorter(sortColumn, sortDirection);
                    break;
                case ('losses'):
                    sortFunction = this.numberSorter(sortColumn, sortDirection);
                    break;
                case ('noDecisions'):
                    sortFunction = this.numberSorter(sortColumn, sortDirection);
                    break;
                case ('email'):
                    sortFunction = this.alphabeticalSorter(sortColumn, sortDirection);
                    break;
                default: break;
            }
            const rows = sortDirection === 'NONE' ? this.state.originalRows.concat() : this.state.rows.concat().sort(sortFunction);
            this.setState({ rows });
        }
        alphabeticalSorter = (column, direction) => {
            const comparer = (a, b) => {
                if (direction === 'ASC') {
                    return (a[column].displayValue.toLowerCase() > b[column].displayValue.toLowerCase()) ? 1 : -1;
                } else if (direction === 'DESC') {
                    return (a[column].displayValue.toLowerCase() < b[column].displayValue.toLowerCase()) ? 1 : -1;
                }
                return 0;
            };
            return comparer;
        }
    
        numberSorter = (column, direction) => {
            const comparer = (a, b) => {
                if (direction === 'ASC') {
                    return (a[column].rawValue - b[column].rawValue);
                } else if (direction === 'DESC') {
                    return (b[column].rawValue - a[column].rawValue);
                }
                return 0;
            };
            return comparer;
        }
    render() {
        return (
            <section className="experts-data-grid">
                {
                (this.props.expertsList || '').length > 0 ?
                <ReactDataGrid
                    columns={this.gridColumns}
                    rowGetter={this.rowGetter}
                    rowsCount={this.state.rows.length}
                    minHeight={((this.state.rows.length * 40) + 40) < 600 ? ((this.state.rows.length * 40) + 40) : 600}
                    rowHeight={40}
                    onGridSort={this.gridSort}
                    rows={this.state.rows} /> 
                    : <p className="card-list-error">No Experts List Found</p>    
                }
            </section>
        );
    }
}
