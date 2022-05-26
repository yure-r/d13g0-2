const generateListItem = (link, editable = false) => {

  //create the li element
  const li = document.createElement("li");

  //create the a tag
  
  const a = document.createElement("a")
  
  const ordertext = document.createElement("span")
  ordertext.innerHTML = "order#: "
  li.append(ordertext)
  
  const order = document.createElement("span")
  // <input type="number" id="tentacles" name="tentacles"
  //      min="10" max="100">
         order.type = "number"
          
  order.classList.add("orderMarker")
              
    
    let data = link.data
            console.log(data.order, "WAS ORDER")
            
            // document.querySelector("#order").value = data.order
  order.innerText = data.order
  li.append(order)
  
              // const order = document.createElement("span");
          order.setAttribute("data-id", link.id);
          order.setAttribute("data-author",link.author)
          order.setAttribute("data-name",link.name)
          order.setAttribute("data-data",JSON.stringify(link.data))
          // console.log(link)
          // console.log(link.data)
          // console.log(link)
          // order.append('  approve')

    //UPDATING ORDER VIA SERVER NOT WORKING PROPERLY IT FUCKS IT UP
  
//           order.addEventListener('change', (e)=>{

//               console.log(e.target.value)

            
//               let data = JSON.parse(e.target.dataset.data)
//               // data.order = "true"
              
//               let newOrder = e.target.value
              
//               data = JSON.stringify(data)
//               console.log(data)
//             console.log(e.target.dataset.name)

//             console.log(`/nopage/data/name/updateOrder/${e.target.dataset.name}/${newOrder}`)
//             console.log("was request url")
            
//               fetch(`/nopage/data/name/updateOrder/${e.target.dataset.name}/${newOrder}`, {method: 'POST'}).then((response)=>{
//                 console.log(response)
//                 window.location = '/edit'
//               }) //APPROVE DATA BY ID OR NAME INSTEAD OF SENDING ALL OF THE DATA.
//             // }
//           })
  
  //UPDATING ORDER VIA SERVER NOT WORKING PROPERLY IT FUCKS IT UP
  
  
  
  
  
  const year = document.createElement("div")
  year.classList.add("edityear")
  year.innerHTML = atob(link.data.year)
  const names = document.createElement("div")
  names.classList.add("editnames")
  names.innerHTML = atob(link.data.fellowNames)
  const title = document.createElement("div")
  title.classList.add("edititle")
  title.innerHTML = atob(link.name)
        a.innerHTML = (year.outerHTML + names.outerHTML + title.outerHTML) //insert the contents of the a tag
        a.setAttribute("href", `/data/${link.id}`) //add the href attribute
        
        if (link.data.approved =='true'){
          console.log("approved")
          // a.style.color = "green"
        } else if(link.data.approved =='false'){
          a.style.color = "red"
          console.log("false")
        } else if (link.data.approved == 'denied'){
          a.style.color = "gray"
          console.log("denied")
        }
  //put the a tag in the li
  
  let desktopImg;
  let mobileImg;

  if(atob(link.data.desktopImage).split(".").pop() == "mp4"){
    desktopImg = document.createElement("video")
    desktopImg.controls = true;
    desktopImg.classList.add("desktopEditImg")
    desktopImg.src = atob(link.data.desktopImage)
  } else {
    desktopImg = document.createElement("img")
    desktopImg.classList.add("desktopEditImg")
    desktopImg.src = atob(link.data.desktopImage)
  }



  // if(document.getElementById("heroImgLink").value.split(".").pop() == "mp4"){
  //   document.getElementById("HTMLblob").value = document.getElementById("HTMLblob").value + "<video controls class='projectHeroImg' src='" + document.getElementById("heroImgLink").value + "'></video>"
  // } else {
  //   document.getElementById("HTMLblob").value = document.getElementById("HTMLblob").value + "<img class='projectHeroImg' src='" + document.getElementById("heroImgLink").value + "'>"
  // }

  if(atob(link.data.mobileImage).split(".").pop() == "mp4"){
    mobileImg = document.createElement("video")
    mobileImg.controls = true;
    mobileImg.classList.add("mobileEditImg")
    mobileImg.src = atob(link.data.mobileImage)
  } else {
    mobileImg = document.createElement("img")
    mobileImg.classList.add("mobileEditImg")
    mobileImg.src = atob(link.data.mobileImage)
  }


  
  let br = document.createElement("br")
  
  a.appendChild(desktopImg)



  a.appendChild(document.createElement("br"))
  a.appendChild(mobileImg)
  a.appendChild(document.createElement("br"))
  
  li.append(a)
  
  //special routine only if the editable elements are requested
  if(editable === true) {
        
    //add the edit information
    const edit = document.createElement("span");
          edit.setAttribute("data-id", link.id);
          edit.setAttribute("data-author", link.author);
          edit.setAttribute("data-name", link.name);    
          edit.setAttribute("data-data", JSON.stringify(link.data));
    
          edit.setAttribute("data-URL", JSON.stringify(link.data.URL));
          edit.setAttribute("data-fellowNames", JSON.stringify(atob(link.data.fellowNames)));
          // edit.setAttribute("data-previewText", JSON.stringify(atob(link.data.previewText)));
          edit.setAttribute("data-year", JSON.stringify(atob(link.data.year)));
    console.log(link.data.HTMLblob)
          edit.setAttribute("data-HTMLblob", JSON.stringify(link.data.HTMLblob));
          // edit.setAttribute("data-data", JSON.stringify(link.data.));
    
          edit.append(' edit')
          


          edit.addEventListener('click', (e)=>{
            //show the edit form, if available
            
            
                  function unplusifySlashifyATOB(str){
        if (str != null && str != undefined){
                  str = str.replaceAll("(SLASH)", "/")
        str = str.replaceAll("(PLUS)", "+")
        str = atob(str)
        return str
        } else {
          return ""
        }

      }
            
            //show the edit form
            //make the edit form into an update request, rather than a creation request
            const editForm = document.querySelector("#edit");
                  editForm.setAttribute("style", "display:block;")
                  editForm.setAttribute("action", "/data/update");

            console.log(e.target.dataset)
            console.log("WAS DATASET")
            document.querySelector('#id').value = e.target.dataset.id;
            document.querySelector('#author').value = e.target.dataset.author;
            document.querySelector('#name').value = e.target.dataset.name;
            document.querySelector('#datum').value = e.target.dataset.data;
            
            // document.querySelector('#order').value = atob(e.target.dataset.data);
            
            console.log(e.target.dataset)
            document.querySelector('#preDatum').value=atob(e.target.dataset.name);
            // document.querySelector('#URL').value=JSON.parse(e.target.dataset.url);
            // console.log(e.target)
            // console.log(e.target.dataset)
            // console.log()
            // document.querySelector('#briefDesc').value=unplusifySlashifyATOB(JSON.parse(e.target.dataset.data).briefDesc)
            // document.querySelector('#prevURL').value=unplusifySlashifyATOB(JSON.parse(e.target.dataset.data).prevURL)
            
            let fellowNamesValue = JSON.parse(e.target.dataset.fellownames);
            fellowNamesValue = fellowNamesValue.split("Description: ").pop()
            
            document.querySelector('#fellowNames').value=  fellowNamesValue;
            
            // document.querySelector('#previewText').value=JSON.parse(e.target.dataset.previewtext);
            document.querySelector('#year').value=JSON.parse(e.target.dataset.year);
            
            
            let html = e.target.dataset.htmlblob
            html = html.replaceAll("(PLUS)", "+")
            html = html.replaceAll("(SLASH)", "/")
            console.log(html)
            html = atob(JSON.parse(html))
            document.querySelector('#HTMLblob').value=html;
            document.querySelector('#htmlPreview').innerHTML = html;
            
            
            
             let data = e.target.dataset.data
            data = data.replaceAll("(PLUS)", "+")
            data = data.replaceAll("(SLASH)", "/")
            
            data = JSON.parse(data)
            console.log(data.order, "WAS ORDER")
            
            document.querySelector("#order").value = data.order
            // console.log(data, "WAS DATA")
            
            document.getElementById("nameandyearpreview").innerHTML = document.getElementById("year").value + ": "+document.getElementById("fellowNames").value;
            // onChange();
            
            let preview = document.querySelector("#htmlPreview")
            //TO ADD
            
            
           if (preview.querySelector('.projectHeroImg')!==null){
             
             let desktopImgLink = preview.querySelector('.projectHeroImg').src
             desktopImgLink = desktopImgLink.split(window.location.origin).pop()
             
            document.querySelector('#heroImgLink').value = desktopImgLink
          }
            
                       if (preview.querySelector('.mobileHeroImg')!==null){
             
             let mobileImgLink = preview.querySelector('.mobileHeroImg').src
             mobileImgLink = mobileImgLink.split(window.location.origin).pop()
             
            document.querySelector('#mobileImgLink').value = mobileImgLink
          }
            
           if (preview.querySelector('.projectSummaryText')!==null){
                                document.querySelector('#previewText').value = preview.querySelector('.projectSummaryText').innerText
          }
  // if (preview.querySelector('.projectProposalText')!==null){         
  // document.querySelector('#proposal').value = preview.querySelector('.projectProposalText').innerText
  //         }
//             function returnImgLinks(array){
//               let linkStr = ""
//               for (var i=0;i<array.length;i++){
//                 if (array[i].src != " "){
                  
//                 let caption = '' 
//                 if (array[i].nextSibling !== null){
//                 if(array[i].nextSibling.classList[0] == "projectFinalImgCaption" || array[i].nextSibling.classList[0] == "projectProcessImgCaption"){
//                   caption = "{" + array[i].nextSibling.innerText+"}"
//                 }
//                 }
                  
//                 linkStr = linkStr + array[i].src + caption + ","
//                 }
//               }
//               return linkStr
//             }
// if (preview.querySelector('.projectFinalImg')!==null){           
// document.querySelector('#projectImgLinks').value = returnImgLinks(preview.getElementsByClassName("projectFinalImg"))
//           }
//             function returnVideoLinks(array){
//             let linkStr = ""
//             let caption = ""
//               for (var i=0;i<array.length;i++){
//                 linkStr = linkStr + array[i].src
//                 console.log(array[i].classList[1])
//                 let dimsList = "{" + array[i].classList[1] + "}"
                
//                 console.log(array[i])
//                 console.log(array[i].parentElement.nextSibling)
//                 console.log("WAS NEXT SIBLING OF VIDEO ELEMENT")
//                 if (array[i].parentElement.nextSibling !== null){
//                 if(array[i].parentElement.nextSibling.classList[0] == "projectFinalVideoCaption" || array[i].parentElement.nextSibling.classList[0] == "projectProcessVideoCaption"){
//                   caption = "(" + array[i].parentElement.nextSibling.innerText+")"
//                 }
//                 }
                    
//                 linkStr = linkStr + dimsList + caption + ","
//               }
//               return linkStr
//             }
            
            
// if (preview.querySelector('.projectFinalVideo')!==null){           
// document.querySelector('#projectVideoLinks').value = returnVideoLinks(preview.getElementsByClassName("projectFinalVideo"))
//           }
//           if (preview.querySelector('.projectProcessImg')!==null){ 
//           document.querySelector('#projectProcessImgLinks').value = returnImgLinks(preview.getElementsByClassName("projectProcessImg"))
//           }
//           if (preview.querySelector('.projectProcessVideo')!==null){ 
//           document.querySelector('#projectProcessVideoLinks').value = returnVideoLinks(preview.getElementsByClassName("projectProcessVideo"))
//           }
            
//             function returnPressLinks(array, pressHTML=false, biography=false){
              
//               console.log("going to set press links!")
              
//               if(biography){
//               // console.log("biography is true!")
                
//               //CUSTOM BIO LINK CONSTRUCTION
//               let linkStr = ""
//               for (var i=0;i<array.length;i++){
               
                
//                 let classList = array[i].parentElement.classList
                
//                 if (classList.length > 1){
                  
                
                
//                 // let classList = array[i].parentElement.classList
//                 console.log(classList)
//                 console.log(classList.contains("iconContainer"))
//                 console.log(array[i])
                
//                 // switch(classList){
//                   if(classList.contains("iconContainerNone")){
//                     console.log("switch statement switched!")
//                     linkStr = linkStr + array[i].href + ","
//                     console.log(linkStr)
//                   } else if(classList.contains("iconContainerBracket")){
//                     console.log("switch statement switched!")
//                     let bracketHTML = array[i].parentElement.querySelector(".linkPrecolon").innerHTML
//                     // console.log(bracketHTML.length)
//                     //TRIM LAST TWO CHARACTERS OFF BRACKETHTML
//                     bracketHTML = bracketHTML.slice(0, bracketHTML.length - 2)
//                     linkStr = linkStr + array[i].parentElement.parentElement.href + "{" +bracketHTML + "}" + ","
//                     console.log(linkStr)
//                     // break;
//                   } else if(classList.contains("iconContainerParenthesis")){
//                     console.log("switch statement switched!")
//                     linkStr = linkStr + array[i].href + "(" + array[i].innerText + ")" + ","
//                     console.log(linkStr)
//                     console.log(array[i])
//                     // break;
//                     } else if(classList.contains("iconContainerBoth")){
//                     console.log("switch statement switched!")
//                       let bracketHTML = array[i].parentElement.querySelector(".linkPrecolon").innerHTML
//                       // console.log(bracketHTML.length)
//                       //TRIM LAST TWO CHARACTERS OFF BRACKETHTML
//                       bracketHTML = bracketHTML.slice(0, bracketHTML.length - 2)
//                     linkStr = linkStr + array[i].parentElement.parentElement.href + "{" +bracketHTML + "}" +"(" + array[i].innerHTML + ")" + ","
//                     console.log(linkStr)
//                     // break;
//                     }
                    
//                 } else {
                  
//                   if(classList.contains("iconContainer")){
//                     console.log("switch statement switched!")
//                     linkStr = linkStr + array[i].href + ","
//                     console.log(linkStr)
//                     // break;
//                   } 
                  
//                 }
                
                
                    
//                 // }
                
                
                
//                 //iconContainerNone
//                 //iconContainerBracket
//                 //iconContainerParenthesis
//                 //iconContainerBoth
                
                
                
                
                
                
//               }
//                 return linkStr
              
                
                
              
//               } else {
                
              
              
//               if(pressHTML){
//                 //PRESS LINKS ON PAGE LOAD EDITOR VALUE SET (TO ADD: {TITLE}(DESC))
//                 let linkStr = ""
//               for (var i=0;i<array.length;i++){
//                 linkStr = linkStr + array[i].innerHTML + ","
//               }
//               return linkStr
//               } else {
//                             let linkStr = ""
//               for (var i=0;i<array.length;i++){
//                 linkStr = linkStr + array[i].href + ","
//               }
//               return linkStr
//               }
                
//               }

//             }
            
//            if (preview.querySelector('.biographyName1')!==null){ 
//             document.querySelector('#biographyName1').value = preview.querySelector(".biographyName1").innerText
//           }
//             if (preview.querySelector('.biographyPhoto1')!==null){
//             document.querySelector('#biographyPhoto1').value = preview.querySelector(".biographyPhoto1").src
//           }
//             if (preview.querySelector('.biographyText1')!==null){
//             document.querySelector('#biography1').value = preview.querySelector(".biographyText1").innerText
//           }
//             if (preview.querySelector('.bioIconLink1')!==null){
//               console.log("getting socials 1!!")
//               console.log(preview.getElementsByClassName("bioIconLink1"))
//             document.querySelector('#biographySocials1').value = returnPressLinks(preview.getElementsByClassName("bioIconLink1"), false, true)
//           }
            
//            if (preview.querySelector('.biographyName2')!==null){ 
//             document.querySelector('#biographyName2').value = preview.querySelector(".biographyName2").innerText 
//           }
//             if (preview.querySelector('.biographyPhoto2')!==null){
//             document.querySelector('#biographyPhoto2').value = preview.querySelector(".biographyPhoto2").src
//           }
//             if (preview.querySelector('.biographyText2')!==null){
//             document.querySelector('#biography2').value = preview.querySelector(".biographyText2").innerText
//           }
//             if (preview.querySelector('.bioIconLink2')!==null){
//             document.querySelector('#biographySocials2').value = returnPressLinks(preview.getElementsByClassName("bioIconLink2"), false, true)
//           }
            
//            if (preview.querySelector('.biographyName3')!==null){ 
//             document.querySelector('#biographyName3').value = preview.querySelector(".biographyName3").innerText 
//           }
//             if (preview.querySelector('.biographyPhoto3')!==null){
//             document.querySelector('#biographyPhoto3').value = preview.querySelector(".biographyPhoto3").src
//           }
//             if (preview.querySelector('.biographyText3')!==null){
//             document.querySelector('#biography3').value = preview.querySelector(".biographyText3").innerText
//           }
//             if (preview.querySelector('.bioIconLink3')!==null){
//             document.querySelector('#biographySocials3').value = returnPressLinks(preview.getElementsByClassName("bioIconLink3"), false, true)
//           }
            
            
           
//             if (preview.querySelector('.biographyName4')!== null){
//             document.querySelector('#biographyName4').value = preview.querySelector(".biographyName4").innerText 
//           }
//                                 if (preview.querySelector('.biographyPhoto4')!== null){
//             document.querySelector('#biographyPhoto4').value = preview.querySelector(".biographyPhoto4").src
//           }
//                                 if (preview.querySelector('.biographyText4')!== null){
//             document.querySelector('#biography4').value = preview.querySelector(".biographyText4").innerText
//           }
//              if (preview.querySelector('.bioIconLink4')!== null){
//              document.querySelector('#biographySocials4').value = returnPressLinks(preview.getElementsByClassName("bioIconLink4"), false, true)
//            }
            
//               if (preview.querySelector('.articleExcerpt1') !== null){
//             document.querySelector('#articleExcerpt1').value = preview.querySelector('.articleExcerpt1').innerHTML
//               }
            
            
//             if (preview.querySelector('.articleExcerpt2') !== null){

//             document.querySelector('#articleExcerpt2').value = preview.querySelector('.articleExcerpt2').innerHTML
//             }
            
            

//             let pressHTML = ""
//             if (preview.querySelector(".bottomLink") !== null ){
//             document.querySelector('#projectPressLinks').value = returnPressLinks(preview.getElementsByClassName("bottomLink"), true)
//             //PRESS LINKS ON PAGE LOAD
//             for (var i=0;i<document.getElementsByClassName("projectPressLink").length;i++){
//              pressHTML = pressHTML + document.getElementsByClassName("projectPressLink")[i].outerHTML
//             }
            
//             }
//              window.projectPressLinksHTML = pressHTML
            
            //TO ADD
            
            
            console.log("POSTED")
                      if (document.querySelector('#htmlPreview')){
            document.querySelector('#htmlPreview').style.display = "block"
          }
          })

    //add the delete information
    const deletion = document.createElement("span");
          deletion.setAttribute("data-id", link.id);
          deletion.setAttribute("data-author",link.author)
          deletion.append(' delete')

          deletion.addEventListener('click', (e)=>{
            // console.log(e.target.dataset.id)
            const response = confirm(`Are you sure you want to delete post id ${e.target.dataset.id}?`)
            if(response === true) {
              fetch(`/erase/${e.target.dataset.id}`, {method: 'POST'}).then((response)=>{
                window.location = '/edit'
              })
            }
          })  
    
            const approval = document.createElement("span");
          approval.setAttribute("data-id", link.id);
          approval.setAttribute("data-author",link.author)
          approval.setAttribute("data-name",link.name)
          approval.setAttribute("data-data",JSON.stringify(link.data))
          console.log(link)
          console.log(link.data)
          // console.log(link)
          approval.append('  approve')

          approval.addEventListener('click', (e)=>{
            // console.log(e.target.dataset.id)
            // const response = confirm(`Are you sure you want to approve post id ${e.target.dataset.id}?`)
            // if(response === true) {
              console.log(e.target.dataset)
              // e.target.dataset.data.approved="true"
            
              let data = JSON.parse(e.target.dataset.data)
              data.approved = "true"
              data = JSON.stringify(data)
              console.log(data)
              // console.log(e.target.dataset.data.approved)
            // console.log(eval(e.target.dataset.data))
              fetch(`/nopage/data/name/approve/${e.target.dataset.name}`, {method: 'POST'}).then((response)=>{
                console.log(response)
                window.location = '/edit'
              }) //APPROVE DATA BY ID OR NAME INSTEAD OF SENDING ALL OF THE DATA.
            // }
          })
    
          const removal = document.createElement("span");
          removal.setAttribute("data-id", link.id);
          removal.setAttribute("data-author",link.author)
          removal.setAttribute("data-name",link.name)
          removal.setAttribute("data-data",JSON.stringify(link.data))
          console.log(link)
          removal.append('  deny')

          removal.addEventListener('click', (e)=>{
          let data = JSON.parse(e.target.dataset.data)
              data.approved = "denied"
              data = JSON.stringify(data)
              console.log(data)
              // console.log(e.target.dataset.data.approved)
            // console.log(eval(e.target.dataset.data))
              fetch(`/nopage/data/name/deny/${e.target.dataset.name}`, {method: 'POST'}).then((response)=>{
                console.log(response)
                window.location = '/edit'
              }) //APPROVE DATA BY ID OR NAME INSTEAD OF SENDING ALL OF THE DATA.
            // }
          }) 
    
          //     const tweet = document.createElement("a");
          // tweet.setAttribute("data-id", link.id);
          // tweet.setAttribute("data-author",link.author)
          // tweet.setAttribute("data-name",link.name)
          // console.log(link)
          // console.log(encodeURI(link.name))
          // tweet.href = "/oauth/twitter/" + encodeURI(link.name)
          // tweet.append(' tweet')
    
    const br = document.createElement("br")

//           post.addEventListener('click', (e)=>{
//            // CLIKCING POST DOES THIS!
//             console.log("post CLICKED")
            

//                       fetch("/postTweet", {method: 'POST'}).then((response)=>{
//                         console.log(response)
//             // window.location = '/'
//           }) 
            
            
//             })
           

    li.append(edit, approval, removal, deletion)
    
    


    // li.append(edit, approval)
  }

  //put the li in the html #data element
  // linkList.append(li);
  return li
};

const generateEraseButton = () => {
  const erase = document.createElement("button");
        erase.append('Erase Everything!')
        erase.addEventListener("click", (e)=>{
          fetch("/erase", {method: 'POST'}).then((response)=>{
            window.location = '/'
          })          
        })
  return erase
}

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
  
  if(urlParams.has('edit')) {
//     let script = document.createElement("script")
//     script.innerHTML = `window.twttr = (function(d, s, id) {
//   var js, fjs = d.getElementsByTagName(s)[0],
//     t = window.twttr || {};
//   if (d.getElementById(id)) return t;
//   js = d.createElement(s);
//   js.id = id;
//   js.src = "https://platform.twitter.com/widgets.js";
//   fjs.parentNode.insertBefore(js, fjs);

//   t._e = [];
//   t.ready = function(f) {
//     t._e.push(f);
//   };

//   return t;
// }(document, "script", "twitter-wjs"));`
    
//     document.body.appendChild(script)



   

  }else{
    
    
  
//   links.forEach((link)=>{


    
//   })
    
//     links.sort(function (a, b) {
//     return b.data.order.localeCompare(a.data.order);
// });
    
    // var numArray = [140000, 104, 99];
links.sort(function(a,b) {
  return a.data.order - b.data.order;
});

// console.log(numArray);
    
    
    
      links.slice().reverse().forEach((link)=>{
        
        console.log(link.data.order)
        
        
        //sort links by order?
        
    
    // if (link.data.approved == "true"){
    let li = generateListItem(link, true)
    linkList.append(li);
    // }
    
  })
    
    document.querySelector("#datum").setAttribute("style","display:block")
    
    }
  
  // const options = await generateAuthorsOptions();
  // const select = document.querySelector("#author")
  // options.forEach((option)=>{
  //   select.append(option)
  // })
  
  if(urlParams.has('add')) {
    // document.querySelector("#edit").setAttribute("style", "display:block")
    document.querySelector("#edit").style.display = "block"
    document.querySelector("#addcontainer").setAttribute("style","display:none")
              if (document.querySelector('#htmlPreview')){
            document.querySelector('#htmlPreview').style.display = "block"
          }
    
    //add placeholder html for the html preview
    
  }

  if(urlParams.has('erase')) {
    const actions = document.querySelector("#actions");
    const erase = generateEraseButton()
    
    actions.append(erase)
  }  
  
}

run().then(()=>{
  // console.log("script executed")
})