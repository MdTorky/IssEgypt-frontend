import { Icon } from '@iconify/react';
import "./AiTools.css";
import AiData from '../../data/aitools.json';

const AiTools = ({ language, languageText }) => {
    const CategorySection = ({ categoryData, categoryTitle, categoryIcon }) => {
        return (
            <div className="outerBox">
                <div className="innerBox">
                    <h2><span><Icon icon={categoryIcon} /></span>{categoryTitle}</h2>
                    {categoryData.map((item, index) => (
                        <AiCard item={item} key={index} />
                    ))}
                </div>
            </div>
        );
    };

    const AiCard = ({ item }) => {
        return (
            <div className="AiCard">
                <div className="AiCardImgText">
                    <img src={item.img} alt="" className={`${item.filter ? "Filter" : ''}`} />
                    <div className="AiCardText">
                        <h2>{language === "en" ? item.name : item.arabicName}</h2>
                        <p>{language === "en" ? item.description : item.arabicDescription}</p>
                    </div>
                </div>
                <button className="icon" onClick={() => { window.open(item.website, "_blank") }}>
                    <span className="tooltip">{languageText.link}</span>
                    <span><Icon icon="mdi:web" /></span>
                </button>
            </div>
        );
    };

    return (
        <div className="AiTools">
            <h1 className="title">{languageText.AiTools}</h1>

            <div className="sectionBox">
                <CategorySection
                    categoryData={AiData.chatbots}
                    categoryTitle={languageText.ChatBots}
                    categoryIcon="tabler:message-chatbot-filled"
                />
                <CategorySection
                    categoryData={AiData.image}
                    categoryTitle={languageText.Image}
                    categoryIcon="mage:image-fill"
                />
                <CategorySection
                    categoryData={AiData.video}
                    categoryTitle={languageText.Video}
                    categoryIcon="icon-park-outline:video"

                />
                <CategorySection
                    categoryData={AiData.coding}
                    categoryTitle={languageText.Coding}
                    categoryIcon="solar:code-2-linear"

                />
                <CategorySection
                    categoryData={AiData.writing}
                    categoryTitle={languageText.Writing}
                    categoryIcon="jam:write-f"
                />
                <CategorySection
                    categoryData={AiData.productivity}
                    categoryTitle={languageText.Productivity}
                    categoryIcon="icon-park-outline:increase"
                />
                <CategorySection
                    categoryData={AiData.humanizers}
                    categoryTitle={languageText.Humanizer}
                    categoryIcon="ph:finn-the-human"
                />
                <CategorySection
                    categoryData={AiData.aiDetectors}
                    categoryTitle={languageText.AIDetectors}
                    categoryIcon="oui:ml-outlier-detection-job"
                />
                <CategorySection
                    categoryData={AiData.others}
                    categoryTitle={languageText.Others}
                    categoryIcon="game-icons:perspective-dice-six-faces-random"
                />
            </div>
        </div>
    );
};

export default AiTools;