import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import arrowLeft from './img/header/arrow-left.svg';
import home from './img/header/home.svg';
import tool from './img/slider/tool.svg';
import map from './img/map/map.svg';
import useFetch from '../../components/hooks/useFetch.js';
import FilterPage from '../filterPage/Filter.jsx';
import SortedPosts from '../../components/SortedPosts.jsx';
import cl from './page2.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { setCategoryTitle } from '../../actions.js';
import Loader from '../../components/UI/Loader/Loader.jsx';
import {useSubcategory} from "../../SubcategoryContext.jsx";

const InfoPage = () => {
  const { activeCategoryId } = useParams();


  const [prevCategories, setPrevCategories] = useState([]);
  const [categoryTitles, setCategoryTitles] = useState({});
  const buttonRef = useRef(null);
  const [filterActiveCategory, setFilterActiveCategory] = useState(null);

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.click();
    }
  }, [buttonRef]);

  useEffect(() => {
    console.log('categoryId:', activeCategoryId);
  }, [activeCategoryId]);

  const handleGoBack = () => {
    if (prevCategories.length > 0) {
      const lastCategory = prevCategories.pop();
      setActiveCategory(lastCategory);
      setPrevCategories([...prevCategories]);
      const path = `/page2/${lastCategory}`;
      window.history.pushState(null, '', path);
      setTimeout(() => {
        scrollToActiveCategory();
      }, 100);
    } else {
      const path = '/';
      window.history.pushState(null, '', path);
    }
  };

  const scrollToActiveCategory = () => {
    const tabsBox = document.querySelector(`.${cl.tabs_box}`);
    const activeTab = document.querySelector(`.${cl.tab}.${cl.active}`);

    if (tabsBox && activeTab) {
      const scrollOffset = activeTab.offsetLeft - (tabsBox.clientWidth - activeTab.clientWidth) / 2;
      tabsBox.scrollTo({
        left: scrollOffset,
        behavior: 'smooth',
      });
    }
  };

  const [categoryPosts, setCategoryPosts] = useState([]);
  const [categoryError, setCategoryError] = useState(null);

  const [showFilterPage, setShowFilterPage] = useState(false);
  const pathParts = useLocation().pathname.split('/');
  const encodedCategory = pathParts[pathParts.length - 1];
  const initialCategoryId = categoryTitles[encodedCategory] || encodedCategory;

  const { data, loading, error } = useFetch(
      'https://places-test-api.danya.tech/api/categories?populate=image'
  );

  const [activeCategory, setActiveCategory] = useState(initialCategoryId);
  const [localCategoryTitle, setLocalCategoryTitle] = useState(initialCategoryId);
  const categoryTitleRedux = useSelector((state) => state?.title?.categories[activeCategory]);
  const dispatch = useDispatch();

  const loopClick = () => {
    setShowFilterPage(true);
    document.body.style.overflow = 'hidden';
  };

  useEffect(() => {
    scrollToActiveCategory();
  }, [activeCategory]);

  const handleFilterPageClose = () => {
    setShowFilterPage(false);
    document.body.style.overflow = 'auto';
  };

  const fetchPostsForCategory = async (categoryId, subcategoryId) => {
    try {
      let url = `https://places-test-api.danya.tech/api/categories/${categoryId}?populate=posts`;
      if (subcategoryId) {
        url += `&subcategoryId=${subcategoryId}`;
      }

      const response = await fetch(url);
      const categoryData = await response.json();

      const posts = categoryData?.attributes?.posts?.data || [];
      setCategoryPosts(posts);
      setCategoryError(null);
    } catch (error) {
      console.error('Error fetching category data:', error);
      setCategoryError('Error fetching category data');
      setCategoryPosts([]);
    }
  };
  const selectedSubcategory = useSelector(state => state.selectedSubcategory);
  console.log(selectedSubcategory + "dawdwd")
  useEffect(() => {
    if (data && data.length > 0) {
      const titles = {};
      data.forEach((category) => {
        dispatch(setCategoryTitle(category.id, category.attributes.title));
        titles[category.id] = category.attributes.title;
      });
      setCategoryTitles(titles);
      scrollToActiveCategory();
    }
  }, [data]);
  useEffect(() => {
    console.log('Selected Subcategory:', selectedSubcategory);

    if (!loading && !error && data) {
      // Your existing code...
    }
  }, [selectedSubcategory, data, loading, error]);

  const handleCategoryClick = async (categoryId) => {
    if (activeCategory === categoryId) {
      console.log('Category is already active');
      return;
    }

    setPrevCategories([...prevCategories, activeCategory]);

    document.querySelectorAll(`.${cl.card__item}`).forEach((tab) => {
      tab.classList.remove(cl.active);
    });

    setActiveCategory(categoryId);
    setFilterActiveCategory(categoryId);

    await fetchPostsForCategory(categoryId);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [useLocation().pathname]);




  return (
      <>
        <div>
          {showFilterPage && (
              <div className={cl.filterPageOverlay}>
                <div className={cl.modalContainer} onClick={handleFilterPageClose}>
                  <FilterPage
                      activeCategory={activeCategory}
                      filterActiveCategory={filterActiveCategory}
                      handleFilterPageClose={handleFilterPageClose}
                  />
                </div>
              </div>
          )}
          <header className={cl.header}>
            <div className={`${cl.header__container} ${cl._container}`}>
              <a href="#" className={cl.header__icon} onClick={handleGoBack}>
                <img src={arrowLeft} alt="" />
              </a>
              <Link to={'/'} className={cl.header__icon}>
                <img src={home} alt="" />
              </Link>
            </div>
          </header>

          <section className={`${cl.page__food} ${cl.food}`}>
            <div className={`${cl.wrapper} ${cl._container}`}>
              {loading ? (
                  <div className={cl.loaderContainer}>
                    <Loader />
                  </div>
              ) : (
                  <ul className={cl.tabs_box}>
                    {data &&
                        data.map((cat) => (
                            <Link
                                to={`/page2/${cat.id}`}
                                key={cat.id}
                                className={`${cl.tab} ${
                                    useLocation().pathname.includes(`/page2/${cat.id}`) ? cl.active : ''
                                }`}
                                onClick={() => handleCategoryClick(cat.id, cat.attributes.title)}
                                data-category={cat.id}
                            >
                              <img
                                  className={cl.button__image}
                                  src={`https://places-test-api.danya.tech${cat.attributes.image.data.attributes.url}`}
                                  alt=""
                              />
                              <span className={cl.tab__text}>{cat.attributes.title}</span>
                            </Link>
                        ))}
                  </ul>
              )}
            </div>

            <div className={`${cl.food__header} ${cl._container}`}>
              <div className={cl.food__content}>
                <div className={cl.food__title}>{categoryTitleRedux}</div>
                <div className={cl.food__desc}>
                  Нажмите на кнопку «фильтры», чтобы выбрать наиболее подходящее место
                </div>
              </div>
              <div className={cl.food__icon}>
                <img onClick={loopClick} src={tool} alt="" />
              </div>
            </div>
            {(categoryTitleRedux || localCategoryTitle) && (
                <SortedPosts
                    categoryId={activeCategory}
                    categoryTitle={categoryTitleRedux}
                    posts={categoryPosts}
                    selectedSubcategory={selectedSubcategory}

              />
            )}
          </section>

          <section className={`${cl.page__map} ${cl.map}`}>
            <div className={`${cl.map__container} ${cl._container}`}>
              <div className={cl.map__content}>
                <div className={cl.map__title}>Онлайн-карта</div>
                <div className={cl.map__desc}>
                  Интерактивная карта в Google Maps с местами города. Ищите новые места <p>рядом с вами!</p>
                </div>
              </div>
              <img src={map} alt="" />
              <a className={cl.map_btn}>ОТКРЫТЬ ОНЛАЙН-КАРТУ</a>
            </div>
          </section>
        </div>
      </>
  );
};

export default InfoPage;
