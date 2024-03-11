import React, { useEffect, useState } from 'react';
import cl from './SubPlaces.module.css';
import MySelectedButton from '../UI/MySelectedButton/MySelectedButton.jsx';
import { useFetch } from '../../../../components/hooks/useFetchB.js';
import axios from 'axios';

    const SubPlaces = ({ activeCategory, subcategoryId }) => {
    const [selectedButton, setSelectedButton] = useState(null);
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchSubSubcategories = async () => {
            try {
                const response = await axios.get(
                    `https://places-test-api.danya.tech/api/sub-categories/${subcategoryId}?populate=subsubcategories,subsubcategories.image`
                );
                setData(response.data || []);
            } catch (error) {
                console.error('Error fetching sub-subcategories:', error.message);
            }
        };

        fetchSubSubcategories();
    }, [activeCategory, subcategoryId]);
    console.log(data)
    const handleButtonClick = (index) => {
        setSelectedButton((prevIndex) => (prevIndex === index ? null : index));
    };

    return (
        <div className={cl.button__selectd}>
            <div className={cl.button_select_rowd}>
                {Array.isArray(data.subsubcategories) && data.subsubcategories.length > 0 &&
                    data.subsubcategories.map((item, index) => (
                        <MySelectedButton
                            key={index}
                            onClick={() => handleButtonClick(index)}
                            isRed={selectedButton === index}
                        >
                            <img
                                className={cl.button__image}
                                src={`https://places-test-api.danya.tech${item?.image?.data?.attributes?.url}`}
                                alt={`Изображение ${index}`}
                            />
                        </MySelectedButton>
                    ))}
            </div>
        </div>
    );
};

export default SubPlaces;
