import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Button from 'react-bootstrap/Button';

const TableProductHistory = ({ productHistory }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Đảm bảo productHistory là array
    const historyItems = Array.isArray(productHistory) ? productHistory : [];

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = historyItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(historyItems.length / itemsPerPage);

    const handleClickPage = (number) => {
        setCurrentPage(number);
    };

    const getPaginationItems = () => {
        let startPage, endPage;

        if (totalPages <= 3) {
            startPage = 1;
            endPage = totalPages;
        } else if (currentPage === 1) {
            startPage = 1;
            endPage = 3;
        } else if (currentPage === totalPages) {
            startPage = totalPages - 2;
            endPage = totalPages;
        } else {
            startPage = currentPage - 1;
            endPage = currentPage + 1;
        }

        return Array.from({ length: (endPage - startPage + 1) }, (_, i) => startPage + i);
    };

    return (
        <>
            <Table striped bordered hover className='text-center'>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Thời gian</th>
                        <th>Ghi chú</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems && currentItems.length > 0 ? (
                        currentItems.map((item, index) => (
                            <tr key={`table-history-${item.id}`}>
                                <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                <td>{new Date(item.createdAt).toLocaleString()}</td>
                                <td>{item.note}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3}>Không tìm thấy lịch sử</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {historyItems.length > 0 && (
                <div className='d-flex justify-content-center'>
                    <Pagination>
                        <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
                        {getPaginationItems().map((page) => (
                            <Pagination.Item
                                key={page}
                                active={page === currentPage}
                                onClick={() => handleClickPage(page)}
                            >
                                {page}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
                        <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                </div>
            )}
        </>
    );
};

export default TableProductHistory;