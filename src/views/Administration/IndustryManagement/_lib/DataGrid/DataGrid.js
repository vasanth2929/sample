import React from 'react';
import ReactDataGrid from 'react-data-grid';
import './DataGrid.scss';

export class DataGrid extends React.PureComponent {
    constructor(props) {
        super(props);
        const { items } = this.props;
        this.state = { originalRows: items, rows: items.slice(0) };
    }

    componentDidUpdate(prevProps) {
        const { items } = this.props;
        // console.log('tribyl industry table updated !');
        if (items !== prevProps.items) {
            // console.log(items);
            this.setState({ originalRows: items, rows: items.slice(0) });
        }
    }

    componentWillReceiveProps() {
        const { items } = this.props;
        this.setState({ originalRows: items, rows: items.slice(0) });
    }

    rowGetter = index => this.state.rows[index]

    render() {
        const { 
            minHeight, 
            minWidth, 
            gridSort, 
            gridColumns 
        } = this.props;
        const { rows } = this.state;
        return (
            <section className="account-tribyl-industry-exception-data-grid">
                <ReactDataGrid
                    columns={gridColumns}
                    rowGetter={this.rowGetter}
                    rowsCount={rows.length}
                    minHeight={minHeight}
                    minWidth={minWidth}
                    rowHeight={60}
                    onGridSort={gridSort}
                    rows={rows} />
            </section>
        );
    }
}
