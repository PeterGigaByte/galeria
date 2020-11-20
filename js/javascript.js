

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
let cookies = [];
cookies=pushToArrayCookies(cookies);
printArray(cookies);
let idC;
for(let i=0;i<json.photos.length;i++) {
    if(cookies.length===json.photos.length && cookies[0]){
        idC=cookies[i]
    }
    else{
        idC=i;
    }
    let image ='<img draggable="true" src="'+json.photos[idC].src+'" alt="'+json.photos[idC].title+'" class="'+'mini"'+' id="'+idC.toString()+'"'+'>'

    gallery.append(image);

    $('#'+idC.toString()).click(function() {
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
    }
    let classList = $('#'+images[newPosition].id).attr('class').split(/\s+/);
    if(classList.length>2){
        console.log('rekurzia');
        return  getNextPosInArray(newPosition,images);
    }
    let position = images[newPosition];
    return position.id;
}
function getPreviousPosInArray(positionInArray,images){
    let previousPosition = positionInArray-1;
    if(previousPosition<0){
        previousPosition=images.length-1;
    }
    let classList = $('#'+images[previousPosition].id).attr('class').split(/\s+/);
    if(classList.length>2){
        console.log('rekurzia');
        return  getPreviousPosInArray(previousPosition,images);
    }
    let position = images[previousPosition];
    return position.id;
}
function rightArrow(images){
    let id = document.getElementsByClassName('full')[0].id;
    let positionInArray = findPosInArray(id,images);
    console.log('thisValue= '+positionInArray);

    let nextPosition = getNextPosInArray(positionInArray,images);
    console.log('id v jsone',nextPosition);
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
    $( gallery ).sortable({
        stop: function (){
            setAllCookies();
            cookies = pushToArrayCookies(cookies);
        }
    });
    $( gallery ).disableSelection();
    setAllCookies();
    });
function setCookie(key, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000));
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}
function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}
function pushToArrayCookies(array){
    for(let index = 0;index<json.photos.length;index++){
        array.push(getCookie(index));
    }
    return array;
}
function printArray(array){
    for(let index = 0;index<array.length;index++){
        console.log(array[index]);
    }
}
function setAllCookies(){
    let images = document.getElementsByClassName('mini');
    for (let index = 0;index<images.length;index++){
        setCookie(index,images[index].id);
    }
}

