
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
    textareaCopy = getById("example-textareacopy"),

    _speed = .5;


function bindListeners(){
    
    document.querySelectorAll(".block").forEach(el => {

        var which = el.id.split("-")[1];
        var newTL = gsap.timeline( { defaults: { duration:0 , ease:"none" }, paused:true } );

        //
        newTL.addLabel("reset", 0)
            .to(".block", {zIndex:300}, "reset")
            .to("#text-"+which, {zIndex:400}, "reset")
            .to(["#text-"+which+" .chars","#text-"+which,"#text-"+which+" div",".example-editcopy"], {alpha:0}, "reset")
            .to("#text-"+which, {height:0}, "reset")

            .to("#text-"+which,.2, { alpha:1 }, ">.01")
            .to("#text-"+which+" div", _speed, { alpha:1,stagger:0.01}, "<")
            .to("#text-"+which+" .chars", _speed, { alpha:1,stagger:0.01}, "<")
            .to("#text-"+which, _speed, {height:"auto", ease:"power1.out"}, "<")

        
        // special animation for copy editing:
        if(which=="editcopy"){
            console.log(which);

            newTL.addLabel("textEdit", "<.25")
                .to(".example-editcopy .chars", {alpha:0}, "textEdit")
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

            newTL.addLabel("templateSpecific", "<.25")
                .to("#arrow-templateSpecific",.1,{rotation:90},"templateSpecific")
                .to("#templateSpecific",.1,{alpha:1},"<")
                .to(".example-editcopy .chars", {alpha:0}, "<")
                .to("#example-textareacopy",{fontSize:"0.9em", paddingTop:"0.2em", left:"23%",top:"48%",overflow:"hidden",width:"8%"},"<")
                
                .to(["#example-editcopy02","#example-textareacopy"], {alpha:1}, ">1")
                .to("#example-textareacopy .chars", {alpha:1,stagger:.1}, "<")
                .to("#example-editcopy02 .chars", {alpha:1,stagger:.1}, "<");
        }


        tls_Blocks[which] = newTL; // Store the TL in the object with 'which' as the key


            
        
        el.addEventListener("click", () => {
            showToolTip(el.id,true);
        });

        el.addEventListener("mouseenter", () => {
            event.stopPropagation(); // Prevents the click from bubbling up to .block

            showToolTip(el.id);
        });

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



function showToolTip(eleID, clicked) {

    var which = eleID.split("-")[1];
    
    // reset all toolTip Timelines except this one

    Object.entries(tls_Blocks).forEach(([key, tl]) => {
        if (key !== which) {
            tl.seek("reset").pause();
        }
    });

    
    if(clicked) {
        tls_Blocks[which].duration(0)
    } else {
        tls_Blocks[which].duration(2);
    }
    tls_Blocks[which].seek("reset").play();
    
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