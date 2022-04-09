async function showPreview(e) {
  let href = e.target.href
  let response = await fetch(href);
  let text;
  if (response.ok) {
    text = await response.text();
  } else {
    console.log(`Не удалось получить данные с ${href}`)
  }
  let array = text.split('\n')
  array = array.filter(e => e.indexOf('og:') > -1)
  array = array
    .map(e => {
      e = e.replaceAll('\"', '')
      return {
        property: getProperty(e),
        value: getContent(e)
      }
    })
  array = prepareData(array)
  addData(array, e.target)

}

function prepareData(data) {
  let output = {};
  output.title = data.find(e => e.property == 'title').value;
  output.description = data.find(e => e.property == 'description').value;
  let url = data.find(e => e.property == 'url').value.replace('index.html', '');
  let img = data.find(e => e.property == 'image').value.replace('./', '');
  output.img = url + img;
  return output;
}

//TODO картинка выезжает за карточку
function addData(data, target) {
 target= target.closest('.examples__item');
  let title = target.querySelector('.preview_title');
  let description = target.querySelector('.preview_description');
  let img = target.querySelector('.preview_img');
  title.innerHTML = data.title;
  description.innerHTML = data.description;
  img.src = data.img;
}

function getProperty(str) {
  let search = 'og:';
  let start = str.indexOf(search);
  let end = str.indexOf(' ', start);
  return str.substring(start + search.length, end);
}

function getContent(str) {
  let search = 'content=';
  let start = str.indexOf(search);
  let end = str.indexOf('>', start);
  return str.substring(start + search.length, end)
}

let examples = document.querySelectorAll('.example')

examples.forEach(el => {
  el.addEventListener('pointerover', showPreview)
})

/*
0: {property: 'title', value: 'MoGo'}
1: {property: 'site_name', value: 'MoGo'}
2: {property: 'url', value: 'https://faustluck.github.io/MoGo/'}
3: {property: 'description', value: 'MoGo пример верстки'}
4: {property: 'image', value: './assets/images/Preview.png'}
5: {property: 'image:type', value: 'image/png'}
6: {property: 'image:width', value: '200'}
7: {property: 'image:height', value: '200'}
*/