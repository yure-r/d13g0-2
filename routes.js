var request = require('request');
const fs = require('fs')
const sqlite3 = require("sqlite3").verbose();
const helpers = require("./db_helpers")
const {cleanseString, isValidJSON} = require("./helpers")
const path = require('path');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const express = require("express");
const app = express();
const exphbs  = require('express-handlebars');
const hbs = require('hbs')
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('images-db.json')
const db = low(adapter)

app.engine('html', exphbs({
  extname: '.html'
}));
app.set('view engine', 'hbs');

// app.set('view engine', 'html');

const handlebarsHelpers = { 
  json: function (context) { 
    return JSON.stringify(context, null, '\t')
  }
}

//super simple schema for the db
const schema = {
  name: "attributedStorage8", //no special punctuation like - or .
  columns: {
    id: "id", //leave this here, no matter what else you change
    author: "text",
    name: "text",
    data: "json" //put json here
  }
}


// const fs = require('fs');


//https://github.com/typicode/lowdb usage instructions


//initiate a blank database if it doesn't exist

//BEGIN IMAGE UPLOAD LOGIC
const initializeDb = () => {
    let dbTemplate = {
    files: []
  }
  db.defaults(dbTemplate).write()
}

initializeDb()


exports.upload = (req, res, next) => {
  console.log(req.files)
  console.log(req.body)
  const timestamp = Date.now()

  console.log(req.files.image.name) 

  let fullFileName = req.files.image.name
  let fileNameExtension = fullFileName.split(".").pop()

  const filename = Buffer.from(`${timestamp}-${req.files.image.name}`).toString('base64') + `.${fileNameExtension}`;
  // req.files.image.mv(`.data/${filename}`);
    req.files.image.mv(`./public/images/${filename}`);
  // console.log(req.files.image.mv(`./public/imgData/${filename}`))
  
  let fileData = {
    name: req.files.image.name,
    filetype: fileNameExtension,
    filename: filename,
    filepath: `/img/${filename}`,
    timestamp: timestamp,
    meta: req.body
  }

  // //write the file description to the database
  db.get("files").push(fileData).write()
  
  // res.json(fileData);
  res.redirect("/addImage")
};

exports.data = (req, res, next) => {

  res.json(db.get("files").value())

}


exports.display = async (req, res) => {
  //list all image names and urls
  
  let fileData = db.get("files").value()
  
  let fileDataList = fileData.map((file)=>{
    
    if(file.filetype == "mp4"){
      return `<div class="imgContainerChild"><video controls height="130" width="130" style="height:130px;width:auto;" src="${file.filepath}"></video><br><a href="${file.filepath}" target="_blank">${file.filepath}</a><div class="copyImgLink">copy relative link</div></div>`
    } else {
      return `<div class="imgContainerChild"><img style="height:130px;width:auto;"src="${file.filepath}"><br><a href="${file.filepath}" target="_blank">${file.filepath}</a><div class="copyImgLink">copy relative link</div></div>`
    }
    
    
  
  
  })
  
  res.set('Content-Type', 'text/html');
  return res.end(`<div class="imgParent">${fileDataList}</div>`)
};

exports.preview = async (req, res) => {
  //show all images
  
  let fileData = db.get("files").value()
  
  let fileDataList = fileData.map((file)=>{
    return `<li>
      <span>${file.filename}</span>
      <a href="${file.filepath}">
        <img width="100%" src="${file.filepath}" />
      </a>
    </li>`
  })

  res.set('Content-Type', 'text/html');
  return res.end(`<ul>${fileDataList}</ul>`)
  
};

exports.listByFilename = async (req, res) => {
  //output all image titles
  
  let fileData = db.get("files").sortBy("filename").value()
  res.json(fileData);
  
};

exports.listByTimestamp = async (req, res) => {
  //output all image titles, most recent first
  
  let fileData = db.get("files").sortBy("timestamp").value()
  res.json(fileData.reverse())
  
};

exports.remove = (req, res) => {
  
  db.get("files").remove(()=>{return true}).write()
  // let images = fs.readdirSync('/app/.data/');
  let images = fs.readdirSync('/app/public/images/');
  
  for(let image of images) {
    console.log(image)
    // fs.unlinkSync(`/app/.data/${image}`);
    let ext = (image.match(/\.([^.]*?)(?=\?|#|$)/) || [])[1] 
    // console.log(ext)
    
    if(ext !== "html"){
          fs.unlinkSync(`/app/public/images/${image}`)
    }

    
    
  }
  
  initializeDb()

  res.end("deleted all images");
}

//END IMAGES





//set up static route for loading index.html
exports.index = (req, res)=> {
  return res.sendFile(__dirname + '/views/index.html');
};

exports.indexEdit = (req, res)=> {
  return res.sendFile(__dirname + '/views/indexEdit.html');
};

exports.authors = (req, res)=>{
  return res.json(["hehhe"])
}

//
//api routes
exports.getData = async (req, res) => {
  const db = await helpers.initialize(schema)
  
  console.log("getting links...")
  db.all(`SELECT * from '${schema.name}'`, (err, rows) => {

    // console.log(rows)

    if(rows) {
      const parsedRows = rows.map((row)=>{
        row.data = JSON.parse(row.data)
        return row
      })    
      // console.log(`record: ${JSON.stringify(parsedRows)}`);

      return res.json(parsedRows)
    } else {
      console.log(err)
      return res.end("here are not your links")
    }
  });
  
}

exports.getDatum = async (req, res) => {
  const db = await helpers.initialize(schema)

  const id = req.params.id
  
  console.log("getting links...")
  db.get(`SELECT id, author, name, json(data) as data from '${schema.name}' WHERE id = ${id}`, (err, row) => {
    if (row) {
      // console.log(`record: ${JSON.stringify(row)}`);

      row.data = JSON.parse(row.data)
      
      return res.json(row)
    } else {
      console.log(err)
      return res.end("here are not your links")
    }
  });
  
}


exports.getFellowByFellow = async (req, res) => {
  
  const id = req.params.project
  console.log(id)
  let correctData
  


    
  
  
    const db = await helpers.initialize(schema)
  
  console.log("getting links...")
  db.all(`SELECT * from '${schema.name}'`, (err, rows) => {

    // console.log(rows)

    if(rows) {
      const parsedRows = rows.map((row)=>{
        row.data = JSON.parse(row.data)
        return row
      })    
      console.log(`record: ${JSON.stringify(parsedRows)}`);

      parsedRows.forEach(link =>{
        
        
      
      
    if(link.data.URL==id){
      console.log("setting correct data from linkfunc")
      correctData = link.id
      
        
  console.log("getting links...CD")
  // console.log(correctData)
  db.get(`SELECT id, author, name, json(data) as data from '${schema.name}' WHERE id = ${correctData}`, (err, row) => {
    if (row) {
      console.log(`record: ${JSON.stringify(row)}`);
     
      row.data = JSON.parse(row.data)
      console.log(correctData)
      console.log("is the project id for")
      console.log(id)
      // return res.render('fellow', row)
      // return res.status(200).render('fellow',row)
      console.log(row.data.HTMLblob)
      console.log(Buffer.from(row.data.year, 'base64').toString())
      console.log(Buffer.from(row.data.HTMLblob, 'base64').toString())
      
      
const search = `(PLUS)`
const replacer = new RegExp(search, 'g')

const search2 = `(SLASH)`
const replacer2 = new RegExp(search2, 'g')

// const string = 'e851e2fa-4f00-4609-9dd2-9b3794c59619'

 
// -> e851e2fa/4f00/4609/9dd2/9b3794c59619
      
      
      let htmlBlob = row.data.HTMLblob
      
      // console.log(htmlBlob.replace(replacer, '+')) 
      
      
      htmlBlob = htmlBlob.replace(replacer, '+');
      htmlBlob = htmlBlob.replace(replacer2, '/');
      
        // console.log(htmlBlob)
      
      let HTMLblobBuffer = Buffer.from(htmlBlob, 'base64').toString()
      console.log(HTMLblobBuffer)
      console.log("html blob buffer")
      
      let str = HTMLblobBuffer
      let fellowYear = str.slice(0, str.search("</div>"));
      fellowYear = fellowYear.slice(str.search("<div class='fellowYear'>"), str.length);
      fellowYear = fellowYear.slice(fellowYear.search("'>"), str.length);
      fellowYear = fellowYear.slice(2, str.length);
      console.log(fellowYear)
      console.log("was fellow year!")
      //<div class='fellowYear'>1990</div>
      
      let projectNameHeader = str.slice(str.search("<div class='projectName'>"), str.length);
      projectNameHeader = projectNameHeader.slice(0, projectNameHeader.search("</div>"))
      projectNameHeader = projectNameHeader.slice(projectNameHeader.search("'>"), str.length);
      projectNameHeader = projectNameHeader.slice(2, str.length);
      console.log(projectNameHeader)
      console.log("was project Name Header")
      //<div class='nameAndTitleContainerFlex'>
      //<div class='projectName'>National Graphic Design Archive</div>
      
      let fellowNamesHeader = str.slice(str.search("<div class='fellowNames'>"), str.length);
      fellowNamesHeader = fellowNamesHeader.slice(0, fellowNamesHeader.search("</div>"))
      fellowNamesHeader = fellowNamesHeader.slice(fellowNamesHeader.search("'>"), str.length);
      fellowNamesHeader = fellowNamesHeader.slice(2, str.length);
      console.log(fellowNamesHeader)
      console.log("was fellowNamesHeader")
      //<div class='fellowNames'>Ann Antoshak, Brian Boyce, Christopher Evans</div> 
      //</div>
      
      let projectSummaryText = str.slice(str.search("<div class='projectSummaryText'>"), str.length);
      projectSummaryText = projectSummaryText.slice(0, projectSummaryText.search("</div>"))
      projectSummaryText = projectSummaryText.slice(projectSummaryText.search("'>"), str.length);
      projectSummaryText = projectSummaryText.slice(2, str.length);
      console.log(projectSummaryText)
      console.log("was projectSummaryText")
      //<div class='projectSummaryText'>Promise Lands is a self-portrait. This project emerges at the intersection of Roy's journey between Tel Aviv, Israel and New York, America. Referencing cultural and visual vernaculars such as the lone American cowboy and Israeli pilot, Promise Lands explores the identities-colonial, entitled or utopian-associated with the quest for the "Promise Land" and the "New World." Through works like the embroidering of gendered chcildhood memories onto plane pillowcases, the fading portraits of his mother and the ironic glotification fo the Israeli soldier, the show revisits the themes of heroism, gender roles and separation Promise Lands re-contextualizes popular cultural metaphors and offers its audience a personal relationship to them; a parallel to the artist's process.
      //</div>
      
      
            let briefDesc = row.data.briefDesc
      
      // console.log(briefDesc.replace(replacer, '+')) 
      
      
      briefDesc = briefDesc.replace(replacer, '+');
      briefDesc = briefDesc.replace(replacer2, '/');
      briefDesc = Buffer.from(briefDesc, 'base64').toString()
      
          const renderOptions = {
    data: row,
    fellowYear: fellowYear,
    projectNameHeader: projectNameHeader,
    fellowNamesHeader: fellowNamesHeader,
    briefDesc: briefDesc,
    projectSummaryText: projectSummaryText,
    dataHTML: Buffer.from(htmlBlob, 'base64').toString(),
    dataYear: Buffer.from(row.data.year, 'base64').toString(),
    layout: false,
    helpers: handlebarsHelpers
  }
          
          console.log(briefDesc)
          
          
  res.render('project.html', renderOptions)
      
    } else {
      console.log(err)
      return res.end("here are not your links")
    }
  });
      
    
      
    } else {
      // console.log(err)
      // return res.end("here are not your links")
    }
  
  })
    }
    
  })
  
  
  
  // const db = await helpers.initialize(schema)



  
}




exports.getMetaData = async (req, res) => {
  
  const id = req.params.pagemetadata
  console.log(id)
  
  
  const search = `(PLUS)`
const replacer = new RegExp(search, 'g')

const search2 = `(SLASH)`
const replacer2 = new RegExp(search2, 'g')

// const string = 'e851e2fa-4f00-4609-9dd2-9b3794c59619'

 
// -> e851e2fa/4f00/4609/9dd2/9b3794c59619
      
      
      let htmlBlob = id
      
      // console.log(htmlBlob.replace(replacer, '+')) 
      
      
      htmlBlob = htmlBlob.replace(replacer, '+');
      htmlBlob = htmlBlob.replace(replacer2, '/');
     let url = Buffer.from(htmlBlob, 'base64').toString()
     console.log(url)
  
  let correctData
  

const getMetaData = require('metadata-scraper')


getMetaData(url).then((data) => {
	res.status(200).send(data)
})
    
  
  
 

}



exports.getDatumByName = async (req, res) => {
  const db = await helpers.initialize(schema)

  const name = req.params.name
  
  console.log("getting links...")
  db.get(`SELECT id, author, name, json(data) as data from '${schema.name}' WHERE name = '${name}' LIMIT 1`, (err, row) => {
    if (row) {
      console.log(`record: ${JSON.stringify(row)}`);

      row.data = JSON.parse(row.data)
      
      return res.status(200).json(row)
    } else {
      console.log(err)
      return res.status(404).json({message: `key with name ${name} not found`})
    }
  });
  
}

exports.editDatum = async (req, res, next) => {
  if(!isValidJSON(req.body.data)) {
    res.status(500).end(`Invalid JSON payload: ${req.body.data}`)
  }

  const db = await helpers.initialize(schema)

  console.log("updating a link...")
  
  const id = req.body.id
  const name = req.body.name;
  const data = req.body.data;
  const author = req.body.author;
  
  db.run(`UPDATE ${schema.name} SET name = (?), author = (?), data = (?) WHERE id = (?)`, [name, author, data, id], (error) => {
    if (error) {
      console.log(error)
      return res.send({ message: "error!" });
    } else {
      console.log(`row ${id} updated with ${name}, ${author} and ${data}`)
      next()
    }
  });
  
}

exports.editDatumByName = async (req, res, next) => {
  if(!isValidJSON(req.body.data)) {
    res.status(500).end(`Invalid JSON payload: ${req.body.data}`)
  }

  const db = await helpers.initialize(schema)

  console.log("updating a link by name...")
  console.log(req.body)
  const name = req.body.name;
  const data = req.body.data;
  const author = req.body.author;
  
  db.get(`UPDATE ${schema.name} SET author = (?), data = (?) WHERE name = (?)`, [author, data, name], (error, row) => {
    
    if (error) {
      console.log(error)
      return res.send({ message: "error!" });
    } 
    
    if (req.headers['x-sender'] === 'npm-client') {
      return res.status(200).json({
        status:200,
        message: `Update successful for key ${name}`
      })
    } else {
      console.log(`row with name ${name} updated with ${author} and ${data}`)
      next()
    }
  });
  
}


exports.editDatumByNameNoPage = async (req, res, next) => {
  console.log("NOPAGE")
  if(!isValidJSON(req.body.data)) {
    res.status(500).end(`Invalid JSON payload: ${req.body.data}`)
  }

  const db = await helpers.initialize(schema)

  console.log("updating a link by name...")
  // console.log(req.body)
  console.log(req.query)
  const name = req.query.name;
  const data = req.query.data;
  const author = req.query.author;
  
  db.get(`UPDATE ${schema.name} SET author = (?), data = (?) WHERE name = (?)`, [author, data, name], (error, row) => {
    
    if (error) {
      console.log(error)
      return res.send({ message: "error!" });
    } 
    
    if (req.headers['x-sender'] === 'npm-client') {
      return res.status(200).json({
        status:200,
        message: `Update successful for key ${name}`
      })
    } else {
      console.log(`row with name ${name} updated with ${author} and ${data}`)
      next()
    }
  });
  
}

exports.editDatumByNameNoPageApprove = async (req, res, next) => {
  console.log("NOPAGEAPPROVE")
  
const search = `(PLUS)`
const replacer = new RegExp(search, 'g')

const search2 = `(SLASH)`
const replacer2 = new RegExp(search2, 'g')

// const string = 'e851e2fa-4f00-4609-9dd2-9b3794c59619'

 
// -> e851e2fa/4f00/4609/9dd2/9b3794c59619
      
      
      let htmlBlob = req.params.name
      
      // console.log(htmlBlob.replace(replacer, '+')) 
      
      
      htmlBlob = htmlBlob.replace(replacer, '+');
      htmlBlob = htmlBlob.replace(replacer2, '/');
      
        // console.log(htmlBlob)


   // let nameURL =  Buffer.from(htmlBlob, 'base64').toString()
  let nameURL = req.params.name
  
  console.log(nameURL)
  
  
  if(!isValidJSON(req.body.data)) {
    res.status(500).end(`Invalid JSON payload: ${req.body.data}`)
  }
  
  


  const db = await helpers.initialize(schema)
  
    
  function getName(name, schema){
    console.log("getting name", name)
    
    db.get(`SELECT id, author, name, json(data) as data from '${schema.name}' WHERE name = '${name}' LIMIT 1`, (err, row) => {
    if (row) {
      console.log(`record: ${JSON.stringify(row)}`);

      row.data = JSON.parse(row.data)
      console.log("will be row.data")
      console.log(row.data)
      
        console.log("updating a link by name...")
  // console.log(req.body)
  console.log(req.query)
  const name = row.name;
  let data = row.data;
  const author = row.author;
      console.log(name)
      console.log(data)
      console.log(author)
      console.log("approving...")
  data.approved = "true"
      console.log(data)
  data = JSON.stringify(data)
      console.log(data)
      
  db.get(`UPDATE ${schema.name} SET author = (?), data = (?) WHERE name = (?)`, [author, data, name], (error, row) => {
    
    if (error) {
      console.log(error)
      return res.send({ message: "error!" });
    } 
    
    if (req.headers['x-sender'] === 'npm-client') {
      return res.status(200).json({
        status:200,
        message: `Approval successful for key ${name}`
      })
    } else {
      console.log(`row with name ${name} updated with ${author} and ${data}`)
    }
  });
      
      
      return res.status(200)
      
    } else {
      console.log(err)
      let message = {}
      return message = {message: `key with name ${name} not found`}
    }
  });
  }
  
  getName(nameURL, schema)

  
  

  
}


exports.editDatumByNameNoPageUpdateOrder = async (req, res, next) => {
  console.log("NOPAGEUPDATEORDER")
  
const search = `(PLUS)`
const replacer = new RegExp(search, 'g')

const search2 = `(SLASH)`
const replacer2 = new RegExp(search2, 'g')

// const string = 'e851e2fa-4f00-4609-9dd2-9b3794c59619'

 
// -> e851e2fa/4f00/4609/9dd2/9b3794c59619
      
      
      let htmlBlob = req.params.name
      console.log(req.params)
  console.log(req.params.order)
  // console.log("was req.params")
  // console.log(req)
  // console.log("was req")
      let order = req.params.order
      console.log(order)
      console.log("was new order")
      
      // console.log(htmlBlob.replace(replacer, '+')) 
      
      
      htmlBlob = htmlBlob.replace(replacer, '+');
      htmlBlob = htmlBlob.replace(replacer2, '/');
      
        // console.log(htmlBlob)


   // let nameURL =  Buffer.from(htmlBlob, 'base64').toString()
  let nameURL = req.params.name
  
  console.log(nameURL)
  console.log("was nameURL")
  
  
  if(!isValidJSON(req.body.data)) {
    res.status(500).end(`Invalid JSON payload: ${req.body.data}`)
  }
  
  


  const db = await helpers.initialize(schema)
  
    
  function getName(name, schema, newOrder){
    console.log("getting name", name)
    
    db.get(`SELECT id, author, name, json(data) as data from '${schema.name}' WHERE name = '${name}' LIMIT 1`, (err, row) => {
    if (row) {
      console.log(`record: ${JSON.stringify(row)}`);

      row.data = JSON.parse(row.data)
      console.log("will be row.data")
      console.log(row.data)
      
        console.log("updating a link by name...")
  // console.log(req.body)
  console.log(req.query)
  const name = row.name;
  let data = row.data;
  const author = row.author;
      console.log(name)
      console.log(data)
      console.log(author)
      console.log("updating order...")
      console.log(req.query.params)
      console.log("was req.query.params")
      console.log(req.params.order)
      console.log("was order")

  // data = JSON.stringify(data)
      data.order = newOrder
            console.log(data)
  data = JSON.stringify(data)
      console.log(data)
      console.log(newOrder)
      console.log("was newOrder")
      console.log(data.order)
      console.log("set new data order to that")
      console.log(data)
      // console.log(data)
      
  db.get(`UPDATE ${schema.name} SET author = (?), data = (?) WHERE name = (?)`, [author, data, name], (error, row) => {
    
    if (error) {
      console.log(error)
      return res.send({ message: "error!" });
    } 
    
    if (req.headers['x-sender'] === 'npm-client') {
      return res.status(200).json({
        status:200,
        message: `Approval successful for key ${name}`
      })
    } else {
      console.log(`row with name ${name} updated with ${author} and ${data}`)
    }
  });
      
      
      return res.status(200)
      
    } else {
      console.log(err)
      let message = {}
      return message = {message: `key with name ${name} not found`}
    }
  });
  }
  
  getName(nameURL, schema, order)

  
  

  
}



exports.editDatumByNameNoPageDeny = async (req, res, next) => {
  console.log("NOPAGEAPPROVE")
  
  const search = `(PLUS)`
const replacer = new RegExp(search, 'g')

const search2 = `(SLASH)`
const replacer2 = new RegExp(search2, 'g')

// const string = 'e851e2fa-4f00-4609-9dd2-9b3794c59619'

 
// -> e851e2fa/4f00/4609/9dd2/9b3794c59619
      
      
      let htmlBlob = req.params.name
      
      // console.log(htmlBlob.replace(replacer, '+')) 
      
      
      htmlBlob = htmlBlob.replace(replacer, '+');
      htmlBlob = htmlBlob.replace(replacer2, '/');
      
        // console.log(htmlBlob)


   // let nameURL =  Buffer.from(htmlBlob, 'base64').toString()
  let nameURL = req.params.name
  
  console.log(nameURL)
  
  
  if(!isValidJSON(req.body.data)) {
    res.status(500).end(`Invalid JSON payload: ${req.body.data}`)
  }
  
  


  const db = await helpers.initialize(schema)
  
    
  function getName(name, schema){
    console.log("getting name", name)
    
    db.get(`SELECT id, author, name, json(data) as data from '${schema.name}' WHERE name = '${name}' LIMIT 1`, (err, row) => {
    if (row) {
      console.log(`record: ${JSON.stringify(row)}`);

      row.data = JSON.parse(row.data)
      console.log("will be row.data")
      console.log(row.data)
      
        console.log("updating a link by name...")
  // console.log(req.body)
  console.log(req.query)
  const name = row.name;
  let data = row.data;
  const author = row.author;
      console.log(name)
      console.log(data)
      console.log(author)
      console.log("approving...")
  data.approved = "denied"
      console.log(data)
  data = JSON.stringify(data)
      console.log(data)
      
  db.get(`UPDATE ${schema.name} SET author = (?), data = (?) WHERE name = (?)`, [author, data, name], (error, row) => {
    
    if (error) {
      console.log(error)
      return res.send({ message: "error!" });
    } 
    
    if (req.headers['x-sender'] === 'npm-client') {
      return res.status(200).json({
        status:200,
        message: `Approval successful for key ${name}`
      })
    } else {
      console.log(`row with name ${name} updated with ${author} and ${data}`)
    }
  });
      
      
      return res.status(200)
      
    } else {
      console.log(err)
      let message = {}
      return message = {message: `key with name ${name} not found`}
    }
  });
  }
  
  getName(nameURL, schema)

  
  

  
}

exports.postDatum = async (req, res, next) => {
  req.body.data.approved = "true"
  if(!isValidJSON(req.body.data)) {
    res.status(500).end(`Invalid JSON payload: ${req.body.data}`)
  } else {
  
  if(req.body.name == ""){
    res.redirect('/invalid')
  } else {
      req.body.data.approved = "true"
  
  const db = await helpers.initialize(schema)
  
  console.log(req.body)
  console.log(`add to links ${req.body.name}, ${req.body.data} by ${req.body.author}`);
  
  const name = req.body.name;
  const data = req.body.data;
  const author = req.body.author;
  
  db.run(`INSERT INTO ${schema.name} (name, data, author) VALUES (?, json(?), ?)`, [name, data, author], error => {
    if (error) {
      console.log(error)
      return res.status(500).end({ message: "error!" });
    } 
    
    if (req.headers['x-sender'] === 'npm-client') {
      return res.status(200).json({
        status:200,
        message: `Insert Successful for key ${name}`
      })
    } else {
      console.log("new links entered into the db, moving on")
      next()
    }
    
    // res.status(500).end(`Thank you for expanding our curriculum. Your school will show up once it is approved.`)
    
    res.redirect('/thankyou')
  });
    
  }
  }
  

}

exports.thankYou = (req, res)=> {
  return res.sendFile(__dirname + '/views/indexEdit.html');
};



exports.credit = (req, res)=> {
  return res.sendFile(__dirname + '/views/credit.html');
};

exports.about = (req, res)=> {
  return res.sendFile(__dirname + '/views/info.html');
};


exports.nameError = (req, res)=> {
  return res.sendFile(__dirname + '/views/invalid.html');
};


// exports.edit = (req, res)=>{
//   // app.use(express.basicAuth('user', 'password'));

//   return res.sendFile(__dirname + '/views/editindex.html');
// }

exports.eraseDatum = async (req, res, next) => {
  const db = await helpers.initialize(schema)
  
  console.log("deleting data...")
  db.run(`DELETE From ${schema.name} WHERE id = '${req.params.id}'`, (error) => {
    if (error) {
      console.log(error)
      return res.status(500).end({ message: "error!" });
    } 
    
    if (req.headers['x-sender'] === 'npm-client') {
      return res.status(200).json({
        status:200,
        message: `Deleted key with id ${req.params.id}`
      })
    } else {
      console.log(`contents of id ${req.params.name} deleted`)
      next()
    }
  });
}

exports.eraseDatumByName = async (req, res, next) => {
  const db = await helpers.initialize(schema)
  
  console.log("deleting data...")
  db.get(`DELETE From ${schema.name} WHERE name = '${req.params.name}'`, (error) => {
    
    if (error) {
      console.log(error)
      return res.status(500).end({ message: "error!" });
    } 
        
    if (req.headers['x-sender'] === 'npm-client') {
      return res.status(200).json({
        status:200,
        message: `Deleted key ${req.params.name}`
      })
    } else {
      console.log(`contents of id ${req.params.name} deleted`)
      next()
    }
    
  });
}

exports.eraseData = async (req, res, next) => {
  const db = await helpers.initialize(schema)

  console.log("deleting data...")
  db.run(`DELETE From ${schema.name}`, (error) => {
    if (error) {
      console.log(error)
      return res.send({ message: "error!" });
    } else {
      console.log("contents of table deleted")
      next()
    }
  });
}







exports.schema = (req, res) =>{
  
  return res.json(schema)
}