import { createContext, useReducer } from 'react'

export const FormsContext = createContext()

export const formsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FORM':
            return {
                forms: action.payload
            }
        case 'CREATE_FORM':
            return {
                forms: [action.payload, ...state.forms]
            }
        case 'DELETE_FORM':
            return {
                forms: state.forms.filter(w => w._id !== action.payload._id)
            }
        default:
            return state
    }
}

export const FormsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(formsReducer, {
        forms: []
    })

    return (
        <FormsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </FormsContext.Provider>
    )
}