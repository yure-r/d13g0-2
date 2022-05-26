const generateListItem = (link) => {
console.log(link)
  //create the li element
  const li = document.createElement("div");

  //create the a tag
  const aParent = document.createElement("div")
  aParent.classList.add("projectParent")
  
  if(link.last){
    aParent.classList.add("projectLast")
    console.log(aParent)
    // console.log("adding project last")
  }
  
  const a = document.createElement("div")
        a.classList.add("project")
  

  

  let desktopImage
  let mobileImage


  if (atob(link.data.desktopImage).split(".").pop() != "mp4"){
      // console.log(atob(link.data.desktopImage))
    desktopImage = document.createElement("img")
    desktopImage.classList.add("desktopImage")
    desktopImage.src= atob(link.data.desktopImage)
   
    // console.log(link.data.desktopImageWebsite)
    // console.log(typeof link.data.desktopImageWebsite)
    // console.log("DESKTOP IMAGE WEBSITE")
    
    if(link.data.desktopImageWebsite == "true"){
      desktopImage.classList.add("desktopImageWebsite")
      // console.log("DESKTOP IMAGE WEBSITE IS TRUE")
    }
    
     aParent.appendChild(desktopImage)
    
  } else {
    desktopImage = document.createElement("video")
    console.log("is video!")
    desktopImage.classList.add("desktopImage")
    desktopImage.src= atob(link.data.desktopImage)
    desktopImage.controls = true;

    if(link.data.desktopImageWebsite == "true"){
      desktopImage.classList.add("desktopImageWebsite")
      // console.log("DESKTOP IMAGE WEBSITE IS TRUE")
    }
    
    aParent.appendChild(desktopImage)

  }
  
  if (atob(link.data.mobileImage).split(".").pop() != "mp4"){
      // console.log(atob(link.data.mobileImage))
    mobileImage = document.createElement("img")
    mobileImage.classList.add("mobileImage")
    mobileImage.src = atob(link.data.mobileImage)
    
        if(link.data.mobileImageWebsite == "true"){
      desktopImage.classList.add("mobileImageWebsite")
    }
    
    aParent.appendChild(mobileImage)
    
  } else{
    mobileImage = document.createElement("video")
    console.log("is video!")
    mobileImage.classList.add("mobileImage")
    mobileImage.src= atob(link.data.mobileImage)
    mobileImage.controls = true;

    if(link.data.mobileImageWebsite == "true"){
      // mobileImage.classList.add("desktopImageWebsite")
      // console.log("DESKTOP IMAGE WEBSITE IS TRUE")
    }
    
    aParent.appendChild(mobileImage)

  }
  
  
    let descDiv = document.createElement("div")
  descDiv.classList.add("descDiv")
  descDiv.innerHTML = atob(link.data.fellowNames) + "<br>" + atob(link.name) //insert the contents of the a tag
        a.appendChild(descDiv)
  
      const year = document.createElement("div")
  year.classList.add("projectYear")
  year.innerHTML = atob(link.data.year)
  a.appendChild(year)
  
  
aParent.appendChild(a)

          

  
        a.setAttribute("href", `/data/${link.id}`) //add the href attribute
        if (link.data.approved =='true'){
          a.style.color = ""
        } else if(link.data.approved =='false'){
          a.style.color = "red"
        } else if (link.data.approved == 'denied'){
          a.style.color = "gray"
        }
  //put the a tag in the li
  
 
  
  li.append(aParent)
  
  
  //special routine only if the editable elements are requested
 

  //put the li in the html #data element
  return li
};


// const generateAuthorsOptions = async () => {
//   const authors = await fetch("/authors").then(res=>res.json())
//   let options = []
//   authors.forEach((author)=>{
    
//     let option = document.createElement("option")
//     option.append(author)
//     option.setAttribute("value", author)
//     options.push(option)
    
//   })
  
//   return options;
// }

const run = async () => {
 
  const urlParams = new URLSearchParams(document.location.search.substring(1));
  const data = [];
  const linkList = document.querySelector("#data");

  // request the links from our app's sqlite database
  let links = await fetch("/data", {}).then((res) => {return res.json()})
    
    
//       links.sort(function (a, b) {
//     return b.data.order.localeCompare(a.data.order);
// });
  links.sort(function(a,b) {
  return a.data.order - b.data.order;
});
  
  links.slice().reverse().forEach((link)=>{
    
    
     console.log(link.data.order)
    
     //sort links by order?
    
    if (link.data.approved == "true"){
    if(link == links[0]){
      // window.firstLink = true
      // console.log("window firstlink is not true")
      link.last = true;
      console.log(link)
    }
    let li = generateListItem(link)
    linkList.append(li);
    }
    
  })
    
  
  
//   if(urlParams.has('add')) {
//     document.querySelector("#edit").setAttribute("style", "display:block")
//     document.querySelector("#addcontainer").setAttribute("style","display:none")
//   }
}


run().then(()=>{
  const urlParams = new URLSearchParams(document.location.search.substring(1));
 if(urlParams.has('edit')){
    window.location = "/edit"
    }
})