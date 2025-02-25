# Johannes Blog and Forum #

## Project Description  ##
### What
I build an online blog where users can read articles and a forum where users can post and discuss their thoughts. They have to login to participate. Admins have special privileges and can manage articles.  

### WHY
I used this project to learn and apply the basics of web development. In addition to the basicsc of HTML,CSS and JavaScript I learned how to:
+ set up a nodejs server using Express
+ interact with databases using Mongoose and mongoDB
+ work with environment variables
+ safely manage user authentication with bycrypt and JWT
+ how to host and deploy on render.com

a live version can be found here: [JohannesBlog](johannesblog.onrender.com) 
disclaimer: it might take a few moments to load as renders free instance will spin down with inactivity, which can delay requests by 50 seconds or more.

## Features ##

+ Read blog articles.
+ Participate in forum discussions (login required).
+ Admins can:
   * Add new articles.
   * Update existing articles.
   * Delete articles.

### Future Features ###
+ Users can comment, like or upvote on both articles and forum posts.
+ Users can set a profile picture.
+ More features to be added, very open to hear suggestions!

## How to install and run locally  ##
if you want to use the project locally make sure to follow these steps

###  1.Clone the repository


```
$ git clone https://github.com/johannes12336/JohannesBlog.git <folder_name>

```

### 2. Install the dependencies

make sure to install the the following npm packages before continuing by using: 

 ```
 npm install
 ```


 **bcrypt** (^5.1.1) - For password hashing.
 
   **dotenv** (^16.4.7) - For environment variable management.
 
  **ejs** (^3.1.10) - For templating views.
 
  **express** (^4.21.2) - Web framework.
  
  **jsonwebtoken** (^9.0.2) - For authentication.
 
  **mongoose** (^8.9.7) - For MongoDB database interactions.
 
  **slug** (^10.0.0) - For generating SEO-friendly URLs.

 
### 3. Set up environment variables
create a .env file in the root directory and add: 
```
MONGODB_URI=<your_mongodb_connection_string>
SECRET=<your_secret_key>
```
### 4. Start the server
```
npm start
```

and finally open http://localhost:3000 in your browser of choice

## Credits ##
I want to use this opportunity to thank the acedemy, my mom, codecookies, and scrimba.
all credits currently to Johannes


## Contributing ##
Contributions are welcome! If you want to improve the project, feel free to fork the repository and submit a pull request.

## License ##
This project is licensed under the MIT License.