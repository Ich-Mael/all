// const vimeo_source =["https://player.vimeo.com/video/89113402?wmode=opaque&api=1&amp;player_id=vimeo&amp;title=0&amp;byline=0&amp;portrait=1&amp;badge=0&amp;color=ffffff&amp;wmode=opaque", "https://player.vimeo.com/video/536620704?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"];

// for(i=1; i>=3 ; i++){
//     play = `playVideo_${i}`;
//     vimeo_source = `vimeo_source_${i}`;

//     play.addEventListener("click", ()=>{
//         document.getElementById("#vimeo-content").src = vimeo_source;
//     });
// }

const items = document.querySelector(".course-list");
items.addEventListener("click", (e)=>{
    if(e.target && e.target.nodeName == "LI") {
        console.log(e.target);
    }
});
// for (var i = 0; i < items.length; i++) {
//     items[i].addEventListener("click", ()=>{
//         document.querySelector("#vimeo-content").src = vimeo_source[i];
// });

