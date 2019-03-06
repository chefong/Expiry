# Expiry

Expiry is a React application for Mercedes-Benz R&D's Design Challenge. The goal was to create a web application that manages a fleet of couriers and their respective loads in "real-time" via an inputted CSV file. More specifically, the user would need to be able to keep track of any overloads that may occur within any of the couriers as a result of merging with one another.

## Setup
To run Expiry locally, run the following command to install all dependencies:
```bash
npm install
```

To run the application, run the following command:
```bash
npm run start
```

Alternatively, if you have yarn installed, you may run the following command:
```bash
yarn start
```

Navigate to localhost:3000 on a browser (if a browser window did not automatically open). This is what you should see.
<p align="center"><img src="./src/assets/images/screenshot.png" width="90%"/></p>

### Functionality

Filtering allows for displaying the couriers in a specified order.
<p align="center"><img src="./gifs/filter.gif" width="90%"/></p>

The user can select and deselect on bar elements, which dynamically updates the information displayed.
<p align="center"><img src="./gifs/select.gif" width="90%"/></p>

Merging allows for more than 1 courier to combine loads, as long as the 90% maximum capacity is not exceeded.
<p align="center"><img src="./gifs/merge.gif" width="90%"/></p>
