import React from 'react';
import PropTypes from 'prop-types';
import "./PaginationManage.style.scss";

function PaginationManage({
 postPerPage, totalPost, paginate, currentPage 
}) {
    const pageNumbers = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= Math.ceil(totalPost / postPerPage); i++) {
        pageNumbers.push(i);
    }
    /* console.log(">>>totalPost", totalPost,postPerPage,pageNumbers); */

    return (
        <nav>
            <ul className="pagination">
                <span>Pages </span>
                {pageNumbers.map(number => 
                    (<li key={number} className="page-item">
                        <span role="button" onClick={() => paginate(number)} className={`page-link ${number === currentPage ? "selected" : ""}`}>
                            {number}
                        </span>
                     </li>))}
            </ul>
        </nav>
    );
}

PaginationManage.propTypes = {
    postPerPage: PropTypes.number,
    totalPost: PropTypes.number,
    paginate: PropTypes.func,
    currentPage: PropTypes.number,
};

export default PaginationManage;
