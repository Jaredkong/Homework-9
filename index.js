const inquirer = require('inquirer');
const axios = require('axios')
const questions = 

[
    {
        type: "input",
        name: "github",
        message: "What's your github username?",
    },

    {
        type: "list",
        name: "color",
        message: "What is your favorite color?",
        choices: ["red","green","blue"]

    }
];



function getUser (username) {
        return axios
          .get(
            `https://api.github.com/users/${username}`
          )
          .then(
              response => {console.log(response)
                console.log(response.data.followers)

               let githubFollowers = response.data.followers;
               let githubLocation = response.data.location;
               let githubPublicRepos = response.data.public_repos;
               let githubFollowing = response.data.following;
               let githubhtmlUrl = response.data.html_Url;
            
            
            }  
          )
          


};

async function init () {
    const {github: githubUsername, faveColor } = await inquirer.prompt(questions);
    console.log (`searching for ${githubUsername}`);
    getUser(githubUsername);
    
        
              
          
};

    





init();