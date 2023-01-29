window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    preloader.style.display = "none";
  });
  
const Thirdcarousel = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('exp-btn-active');
            console.log("working");
        } else {
            entry.target.classList.remove('exp-btn-active');
        }
    });
})
let explorebtn = document.querySelector(".explore-btn");
Thirdcarousel.observe(explorebtn)

let scene1 = document.querySelector(".scene1-msg");
const Firstcarousel = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("scene1-show");
            document.querySelector(".scene1-msg h1:nth-of-type(1)").style.left = "0";
            document.querySelector(".scene1-msg h1:nth-of-type(2)").style.left = "0";
            setTimeout(() => {
                document.querySelector(".scene1-msg button").style.transform = "scale(1)";
                document.querySelector(".scene1-msg button").style.opacity = "1";
            }, 1000);

        } else {
            entry.target.classList.remove("scene1-show");
            document.querySelector(".scene1-msg h1:nth-of-type(1)").style.left = "-100%";
            document.querySelector(".scene1-msg h1:nth-of-type(2)").style.left = "-150%";
            document.querySelector(".scene1-msg button").style.transform = "scale(.1)";
            document.querySelector(".scene1-msg button").style.opacity = "0";
        }
    });
})
Firstcarousel.observe(scene1)


fetch("localhost:8080/artist").then(res=>res.json()).then(data=>console.log(data))

function open_mobile_menu(){
        document.querySelector(".mobile-nav").style.opacity="1"
        document.querySelector(".mobile-nav").style.left="0"
}
function close_mobile_menu() {
    document.querySelector(".mobile-nav").style.opacity="0"
    document.querySelector(".mobile-nav").style.left="-100%"
}
