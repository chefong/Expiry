Thank you for checking out my Design Challenge submission! Below are steps for running the application on a local server.

STEPS:
1) Unzip the file in any directory.

2) Navigate to the folder produced from unzipping the file via the command line.

3) Install all dependencies by running "npm install".

3) To start the application, run "npm run start" or "yarn start" (if you have yarn installed).

4) If a browser did not automatically open, open a browser and navigate to "localhost:3000".



HOW THE APPLICATION WORKS:
1) As stated in the window, first upload a CSV file by clicking on the upload icon. Sample CSV files are located in the "data" folder in root folder of the application. The CSV files MUST be formatted as "Name, Load, Max" in order for the application to work correctly. "Name" is the courier's name (self-explanatory), "Load" is the number of units of items in the vehicle, and "Max" is the total amount that specific courier's vehicle can store.

2) After uploading and submitting the CSV file, the user will be routed to the home page, where a horizontal bar graph displays each courier's capacity (in %) in the order that they were given in the CSV file. Each capacity is calculated as "(Load / Max) * 100)".

3) The select form allows the user to filter and order the couriers shown on the bar graph in ascending order or alphabetically (and both in reverse).

4) Clicking on a bar element allows the user to see information regarding that courier on the top left of the window. The maximum capacity is statically defined as 90%, so any courier exceeding 90% would result in an overload. Clicking on the bar element again will deselect it.

5) Clicking on multiple bar elements allows the user to potentially merge the selected couriers. The previewed merged capacity is displayed under the graph after the user selected more than 1.

6) As stated before, the no courier can exceed a capacity of 90%, so the merged capacity will be displayed in green if it is accepted and red if not.

7) Clicking the "Merge" button combines all the couriers selected. Determining whether or not a merge is allowed is done by first getting the largest maximum size of all the selected courier vehicles. Once this is found, each courier's load is added together to produce the new merged load. Then, the capacity of the newly merged vehicle is calculated like before, "(Load / Max) * 100)".

8) For further reference, you may view the GIFs that are included that demonstrate some of the application's functionalities. The GIFs are located in the "gifs" folder in the root folder of the application.



CHALLENGES FACED
A big challenge I faced while I was developing the application was figuring out how to keep track of all the couriers. I decided to keep track of them by index because I was storing all the other courier information in the same order as well. This was really helpful when developing the "merging" part because I had to access other information like their color, load, etc. Another big challenge I faced was figuring out how to design the "merging" part of the application. While doing so, I was able to figure out how to get each courier's information by simply clicking on a bar element, which made the user interface more minimal and smooth. This, again, would not be possible had I not used the couriers indices as a way to manage which ones the user selected.