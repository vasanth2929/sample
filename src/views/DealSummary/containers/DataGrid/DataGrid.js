import React from 'react';
import ReactDataGrid from 'react-data-grid';

import './styles/DataGrid.styles.scss';

export class DataGrid extends React.PureComponent {
    constructor(props) {
        super(props);
        const { items, onRowSelect } = this.props;
        const rows = items.slice(0);
        const selectedRow = rows[0];
        this.state = {
            rows,
            originalRows: items,
            selectedIndexes: [0]
        };
        if (onRowSelect) onRowSelect(selectedRow.id);
    }

    componentWillReceiveProps() {
        const { items } = this.props;
        this.setState({ originalRows: items, rows: items.slice(0) });
    }

    rowGetter = index => this.state.rows[index]


    onRowsSelected = (rows) => {
        const { onRowSelect } = this.props;
        const selectedRow = rows[0];
        this.setState(
            { selectedIndexes: [selectedRow.rowIdx] },
            () => typeof onRowSelect === 'function' && onRowSelect(selectedRow.row.id)
        );
    };

    onRowsDeselected = () => {
        this.setState({ selectedIndexes: [] });
    };

    render() {
        const {
            minHeight,
            minWidth,
            gridSort,
            gridColumns,
            onRowSelect
        } = this.props;
        const { rows, selectedIndexes } = this.state;
        return (
            <section className="deal-summary-data-grid">
                <ReactDataGrid
                    columns={gridColumns}
                    rowGetter={this.rowGetter}
                    rowsCount={rows.length}
                    minHeight={minHeight}
                    minWidth={minWidth}
                    rowHeight={60}
                    onGridSort={gridSort}
                    rows={rows}
                    enableCellAutoFocus={false}
                    rowSelection={
                        typeof onRowSelect === 'function' && {
                            showCheckbox: true,
                            enableShiftSelect: true,
                            onRowsSelected: this.onRowsSelected,
                            onRowsDeselected: this.onRowsDeselected,
                            selectBy: { indexes: selectedIndexes }
                        }} />
            </section>
        );
    }
}
