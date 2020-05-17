const inquirer = require('inquirer');
const axios = require('axios');
const htmlpdf = require ('html-pdf');
const open = require('open');
const generateHTML = require('./generateHTML');

let githubRepos, githubLocation, githubFollowers, githubFollowing, githubPublicRepos, githubhtmlUrl, githubPicture, realName;


const questions = 

[
    {
        type: "input",
        name: "github",
        message: "What's your github username?",
    },

    {
        type: "list",
        name: "faveColor",
        message: "What's your favorite color?",
        choices: ["green", "blue", "pink", "red"]

    }
];



async function getUser (username) {
    try{
        const response = await axios.get(`https://api.github.com/users/${username}`)

        githubPicture = response.data.avatar_url;
        githubFollowers = response.data.followers;
        githubLocation = response.data.location;
        githubPublicRepos = response.data.public_repos;
        githubFollowing = response.data.following;
        githubhtmlUrl = response.data.html_url;
        githubRepos = response.data.repos_url;
        realName = response.data.name;
                
             
          
    }
    catch (err){
        console.error(err)
    }  


};
async function getTotalStars(username) {
    try {
        const response = await axios.get(`https://api.github.com/users/${username}/repos`)

        let totalStars = 0
        for (var i=0; i < response.data.length; i++) {
           
           
            totalStars += parseInt(response.data[i].stargazers_count)
         
        }
     
        return totalStars
    }
    catch(err){
        console.error(err)
    }
}



async function init () {
    try{
        const {github: githubUsername, faveColor } = await inquirer.prompt(questions);
        getUser(githubUsername);
        const totalStars = await getTotalStars(githubUsername);
        const html = generateHTML ({
            githubUsername,
            faveColor,
            githubRepos, 
            githubLocation, 
            githubFollowers, 
            githubFollowing, 
            githubPublicRepos, 
            githubhtmlUrl,
            totalStars,
            githubPicture,
            realName
        });
        generatePDF(html);
    }catch (err){
        console.error(err);
    }


              
          
};

function generatePDF(html){
    const resumeFilePath = './resume.pdf';
    htmlpdf.create(html, { format: 'Tabloid' }).toFile(resumeFilePath, (err, res) => {
        if (err) {
            return console.error(err);
        }
    open(resumeFilePath);
  });
}





init();