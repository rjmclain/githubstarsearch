let resultsWrapper = document.getElementById('results_wrap');

let mainForm = document.getElementById('githubForm');

let currentlySearched = document.getElementById('currently_searched');

mainForm.addEventListener("submit", function(event){
    event.preventDefault();

    //This is just for a bit of styling flavor
    if(!mainForm.classList.contains('searched')){
        mainForm.classList.add('searched');
    }
    //end styling flavor

    //get search value
    let searchbox = document.getElementById('searchbox').value;

    currentlySearched.innerHTML = `<b>Looking for:</b> ${searchbox}`;
    
    //make sure search value is valid query string (usually this involves additional checks for special characters, but I'm not entirely sure as to the depths of github's search)
    searchbox = searchbox.split(' ').join('+');

    // Actual API call
    let apiUrl = `https://api.github.com/search/repositories?q=${searchbox}+in:name,description&sort=stars&order=desc`;
    let githubRequest = new XMLHttpRequest();
    let resultsHTML = ``;
    githubRequest.onreadystatechange = function () {
        if(githubRequest.readyState === 4 ) {
            let searchResults = JSON.parse(githubRequest.responseText).items;
            for (let i=0; i<searchResults.length; i += 1) {

                // I just couldn't help but throw this little meme in for fun
                // Build out the star count section
                    let starCountSection = `<div class="star_count"> ${searchResults[i].stargazers_count} STARS`;
                    if(searchResults[i].stargazers_count > 9000) {
                        starCountSection += `                         
                            <div class="over_9">
                                IT'S OVER 9000!!!
                                <img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6d3d7e17-858b-42ea-bd73-0953f3998b28/d5vhzjz-7a170c2b-3017-463a-8efa-f311b4fbe008.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvNmQzZDdlMTctODU4Yi00MmVhLWJkNzMtMDk1M2YzOTk4YjI4XC9kNXZoemp6LTdhMTcwYzJiLTMwMTctNDYzYS04ZWZhLWYzMTFiNGZiZTAwOC5naWYifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.SP7Bx9NNZMlsq0DXOQx2S05DksU8yXfkaYPWVrKOLxw" />
                            </div>
                        `
                    } 
                    starCountSection += `</div>`;
                //End meme
                
                //HTML Breakdown
                resultsHTML += `
                    <a href="${searchResults[i].html_url}" class="result_link" target="_blank">
                        <div class="avatar_wrap">
                            <img src="${searchResults[i].owner.avatar_url}" />
                        </div>
                        <div class="text_wrap">
                            <div class="created_by">
                                ${searchResults[i].owner.login}
                            </div>
                            <div class="desc">
                                ${searchResults[i].description}
                            </div>
                            ${starCountSection}
                        </div>
                    </a>
                `;
            }
            resultsWrapper.innerHTML = resultsHTML;
        }
    }
    githubRequest.open("GET", apiUrl);
    githubRequest.send();
}, false);