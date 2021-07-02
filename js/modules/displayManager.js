
/**
 * DisplayManager has methods to handle UI updates based off retrieved mock stock data 
 * 
 */
class DisplayManager {

    constructor(responseJSONData) {
                
        this.setResponseJSONData(responseJSONData);

        this.currentPage = this.responseJSONData.page ?? 0;

        this.totalDataCount = this.responseJSONData.total ?? 0;

        this.resultsData = this.responseJSONData.data ?? [];

        this.resultsPerPage = this.responseJSONData["per_page"] ?? 0;

        this.totalPages = this.responseJSONData["total_pages"] ?? 0;

        this.initDisplay();
        
    }

    /**
     * initDisplay initialises the UI Display with retrieved or existing data
     * @return {void}
     */
    initDisplay() {
    	this.setPageHeadingDisplay();

    	this.setPaginationDisplay();

    	this.setResultDescriptionDisplay();

    	this.setResultsTableDisplay();

    	this.errorDisplay();
    }

    

    /**
     * getPageHeadingDisplayElement retrieves the main page view heading in the UI
     * 
     * @return {DomObject | String} a domobject or an empty string on failure
     */
    getPageHeadingDisplayElement(){
        return document.querySelector('.page-header-text') ?? "";

    }

    /**
     * getPaginationDisplayElement retrieves the pagination display element
     * 
     * @return {DomObject | String} a domobject or an empty string on failure
     */
    getPaginationDisplayElement(){
    	return document.querySelector('.pagination-list') ?? "";
    }

    /**
     * getResultDescriptionDisplayElement retrieves the pagination result description
     * element.
     * 
     * @return {DomObject | String} a domobject or an empty string on failure
     */
    getResultDescriptionDisplayElement(){
    	return document.querySelector('.results-description') ?? "";
    }

    /**
     * getResultsTableDisplayElement retrieves the results table element 
     * 
     * @return {DomObject | String} a domobject or an empty string on failure
     */
    getResultsTableDisplayElement(){
    	return document.querySelector('table') ?? "";
    }

    /**
     * getDefaultMessageDisplayElement retrieves the message display UI element used
     * in alerting viewers on issues with data retrieval and more 
     * 
     * @return {DomObject | String} a domobject or an empty string on failure
     */
    getDefaultMessageDisplayElement(){
    	return document.querySelector('.default-message') ?? "";
    }

    /**
     * getCurrentPage retrieves the current page being displayed
     * @return {Integer} 
     */
    getCurrentPage(){
        return this.currentPage;
    }

    /**
     * setResponseJSONData sets or updates the responseJSONData property of the
     * class
     * @param {Object} responseData the retrieved json response data for display
     */
    setResponseJSONData(responseData) {
        this.responseJSONData = responseData;
    }

    /**
     * setPageHeadingDisplay updates the page heading UI element with the current
     * Page
     */
    setPageHeadingDisplay() {

        let pageHeadingArea = this.getPageHeadingDisplayElement();

        if (pageHeadingArea !== "") {

        	pageHeadingArea.getElementsByTagName('span')[0].classList.remove('hidden');
            pageHeadingArea.getElementsByTagName('span')[0].textContent = this.currentPage ?? 0;

        } else {

            console.log("No page header detected");
        }
    }

    /**
     * setPaginationDisplay updates the pagination list items 
     */
    setPaginationDisplay() {
        let paginationList = this.getPaginationDisplayElement();

        if (paginationList !== "") {

            if (this.totalPages > 1) {

                paginationList.classList.remove('hidden');

                // initialise pagination event
                const paginationReadyEvent = new Event('PaginationReady');

                if(paginationList.childElementCount < 1){
                    let listItems = `<li>
                                <a href="##prev" data-prev-page="true">
                                    <span>< Prev</span>
                                </a>
                            </li>`;

                    for (var i = 1; i <= this.totalPages; i++) {
                        let activeClass = i == this.currentPage ? "active": "";

                        listItems += `
    						<li>
                                <a href="##page=${i}" class="${activeClass}" data-page="${i}">
                                    <span>${i}</span>
                                </a>
                            </li>
                        `;
                    }
                    listItems += `<li>
                                <a href="##next" data-next-page="true">
                                    <span>Next ></span>
                                </a>
                            </li>`;


                    paginationList.innerHTML = listItems;
                    
                    document.dispatchEvent(paginationReadyEvent);


                } else {

                    // handle the removal or addition of the active clase
                    // to pagination jump links.
                    
                    let listItems = paginationList.children;


                    for (var i = 1; i < listItems.length -1; i++) {

                        let element = listItems[i];

                        if( i == this.currentPage){

                            element.children[0].classList?.add('active');
                        } else {

                            element.children[0].classList?.remove('active');
                        }
                        
                    };
                    
                }


            } else {
                paginationList.classList.add('hidden');
            }

        } else {

            console.log("No pagination list detected");

        }
    }


    /**
     * setResultDescriptionDisplay updates the results descriptions element with
     * information on the current view the user is on and number of results shown.
     */
    setResultDescriptionDisplay() {
        let resultsDescription = this.getResultDescriptionDisplayElement();

        if (resultsDescription !== "") {
            resultsDescription.classList.remove('hidden');
            if (this.resultsData.length > 0 && this.resultsPerPage > 0) {
                

                let resultSetEnd = this.currentPage > 1 ?
                	this.currentPage * this.resultsPerPage : 
                	this.resultsData.length;

                let resultSetStart = this.currentPage > 1 ? 
                	resultSetEnd - this.resultsData.length + 1:
                	this.currentPage;

                

                resultsDescription.innerHTML = `
	    			Showing <b>${resultSetStart}</b> to <b>${resultSetEnd}</b> of <b>${this.totalDataCount}</b> results
	    		`;

            } else {
                resultsDescription.innerHTML = '';
            }

        } else {
            console.error('No results description area found');
        }
    }

    /**
     * setResultsTableDisplay Updates the results table rows display with 
     * retrieved data.
     */
    setResultsTableDisplay() {

        let resultsTable = this.getResultsTableDisplayElement();

        if (resultsTable !== "") {
            let resultsTableBodyHTML = '';

            for (var i = 0; i < this.resultsData.length; i++) {

                let currentData = this.resultsData[i];
                let date = currentData.date ?? "";
                let open = currentData.open ?? "";
                let high = currentData.high ?? "";
                let low = currentData.low ?? "";
                let close = currentData.close ?? "";

                resultsTableBodyHTML += `
    				<tr>
						<td>${date}</td>
						<td>${open.toString()}</td>
						<td>${high.toString()}</td>
						<td>${low.toString()}</td>
						<td>${close.toString()}</td>
					</tr>
    			`;
            }
            resultsTable.classList.remove('hidden');
            resultsTable.getElementsByTagName('tbody')[0].innerHTML = resultsTableBodyHTML;
        } else {
            console.error('No results table element found');
        }
    }



    /**
     * hideDisplayedDataAreas hides UI elements providing data retrieval information
     * on screen
     * @return {void} 
     */
    hideDisplayedDataAreas(){
        document.querySelector('.page-header-text')?.firstElementChild.classList.add('hidden');

        // document.querySelector('.pagination-list')?.classList.add('hidden');

        document.querySelector('.results-description')?.classList.add('hidden');

        document.querySelector('table')?.classList.add('hidden');

    }
    /**
     * errorDisplay shows errors on data retrieval or request issues on screen
     * @return {void} 
     */
    errorDisplay() {

        let defaultMessage = this.getDefaultMessageDisplayElement();


        if(defaultMessage !== ""){
            // console.log(this.responseJSONData);
	        if (this.responseJSONData.responseStatus) {
	        	
	        	this.hideDisplayedDataAreas();
	        	defaultMessage.textContent = 'Request Exception';
	        	defaultMessage.classList.remove('hidden');

	        } else if (this.resultsData.length == 0) {
	        	
	        	this.hideDisplayedDataAreas();
	        	defaultMessage.textContent = 'No Results Found';
	        	defaultMessage.classList.remove('hidden');

	        }

        } else {
        	console.error('Default message area not found');
        }
    }

}

export {DisplayManager};