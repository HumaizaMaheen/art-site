
// first we are selecting all the elements with class 'info-btn '( are buttons ) using querySelectorAll
// then we are applying function foreach basically we using it to apply an event listener to all the elements selected
//used event listner so that on click it performs a specified function 
// storing the attributes value/data in the variables mentioned(title, price etc) from attributes specified inside html tags(eg data-)
// selecting the element with id infoContent 
// injecting a dynamic httml using innerhtml so that every time a user click on an info button it should be updated
//using bootstrap modal to create bootstrap object modal from an exsisting html modal element for elements with id Infomodal and on click it should showon the screen 
document.querySelectorAll('.info-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const title = this.getAttribute('data-title');
    const price = this.getAttribute('data-price');
    const artist = this.getAttribute('data-artist');
    const story = this.getAttribute('data-story');

    document.getElementById('infoContent').innerHTML = `
      <h3>${title}</h3>
      <p><strong>Price:</strong> ${price}</p>
      <p><strong>Artist:</strong> ${artist}</p>
      <p><strong>Story:</strong> ${story}</p>
    `;
    new bootstrap.Modal(document.getElementById('infoModal')).show();
  });
});







// 767 to 829
// setting the scroll indext to zero
// card width = gap as margin each card taking
// total number of cards 
// visible cards other should be hidden visible on scrolling
//function
// function where direction pass as parameter the value is passed in the scroll buttons inside function when the button is clicked the is passed acc to the value passed in that button function
// storing all elements with id 'card scroll' in wrrapper variable
// scrollindex = scrollindex=direction it is used to control the direction if the user click right button it move forward(+1) if left the backwards(-1)
// limiting scroll range if eg SI is 3 and MI is (5-3)= 2 so SI>2 then it should make it SI=MI else if SI 0 it should be 0 so that it wont go any father to right side as well as left respecttively
//wrapper which has all the cards by id by using javascrip propert control horizontal scroling scrollleft then SI*CW 
//scrollIndex === maxIndex This checks if youre at the last scroll step === means "strictly equal" If this is true then it means you've reached the end of the scroll.
// using ternary operators when reach the end then block means show the see more button if not then none 



    let scrollIndex = 0;
    const cardWidth = 300 + 16; // card width + margin
    const totalCards = 5;
    const visibleCards = 3;

    function scrollCards(direction) {
        const wrapper = document.getElementById("card-scroll");
        scrollIndex += direction;

        // Limit scroll range
        const maxIndex = totalCards - visibleCards;
        if (scrollIndex > maxIndex) scrollIndex = maxIndex;
        if (scrollIndex < 0) scrollIndex = 0;

        wrapper.scrollLeft = scrollIndex * cardWidth;

        // Show/hide See More
        const seeMore = document.getElementById("see-more");
        seeMore.style.display = scrollIndex === maxIndex ? "block" : "none";
    }

// store all the Elemens with class reel and storing it in variable videos 
// current =0
//fuction
//function created playnext using videos.foreach to apply what we want to do on all the elements with class reel loops through each video
// it is reseting videos after playing it for 6 sec for one video then pausing it again setting the current time to 0 remove any active styling or other class
// .pause is a builtin method for video 
// Before we start playing the next video, we want to make sure all other videos are stopped
// .currentTime is a property of a video that tells how many seconds in the video we are setting it to 0 means rewind the video to the start
// So that if we come back to this video later, it starts from the beginning
// classlist lets you acess all the classes in the element .remove remove the class named active
// videos[current] grabs the specific video at that position We save it in a variable called currentVideo so we can use it easily in the next lines
// .play videos that is at the current index to play video automattically
// when index 0+1 =1 %5 it wont start from start in fact it goes to the next video after 6 sec then same as it current +1 reaches = 5 , 5%5=0 then it starts again




const videos = document.querySelectorAll('.reel');
let current = 0;

function playNext() {
  // Reset all videos
  videos.forEach(video => {
    video.pause();
    video.currentTime = 0;
    video.classList.remove('active');
  });

  // Play the current video
  const currentVideo = videos[current];
  currentVideo.classList.add('active');
  currentVideo.play();

  // Set up the next one to play after 2 seconds
  setTimeout(() => {
    current = (current + 1) % videos.length;
    playNext();
  }, 6000);
}

// Start the sequence
playNext();
