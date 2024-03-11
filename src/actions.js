// actions.js
export const setCategoryTitle = (categoryId, categoryTitle) => ({
    type: 'SET_CATEGORY_TITLE',
    payload: { categoryId, categoryTitle },
});
import buttonReducer from './features/buttonSlide.js'; // Update the path
// actions.js
export const setSelectedSubcategory = (subcategory) => ({
    type: 'SET_SELECTED_SUBCATEGORY',
    payload: subcategory,
});

export const setCategoryData = (data) => ({
    type: 'SET_CATEGORY_DATA',
    payload: data,
});
export const setActiveCategory = (categoryId) => ({
    type: 'SET_ACTIVE_CATEGORY',
    payload: categoryId,
});

export const setActiveCategoryFilter = (categoryId) => ({
    type: 'SET_ACTIVE_CATEGORY_FILTER',
    payload: categoryId,
});

// Add the following exports for saga.js
export const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST';
export const fetchDataRequest = () => ({
    type: FETCH_DATA_REQUEST,
});

export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';
export const fetchDataSuccess = (data) => ({
    type: FETCH_DATA_SUCCESS,
    payload: data,
});
export const resetActiveCategory = () => ({
    type: RESET_ACTIVE_CATEGORY,
});
export const FETCH_DATA_ERROR = 'FETCH_DATA_ERROR';
export const fetchDataError = (error) => ({
    type: FETCH_DATA_ERROR,
    payload: error,
});

export const setSelectedCategoryId = (categoryId) => ({
    type: 'SET_SELECTED_CATEGORY_ID',
    payload: categoryId,
});


const initialState = {
    categories: {},
    selectedCategoryId: null,

    activeCategory:0,
    activeCategoryFilter: null,
    selectedSubcategory: "",
    categoryData: null,
};

const rootReducer = (state = initialState, action) => {

    switch (action.type) {
        case 'SET_SELECTED_CATEGORY_ID':
            return {
                ...state,
                selectedCategoryId: action.payload,
            };
        case 'SET_ACTIVE_CATEGORY':
            return {
                ...state,
                activeCategory: action.payload,
            };
        case 'SET_SELECTED_SUBCATEGORY':
            return {
                ...state,
                selectedSubcategory: action.payload,
            };

        case 'SET_CATEGORY_DATA':
            return {
                ...state,
                categoryData: action.payload,
            };
        case 'SET_ACTIVE_CATEGORY_FILTER':
            return {
                ...state,
                activeCategoryFilter: action.payload,
            };
        case 'SET_CATEGORY_TITLE':
            return {
                ...state,
                categories: {
                    ...state.categories,
                    [action.payload.categoryId]: action.payload.categoryTitle,
                },
            };
        default:
            return state;

    }
};

export default rootReducer;
