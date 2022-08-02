export default function () {
  const todo = JSON.parse(localStorage.getItem('todo')) || [];
  const counter = todo.filter(item => item.checked !== true).length;

  const canvas = document.createElement('canvas');
  canvas.height = 64;
  canvas.width = 64;

  const ctx = canvas.getContext('2d');
  const img = new Image();

  img.src = './assets/img/favicon.png';
  img.onload = () => {
    ctx.drawImage(img, 0, 0);

    if (counter > 0) {
      const circle = new Path2D();
      let circleRadius = 22;
      let fontX = 1;

      if (counter < 10) {
        circleRadius = 18;
        fontX = 10;
      }

      circle.arc(20, 45, circleRadius, 0, 2 * Math.PI);
      ctx.fillStyle = '#2b81fa';
      ctx.fill(circle);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 34px sans-serif';
      ctx.fillText(counter, fontX, 57);
    }

    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = canvas.toDataURL();
    document.querySelector('head').appendChild(link);
  };
}
