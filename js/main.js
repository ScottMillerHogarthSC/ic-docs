
//hoxton.timeline = Creative.tl;
gsap.defaults({overwrite: "auto", duration:0, ease:"none"});

// as we are using className to target elements in certain sizes in the TL, we want to suppress warnings:
gsap.config({nullTargetWarn:false});

var tlBlocks = gsap.timeline( { defaults: { duration:0 , ease:"none" } } ),
    tlPopups = gsap.timeline( { defaults: { duration:0 , ease:"none" } } );


// content
var container       = getById("container"),
    blockGroups     = getById("block-groups"),
    blockVars       = getById("block-vars"),
    blockTemplates  = getById("block-templates"),
    blocks          = document.getElementsByClassName("block"),
    textareaCopy = getById("example-textareacopy"),

    _speed = .5;


function bindListeners(){
    
    document.querySelectorAll(".block").forEach(el => {
        
        el.addEventListener("click", () => {
            initTLs(el.id,true);
        });

        el.addEventListener("mouseenter", () => {
            initTLs(el.id);
        });

        // el.addEventListener("mouseleave", () => {
        //     // initTLs("mouseleave "+el.id);
        //     gsap.to(".text", 0, {alpha:0})
        //     gsap.to(".text .chars", 0, {alpha:0})
        // });
    });

    // 
    document.querySelectorAll(".clickable").forEach(el => {
        el.addEventListener("click", () => {
            event.stopPropagation(); // Prevents the click from bubbling up to .block

            showPopup(el.id);
        });
    });


    overlay.addEventListener("click", closePopup);
    
}


function initTLs(eleID, clicked) {
    // console.log(which);

    var which = eleID.split("-")[1];

    tlBlocks.clear();

    tlBlocks.addLabel("reset", 0)
        .to([".chars",".text",".example-editcopy"], {alpha:0}, "reset")
        .to("#block-"+which+" .text", {height:0}, "reset")

        .to("#block-"+which+" .text:not(.text-inner)", clicked ? 0 : .2, { alpha:1 }, ">")
        .to("#block-"+which+" .text .chars", clicked ? 0 : _speed, { alpha:1,stagger:clicked ? 0 : 0.01}, "<")
        .to("#block-"+which+" .text", clicked ? 0 : _speed, {height:"auto", ease:"power1.out"}, "<")

    
    // special animation for copy editing:
    if(which=="editcopy"){
        console.log(which);

        tlBlocks.addLabel("textEdit", "<.25")
            .to(".example-editcopy .chars", {alpha:0}, "textEdit")
            .to(".example-editcopy", {alpha:1}, ">")
            .to("#example-textareacopy .chars", {alpha:1,stagger:.1}, "textEdit+=.15")
            .to("#example-editcopy01 .chars", {alpha:1,stagger:.1}, "textEdit+=.15")
            .to("#example-editcopy02 .chars", {alpha:1,stagger:.1}, "textEdit+=.15")
            .to("#example-editcopy03 .chars", {alpha:1,stagger:.1}, "textEdit+=.15")
            .to("#example-editcopy04 .chars", {alpha:1,stagger:.1}, "textEdit+=.15")
    }
            
    
}
function getById( eleID ) 
{
    return document.getElementById(eleID);
}

function goSite(){
    initSplits();

    bindListeners();
}

function initSplits() {
    document.querySelectorAll(".text").forEach(el => {
        var newSplit = new SplitText(el, {
            type: "lines,words,chars",
            linesClass: "lines",
            charsClass: "chars"
        });
        gsap.to("#"+el.id+" .chars", 0, {alpha:0})
    })

    
    document.querySelectorAll(".example-editcopy").forEach(el => {
        var newSplit2 = new SplitText(el, {
            type: "lines,words,chars",
            linesClass: "lines",
            charsClass: "chars"
        });
    });
}

function showPopup(eleID) {
    console.log(eleID.split("-")[1]);
    var which = eleID.split("-")[1];

    tlPopups.clear();

    tlPopups.addLabel("reset", 0)
        .to("#overlay", {display:"flex",alpha:1}, "reset")
        .to(".highlight-"+which, {alpha:0}, "<")
        .to("#overlay-bg", 1, {alpha:1}, ">")
        .to("#popup-"+which, {display:"flex"}, "reset")
        .to(".highlight-"+which,1,{alpha:1,stagger:.3}, "reset");

    // if popup contains a video:
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


initTLs("block-editcopy")