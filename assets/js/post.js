function checkUpload(e,t){
    var l;
    if(clearAll(t),e.target.files&&e.target.files[0])
    for(l=0;l<e.target.files.length;l++){
        var n=new FileReader;
        n.onload=function(e){
            appendElement(t,e.target.result)
        },
        n.readAsDataURL(e.target.files[l])
    }
    console.log(e.target.files)
}
function appendElement(e,t){
    var l='<img class="upload-thumbnail" src="'+t+'"></img>';
    document.getElementById(e).innerHTML+=l
}
function clearAll(e){
    document.getElementById(e).innerHTML=""
}