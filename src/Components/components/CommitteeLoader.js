import { useEffect } from 'react'
const CommitteeLoader = ({ languageText, committee }) => {

    if (committee === "Academic") {
        return languageText.AcademicMembers
    } else if (committee === "Bank") {
        return languageText.BankMembers
    } else if (committee === "Social") {
        return languageText.SocialMembers
    } else if (committee === "Culture") {
        return languageText.CultureMembers
    } else if (committee === "Sports") {
        return languageText.SportMembers
    } else if (committee === "Media") {
        return languageText.MediaMembers
    } else if (committee === "Logistics") {
        return languageText.LogisticsMembers
    } else if (committee === "Women Affairs") {
        return languageText.WomenMembers
    } else if (committee === "Reading") {
        return languageText.ReadingMembers
    }

}
export default CommitteeLoader;