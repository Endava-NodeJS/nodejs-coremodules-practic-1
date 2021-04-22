# 1. You have to implement functionality that calls weather API (http://api.weatherstack.com/current?access_key=a0b5a0610fc1eb8fa3a870a7f8cba8e0&query=Chisinau) and displays a result

- 1. Retrieve weather data from API using HTTP core module, for the city recieved in the process arguments
- 2. Process the recieved data
- 3. Log the result

Ex. "It's currently sunny in Chisinau, with +4 degrees Celsius."


# 2. Notes manager
## You have to implement the following functionality:
- 1. Read notes
- 2. Add notes
- 3. Remove notes
- 4. Return note by title

  
## 1. Edit notes
- 1. Load and parse the JSON data.
- 2. Change the "title" and "content" properties
- 3. Stringify the changed object and overwrite the original data
- 4. Return the changed note
   

## 2. Add notes
- 1. Parse the body object from the request or get the data from process.argv
- 2. Save the received data in a JSON file. If there was some data added before, new data should be added to the existing set of records
- 3. Return the modified/added data

  
## 3. Remove notes
- 1. Find a note by title, using the  received data from process arguments/http request
- 2. Remove it from the data set
- 3. Save the changed data
- 4. Return the removed data or print a message that will reflect the status of the operation