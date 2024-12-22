import React from 'react'
import { useEffect, useState } from 'react';
import { useFormsContext } from '../../hooks/useFormContext'
import * as XLSX from 'xlsx';
import { utils } from 'xlsx';
import JSZip from 'jszip';  // Import JSZip
import Loader from '../Loader/Loader'
import { saveAs } from 'file-saver';
import { Icon } from '@iconify/react/dist/iconify.js';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import { faFileExcel, faFileZipper } from '@fortawesome/free-solid-svg-icons';

const ProductsData = ({ language, languageText, api, darkMode }) => {
    const { products = [], transactions = [], dispatch } = useFormsContext();
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('');
    const [combinedData, setCombinedData] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${api}/api/product`);

                if (!response.ok) {
                    console.error(
                        `Error fetching suggestions. Status: ${response.status}, ${response.statusText}`
                    );
                    return;
                }

                const data = await response.json();

                dispatch({
                    type: "SET_ITEM",
                    collection: "products",
                    payload: data,
                });


                const transactionResponse = await fetch(`${api}/api/transaction`)
                if (!transactionResponse.ok) {
                    console.error(
                        `Error fetching suggestions. Status: ${transactionResponse.status}, ${transactionResponse.statusText}`
                    );
                    return;
                }

                const transactionData = await transactionResponse.json()
                dispatch({
                    type: 'SET_ITEM',
                    collection: "transactions",
                    payload: transactionData
                })

                const joinedData = transactionData.map((transaction) => {
                    const matchingProduct = data.find(
                        (product) => product.productId === products._id
                    );
                    return {
                        ...transaction,
                        product: matchingProduct || {},
                    };
                });

                setCombinedData(joinedData);


                setLoading(false);
            } catch (error) {
                console.error("An error occurred while fetching data:", error);
            }
        };
        fetchData();
    }, [api, dispatch]);


    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        const sortedData = [...combinedData].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'asc' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        setCombinedData(sortedData);
    };

    const filterLength = combinedData.length;

    const filteredData = combinedData.filter((item) => {
        const searchRegex = new RegExp(searchTerm, 'i');
        return (
            searchRegex.test(item.buyerName) ||
            searchRegex.test(item.buyerEmail) ||
            searchRegex.test(item.buyerPhone) ||
            searchRegex.test(item.buyerAddress) ||
            searchRegex.test(item.productSize) ||
            searchRegex.test(item.productQunatity)

        );
    });



    const handleDownloadExcel = () => {
        const tableData = combinedData.map(item => ({
            Name: item.buyerName,
            Matric: item.buyerMatric,
            Email: item.buyerEmail,
            Phone: item.buyerPhone,
            Product: item.product.pTitle,
            Quantity: item.productQuantity,
            Size: item.productSize,
            Price: item.productQuantity * (item.product.pPrice || 0),
            Address: item.buyerAddress,
            Proof: item.proof,
        }));

        const worksheet = XLSX.utils.json_to_sheet(tableData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Products_Transactions");
        XLSX.writeFile(workbook, "Products_Transactions.xlsx");
    };

    const handleDownloadAllProofPictures = async () => {
        const zip = new JSZip();
        const folder = zip.folder("Proof_Images");
        const imagePromises = combinedData.map(async (item) => {
            const response = await fetch(item.proof);
            if (response.ok) {
                const blob = await response.blob();
                folder.file(`${item._id}.jpg`, blob);
            }
        });

        try {
            await Promise.all(imagePromises);
            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, "Proof_Images.zip");
        } catch (error) {
            console.error("Error downloading proof images:", error);
        }
    };


    const handleStatusChange = async ({ item, status }) => {
        try {
            const response = await fetch(`${api}/api/transaction/${item}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ transactionStatus: status }),
            });

            if (!response.ok) {
                console.error(`Error updating form status. Status: ${response.status}, ${response.statusText}`);
                return;
            }

            // Update the context
            dispatch({
                type: 'UPDATE_ITEM',
                collection: 'transactions',
                payload: { id: item, changes: { transactionStatus: status } },
            });

            // Update the combinedData state
            setCombinedData(prevData =>
                prevData.map(transaction =>
                    transaction._id === item
                        ? { ...transaction, transactionStatus: status }
                        : transaction
                )
            );

            // Display success message
            toast.success(`${languageText.statusChanged}`, {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: darkMode ? "dark" : "colored",
                style: {
                    fontFamily: language === 'ar' ?
                        'Noto Kufi Arabic, sans-serif' :
                        'Poppins, sans-serif',
                },
            });

        } catch (error) {
            console.error('An error occurred while updating form status:', error);
        }
    };



    const handleUpdateAllStatus = async (status) => {
        try {
            const response = await fetch(`${api}/api/transaction/t/updateAll`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                throw new Error(`Error updating all transactions. Status: ${response.status}`);
            }

            // Update all transactions in context
            const updatedTransactions = transactions.map(transaction => ({
                ...transaction,
                transactionStatus: status
            }));

            dispatch({
                type: 'SET_ITEM',
                collection: 'transactions',
                payload: updatedTransactions
            });

            // Update combinedData state
            setCombinedData(prevData =>
                prevData.map(transaction => ({
                    ...transaction,
                    transactionStatus: status
                }))
            );

            // Show success message
            toast.success(`All transactions status updated to ${status}`, {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: darkMode ? "dark" : "colored",
                style: {
                    fontFamily: language === 'ar' ?
                        'Noto Kufi Arabic, sans-serif' :
                        'Poppins, sans-serif',
                },
            });

        } catch (error) {
            console.error('An error occurred while updating all transactions:', error);
            toast.error('Failed to update all transactions', {
                position: "bottom-center",
                theme: darkMode ? "dark" : "colored",
            });
        }
    };


    return (
        <div className="FormData">
            {loading ? (
                <div><Loader /></div>
            ) : (
                <div className='FormDataBack'>
                    <h2 className="EventName">{languageText.Purchases}</h2>
                    <div className="FormResponses">
                        <div className="FormResponsesLeft">
                            <p>{languageText.NumberOfPurchases}</p>
                            {/* <p>2</p> */}
                            <p>{filterLength}</p>
                        </div>
                        <Icon icon="bxs:purchase-tag" className='FormResponsesIcon' />

                    </div>
                    <div className="SearchForms">
                        <input
                            className={`Search ${searchTerm && filteredData.length === 0 ? 'noMembers' : 'hasMembers'}`}
                            placeholder={`${languageText.searchResponse2}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <p className="HeaderCopy">{languageText.PurchaseHeader}</p>
                    <div className="ButtonsContainer">
                        {filterLength > 0 && (
                            <>
                                <button className="DownloadButton Excel" onClick={handleDownloadExcel}>
                                    <Icon icon="vscode-icons:file-type-excel" /> {languageText.Excel}
                                </button>
                                <button className="DownloadButton Proof" onClick={handleDownloadAllProofPictures}>
                                    <Icon icon="hugeicons:file-zip" />  {languageText.dProof}
                                </button>
                                <div className="DownloadButton Pictures">
                                    <Icon icon="material-symbols:update" /> {/* Add an icon */}
                                    <select
                                        className="StatusDropdown"
                                        onChange={(e) => {
                                            if (window.confirm(languageText.TransactionsConfirm)) {
                                                handleUpdateAllStatus(e.target.value);
                                            }
                                        }}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>{languageText.ApplyStatus}</option>
                                        <option value="Didn't Arrive">{languageText.DidntArrive}</option>
                                        <option value="Available"> {languageText.Available}</option>
                                        <option value="Delivered">{languageText.Delivered}</option>
                                    </select>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="OverFlow">{languageText.ScrollHorizontal}</div>
                    <div className="ResponseBack">

                        <table>
                            <tr className="ResponseHeader">
                                <th onClick={() => handleSort('referenceNumber')}>{languageText.ReferenceNo}</th>
                                <th onClick={() => handleSort('buyerName')}>{languageText.Name}</th>
                                <th onClick={() => handleSort('buyerMatric')}>{languageText.Matric}</th>
                                <th onClick={() => handleSort('buyerEmail')}>{languageText.Email}</th>
                                <th onClick={() => handleSort('buyerPhone')}>{languageText.Phone}</th>
                                <th onClick={() => handleSort('product.pTitle')}>{languageText.Product}</th>
                                <th onClick={() => handleSort('productQuantity')}>{languageText.Quantity}</th>
                                <th onClick={() => handleSort('productSize')}>{languageText.Size}</th>
                                <th onClick={() => handleSort('transactionStatus')}>{languageText.Status}</th>
                                {/* <th onClick={() => handleSort('product.pPrice')}>Price</th> */}
                                <th onClick={() => handleSort('buyerAddress')}>{languageText.Address}</th>
                                <th>{languageText.Proof}</th>
                                <th>{languageText.Action}</th>
                            </tr>

                            {filteredData.map((item) => (
                                <tr className="ResponseHeader ResponseContent" key={item._id}>
                                    <td>{item.referenceNumber}</td>
                                    <td>{item.buyerName}</td>
                                    <td>{item.buyerMatric}</td>
                                    <td style={{ fontSize: "0.5em" }}>{item.buyerEmail}</td>
                                    <td>{item.buyerPhone}</td>
                                    <td>{item.product.pTitle}</td>
                                    <td>{item.productQuantity}</td>
                                    <td>{item.productSize}</td>
                                    <td>
                                        <div
                                            className={`TransactionStatus ${item.transactionStatus === "Didn't Arrive"
                                                ? "OutOfOrder"
                                                : item.transactionStatus === "Available"
                                                    ? "Available"
                                                    : ""
                                                }`}
                                        >{item.transactionStatus}</div>
                                    </td>
                                    {/* <td> {item.productQuantity * (item.product.pPrice || 0)}</td> */}
                                    <td>{item.buyerAddress}</td>
                                    <td
                                        style={{
                                            cursor: "pointer"
                                        }}
                                        onClick={() => { window.open(item.proof, "_blank") }}><img src={item.proof} alt="" /></td>
                                    <td >
                                        <div className="icons TableIcons">
                                            <button className="icon Delete" onClick={(e) => {
                                                e.stopPropagation();
                                                handleStatusChange({ item: item._id, status: "Didn't Arrive" })
                                            }}>
                                                <span class="tooltip Delete" >{languageText.StatusDidntArrive}</span>
                                                <span><Icon icon="subway:multiply" /></span>
                                            </button>
                                            <button className="icon Zero" onClick={(e) => {
                                                e.stopPropagation();
                                                handleStatusChange({ item: item._id, status: "Available" })

                                            }}>
                                                <span class="tooltip Delete" >{languageText.StatusArrived}</span>
                                                <span><Icon icon="mage:bolt-fill" /></span>
                                            </button>

                                            <button className="icon Status" onClick={(e) => {
                                                e.stopPropagation();
                                                handleStatusChange({ item: item._id, status: "Delivered" })


                                            }}>
                                                <span class="tooltip Delete" >{languageText.StatusDelivered}</span>
                                                <span><Icon icon="hugeicons:delivered-sent" /></span>
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </table>

                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductsData
