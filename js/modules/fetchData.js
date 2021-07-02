/**
 * FetchStockData class has methods managing the request and data retrieval of 
 * mock stock data for display on screen
 */

class FetchStockData {
	
	constructor(page){
		this.responseObject = {};
		
		this.kBaseUri = "https://jsonmock.hackerrank.com/api/stocks";
		
		this.setPage(page);

		this.setUri();

	}

	/**
	 * setPage sets the current page to be requested
	 * @param {Integer} page is the page number requested
	 */
	setPage(page){
		this.page = isNaN(page) || page < 1 ? 1: page;
	}


	setUri(){
		this.uri = `${this.kBaseUri}?page=${this.page}`;
	}


	getResponseStatus(){
		return this.responseStatus;
	}


	/**
	 * fetchURIData performs the actual mock stock data request on remote serverr
	 * @return {Object} is either a responseObject or an object with a status index 
	 *                     holding a http status code value
	 */
	async fetchURIData () {

		// set the default status to a 408 in the event of no internet connection
		// other requests code will be available 
		let data = {status : 408};

		try {
			// statements
			data = await fetch(this.uri);

		} catch(e) {
			// this.responseStatus = 408;
			// console.log(e);
		}

		this.responseObject = data;
		this.responseStatus = data.status;

		
	}

	/**
	 * getStockData retrieeves the stocks data from the request URI
	 * @return {JSONObject} a json object of the retrieved data body. Will have a 
	 *                        status index with http status code for none 200 status 
	 *                        code
	 */
	async getStockData(){
		await this.fetchURIData();
		
				

		let jsonData = {};

		try{

			jsonData = await this.responseObject.json();

		} catch {
			
			console.error(`Could not retrieve data from ${this.kBaseUri}`);
		}

		if(this.responseStatus !== 200){
			jsonData.responseStatus = this.responseStatus;
		}

		return jsonData;
	}

	
}

export {FetchStockData};