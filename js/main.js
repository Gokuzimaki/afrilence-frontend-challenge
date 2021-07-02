/////////////////////
// Import Classes //
////////////////////

// Import FetchStockDataClass for managing data requests
import {FetchStockData} from './modules/fetchData.js';

// Import DisplayManager Class for managing UI Updates
import {DisplayManager} from './modules/displayManager.js';


window.addEventListener('load', function(e){

	// Load up the default page display
	initDisplay(1);

	// initialise pagination elements
	document.addEventListener('PaginationReady', function(){
		initPagination();
	});


});

/**
 * initDisplay initialises the page elements with retrieved content as needed
 * @param  {Number} page the number of the default page to be retrieved off the 
 *                       dataset
 *                       
 * @return {void}      
 */
async function initDisplay(page = 1){

	let stockData = new FetchStockData(page);


	let stockJSONData = await stockData.getStockData();


	let displayManager = new DisplayManager(stockJSONData);

	window['currentPage'] = displayManager.getCurrentPage();
}

/**
 * initPagination initialises event listeners on existing pagination elements within
 * 	the page
 * @return {voud} 
 */
function initPagination(){
	let paginationLinks = document.querySelectorAll('.pagination-hold a');

	paginationLinks?.forEach( function(pageLink,index,links){
		
		
		pageLink.addEventListener('click',  function(){

			let pageID = this.getAttribute('data-page');
			
			let isNext = this.getAttribute('data-next-page');

			let isPrevious = this.getAttribute('data-prev-page');
			

			if(isNext && isNext !== null){
				pageID = parseInt(currentPage) + 1;
			}

			if(isPrevious && isPrevious !== null){
				pageID = parseInt(currentPage) - 1;
			}

			if(pageID !== null){
				 initDisplay(pageID);
			}
		});
		
	});
}
