import { grabScroll } from "./modules/helper";
import { getData } from "./modules/http";

const categories_list = document.querySelector('.categories__list');
const in_cinema = document.querySelector('.in-cinema__content');
const bg_poster = document.querySelector('.bg-poster');


getData("/trending/movie/day?language=ru-RU")
  .then(res => reload(res.data.results, in_cinema))
getData("/trending/movie/day?language=ru-RU")
  .then(res => console.log(res.data.results))
grabScroll(categories_list)


function reload(arr, place) {
  place.innerHTML = ""
  for (const item of arr) {
    const div = document.createElement("div")
    const banner = document.createElement("div")
    const banner_bg = document.createElement("div")
    const about = document.createElement("div")
    const about_text = document.createElement("div")
    const rating = document.createElement("div")
    const rating_text = document.createElement("span")
    const title = document.createElement("span")
    const subtitle = document.createElement("span")

    div.classList.add("content-item")
    banner.classList.add("item-banner")
    title.classList.add("item-title")
    subtitle.classList.add("item-subtitle")

    banner.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${item.poster_path})`
    title.textContent = item.title
    title.style.color = "white"


    div.onmouseenter = () => {
      bg_poster.style.opacity = "0"
      banner.style.background = "rgba(54, 87, 203, 0.65)"
      setTimeout(() => {
        bg_poster.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${item.backdrop_path})`
        bg_poster.classList.add("change")
        bg_poster.style.opacity = ".7"
      }, 1000);
    }
    div.onmouseleave = () => {
      bg_poster.classList.remove("change")
      bg_poster.style.backgroundImage = `url(public/defoult-bg.png)`
    }

    div.append(banner, title, subtitle)
    banner.append(about, rating, banner_bg)
    about.append(about_text)
    rating.append(rating_text)

    place.append(div)
  }
}