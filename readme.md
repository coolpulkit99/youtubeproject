## Youtube Video server

### Endpoints  

* ```/``` - Endpoint to check status of server
* ```/getData/:page``` - Gets the video data stored in database with paginated response 5 entries per page and page number as a param. Also takes queries for ```title``` and ```desc``` to search withing title and description respectively.
* ```/startTimer``` - To start the timer to fetch data from youtube. Included so as to avoid database flooding with data from youtube. Also the youtube api called return limited video response to save storage space.
* ```/endTimer``` - Stops the timer started by ```/startTimer```

### How to use

1. Set ```MONGO_URI``` and ```KEY``` env variable in ```.env``` file or otherwise. 
    * MONGO_URI contains mongo url 
    * KEY contains google api key to access youtube api

2. Run below command to install node modules<br>
    ```npm i```

3. Run below command to execute server<br> 
    ```node index.js```

4. Start/stop the timer using the above timer endpoint

5. Query database using ```/getData``` endpoint 