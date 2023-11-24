import { useEffect } from 'react'
const MemberLoader = ({ languageText, committee, role }) => {

    if (committee === "ISS Egypt" && role === "President") {
        return languageText.President
    }
    else if (committee === "Vice" && role === "President") {
        return languageText.VicePresident
    }
    else if (committee === "Secretary" && role === "President") {
        return languageText.Secretary
    }
    else if (committee === "Treasurer" && role === "President") {
        return languageText.Treasurer
    }
    else if (committee === "Academic" && role === "President") {
        return languageText.AcademicPresident
    }
    else if (committee === "Bank" && role === "President") {
        return languageText.BankPresident
    }
    else if (committee === "Social" && role === "President") {
        return languageText.SocialPresident
    }
    else if (committee === "Culture" && role === "President") {
        return languageText.CulturePresident
    }
    else if (committee === "Sports" && role === "President") {
        return languageText.SportPresident
    }
    else if (committee === "Media" && role === "President") {
        return languageText.MediaPresident
    }
    else if (committee === "Logistics" && role === "President") {
        return languageText.LogisticsPresident
    }
    else if (committee === "Women Affairs" && role === "President") {
        return languageText.WomenPresident
    }
    else if (committee === "PR" && role === "President") {
        return languageText.PublicRelation
    }
    else if (committee === "Academic" && role === "Member") {
        return languageText.AcademicMember
    }
    else if (committee === "Bank" && role === "Member") {
        return languageText.BankMember
    }
    else if (committee === "Social" && role === "Member") {
        return languageText.SocialMember
    }
    else if (committee === "Culture" && role === "Member") {
        return languageText.CultureMember
    }
    else if (committee === "Sports" && role === "Member") {
        return languageText.SportMember
    }
    else if (committee === "Media" && role === "Member") {
        return languageText.MediaMember
    }
    else if (committee === "Logistics" && role === "Member") {
        return languageText.LogisticsMember
    }
    else if (committee === "Women Affairs" && role === "Member") {
        return languageText.WomenMember
    }
    else if (committee === "PR" && role === "Member") {
        return languageText.PublicRelation
    }
}
export default MemberLoader;