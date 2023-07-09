import React, { useState } from 'react';
import Loader from 'components/Loader/Loader';
import PropTypes from 'prop-types';
import css from './Modal.module.css';

const Modal = ({ visibleData, onCloseModal }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const onImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={css.overlay}>
      <button
        type="button"
        className={css.modalCloseBtn}
        onClick={onCloseModal}
      >
        x
      </button>
      <div>
        {!isLoaded && <Loader />}
        <div className={!isLoaded ? css.hidden : css.modal}>
          <img
            className={css.largeImage}
            src={visibleData.largeImageURL}
            alt={visibleData.tags}
            onLoad={() => {
              onImageLoad();
            }}
          />
          <div className={css.tags}>{visibleData.tags}</div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  visibleData: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  onCloseModal: PropTypes.func.isRequired,
};

export default Modal;
