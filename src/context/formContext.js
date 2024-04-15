import { createContext, useReducer } from 'react'

export const FormsContext = createContext()

// export const formsReducer = (state, action) => {
//     switch (action.type) {
//         case 'SET_FORM':
//             return {
//                 forms: action.payload
//             }
//         case 'CREATE_FORM':
//             return {
//                 forms: [action.payload, ...state.forms]
//             }
//         case 'DELETE_FORM':
//             return {
//                 forms: state.forms.filter(w => w._id !== action.payload._id)
//             }
//         case 'SET_MEMBERS':
//             return {
//                 members: action.payload
//             };
//         case 'CREATE_MEMBER':
//             return {
//                 members: [action.payload, ...state.forms]
//             }
//         case 'DELETE_FORM':
//             return {
//                 forms: state.forms.filter(w => w._id !== action.payload._id)
//             }
//         default:
//             return state
//     }
// }


export const formsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ITEM':
            return {
                ...state,
                [action.collection]: action.payload
            };
        case 'CREATE_ITEM':
            return {
                ...state,
                [action.collection]: [action.payload, ...state[action.collection]]
            };
        case 'DELETE_ITEM':
            return {
                ...state,
                [action.collection]: state[action.collection].filter(item => item._id !== action.payload._id)
            };
        case 'GET_ITEM':
            return {
                ...state,
                [action.collection]: state[action.collection].map(item => (item._id === action.payload.id ? action.payload : item))
            };
        case 'UPDATE_ITEM':
            return {
                ...state,
                [action.collection]: state[action.collection].map(item =>
                    item._id === action.payload.id ? { ...item, ...action.payload.changes } : item
                ),
            };
        // case 'UPDATE_STATUS':
        //     return {
        //         ...state,
        //         forms: state.forms.map(form => (form._id === action.payload.id ? { ...form, status: action.payload.status } : form))
        //     };
        default:
            return state;
    }
};

export const FormsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(formsReducer, {
        forms: [],
        members: [],
        ISSForm: [],
        faculties: [],
        courses: [],
        charities: [],
        points: [],
        books: [],
        bookings: []
    })



    return (
        <FormsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </FormsContext.Provider>
    )
}