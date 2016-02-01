#MyLocations

## an example interview project for Welldone software
---

**Installation**

 - gulp with browserSync - for build and develop
 - bower - for handling client-side dependencies
 - angular.js
 - angular ui-router (with extras for sticky views)
 - ratchet.js - for ios like theme

**Setup**

 - clone repository
 - run npm install
 - run npm test or
 - run npm start 
 
###App explanation
The app was designed for mobile phones, while it will work in a desktop browser, it won't look pretty.  
The app has 2 pages - locations and categories, accessible from the bottom bar.  
You can swipe left or right to navigate between the pages.  

**Categories:**  
  There is a "add category" button, when pressed it will add an input you can change a category's name.  
  Category names can be changed in line.  
  
**Locations:**  
  at the top bar there is a plus icon.  
  you can press that icon to add a new location.  
  When adding a location, a popup will appear with a form.  
    Pressing the edit icon in coordinates will open a map to choose coordinates.  
    Alternatively, when adding an address, the app will geocode for the coordinates automatically.  
  When there are locations, they will appear on the main screen.  
  Choosing a location will make available two new commands at the top bar - remove and edit.  
  Also pressing on the right chevron will show the location on the map.  
  
###Structure

The file structure is based on the default cordova project.  
All items exist in `www` folder.  
All tests exist in `test\unit` folder -with specs matching file names in `www\js`.  

  `www\js\app.js` - main app, in charge of loading and configuring other modules  
  `www\js\data` - folder containing localStorage and models  
  `www\js\page` - controllers for locations and categories pages  
  `www\js\modals` - controllers for modals  
  `www\js\ui` - misc services and directives that change or add to the ui  
