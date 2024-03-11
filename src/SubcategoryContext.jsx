// SubcategoryContext.js
import { createContext, useContext, useState } from 'react';

const SubcategoryContext = createContext();

export const SubcategoryProvider = ({ children }) => {
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);

    return (
        <SubcategoryContext.Provider value={{ selectedSubcategory, setSelectedSubcategory }}>
            {children}
        </SubcategoryContext.Provider>
    );
};

export const useSubcategory = () => {
    return useContext(SubcategoryContext);
};
