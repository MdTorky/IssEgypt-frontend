




// import React from 'react'
import './Magazine.css'
import { Icon } from '@iconify/react';
import React, { useState, useRef } from 'react';
import { Document, Page } from '@react-pdf/renderer';
import { Flipped, Flipper } from 'react-flip-toolkit';

const Magazine = () => {
    const pdfUrl = '../../data/Magazine.pdf';

    const [currentPage, setCurrentPage] = useState(1);
    const pdfRef = useRef(null);

    const handleNextPage = () => {
        if (currentPage < pdfRef.current.numPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };


    return (
        <div className="Form">
            <Flipper flipKey={currentPage} style={{ width: '100%', height: '1900px' }}>
                <Flipped flipDirection="horizontal" onFlipEnd={handleNextPage}>
                    <Document file={pdfUrl}>
                        <Page pageNumber={currentPage} style={{ width: '50%', height: '100%' }} />
                    </Document>
                </Flipped>
                <Flipped flipDirection="horizontal" onFlipEnd={handlePreviousPage}>
                    <Document file={pdfUrl}>
                        <Page pageNumber={currentPage + 1} style={{ width: '50%', height: '100%' }} />
                    </Document>
                </Flipped>
            </Flipper>
        </div>
    );
};

export default Magazine
