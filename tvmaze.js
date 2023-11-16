"use strict";

const MISSING_IMAGE_URL = "https://tinyurl.com/tv-missing";
const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.


  const params = new URLSearchParams({ q : term });

  const response = await fetch(`http://api.tvmaze.com/search/shows?${params}`);
  const showsData = await response.json();
  //console.log(showsData);

  return showsData.map(function (scoreAndShow){
    return {
      "id" : scoreAndShow.show.id,
      "name" : scoreAndShow.show.name,
      "summary" : scoreAndShow.show.summary,
      "image" : scoreAndShow.show.image ? scoreAndShow.show.image.medium : MISSING_IMAGE_URL
    };

  });

}
//showData -> showsData
//result -> scoreAndShow
//arrow function

/** Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 * */

function displayShows(shows) {
  $showsList.empty();

  for (const show of shows) {
    const $show = $(`
        <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchShowsAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  displayShows(shows);
}

/** Takes event object, prevents screen from reloading.
 * Calls function that searches for show.
 *  */
$searchForm.on("submit", async function handleSearchForm (evt) {
  evt.preventDefault();
  await searchShowsAndDisplay();
});




/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  console.log('getEpisodesData triggered', "id = ", id);
  const response = await fetch(`http://api.tvmaze.com/shows/${id}/episodes`);
  const episodesData = await response.json();
  console.log(episodesData);

  return episodesData.map(function (episodeDetails){
    return {
      "id" : episodeDetails.id,
      "name" : episodeDetails.name,
      "season" : episodeDetails.season,
      "number" : episodeDetails.number
    };

  });

}



/** Takes array of information about tv show episodes and displays that info
 *  in the DOM. Returns nothing.
 */
function displayEpisodes(episodes) {




}


/** Takes event object, finds id of show based on which "Episodes" button got
 *  clicked, sends id to another function to retrieve data on the episodes,
 *  calls displayEpisodes(). Returns nothing.
 */
async function searchEpisodesAndDisplay(evt) {
  const $evtTarget = $(evt.target);
  const id = $evtTarget.closest(".Show").data("showId");
  console.log("id = ", id);

  // Get id of show
  const episodes = await getEpisodesOfShow(id);

}



// Make jQuery object for each show's episode button
const $episodesButtons = $(".Show-getEpisodes");


/** Triggers when "Episodes" button beneath a show is clicked. Prevents screen
 *  from reloading and calls function that retrieves an episode id.
 *  Returns nothing.
 */
$showsList.on("click", $episodesButtons, async function episodeClickHandler (evt) {
  console.log("woohoo button was clicked!");
  console.log("evt =", evt, "evt.target= ", evt.target);
  evt.preventDefault();

  await searchEpisodesAndDisplay(evt);

})

