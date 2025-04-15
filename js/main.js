gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);
//hoxton.timeline = Creative.tl;
gsap.defaults({overwrite: "auto", duration:0, ease:"none"});

// as we are using className to target elements in certain sizes in the TL, we want to suppress warnings:
gsap.config({nullTargetWarn:false});

// var tlBlocks = gsap.timeline( { defaults: { duration:0 , ease:"none" } } ),
var tls_Blocks = {},
    tlPopups = gsap.timeline( { defaults: { duration:0 , ease:"none" } } );


// content
var container       = getById("container"),
    blockGroups     = getById("block-groups"),
    blockVars       = getById("block-vars"),
    blockTemplates  = getById("block-templates"),
    blocks          = document.getElementsByClassName("block"),
    textareaCopy    = getById("example-textareacopy"),
    sections        = document.querySelectorAll(".section"),
    videos          = document.querySelectorAll(".video-popup"),


    _speed = .5;

const clickedBlocks = new Set(); // Tracks clicked blocks


function bindListeners(){
    
    document.querySelectorAll(".block").forEach(el => {

        var which = el.id.split("-")[1];
        var newTL = gsap.timeline( { defaults: { duration:0 , ease:"none" }, paused:true } );

        //
        newTL.addLabel("reset", 0)
            .to(".text", {zIndex:299}, "reset")        
            .to(".block", {zIndex:300}, "reset")
            .to(["#text-"+which+" .chars","#text-"+which,".example-editcopy"], {alpha:0}, "reset")
            .to("#text-"+which, {height:0}, "reset")

            .to("#text-"+which,.2, { alpha:1 }, ">.01")
            .to("#text-"+which, {zIndex:400}, ">")
            .to("#text-"+which, _speed, {height:"auto", ease:"power1.out"}, "<")

            .to("#text-"+which+" .chars", _speed, { alpha:1,stagger:0.01}, "<")
        .addLabel("textShowing", ">")
            .to(".block", {zIndex:300}, "textShowing")
            .to("#text-"+which, {zIndex:400}, "<")


        
        // special animation for copy editing:
        if(which=="editcopy"){
            console.log(which);

            newTL.addLabel("textEdit", "reset+=.25")
                .to([".example-editcopy .chars",".example-copy"], {alpha:0}, "textEdit")
                .to("#example-textareacopy",{left:"16.2%",top:"41%"},"textEdit")
                .to(".example-editcopy", {alpha:1}, ">")
                .to("#example-textareacopy .chars", {alpha:1,stagger:.1}, "textEdit+=.15")
                .to("#example-editcopy01 .chars", {alpha:1,stagger:.1}, "textEdit+=.15")
                .to("#example-editcopy02 .chars", {alpha:1,stagger:.1}, "textEdit+=.15")
                .to("#example-editcopy03 .chars", {alpha:1,stagger:.1}, "textEdit+=.15")
                .to("#example-editcopy04 .chars", {alpha:1,stagger:.1}, "textEdit+=.15");
        }

         // special animation for copy editing:
        if(which=="templateSpecific"){
            console.log(which);

            newTL.addLabel("templateSpecific", "reset+=.25")
                .to("#arrow-templateSpecific",.1,{rotation:90},"templateSpecific")
                .to("#templateSpecific",.1,{alpha:1},"<")
                .to([".example-editcopy .chars","#example-copy02"], {alpha:0}, "<")
                .to("#example-textareacopy",{fontSize:"0.9em", paddingTop:"0.2em", left:"23%",top:"48%",overflow:"hidden",width:"8%"},"<")
                
                .to(["#example-editcopy02","#example-textareacopy"], {alpha:1}, "<.1")
                .to("#example-textareacopy .chars", {alpha:1,stagger:.1}, "<")
                .to("#example-editcopy02 .chars", {alpha:1,stagger:.1}, "<");
        }

        if(which=="workflow"){
            console.log(which);
            newTL.addLabel("workflow", "reset+=.5")
                .to("#workflowFilters",.1,{alpha:1},"workflow")
        }

        if(which=="listView"){
            console.log(which);
            newTL.addLabel("listView", "reset+=.5")
                .to("#listView",.1,{alpha:1},"listView")
        }
        
        if(which=="productionStatus"){
            console.log(which);
            newTL.addLabel("productionStatus", "reset+=.5")
                .to("#productionStatus",.1,{alpha:1},"productionStatus")
        }
        if(which=="visibility"){
            console.log(which);
            newTL.addLabel("visibility", "reset+=.5")
                .to("#visibility",.1,{alpha:1},"visibility")
        }
        if(which=="publish"){
            console.log(which);
            newTL.addLabel("publish", "reset+=.5")
                .to("#publish",.1,{alpha:1},"publish")
        }


        tls_Blocks[which] = newTL; // Store the TL in the object with 'which' as the key


            
        
        el.addEventListener("click", () => {
            // Clear all other clicked blocks
            clickedBlocks.forEach(id => {
                if (id !== which) clickedBlocks.delete(id);
            });

            clickedBlocks.add(which); // Mark this block as clicked
            showToolTip(which, true);
        });

        el.addEventListener("mouseenter", (event) => {
            event.stopPropagation();
            document.querySelectorAll('.active').forEach(el => el.classList.remove('active'));

            el.classList.add("active");
            showToolTip(which);
        });

    });



    document.querySelectorAll(".text").forEach(el => {
        var which = el.id.split("-")[1];

        el.addEventListener("click", () => {
            clickedBlocks.forEach(id => {
                if (id !== which) clickedBlocks.delete(id);
            });

            clickedBlocks.add(which); // Mark this block as clicked
            showToolTip(which, true);
        });
    });



    // 
    document.querySelectorAll(".popup-link").forEach(el => {
        el.addEventListener("click", () => {
            event.stopPropagation(); // Prevents the click from bubbling up to .block
            var which = el.id.split("popup-link-")[1];
            
            // where we have two popup-links both wanting to show same popup:
            if(which.split("_").length>0){
                which = which.split("_")[0];
            }
            showPopup(which);
        });
    });


    document.querySelectorAll(".site-link").forEach(a => {
        a.addEventListener("click", (e) => {
            e.preventDefault();

            // console.log(a.getAttribute("href"));
            gsap.to(window, {
                duration: 1,
                ease: "power2.inOut",
                scrollTo: a.getAttribute("href")
            });
        });
    });

    ScrollTrigger.create({
        trigger: "#section-Assemble",
        start: "-20% top",
        end: "80% center",
        // markers: true,
        onEnter: () => scrollToSection(0),
        onEnterBack: () => scrollToSection(0),
    });

    ScrollTrigger.create({
        trigger: "#section-creativeLibrary",
        start: "10% center",
        end: "bottom center",
        // markers: true,
        onEnter: () => scrollToSection(1),
        onEnterBack: () => scrollToSection(1),
    });


    videos.forEach(ele => {
        ele.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevents the click from bubbling up to overlay
            // e.preventDefault();
            playVideo(e.target.id);
        });

    })

    overlay.addEventListener("click", closePopup);


}

var isFirstLoad = true;
function scrollToSection(index) {
    gsap.to(window, {
        duration: 1,
        delay: isFirstLoad ? 1 : 0,
        scrollTo: {
            y: sections[index],
            autoKill: false
        },
        onComplete: () => {isFirstLoad=false;},
        ease: "power2.inOut"
    });
}



function showToolTip(which, clicked) {

    // Reset all toolTip timelines except this one,
    // but only if not clicked
    Object.entries(tls_Blocks).forEach(([key, tl]) => {
        if (key !== which /*&& !clickedBlocks.has(key)*/) {
            tl.seek("reset").pause();
        }
    });

    // if block is clicked we skip the animation:
    if(clicked) {
        tls_Blocks[which].seek("textShowing",false).play()
    } else {
        tls_Blocks[which].seek(0).play();
    }
    
}
function getById( eleID ) 
{
    return document.getElementById(eleID);
}

function goSite(){

     // 
    document.querySelectorAll(".popup-link").forEach(el => {
        var spanIcon = document.createElement("span");
        spanIcon.className="icon chars";
        el.appendChild(spanIcon);
    });

    document.querySelectorAll(".external-link").forEach(el => {
        var spanIcon = document.createElement("span");
        spanIcon.className="icon chars";
        el.appendChild(spanIcon);
    });
    

    

    initSplitTexts();
    bindListeners();
}


var splitText_texts = {};
var splitText_editCopy = {};
function initSplitTexts() {
    document.querySelectorAll(".text").forEach(el => {
        var newSplit = new SplitText(el, {
            type: "lines,words,chars",
            linesClass: "lines",
            charsClass: "chars"
        });
        gsap.set("#"+el.id+" .chars", {alpha:0})

        if (el.id) {
            var which = el.id.split("-")[1];
            splitText_texts[which] = newSplit;
        }
    })

    
    document.querySelectorAll(".example-editcopy").forEach(el => {
        var newSplit2 = new SplitText(el, {
            type: "lines,words,chars",
            linesClass: "lines",
            charsClass: "chars"
        });
    });
}




function showPopup(which) {

    closePopup();

    tlPopups.clear();

    tlPopups.addLabel("reset", 0)
        .to("#overlay", {display:"flex",alpha:1}, "reset")
        .to("#overlay-bg", {alpha:0}, "<")
        .to("#popup-"+which, {display:"flex",alpha:1,scale:.1}, "reset")
        .to(".highlight-"+which, {alpha:0}, "<")
        .to("#overlay-bg", 1, {alpha:1}, ">")
        .to(".highlight-"+which,1,{alpha:1,stagger:.3}, "reset")
        .to("#popup-"+which, .3, {scale:1,ease:"power1.out"}, "reset")

    // if popup contains a video:
    playVideo(which);
}

function playVideo(which) {
    var this_video;
    this_video = getById("video-"+which);
    if(this_video){
        this_video.currentTime=0;
        this_video.play();
    } else {
        console.log("no video");
    }
}

function closePopup(){
    gsap.to("#overlay",0,{display:"none",alpha:0});
    gsap.to(".popup",0,{display:"none"});
}


goSite();