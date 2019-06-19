
- Models:
    - DJ
        - Name 
        - Description
        - Methods:
    - Show    
        - Name 
        - Description
        - Methods:
    - Scheduled Show
        - Schedule 
        - Show
        - Day
        - Hour
        - Minute
        - Duration
        - Methods
            - start_time(self)
                - Returns start time tuple
            - end_time(self)
                - Returns end time tuple
            - clean(self)
                - Checks if the day, hour, and minute are in valid range

Markdown


INSTRUCTIONS FOR COMMITTING:

COMMIT → PULL → PUSH

How to setup the sql server
-------------------
1. make sure mysql is started and its has a user with username: root and password: root
2. if not you can make one or change the username and password in header.js in database/ folder to yours
3. then run "node init.js" in database/ it will make the database and tables

How to use the express server API
-------------------
Here's a list of all the fetch commands the server supports and the syntax of the request and response object. I am basically just going thru each method in TestPage.jsx here line by line. Also The methods are grouped into gets, posts, and deletes. Gets just get data and posts do both creating of entries and updating entries.

Example 0: All fetches
-------------------
So all the fetches have the same syntax except for the get fetches. These are the fetches that have no request object in the arguments and have only the express server url as the parameter. Also the link was always end with a '/'
        
        0.1: Get fetches
        ----------------
        fetch(your resource link here).then() <-- the .then() is a promise, fetch is an async call so we have to 
                                                  either wait for the object to come back. 
        fetch(resource link).then(function(resObj) { <-- Or just give the website something to do when we get it
            // do stuff with resObj
        }
       
        but actually first thing to do is parse the resObj.body field because its a string. but its also where
        i put all the data is, so:
        
        fetch(res link).then(resObj => resObj.json()).then(function(data) { <-- .json() is a browser method that 
                                                                                 that parses the body string for us
                                                                                 then gives us our data json object
        0.2: All other fetches
        -----------------
        fetch(res link, {
            method: "YOUR METHOD", //POST, DELETE, etc.
            headers: {                                              <-- 
                "Content-Type": "application/json ; charset=utf-8"  <-- never changes for our site always the same
            },                                                      <--
            body: JSON.strinfigy(your data object)  <-- data object is specific to each request, then make it a str
        }).then(    <-- back to doing stuff with response object
        
Example 1: Get fetches
---------------------
Again all fetches where you just want data just go you don't need the request object so the fetch only uses the following resource links. The fields from returned from the server are the exact same here.

    1.1: get array of users: '/api/get/users/'
    --------------------
    .then(data => {
        let userObjArray = data.userObjArray;   <-- actual array was stored in data.userObjArray
        let userObj = userObjArray[0];     
        // just showing the different fields of a single object here
        userObj._user_name --> the user name
        userObj._user_pass --> the user password
        userObj._user_pic --> FOR NOW just some url
        userObj.user_bio --> the user bio, all these fields are strings atm

    1.2 get array of shows (digital and fm): '/api/get/shows/' + your_channel_variable ('fm' or 'dg') + '/'
    ---------------------
    .then(data => {
        let showObjArray = data.showObjArray   <-- actual array was stored in data.showObjArray
        let showObj = showObjArray[0];
        // the different fields of the show object are
        showObj._show_channel --> "fm" or "dg"
        showObj._show_day --> [0, 6]
        showObj._show_description -->
        showObj._show_djs --> array of JUST the name of the djs, info about djs have to be request sperate :(
        showObj._show_duration -->
        showObj._show_genre -->
        showObj._show_id -->
        showObj._show_name -->
        showObj._show_start_hour --> [0, 23]
    
    1.3 get user by name: '/api/get/users/' + name of the user + '/'
    ---------------------
    .then(data => {
        let userObj = data.userObj;
        // fields same as 1.1
    
    1.4 get show by id: '/api/get/id/' + id of the show + '/'
    ----------------------
    .then(data => {
        let showObj = data.showObj;
        // same as 1.2
        
    1.5 get show by name: '/api/get/name/' + name of the show + '/'
    ----------------------
    //same as 1.4 only the res link has changed

Example 2: Post fetches
-----------------------
The post methods on the express server need more than just the show_id or user_name so we gotta use the request objects now. I use 'put' to mean create entry in sql here. These are more complicated so ill write out the whole fetch process for the user.

    2.1 put user: '/api/put/user/'
    -----------------------------
    yourButtonEventListener() {
        let newUserInfo = {   <-- can be named whatever you wanted
            user_name: document.getElementById('your inputs')     <
            user_pass:  //etc.
            user_pic:   //only thing that is set are the fields of info object i.e. myJson.user_name
            user_bio:   //kind of confusing because server uses .my_variable and client uses ._my_variable
        }
        fetch('/api/put/user/', {
            method: "POST", <-- all post fetches need this
            header: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(newUserInfo)  <-- turns data json object to string which will be parsed on server     
        }).then(resObj => resObj.json()).then(data => {
            data.put_status --> either boolean true or boolean false (success=true | fail=false)
            data.put_message --> success message or fail message to display
        });
    }
    
    now that you got the gist ill just write out the fetch request object (the thing that comes after the link).
    and what to do with the response object
    
    2.2 put show: '/api/put/show/'
    --------------------------------
    let newShowInfo = {
        show_name:
        show_description:
        show_genre:
        show_day:
        show_start_hour:
        show_duration:
        channel:
    }
    ...
    // the server will auto generate a new id for the show, it wont collide with the others
    .then(data => {
        data.put_status -->   //same fields as 2.1 with status again a boolean but the message is different
        data.put_message -->  //put show can fail if the start_hour of a day is already taken
     
     2.3 update user: '/api/update/show/'
     ---------------------------------
     //almost the exact same as 2.1
     let updatedUserInfo = {
        //same exact fields
     }
     ...
     .then(data => {
        data.upd_status --> boolean true or boolean false
        data.upd_message --> update message for success or failure
   
    2.4 update show: '/api/update/show/'
    ------------------------------    
    //a little different from 2.2, changing channel doesnt work right now and the show_id field is necessary
    let updatedShowInfo = {
        // same as 2.2 omit the channel: field
        show_id:   <-- need this
    }
    .then(data => 
        data.upd_status -->
        data.upd_message --> fails for the same reasons as 2.2
    }
    
Example 3: Delete fetches
-------------------------
Basically same format as the post fetches accept that the data we are sending changes and the method: field of the fetch request object changes as well. Also I don't use the resource link as a parameter for the express delete methods because then just enterting the url on your browser would mess with the sql server.

    3.1 delete user: '/api/delete/user/'
    --------------------
    //here is my code verbatim from TestPage.jsx
    let deleteUserInfo = {
        user_name: document.getElementById('delete_user_name').value
    };
    fetch('/api/delete/user/', {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(deleteUserInfo)
    }).then(resObj => resObj.json()).then(data => {
        console.log("User delete operation status is: " + data.delete_status);
        console.log(data.delete_message);
    });
    
    3.2 delete show: '/api/
    --------------------
    let deleteShowInfo = {
        show_id:
    };
    ...
    .then(data => {
        data.delete_status -->
        data.delete_message -->
    
    
            
            
        
            









