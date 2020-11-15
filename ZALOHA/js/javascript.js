
var json = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'photosJSON/photos.json',
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})();
for(var i=0;i<json.photos.length;i++) {
    var image ='<img draggable="true" src="'+json.photos[i].src+'" alt="'+json.photos[i].title+'" class="'+'mini"'+' id="'+i.toString()+'"'+'>'
    $('gallery').append(image);
    $('#'+i.toString()).click(function() {
        $('#overlay').addClass('active');
        $('#behind-scene').addClass('active');
        createScene(this.id,json);
    });
}

$('#searchBox').keyup(function (){
    var str1 = this.value.toLowerCase();
    console.log("---------------------------------");
    for(var i = 0;i<json.photos.length;i++){
        if(json.photos[i].title.toLowerCase().includes(str1)){
            $('#'+i).removeClass('hidden');
        }else{
            $('#'+i).addClass('hidden');
        }
    }
    console.log("---------------------------------");
});
function createScene(id){
    $('#behind-scene-header').html('<div class="title">'+json.photos[id].title+'</div>'+'<input id="exit" type="image" src="images/exit.png" alt="exit" class="exit" />');
    $('#behind-scene-body').html('<img src="'+json.photos[id].src+'" alt="'+json.photos[id].title+'" class="'+'full"'+' id="'+id.toString()+'"'+'>'+'<div class="leftArrow">\n' +
        '                    <input type="image" id="leftArrow" value="'+id+'" class="leftArrow" alt="leftArrow" src="images/left_arrow.png">\n' +
        '                </div>'+'<div class="rightArrow">\n' +
        '                    <input type="image" id="rightArrow" value="'+id+'" class="rightArrow" alt="rightArrow" src="images/right_arrow.png">\n' +
        '                </div>');
    $('#description').html(json.photos[id].description);
    $('#exit').click(function (){
        $('#overlay').removeClass('active');
        $('#behind-scene').removeClass('active');
        clearInterval(myShow);
    });
    $('#leftArrow').click(function (){
        leftArrow(this.value);
    });
    $('#rightArrow').click(function (){
        rightArrow(this.value);
    });
}
function rightArrow(id){
    console.log('thisValue= '+id);
    var nextId=parseInt(id)+1;
    if(nextId>=parseInt(json.photos.length)){
        nextId=0;
    }
    var classList = $('#'+nextId).attr('class').split(/\s+/);
    console.log(classList.length);
    if(classList.length>2){
        rightArrow(nextId);
    }else{
        console.log('nextID= '+nextId);
        createScene(nextId);
        console.log("Right ARROW clicked");
    }

}
function leftArrow(id){
    console.log('thisValue= '+id);
    var nextId=parseInt(id)-1;
    if(nextId<0){
        nextId=parseInt(json.photos.length)-1;
    }
    var classList = $('#'+nextId).attr('class').split(/\s+/);
    console.log(classList.length);
    if(classList.length>1){
        leftArrow(nextId);
    }else{
        console.log('nextID= '+nextId);
        createScene(nextId);
        console.log("Left ARROW clicked");
    }
}
var myShow;
$('#play').click(function (){
    myShow=setInterval(showSlide, 2000);
});
$('#stop').click(function (){
    clearInterval(myShow);
});
function showSlide(){
    rightArrow(document.getElementById('rightArrow').value);
}
$(document).ready(function() {
    $('#dropzone').sortable({
        revert:true
    });

});

