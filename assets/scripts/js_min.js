function toggleMenu(e,t=!0){if(t){if(window.matchMedia("(min-width: 768px)").matches)return;if(!(e.target.closest(".menu")||e.target.closest(".burger")||e.target.closest(".overlay:not(form)")))return}let o=document.querySelector(".menu");o.classList.toggle("open"),t=o.classList.contains("open"),document.querySelector(".writing").classList.toggle("left",t),toggleOverlay(t),toggleBurger(t)}function toggleBurger(e){document.querySelector(".burger").classList.toggle("hide",e)}function toggleOverlay(e,t=""){t&&(t=`.${t}`),document.querySelector(`.overlay${t}`).classList.toggle("open",e),toggleOverflow(e)}function toggleOverflow(e){document.body.classList.toggle("fixed",e)}function checkTheme(){let e=window.localStorage.getItem("dark");e=null===e?checkPreferColorScheme():"true"===e,document.body.classList.toggle("dark",e),document.body.classList.toggle("light",!e),toggleIcon(e)}function checkPreferColorScheme(){return window.matchMedia("(prefers-color-scheme:dark)").matches}function savePreferTheme(e){window.localStorage.setItem("dark",`${e}`)}function toggleIcon(e){let t=document.querySelectorAll(".icon"),[o,n]=e?["dark","light"]:["light","dark"];t.forEach((e=>{e.src=e.src.replaceAll(o,n)}))}function toggleTheme(e){if(!e.target.closest(".theme"))return;let t=!document.body.classList.contains("dark");document.body.classList.toggle("dark",t),document.body.classList.toggle("light",!t),savePreferTheme(t),toggleIcon(t)}function toggleWritingIcon(e){let t=document.querySelector(".writing");t.classList.toggle("hide",e),t.classList.remove("left")}function toggleForm(e){if(!e.target.closest(".writing")&&!e.target.closest(".close"))return;let t=document.querySelector(".popup");e.target.closest(".close")&&document.forms[0].reset(),t.classList.toggle("open");let o=t.classList.contains("open");o?addListeners():removeListeners(),document.querySelector(".overlay").classList.contains("open")&&toggleMenu(null,!o),toggleOverlay(o,"form"),toggleWritingIcon(o)}function closeMenu(){if(window.matchMedia("(min-width: 768px) and (orientation:landscape)").matches){let e=document.querySelector(".overlay").classList.contains("open");e&&toggleMenu(null,!e)}}function validateEmail(e){let t=e.target.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);return e.target.classList.toggle("invalid",!t),t}function isEmpty(e){let t=e.target.value,o=Boolean(t);e.target.classList.toggle("invalid",!o)}function validateForm(){let e=document.forms[0],t=e.querySelector(".submit");if(e.bucket.value)return!1;let o=Boolean(e.querySelectorAll(".invalid").length);t.classList.toggle("inactive",o),o||t.addEventListener("click",saveMessage)}function addListeners(){let e=document.forms[0],t=e.querySelectorAll("input"),o=e.querySelector("textarea");t=[...t,o],t.forEach((e=>{if("email"===e.type)return e.addEventListener("input",validateEmail);e.classList.contains("bucket")||"radio"!==e.type&&e.addEventListener("input",isEmpty)}))}function removeListeners(){let e=document.forms[0],t=e.querySelectorAll("input"),o=e.querySelector("textarea");t=[...t,o],t.forEach((e=>{if("email"===e.type)return e.removeEventListener("input",validateEmail);e.classList.contains("bucket")||"radio"!==e.type&&e.removeEventListener("input",isEmpty)}))}const done={ru:"Данные записаны",en:"Data recorded"},errors={ru:"Что-то пошло не так",en:"Something went wrong"},sayThanks={ru:"Благодарю за оценку",en:"Thank you for rating"};async function saveMessage(){let e=document.documentElement.lang;showPreloader();let t=createData();(await fetch("https://englishspace-1-g1233964.deta.app/saveMessage",{headers:{"Content-Type":"application/json"},method:"POST",body:JSON.stringify(t)})).ok?showResult(done[e]):showResult(errors[e],!0),setTimeout(returnStyles,1e3)}function createData(){let e=document.forms[0];return{timestamp:Date.now(),name:e.name.value,email:e.email.value,message:e.message.value}}function returnStyles(){let e=document.querySelector(".result");e.textContent="",e.classList.remove("show"),e.classList.remove("error");let t=document.forms[0];t.reset(),t.removeAttribute("style"),t.querySelector(".container").removeAttribute("style"),document.querySelector(".popup").classList.remove("open"),document.querySelector(".overlay.form").classList.remove("open"),document.body.classList.remove("fixed"),toggleWritingIcon()}function showResult(e,t=!1){let o=document.querySelector(".preloader"),n=document.querySelector(".result");o.classList.remove("show"),n.classList.add("show"),t&&n.classList.add("error"),n.textContent=e}function showPreloader(){let e=document.querySelector(".preloader"),t=document.forms[0],[o,n]=[t.offsetWidth-96,t.offsetHeight-96];t.querySelector(".container").style.display="none",t.style.width=o+"px",t.style.height=n+"px",e.classList.add("show")}async function getRating(){let e=await fetch("https://englishspace-1-g1233964.deta.app/getRating");if(e.ok){showRating(await e.json())}}async function updateRating(e){let t=+e.target.value,o=await fetch(`https://englishspace-1-g1233964.deta.app/addGrade/${t}`);if(o.ok){window.localStorage.setItem("voted","true");toggleRatingStyles(!1,await o.json())}else e.target.checked=!1,toggleRatingStyles(!0)}function toggleRatingStyles(e,t=null){let o=document.documentElement.lang,n=document.querySelector(".thanks"),r=document.querySelector(".star_rating"),a=document.querySelector(".star_rating_result");r.classList.add("hide"),n.textContent=e?errors[o]:sayThanks[o],n.classList.remove("hide"),setTimeout((()=>{n.classList.add("hide"),e?r.classList.remove("hide"):a.classList.remove("hide"),t&&showRating(t)}),2e3)}function showRating({count:e,rating:t}){console.log({count:e,rating:t});let o=document.querySelector(".star_rating_result");updateRatingDigits(+t),o.querySelector(".count").textContent=`${e}`,"true"===window.localStorage.getItem("voted")&&(document.querySelector(".star_rating").classList.add("hide"),o.classList.remove("hide"))}function scrollDigit(e,t){let o=getTopNumber(e),n=(-16*t-o)/100,r=setInterval((()=>{e.style.marginTop=getTopNumber(e)+n+"px",getTopNumber(e)===-16*t&&clearInterval(r)}),10)}function getTopNumber(e){return+window.getComputedStyle(e).marginTop.split("px")[0]}function updateRatingDigits(e){let t=document.querySelectorAll(".digits"),o=`${e}`;o=o.includes(".")?o.padEnd(4,"0"):`${o}.00`,o=o.split("").filter((e=>"."!==e)),t.forEach(((e,t)=>scrollDigit(e,o[t])))}async function fetchData(e){let t,o=e.target.href,n=await fetch(o);return n.ok?t=await n.text():console.log(`Не удалось получить данные с ${o}`),t}function splitData(e){return e.split(/>(\\n)?(\s+)?</).filter((e=>e))}function createInfo(e){return{property:getProperty(e),value:getContent(e)}}function createOG_object(e){return e.filter((e=>e.indexOf("og:")>-1)).map((e=>e.replaceAll('"',""))).map(createInfo)}function prepareData(e){let t={};t.title=e.find((e=>"title"===e.property)).value,t.description=e.find((e=>"description"===e.property)).value;let o=e.find((e=>"url"===e.property)).value,n=e.find((e=>"image"===e.property)).value.replace("./","");return t.src=o+n,t}function getProperty(e){let t=e.indexOf("og:"),o=e.indexOf(" ",t);return e.substring(t+"og:".length,o)}function getContent(e){let t="content=",o=e.indexOf(t);return e.substring(o+t.length,e.length)}async function checkMedia(){if(!window.matchMedia("(any-hover: hover)").matches)return;let e=document.querySelectorAll(".example");e=Array.from(e);let t=e.map(checkStorage),o=[],n=[];t.forEach((e=>{e.hasOwnProperty("src")?o.push(e):n.push(e)})),n.length&&(n=await Promise.all([...n].map(fetchData)),n=n.map(splitData).map(createOG_object).map(prepareData),saveData(n),n.map((t=>{t.target=e.find((e=>e.text===t.title))}))),o=[...o,...n],o.forEach(addData)}function saveData(e){e.forEach((e=>{let t={description:e.description,src:e.src};window.localStorage.setItem(e.title,JSON.stringify(t))}))}function addData(e){let t=e.target.closest(".examples__item"),o=t.querySelector(".empty"),n=t.querySelector(".preview_title"),r=t.querySelector(".preview_description"),a=t.querySelector(".preview_img");n.textContent=e.title,r.textContent=e.description,a.src=e.src,o.classList.remove("empty")}function checkStorage(e){let t={...JSON.parse(window.localStorage.getItem(e.textContent))};return t.target=e,t.title=e.textContent,checkValue(t)?e:t}function checkValue(e){return Object.values(e).some((e=>null==e||void 0))}document.addEventListener("DOMContentLoaded",checkMedia),document.addEventListener("DOMContentLoaded",checkTheme),document.addEventListener("DOMContentLoaded",getRating),document.addEventListener("DOMContentLoaded",showRating),document.addEventListener("click",toggleMenu),document.addEventListener("click",toggleTheme),document.addEventListener("click",toggleForm),document.querySelector("form").addEventListener("input",validateForm),document.querySelector(".star_rating").addEventListener("change",updateRating),window.addEventListener("resize",closeMenu);