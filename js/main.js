var about = false;

document.getElementById('about').addEventListener('click', function () {
  console.log('?');
  if (!about) {
    document.getElementById('interface').classList.add('about');
  } else {
    document.getElementById('interface').classList.remove('about');
  }
  about = !about;
});

document.getElementById('x').addEventListener('click', function () {
  console.log('x');
  document.getElementById('interface').classList.remove('about');

});
