(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

  let taxSwitch = document.querySelector("#switchCheckDefault");
    taxSwitch.addEventListener("click", ()=> {
    let gst_tag = document.querySelectorAll(".gst_tag");
    for( tags of gst_tag){
        if (tags.style.display == "inline") {
            tags.style.display = "none";
        } else {
            tags.style.display ="inline";
        }
    }
    })

// let navbarToggler = document.querySelector(".navbar-toggler");

// navbarToggler.addEventListener("click", () => {
//   let searchInput = document.querySelector(".search-input");
//   let searchBtn = document.querySelector(".search-btn");
//   if(searchBtn.style.display != "none") {
//   searchBtn.style.display = "none";
//   searchInput.style.display = "none";
//   }
  
// })