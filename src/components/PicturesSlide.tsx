import React, { useState, useEffect } from 'react';
import Slide from '@mui/material/Slide';
import { Button, Box, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

interface ProductSlideShowProps {
    images: ImageData[];
}

interface ImageData {
    type: string;
    data: number[];
}

const ProductSlideShow = ({ images }: ProductSlideShowProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const convertBufferToUrl = (bufferData: ImageData) => {
    const blob = new Blob([new Uint8Array(bufferData.data)], { type: bufferData.type });
    return URL.createObjectURL(blob);
  };

  const goToPrevious = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '300px', overflow: 'hidden' }}>
      {images.map((image, index) => (
        <Slide
          key={index}
          direction={index === activeIndex ? 'left' : 'right'}
          in={index === activeIndex}
          mountOnEnter
          unmountOnExit
          timeout={{ enter: 500, exit: 500 }}
        >
          <Box
            component="img"
            src={convertBufferToUrl(image)}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Slide>
      ))}
      <IconButton onClick={goToPrevious} sx={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)' }}>
        <ArrowBack sx={{ fontSize: '1.0rem' }}/>
      </IconButton>
      <IconButton onClick={goToNext} sx={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)' }}>
      <ArrowForward sx={{ fontSize: '1.0rem' }}/>
      </IconButton>
    </Box>
  );
};

export default ProductSlideShow;
