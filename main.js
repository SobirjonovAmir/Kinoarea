import { grabScroll } from "./modules/helper";
import { getData } from "./modules/http";

const categories_list = document.querySelector('.categories__list');
const in_cinema = document.querySelector('.in-cinema__content');
const bg_poster = document.querySelector('.bg-poster');
//let genres = document.querySelectorAll('.categories__list-item');

const API_KEY = 'f1d5beaab7f191450fc1bdd4b37d1f96';

//fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
//  .then(response => {
//    if (!response.ok) {
//      throw new Error(`Произошла ошибка при запросе: ${response.status}`);
//    }
//    return response.json();
//  })

//  .then(data => {

//  })
//  .catch(error => {
//    console.error('Произошла ошибка:', error);
//  });
getData(`/genre/movie/list?api_key=${API_KEY}`)
  .then(res => {
    const all = document.createElement("li")
    all.classList.add("categories__list-item", "active")
    all.textContent = "all"
    all.setAttribute("data-genre", "all")
    categories_list.append(all)

    getData(`/movie/now_playing?api_key=${API_KEY}&language=ru-RU`)
      .then(res => reload(res.data.results.slice(0, 8), in_cinema))

    const genres = res.data.genres;
    genres.forEach(genre => {
      const { id, name } = genre;
      const li = document.createElement("li")

      li.classList.add("categories__list-item")
      li.setAttribute("data-genre", id)
      li.textContent = name

      categories_list.append(li)
      let all_genres = document.querySelectorAll(".categories__list-item")
      all_genres.forEach(li => {
        li.onclick = () => {
          document.querySelectorAll(".categories__list-item").forEach(el => el.classList.remove("active"))
          li.classList.add("active")
          let key = li.getAttribute("data-genre")

          if (key === "all") {
            getData(`/movie/now_playing?api_key=${API_KEY}&language=ru-RU`)
              .then(res => reload(res.data.results.slice(0, 8), in_cinema))
          } else {
            getData(`/movie/now_playing?api_key=${API_KEY}&with_genres=${+key}&language=ru-RU`)
              .then(res => {
                const movies = res.data.results;
                reload(movies.slice(0, 8), in_cinema)
              })
          }
        }
      })
    });
  })






grabScroll(categories_list)



function reload(arr, place) {
  place.innerHTML = ""
  for (const item of arr) {
    const div = document.createElement("div")
    const banner = document.createElement("div")
    const banner_bg = document.createElement("div")
    const about = document.createElement("div")
    const about_text = document.createElement("span")
    const rating = document.createElement("div")
    const rating_text = document.createElement("span")
    const title = document.createElement("span")
    const subtitle = document.createElement("span")

    div.classList.add("content-item")
    banner.classList.add("item-banner")
    banner_bg.classList.add("item-banner__bg")
    rating.classList.add("item-rating")
    about.classList.add("item-about")
    title.classList.add("item-title")
    subtitle.classList.add("item-subtitle")


    about_text.textContent = "Карточка фильма"
    rating_text.textContent = (+item.vote_average).toFixed(2)
    banner.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${item.poster_path})`
    title.textContent = item.title
    title.style.color = "white"


    banner.onmouseenter = () => {
      banner_bg.classList.add("active")
      bg_poster.style.opacity = "0"
      setTimeout(() => {
        bg_poster.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${item.backdrop_path})`
        bg_poster.classList.add("change")
        bg_poster.style.opacity = ".7"
      }, 1000);
    }
    banner.onmouseleave = () => {
      banner_bg.classList.add("hide")
      setTimeout(() => {
        banner_bg.classList.remove("hide")
        banner_bg.classList.remove("active")
      }, 300);
      bg_poster.classList.remove("change")
      bg_poster.style.backgroundImage = `url(public/defoult-bg.png)`
    }

    div.append(banner, title, subtitle)
    banner.append(rating, banner_bg)
    banner_bg.append(about)
    about.append(about_text)
    rating.append(rating_text)

    place.append(div)
  }
}




