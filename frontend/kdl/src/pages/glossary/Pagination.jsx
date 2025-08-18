import React from 'react';
import triangle_table from '../../buttons/table-name-tringle.svg';

function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    // Вычисление видимых номеров страниц
    const getVisiblePages = () => {
        if (totalPages <= 5) return [...Array(totalPages).keys()].map(n => n + 1);

        if (currentPage <= 3) return [1, 2, 3, 4, 5];
        if (currentPage >= totalPages - 2)
            return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];

        return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="pagination">
            <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>⏮️</button>
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                <img src={triangle_table}
                     alt="Toggle"
                     className='pag-btn-icon-left'
                />
            </button>

            {visiblePages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={currentPage === page ? 'active-page' : ''}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <img src={triangle_table}
                     alt="Toggle"
                     className='pag-btn-icon-right'
                />
            </button>
            <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
            >
                ⏭️
            </button>
        </div>
    );
}

export default Pagination;