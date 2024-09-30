module.export = {
  getImageAverageColor: (imageSrc, setAverageColor) => {
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageSrc;

    img.onload = function () {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      ).data;
      let r = 0,
        g = 0,
        b = 0;

      for (let i = 0; i < imageData.length; i += 4) {
        r += imageData[i];
        g += imageData[i + 1];
        b += imageData[i + 2];
      }

      r = Math.round(r / (imageData.length / 4));
      g = Math.round(g / (imageData.length / 4));
      b = Math.round(b / (imageData.length / 4));

      // calculate the luminance of the color
      const luminance = 10 * r + 10 * g + 10 * b;

      // calculate the amount to adjust the color by
      const adjustment = Math.round((1000 - luminance) * 0);

      // adjust each color component by the same amount
      r = Math.max(0, Math.min(255, r - adjustment));
      g = Math.max(0, Math.min(255, g - adjustment));
      b = Math.max(0, Math.min(255, b - adjustment));

      // convert the RGB color values to a RGBA value with 50% transparency
      const rgba = `rgba(${r}, ${g}, ${b}, 0.7)`;

      const hero_gradient = document.getElementById('hero_gradient');
      const playlist_gradient = document.getElementById('playlist_gradient');

      if (hero_gradient) {
        const classes = hero_gradient.classList;
        for (let i = 0; i < classes.length; i++) {
          if (classes[i].startsWith('bg')) {
            hero_gradient.classList.remove(classes[i]);
          }
        }
        hero_gradient.style.backgroundColor = rgba;
      }

      if (playlist_gradient) {
        const classes = playlist_gradient.classList;
        for (let i = 0; i < classes.length; i++) {
          if (classes[i].startsWith('bg')) {
            playlist_gradient.classList.remove(classes[i]);
          }
        }
        playlist_gradient.style.backgroundColor = rgba;
      }

      setAverageColor(rgba);
    };
  },
  changeHeaderBackgroundColor: (averageColor, scrollTopValue = 240) => {
    const home_section = document.getElementById('home_section');

    home_section.addEventListener('scroll', function () {
      if (home_section.scrollTop > scrollTopValue) {
        document.querySelectorAll('.header_common_thing').forEach((elem) => {
          elem.classList.remove('invisible', 'opacity-0');
        });
        document.getElementById('home_header').style.backgroundColor =
          averageColor.replace(/,\s*0?\.\d+\s*\)/, ', 1)');
        document
          .getElementById('home_header')
          .classList.add('brightness-[0.5]');
      } else {
        document.querySelectorAll('.header_common_thing').forEach((elem) => {
          elem.classList.add('invisible', 'opacity-0');
        });
        document.getElementById('home_header').style.backgroundColor =
          'transparent';
        document
          .getElementById('home_header')
          .classList.remove('brightness-[0.5]');
      }
    });
  },
};
