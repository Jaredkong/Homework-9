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

        console.log("hello" + response.data[1].stargazers_count)
        console.log(parseInt(response.data[1].stargazers_count) + parseInt(response.data[5].stargazers_count) )

        let totalStars = 0
        for (var i=0; i < response.data.length; i++) {
           
            console.log(i)
            totalStars += parseInt(response.data[i].stargazers_count)
         
        }
        console.log("we adding numbers" + response.data[7].stargazers_count,response.data[5].stargazers_count,response.data[1].stargazers_count)
        console.log("THIS IS WHATEVER" + totalStars)
        return totalStars
    }
    catch(err){
        console.error(err)
    }
}



async function init () {
    try{
        const {github: githubUsername, faveColor } = await inquirer.prompt(questions);
        console.log (`searching for ${githubUsername}`);
        getUser(githubUsername);
        const totalStars = await getTotalStars(githubUsername);
        console.log("here is your favorite color!!" + faveColor)
        console.log("here r ur totl stars" + totalStars);
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
    console.log('successfully created resume', res.filename);
    open(resumeFilePath);
  });
}





init();