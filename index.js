const prefix = "[CreadorCraft Maker] ";
console.info(prefix+"CreadorCraft Maker Action by Creadores Program ©2024");
console.info(prefix+"Loading Libraries...");
try{
  const { npmInstallAction } = require("npm-install")
  await npmInstallAction();
  const core = require('@actions/core');
  const github = require('@actions/github');
  const JSzip = require("jszip");
  const fs = require("fs");
}catch(error){
  console.error(error.stack || error.message);
  core.setFailed(error.stack || error.message);
}
//error Messages
const errorMessages = {
    inManifest: "\nError in manifest.json",
    inFileNotFound: function(file){
      return "\nError "+file+" Not Found";
    }
};
console.info(prefix+"Done!");
console.info(prefix+"Creating CreatorCraft Game...");
var dirGame = core.getInput("path");
try{
  var manifestCCG = {};
  fs.readFile(dirGame+"/manifest.json", 'utf8', (err, data) => {
    if(err){
        throw err;
    }
    manifestCCG = JSON.parse(data);
    if(manifestCCG.name == null || manifestCCG.name.trim() == ""){
        throw new Error(prefix+"You need a name for the game!"+errorMessages.inManifest);
    }
    if(manifestCCG.version == null || manifestCCG.version.trim() == ""){
        throw new Error(prefix+"You need a version for the game!"+errorMessages.inManifest);
    }
    if(manifestCCG.description == null){
        throw new Error(prefix+"You need a description for the game!"+errorMessages.inManifest);
    }
    if(manifestCCG.mainHtml == null){
        throw new Error(prefix+"You need a main Html for the game!"+errorMessages.inManifest);
    }
    if(manifestCCG.mainJS == null){
        throw new Error(prefix+"You need a main JS for the game!"+errorMessages.inManifest);
    }
    function VerifyAccess(dirs) {
      fs.access(dirGame+"/"+dirs).catch(()=>{
        throw new Error(prefix+errorMessages.inFileNotFound(dirs));
      });
    }
    VerifyAccess(manifestCCG.mainHtml);
    VerifyAccess(manifestCCG.mainJS);
    if(manifestCCG.mainJSmodule != null) VerifyAccess(manifestCCG.mainJSmodule);
    if(manifestCCG.mainCSS != null) VerifyAccess(manifestCCG.mainCSS);
    if(manifestCCG.mainPython != null) VerifyAccess(manifestCCG.mainPython);
    if(manifestCCG.mainWebAssembly != null) VerifyAccess(manifestCCG.mainWebAssembly);
    if(manifestCCG.mainCoffeeScript != null) VerifyAccess(manifestCCG.mainCoffeeScript);
    if(manifestCCG.mainLS != null) VerifyAccess(manifestCCG.mainLS);
    if(manifestCCG.mainTS != null) VerifyAccess(manifestCCG.mainTS);
    if(manifestCCG.mainLatinoScript != null) VerifyAccess(manifestCCG.mainLatinoScript);
    if(manifestCCG.mainSCSS != null) VerifyAccess(manifestCCG.mainSCSS);
    if(manifestCCG.mainPerl != null) VerifyAccess(manifestCCG.mainPerl);
    if(manifestCCG.mainRuby != null) VerifyAccess(manifestCCG.mainRuby);
    if(manifestCCG.mainLua != null) VerifyAccess(manifestCCG.mainLua);
    if(manifestCCG.mainPHP != null) VerifyAccess(manifestCCG.mainPHP);
    if(manifestCCG.mainLat != null) VerifyAccess(manifestCCG.mainLat);
    console.info(prefix+"Verification Complete");
    console.info(prefix+"Packing...");
    const zip = new JSZip();
    function addFilesToZip(folderPath, zipFolder) {
      const files = fs.readdirSync(folderPath);
    
      files.forEach(file => {
        let fullPath = "";
        if(folderPath != dirGame){
          if(folderPath.startsWith(dirGame+"/")){
            folderPath.replace(dirGame+"/", "");
          }
          fullPath = folderPath+"/"+file;
        }else{
          fullPath = file; 
        }
        const stat = fs.statSync(fullPath);
    
        if (stat.isDirectory()) {
          addFilesToZip(fullPath, zipFolder);
        } else {
          const fileData = fs.readFileSync(fullPath);
          zipFolder.file(file, fileData);
        }
      });
    }
    addFilesToZip(dirGame, zip);
    zip.generateAsync({ type: 'nodebuffer' })
    .then(content => {
      fs.writeFileSync(manifestCCG.name+" "+manifestCCG.version+'.creadorcraftgame.zip', content);
      console.info(prefix+'Game '+manifestCCG.name+" "+manifestCCG.version+'.creadorcraftgame.zip Build Correctly');
    })
    .catch(err => {
      console.error(prefix+"Game "+manifestCCG.name+" "+manifestCCG.version+'.creadorcraftgame.zip Build Fail');
      throw err;
    });
  });
}catch(error){
    console.error(error.stack || error.message);
    core.setFailed(error.stack || error.message);
}
