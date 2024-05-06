import React, { useEffect } from 'react'
import './Magazine.css'
import { Icon } from '@iconify/react';

const Magazine = () => {



    useEffect(() => {

        const prevBtn = document.querySelector("#prev-btn");
        const nextBtn = document.querySelector("#next-btn");
        const book = document.querySelector("#book");

        const paper1 = document.querySelector("#p1");
        const paper2 = document.querySelector("#p2");
        const paper3 = document.querySelector("#p3");
        const paper4 = document.querySelector("#p4");
        const paper5 = document.querySelector("#p5");
        const paper6 = document.querySelector("#p6");
        const paper7 = document.querySelector("#p7");

        // Event Listener
        prevBtn.addEventListener("click", goPrevPage);
        nextBtn.addEventListener("click", goNextPage);

        // Business Logic
        let currentLocation = 1;
        let numOfPapers = 7;
        let maxLocation = numOfPapers + 1;

        function openBook() {
            book.style.transform = "translateX(50%)";
            prevBtn.style.transform = "translateX(-180px)";
            nextBtn.style.transform = "translateX(180px)";
            nextBtn.style.zIndex = 9000;

        }

        function closeBook(isAtBeginning) {
            if (isAtBeginning) {
                book.style.transform = "translateX(0%)";
            } else {
                book.style.transform = "translateX(100%)";
            }

            prevBtn.style.transform = "translateX(0px)";
            nextBtn.style.transform = "translateX(0px)";
            prevBtn.style.zIndex = 9000;

        }

        function goNextPage() {
            if (currentLocation < maxLocation) {
                switch (currentLocation) {
                    case 1:
                        openBook();
                        paper1.classList.add("flipped");
                        paper1.style.zIndex = 1;
                        break;
                    case 2:
                        paper2.classList.add("flipped");
                        paper2.style.zIndex = 2;
                        break;
                    case 3:
                        paper3.classList.add("flipped");
                        paper3.style.zIndex = 3;
                        break;
                    case 4:
                        paper4.classList.add("flipped");
                        paper4.style.zIndex = 4;
                        break;
                    case 5:
                        paper5.classList.add("flipped");
                        paper5.style.zIndex = 5;
                        break;
                    case 6:
                        paper6.classList.add("flipped");
                        paper6.style.zIndex = 6;
                        break;
                    case 7:
                        paper7.classList.add("flipped");
                        paper7.style.zIndex = 7;
                        closeBook(false);
                        break;
                    default:
                        throw new Error("unknown state");
                }
                currentLocation++;
            }
        }

        function goPrevPage() {
            if (currentLocation > 1) {
                switch (currentLocation) {
                    case 2:
                        closeBook(true);
                        paper1.classList.remove("flipped");
                        paper1.style.zIndex = 7;
                        break;
                    case 3:
                        paper2.classList.remove("flipped");
                        paper2.style.zIndex = 6;
                        break;
                    case 4:
                        paper3.classList.remove("flipped");
                        paper3.style.zIndex = 5;
                        break;
                    case 5:
                        paper4.classList.remove("flipped");
                        paper4.style.zIndex = 4;
                        break;
                    case 6:
                        paper5.classList.remove("flipped");
                        paper5.style.zIndex = 3;
                        break;
                    case 7:
                        paper6.classList.remove("flipped");
                        paper6.style.zIndex = 2;
                        break;
                    case 8:
                        openBook();
                        paper7.classList.remove("flipped");
                        paper7.style.zIndex = 1;
                        break;
                    default:
                        throw new Error("unknown state");
                }

                currentLocation--;
            }
        }

    }, []);





    return (
        <div className="Form">
            <div className="Magazine">
                <button id="prev-btn">
                    <Icon icon="iconamoon:player-previous-fill" />
                </button>


                <div id="book" class="book">
                    <div id="p1" class="paper">
                        <div class="front">
                            <div id="f1" class="front-content">
                                <img src="https://firebasestorage.googleapis.com/v0/b/iss-egypt-files.appspot.com/o/Magazine%2F1.png?alt=media&token=8ba3914d-1f70-48ee-b3e1-3e6353659df5" />

                            </div>
                        </div>
                        <div class="back">
                            <div id="b1" class="back-content">
                                <img src="https://firebasestorage.googleapis.com/v0/b/iss-egypt-files.appspot.com/o/Magazine%2F2.png?alt=media&token=b0740801-e56c-4701-af0a-d561463a2753" />

                            </div>
                        </div>
                    </div>

                    <div id="p2" class="paper">
                        <div class="front">
                            <div id="f2" class="front-content">
                                <img src="https://firebasestorage.googleapis.com/v0/b/iss-egypt-files.appspot.com/o/Magazine%2F3.png?alt=media&token=3e6c1cbd-4526-475e-80a3-275653e9f18f" />

                            </div>
                        </div>
                        <div class="back">
                            <div id="b2" class="back-content">
                                <img src="https://firebasestorage.googleapis.com/v0/b/iss-egypt-files.appspot.com/o/Magazine%2F4.png?alt=media&token=05189977-0a14-4416-abfc-420a8faa6cb7" />

                            </div>
                        </div>
                    </div>
                    {/* <!-- Paper 3 --> */}
                    <div id="p3" class="paper">
                        <div class="front">
                            <div id="f3" class="front-content">
                                <img src="https://firebasestorage.googleapis.com/v0/b/iss-egypt-files.appspot.com/o/Magazine%2F5.png?alt=media&token=c450b86e-edbe-4a1f-8bc2-b00d37ade830" />

                            </div>
                        </div>
                        <div class="back">
                            <div id="b3" class="back-content">
                                <img src="https://firebasestorage.googleapis.com/v0/b/iss-egypt-files.appspot.com/o/Magazine%2F6.png?alt=media&token=ff26a27c-53c8-452e-88d8-5384d7cf73ba" />

                            </div>
                        </div>
                    </div>

                    <div id="p4" class="paper">
                        <div class="front">
                            <div id="f4" class="front-content">
                                <img src="https://firebasestorage.googleapis.com/v0/b/iss-egypt-files.appspot.com/o/Magazine%2F7.png?alt=media&token=a7c744fa-36d3-4d8f-b514-10bc62814f88" />

                            </div>
                        </div>
                        <div class="back">
                            <div id="b4" class="back-content">
                                <img src="https://firebasestorage.googleapis.com/v0/b/iss-egypt-files.appspot.com/o/Magazine%2F8.png?alt=media&token=f392d1ac-e813-4f4f-ace3-49044bdf9cfa" />

                            </div>
                        </div>
                    </div>

                    <div id="p5" class="paper">
                        <div class="front">
                            <div id="f5" class="front-content">
                                <img src="https://firebasestorage.googleapis.com/v0/b/iss-egypt-files.appspot.com/o/Magazine%2F9.png?alt=media&token=ea65c72f-6f88-4dda-bdd0-787eb7021a27" />

                            </div>
                        </div>
                        <div class="back">
                            <div id="b5" class="back-content">
                                <img src="https://firebasestorage.googleapis.com/v0/b/iss-egypt-files.appspot.com/o/Magazine%2F10.png?alt=media&token=4e5fa940-eab9-49f9-ad86-a2fa3bbe6c61" />

                            </div>
                        </div>
                    </div>

                    <div id="p6" class="paper">
                        <div class="front">
                            <div id="f6" class="front-content">
                                <img src="https://firebasestorage.googleapis.com/v0/b/iss-egypt-files.appspot.com/o/Magazine%2F11.png?alt=media&token=25c15742-f359-4c36-9952-fa4f344efcda" />

                            </div>
                        </div>
                        <div class="back">
                            <div id="b6" class="back-content">
                                <img src="https://firebasestorage.googleapis.com/v0/b/iss-egypt-files.appspot.com/o/Magazine%2F12.png?alt=media&token=e71098f4-e9af-492a-8233-a7039928bd3b" />

                            </div>
                        </div>
                    </div>

                    <div id="p7" class="paper">
                        <div class="front">
                            <div id="f7" class="front-content">
                                <img src="https://firebasestorage.googleapis.com/v0/b/iss-egypt-files.appspot.com/o/Magazine%2F13.png?alt=media&token=4dd2f46c-9422-42d8-b867-19d09266f52a" />

                            </div>
                        </div>
                        <div class="back">
                            <div id="b7" class="back-content">
                                <img src="https://firebasestorage.googleapis.com/v0/b/iss-egypt-files.appspot.com/o/Magazine%2F14.png?alt=media&token=5c07ebe5-bf84-4c63-99a5-704348eb35fe" />

                            </div>
                        </div>
                    </div>
                </div>

                {/* <!-- Next Button --> */}
                <button id="next-btn">
                    <Icon icon="iconamoon:player-next-fill" />
                </button>
            </div>
        </div>
    )
}

export default Magazine
