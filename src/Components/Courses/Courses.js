import "./Courses.css"
import courses from "../../data/courses.json";
import { Icon } from '@iconify/react';

const Courses = ({ language, languageText }) => {


    return (
        <div className="courses">
            <h1 className="title">{languageText.extraCourses}</h1>
            <h1 className="bus" id="bus"></h1>

            <div className="sectionBox">
                {Object.keys(courses).map((faculty) => (
                    <div className="outerBox">
                        <div className="innerBox" key={faculty}>
                            <h2>{language == "ar" ? languageText[faculty + "Arabic"] : faculty}</h2>
                            <div className="cards">
                                {courses[faculty].map((course) => (
                                    <div className="card" key={course.id}>
                                        <div className="img"><img src={course.img} alt="" /></div>
                                        <div className="cardsBottomContent">
                                            <div className="coursesTitle">
                                                {language == "ar" ? (
                                                    <>
                                                        <p>{course.nameArabic}</p>
                                                        <p className="creator">{course.creatorArabic}</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p>{course.name}</p>
                                                        <p className="creator">{course.creator}</p>
                                                    </>
                                                )}
                                            </div>

                                            <button className="icon" onClick={() => window.open(course.link, "_blank")}>
                                                <span className="tooltip">{languageText.courseLink}</span>
                                                <span>
                                                    <Icon icon="fa-solid:link" />
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Courses;