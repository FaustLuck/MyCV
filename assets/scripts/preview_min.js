async function fetchData(e){let t,r=e.href,n=await fetch(r);return n.ok?t=await n.text():console.log(`Не удалось получить данные с ${r}`),t}function splitData(e){return e.split("\n")}function createInfo(e){return{property:getProperty(e),value:getContent(e)}}function createOG_object(e){return e.filter((e=>e.indexOf("og:")>-1)).map((e=>e.replaceAll('"',""))).map(createInfo)}function prepareData(e){let t={};t.title=e.find((e=>"title"==e.property)).value,t.description=e.find((e=>"description"==e.property)).value;let r=e.find((e=>"url"==e.property)).value.replace("index.html",""),n=e.find((e=>"image"==e.property)).value.replace("./","");return t.src=r+n,t}function getProperty(e){let t=e.indexOf("og:"),r=e.indexOf(" ",t);return e.substring(t+"og:".length,r)}function getContent(e){let t="content=",r=e.indexOf(t),n=e.indexOf(">",r);return e.substring(r+t.length,n)}async function checkMedia(){if(!window.matchMedia("(any-hover: hover)").matches)return;let e=document.querySelectorAll(".example");e=Array.from(e);let t=e.map(checkStorage),r=[],n=[];t.forEach((e=>{e.hasOwnProperty("src")?r.push(e):n.push(e)})),n.length&&(n=await Promise.all([...n].map(fetchData)),n=n.map(splitData).map(createOG_object).map(prepareData),saveData(n),n.map((t=>{t.target=e.find((e=>e.text==t.title))}))),r=[...r,...n],r.forEach(addData)}function saveData(e){e=e.map((e=>{window.localStorage.setItem(e.title,e.description),window.localStorage.setItem(`${e.title}-src`,e.src)}))}function addData(e){let t=e.target.closest(".examples__item"),r=t.querySelector(".empty"),n=t.querySelector(".preview_title"),a=t.querySelector(".preview_description"),o=t.querySelector(".preview_img");n.textContent=e.title,a.textContent=e.description,o.src=e.src,r.classList.remove("empty")}function checkStorage(e){let t={};return t.target=e,t.title=e.textContent,t.description=window.localStorage.getItem(e.textContent),t.src=window.localStorage.getItem(`${e.textContent}-src`),checkValue(t)?e:t}function checkValue(e){return Object.values(e).some((e=>null==e||void 0))}document.addEventListener("DOMContentLoaded",checkMedia);