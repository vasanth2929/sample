import { Button } from '@material-ui/core';
import NavigationIcon from '@material-ui/icons/Navigation';
import React, { useEffect } from 'react';
import './ScrollUpButton.style.scss';

export default function ScrollUpButton() {
  window.onload = () => {
    const mybutton = document.getElementById('upBtn');
    mybutton.style.display = 'none';
    window.onscroll = function () {
      scrollFunction(mybutton);
    };
  };

  function scrollFunction(mybutton) {
    if (
      document.body.scrollTop > 30 ||
      document.documentElement.scrollTop > 30
    ) {
      mybutton.style.display = 'block';
    } else {
      mybutton.style.display = 'none';
    }
  }

  const goTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  return (
    <div
      id="upBtn"
      style={{
        display: 'none',
      }}
      onClick={goTop}
    >
      <Button
        variant="contained"
        color="secondary"
        style={{ borderRadius: '50px', fontSize: '14px' }}
        startIcon={<NavigationIcon />}
      >
        Scroll Up
      </Button>
    </div>
  );
}
