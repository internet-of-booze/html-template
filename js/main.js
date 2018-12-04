
document.getElementById('about').addEventListener('click', function () {
  console.log('?');
  document.getElementById('front').classList.add('hide');
  document.getElementById('back').classList.remove('hide');
});

document.getElementById('x').addEventListener('click', function () {
  console.log('x');
  document.getElementById('back').classList.add('hide');
  document.getElementById('front').classList.remove('hide');
});
