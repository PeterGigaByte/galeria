let gallery = $('#dropzone');
let json = (function () {
    let json = null;
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
for(let i=0;i<json.photos.length;i++) {
    let image ='<img draggable="true" src="'+json.photos[i].src+'" alt="'+json.photos[i].title+'" class="'+'mini"'+' id="'+i.toString()+'"'+'>'

    gallery.append(image);

    $('#'+i.toString()).click(function() {
        $('#overlay').addClass('active');
        $('#behind-scene').addClass('active');
        createScene(this.id,json);
    });
}
$('#searchBox').keyup(function (){
    let str1 = this.value.toLowerCase();
    console.log("---------------------------------");
    for(let i = 0;i<json.photos.length;i++){
        if(json.photos[i].title.toLowerCase().includes(str1)){
            $('#'+i).removeClass('hidden');
        }else{
            $('#'+i).addClass('hidden');
        }
    }
    console.log("---------------------------------");
});
function createScene(id){
    let images = gallery.children();
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
        leftArrow(images);
    });
    $('#rightArrow').click(function (){
        rightArrow(images);
    });
}
function findPosInArray(id,images){
    for (let index=0;index<images.length;index++){
        if(images[index].id===id){
            return index;
        }
    }
}
function getNextPosInArray(positionInArray,images){
    let newPosition = positionInArray+1;
    if(newPosition>images.length-1){
        newPosition=0;
        console.log(newPosition);
    }
    let classList = $('#'+newPosition).attr('class').split(/\s+/);
    if(classList.length>2){
        getNextPosInArray(newPosition,images);
    }
    let position = images[newPosition];
    return position.id;
}
function getPreviousPosInArray(positionInArray,images){
    let previousPosition = positionInArray-1;
    if(previousPosition<0){
        console.log(previousPosition);
        previousPosition=images.length-1;
        console.log(previousPosition);
    }
    let classList = $('#'+previousPosition).attr('class').split(/\s+/);
    if(classList.length>2){
        getPreviousPosInArray(previousPosition,images);
    }
    let position = images[previousPosition];
    return position.id;
}
function rightArrow(images){
    let id = document.getElementsByClassName('full')[0].id;
    console.log('thisValue= '+id);
    let positionInArray = findPosInArray(id,images);
    console.log(positionInArray);
    let nextPosition = getNextPosInArray(positionInArray,images);
    createScene(nextPosition);
}
function leftArrow(images){
    let id = document.getElementsByClassName('full')[0].id;
    console.log('thisValue= '+id);
    let positionInArray = findPosInArray(id,images);
    console.log(positionInArray);
    let previousPosition = getPreviousPosInArray(positionInArray,images);
    createScene(previousPosition);
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
$( function() {
    $( gallery ).sortable();
    $( gallery ).disableSelection();
    });

