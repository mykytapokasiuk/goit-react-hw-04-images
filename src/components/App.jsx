import React, { useEffect, useState } from 'react';
import Searchbar from './Searchbar/Searchbar.jsx';
import ImageGallery from './ImageGallery/ImageGallery.jsx';
import Button from './Button/Button.jsx';
import Modal from './Modal/Modal.jsx';
import Loader from './Loader/Loader.jsx';
import { getImages } from 'services/api.js';
import {
  checkResponse,
  onError,
  onInputEmpty,
  onSameRequest,
} from 'services/utils.js';

const App = () => {
  const [modal, setModal] = useState({ isOpen: false, visibleData: null });
  const [images, setImages] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(null);
  const [page, setPage] = useState(1);
  const [totalImages, setTotalImages] = useState(0);
  const showButton = !isLoading && totalImages !== images.length;

  useEffect(() => {
    if (searchQuery === null) return;
    const fetchImages = async () => {
      try {
        setIsloading(true);
        const response = await getImages(searchQuery, page);
        checkResponse(response, page);
        setImages(prevImages => [...prevImages, ...response.hits]);
        setTotalImages(response.totalHits);
      } catch (error) {
        onError(error.message);
      } finally {
        setIsloading(false);
      }
    };
    fetchImages();
  }, [searchQuery, page]);

  const onOpenModal = data => {
    setModal({ isOpen: true, visibleData: data });
  };

  const onCloseModal = () => {
    setModal({
      modal: { isOpen: false, visibleData: null },
    });
  };

  const onSubmit = input => {
    if (!input) {
      onInputEmpty();
      return false;
    }
    if (input === searchQuery) {
      onSameRequest(searchQuery);
      return true;
    }
    setSearchQuery(input);
    setImages([]);
    setPage(1);
    setTotalImages(0);
    return true;
  };

  const onLoadMore = () => {
    setPage(page + 1);
  };

  return (
    <div>
      {isLoading && <Loader />}
      <Searchbar onSubmit={onSubmit} />
      {images.length > 0 ? (
        <ImageGallery imagesArray={images} onOpenModal={onOpenModal} />
      ) : null}
      {showButton ? <Button onLoadMore={onLoadMore} /> : null}
      {modal.isOpen && (
        <Modal visibleData={modal.visibleData} onCloseModal={onCloseModal} />
      )}
    </div>
  );
};

export default App;
