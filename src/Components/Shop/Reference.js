import { useState, useEffect } from 'react';
import { useFormsContext } from '../../hooks/useFormContext';
import Loader from "../Loader/Loader";
import React from 'react';
import { useParams } from 'react-router-dom';
import './Reference.css'

const Reference = ({ api, language, languageText }) => {
    const [loading, setLoading] = useState(false);
    const { transactions, dispatch } = useFormsContext();
    const { referenceNumber } = useParams();
    const [transaction, setTransaction] = useState(null);
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchTransactionData = async () => {
            setLoading(true);
            try {
                // Fetch the transaction data
                const response = await fetch(`${api}/api/transaction/t/${referenceNumber}`);
                if (!response.ok) {
                    console.error(
                        `Error fetching transaction data. Status: ${response.status}, ${response.statusText}`
                    );
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                dispatch({
                    type: "GET_ITEM",
                    collection: "transactions",
                    payload: data,
                });
                setTransaction(data);

                // Fetch the product data
                const productResponse = await fetch(`${api}/api/product/${data.productId}`);
                if (!productResponse.ok) {
                    console.error(
                        `Error fetching product data. Status: ${productResponse.status}, ${productResponse.statusText}`
                    );
                    setLoading(false);
                    return;
                }

                const productData = await productResponse.json();
                dispatch({
                    type: "GET_ITEM",
                    collection: "products",
                    payload: productData,
                });
                setProduct(productData);
            } catch (error) {
                console.error("An error occurred while fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactionData();
    }, [api, referenceNumber, dispatch]);

    return (
        <div className="CreatedForm">
            {loading ? (
                <div className="LoaderDiv"><Loader /></div>
            ) : transaction && product ? (
                <div className="Reference">
                    <div className="FormLeft ProductForm">
                        <img src={product.pImage} alt={language === "en" ? product.pTitle : product.pArabicTitle} />
                        <h3>{transaction.productSize}</h3>
                        <div className="ReferenceForm">
                            <div className="ReferenceDetails">

                                <h2 className="ReferenceTitle">{languageText.PersonalDetails}</h2>
                                <p className="ReferenceDetail"><span>{languageText.Name}:</span> {transaction.buyerName}</p>
                                <p className="ReferenceDetail"><span>{languageText.Email}:</span> {transaction.buyerEmail}</p>
                                <p className="ReferenceDetail"><span>{languageText.Phone}:</span> {transaction.buyerPhone}</p>
                                <p className="ReferenceDetail"><span>{languageText.Faculty}:</span> {transaction.buyerFaculty}</p>
                                <p className="ReferenceDetail"><span>{languageText.Address}:</span> {transaction.buyerAddress}</p>
                                <div className="ReferenceNumber">
                                    <h2>{transaction.referenceNumber}</h2>
                                </div>
                            </div>
                            <div className="ReferenceDetails ReferenceDetailsProduct">
                                <h2 className="ReferenceTitle">{languageText.ProductDetails}</h2>

                                <h2 className='ReferenceProductTitle'>{language === "en" ? product.pTitle : product.pArabicTitle}</h2>
                                <p className='ReferenceProductDescription'>{language === "en" ? product.pDescription : product.pArabicDescription}</p>
                                <div className="ReferenceProductDetails">
                                    <p>{transaction.productQuantity} {languageText.Pieces}</p>
                                    <p>{transaction.productSize}</p>
                                    <p>{transaction.productQuantity * product.pPrice} {languageText.RM}</p>

                                </div>
                                <h2
                                    className={`Status ${transaction.transactionStatus === "Didn't Arrive"
                                        ? "OutOfOrder"
                                        : transaction.transactionStatus === "Available"
                                            ? "Available"
                                            : ""
                                        }`}
                                >
                                    {/* •  */}
                                    {transaction.transactionStatus}
                                </h2>
                            </div>
                        </div>

                    </div>
                </div>
            ) : (
                <p>No data available</p>
            )
            }
        </div >
    );
};

export default Reference;
