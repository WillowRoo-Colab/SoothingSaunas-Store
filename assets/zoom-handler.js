/* [ZOOM IMAGE FUNCTIONALITY SCRIPT] */
     /* RENDER WITH --  <script src="{{ 'zoom-handler.js' | asset_url }}"></script>  STOP */

/* SCRIPT APPLIED TO THE PAGES -- */
/* -- main-product-soothingsaunas.liquid -- */
/* -- theme.liquid -- */

document.querySelectorAll('.zoomable-image').forEach((img) => {
  let zoomLevel = 1;
  let isDragging = false;
  let startX, startY;
  let originX = 0, originY = 0;

  img.style.transformOrigin = '0 0';
  img.style.cursor = 'grab';

  img.addEventListener('mousedown', (e) => {
    isDragging = false;
    startX = e.clientX - originX;
    startY = e.clientY - originY;

    const onMouseMove = (e) => {
      isDragging = true;
      originX = e.clientX - startX;
      originY = e.clientY - startY;
      img.style.transform = `scale(${zoomLevel}) translate(${originX / zoomLevel}px, ${originY / zoomLevel}px)`;
    };

    const onMouseUp = (e) => {
      img.style.cursor = 'grab';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (!isDragging) {
        /* Only zoom on actual click */
        zoomLevel = zoomLevel === 1 ? 2 : zoomLevel === 2 ? 3 : 1;
        originX = 0;
        originY = 0;
        img.style.transform = `scale(${zoomLevel}) translate(0px, 0px)`;
      }
    };

    img.style.cursor = 'grabbing';
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
});
