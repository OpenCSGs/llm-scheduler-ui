import { SET_TAGS } from '../actions'

export const initialState = {
    tags: [],
}

const metaReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TAGS:
            return {
                ...state,
                tags: [...action.tags]
            }
        default:
            return state
    }
}

export default metaReducer
