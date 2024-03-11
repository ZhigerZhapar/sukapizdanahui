import React, { useEffect, useRef, useState } from 'react';
import cl from '../SelectBlock/SelectBlock.module.css';
import MySelectedButton from '../UI/MySelectedButton/MySelectedButton.jsx';
import axios from 'axios';
import { useFetch } from '../../../../components/hooks/useFetchB.js';
import { useDispatch } from 'react-redux';
import { setActiveCategory } from '../../../../actions.js';
import Places from '../Places/Places.jsx';
import MyLine from '../UI/MyLine/MyLine.jsx';
import MyBigButton from '../UI/MyBigButton/MyBigButton.jsx';
import { Link } from 'react-router-dom';
import sun from '../../imgs/Header/sun.svg';
import {useSubcategory} from "./../../../../SubcategoryContext.jsx";

const Categories = ({activeCategory, onCategoryClick, handleFilterPageClose, onFilterResultsClick }) => {
    const [selectedButton, setSelectedButton] = useState(null);
    const [categoryTitles, setCategoryTitles] = useState({});
    const pathParts = location.pathname.split('/');
    const encodedCategory = pathParts[pathParts.length - 1];
    const initialCategoryId = categoryTitles[encodedCategory] || encodedCategory;
    const [activeCategoryId, setActiveCategoryId] = useState(activeCategory || initialCategoryId);
    const [data, setData] = useState({});
    const [fetching, isDataLoading, dataError] = useFetch(async () => {
        const response = await axios.get(
            'https://places-test-api.danya.tech/api/categories?populate=image,posts,posts.images,posts.category,posts.subcategory,posts.subsubcategory'
        );
        setData(response.data || {});
        return response;
    });
    const dispatch = useDispatch();


    const { selectedSubcategory, setSelectedSubcategory } = useSubcategory();
    const handleSubcategorySelect = (subcategory) => {
        console.log('Selected Subcategory:', subcategory);
        setSelectedSubcategory(subcategory);
    };

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, []);

    const [selectedCategory, setSelectedCategory] = useState(activeCategoryId);
    const [prevCategories, setPrevCategories] = useState([]);
    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
    };
    const buttonRef = useRef(null);
    useEffect(() => {
        // Check if the button reference exists and if it does, simulate a click
        if (buttonRef.current) {
            buttonRef.current.click();
        }
    }, [buttonRef]);

    useEffect(() => {
        fetching();
    }, []);

    console.log(selectedSubcategory)
    useEffect(() => {
        if (data.data && activeCategoryId) {
            const defaultActiveCategoryIndex = data.data.findIndex((button) => button.id === activeCategoryId);

            if (defaultActiveCategoryIndex !== -1) {
                setSelectedButton(defaultActiveCategoryIndex);
                if (onCategoryClick) {
                    onCategoryClick({
                        category: data?.data?.[defaultActiveCategoryIndex],
                        categoryId: activeCategoryId,
                    });
                }
            }
        }
    }, [data.data, activeCategoryId, onCategoryClick]);

    useEffect(() => {
        // Use local storage to persist the active category
        localStorage.setItem('activeCategory', activeCategoryId);
    }, [activeCategory]);

    const [filterClosed, setFilterClosed] = useState(false);

    const handleCloseFilter = () => {
        setFilterClosed(true);
        // Additional logic if needed
    };

    const handleFilterResultsClick = () => {
        // Assuming onFilterResultsClick is a prop function passed from the parent
        onFilterResultsClick({
            categoryId: selectedCategory,
            subcategoryId: selectedSubcategory,
        });
    };
    const handleButtonClick = (index, categoryId) => {
        dispatch(setActiveCategory(categoryId));

        setSelectedButton(index);
        setActiveCategoryId(data?.data?.[index]?.id);
        if (onCategoryClick) {
            onCategoryClick({
                category: data?.data?.[index],
                categoryId: data?.data?.[index]?.id,
            });
        }
    };

    return (
        <div>
            {loading && (
                <div className={cl.loadingSpinner}>
                    <img className={cl.loader} src={sun} alt="Loading" />
                </div>
            )}
            <div className={cl.button__select}>
                <div className={cl.button__select__row}>
                    {data?.data?.map((button, index) => (
                        <MySelectedButton
                            key={index + 1}
                            isRed={selectedButton === index}
                            onClick={() => {
                                handleButtonClick(index);
                            }}
                            ref={buttonRef}
                        >
                            <img
                                className={cl.button__image}
                                src={`https://places-test-api.danya.tech${button?.attributes?.image?.data?.attributes?.url}`}
                                alt={`Изображение ${index}`}
                            />
                            {button?.attributes?.title}
                        </MySelectedButton>
                    ))}
                </div>
            </div>
            <MyLine />
            <Places activeCategory={activeCategoryId} onSubcategorySelect={handleSubcategorySelect} />
            <MyLine />

            {isDataLoading ? (
                <div style={{ height: '40px' }} className={cl.loadingSpinner}>
                    <img style={{ width: 20 }} className={cl.loader} src={sun} alt="Loading" />
                </div>
            ) : (
                <div className={cl.cont}>
                    <MyBigButton
                        onSelectCategory={handleCategorySelect}
                        handleFilterPageClose={handleFilterPageClose}
                        categoryId={activeCategoryId}
                        onCloseFilter={handleCloseFilter}
                        onFilterResultsClick={handleFilterResultsClick} // Передача нового обработчика
                    >
                        Показать результаты
                    </MyBigButton>
                </div>
            )}
        </div>
    );
};

export default Categories;
