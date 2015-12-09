var quizRound = 1;
var deviceHeightSet = false;
var db;
var myScroll;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.cor
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("backbutton", this.onBackKeyDown, false);
/*
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
*/
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        $.mobile.allowCrossDomainPages = true;
        $.support.cors = true;
        $.mobile.buttonMarkup.hoverDelay = 50;
        $.mobile.defaultDialogTransition = "none";
        $.mobile.defaultPageTransition = "none";

        window.setInterval(checkForNotification, 9000);

        cordova.plugins.notification.local.on("click", function (notification) {
            window.location.hash = "#articleList";
            var requiredData = '';
            var requiredResult = '';
            var articleDay = notification.id;
            $("#ularticleByDayList").html('');
            articleDay = Number(articleDay);
            $.getJSON('info.json', function(data){
               requiredData = data.data[articleDay-1].articles;
                $.each(requiredData,function(i, obj){
                    requiredResult = requiredResult + '<li class="ui-first-child"><a style="color:#496901;" href="#" class="ui-btn ui-btn-icon-right ui-icon-carat-r" data-transition="slide"  ' +
                    'data-id="'+obj.id+'" >' + obj.title + '</a></li>';
                } );
                $("#ularticleByDayList").html(requiredResult);
                $('#ularticleByDayList').find("a").click(function(e){
                    window.location.hash = "#viewIndividualArticle";
                    individualArticleNumber = $(this).data('id');
                    individualArticleNumber = Number(individualArticleNumber);
                    $("#individualarticletitle").html(data.data[articleDay-1].articles[individualArticleNumber].title);
                    //$("#individualarticlenumber").html($(this).data('id'));
                    $("#individualarticledescription").html(data.data[articleDay-1].articles[individualArticleNumber].description);
                    //$("#individualarticleday").html(articleDay);
                });

            });



        });
        /*var viewportScale = 1 / window.devicePixelRatio;
        $("#viewport").attr("content","user-scalable=no, initial-scale="+viewportScale+", minimum-scale=0.2, maximum-scale=2, width=device-width");*/

        //loadIscroll();
        checkIfLoggedIn();
        getDeviceHeight();
        //db = window.openDatabase("Database", "1.0", "Reorder", 5242880);

        $(document).on('swiperight', '.page-content', function(){
            var currentPage = window.location.hash;
            if(currentPage == "#homeScreen"){

            }else if(currentPage == "#messagePage"){
                window.location.hash = "#loadingForQuiz";
            }else if(currentPage == "#quizPage"){
                if(confirm("Are you sure you want to quit the game?")){
                    window.location.hash = "#loadingForQuiz";
                }
            }else if(currentPage == "#loadingForQuiz"){
                window.location.hash = '#homeScreen';
            }else if(currentPage == "#forumPage"){
                if(window.localStorage.getItem('role') == "patient"){
                    window.location.hash = "#messagePage";
                }else{
                    window.location.hash = "#patientListPage";
                }
            }


           //window.location.hash = "#requestList";
        });

        $(document).on('swipeleft', '.page-content', function(){
           var currentPage = window.location.hash;
            if(currentPage == "#homeScreen"){
                window.location.hash = "#loadingForQuiz";
            }else if(currentPage == "#quizPage"){
                if(confirm("Are you sure you want to quit the game?")){
                    window.location.hash = "#loadingForQuiz";
                }
            }else if(currentPage == "#loadingForQuiz"){
                window.location.hash = "messagePage";
            }else if(currentPage == "#messagePage" || currentPage == "#patientListPage"){
                window.location.hash = "#forumPage";
                $('#forum-content').html('<iframe style="height:100%;width:100%;-webkit-overflow-scrolling: touch;" src="http://thelacunablog.com/forum"></iframe>');
            }
        });


        $("#LoginButton").on('click', function(e){
           Login(e);
        });

        $("#logout").on('click', function(e){
            e.preventDefault();
            if(confirm("Are you sure you want to logout?")){
                window.localStorage.clear();
                cancelAllNotifications();
                window.location.hash = "#login";
            }
        })

        $("#load-articles").on('click', function(e){
            loadInitialCss();
            loadArticles();
        });

        $("#load-quiz").on('click', function(e){
            window.location.hash = "#quizPage";
            loadQuizByDay(1);
            //loadQuiz();
            //thought different page would be better for quiz.
           /*$("#content-bin").html('');
            var result = '<h1>No quiz contents available</h1>';
            $("#content-bin").html(result);*/
        });

        $("#load-settings").on('click', function(e){
            loadInitialCss()
            $("#content-bin").html('');
            var result = '<h1>Under construction</h1>';
            $("#content-bin").html(result);
        });

        $("#load-my-baby").on('click', function(e){
            loadInitialCss();
            schedule();
        });

        $(".icon-notification").on('click', function(e){
            window.location.hash = "#requestList";
            showMessage();
            showUserQueries();
        });

        $("#submitQuery").on('click', function(e){
            submitUserQuestion();
        });

        $("#playQuiz").on('click', function(e){
           window.location.hash = '#quizPage';
            quizRound = 1;
            $("#progress-bar").css({"width": "0%"});
            //loadQuizByDay(quizRound,0);
            getQuizQuestion(0, 0);
        });

        $("#messagePatient").on('click', function(e){
            $("#messageArea").show();
        });

        $("#sendMessageNow").on('click', function(e){

        });

        $("#replyThread").on('click', function(e){
           $("#replymessageArea").show();
        });

        $("#replyMessageNow").on('click', function(e){
           alert("Message Sent");
        });


        $("#btnAddItem").on('click',function(e){
            startScan();
            var data = {Item:"Colgate", ItemProductGroup:"Toothpaste", ItemProductManufacturer: "Colgate Inc", ItemId: 11223498573};
            data = JSON.stringify(data);
            db.transaction(function (tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS person(id unique, data )');
                tx.executeSql('INSERT OR REPLACE INTO person(id, data) VALUES (1, ?)', [data]);
                tx.executeSql('INSERT OR REPLACE INTO person(id, data) VALUES (2, ?)', [data]);
                tx.executeSql('INSERT OR REPLACE INTO person(id, data) VALUES (3, ?)', [data]);
                tx.executeSql('INSERT OR REPLACE INTO person(id, data) VALUES (4, ?)', [data]);

            });



        });

        $("#btnViewItem").on("click", function(e){
            $('#ulItemList').html('');
            db.transaction(function(tx){
                tx.executeSql('SELECT * FROM person',[], function(tx,results){queryGetPersonInfoSuccess(tx,results)}, errorCB);
            });
            window.location.hash = '#itemList';
        });

        $("#btnViewTransaction").on('click',function(e){
            $('#ulTransactionList').html('');
            window.location.hash = "transactionList";
        });

        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event

    onBackKeyDown:function() {
        var hashId = window.location.hash;
        if (hashId == null || hashId == "" || hashId == "#homeScreen" || hashId == "#login" || hashId == "#patientListPage") {
            // Define the Dialog and its properties.
            if(confirm('Do you want to exit application?')){
                navigator.app.exitApp();
            }

            /*navigator.notification.confirm(
                'Do you want to exit application?',  // message
                function(result){
                    if(result == 1){
                        navigator.app.exitApp();
                    }
                }
            );*/
        }else{
            if(hashId == "#quizPage"){
                if(! confirm("Are you sure you want to quiz the game?")){
                    return;
                }
            }
            navigator.app.backHistory();
        }
    },
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();



// Transaction error callback
//

function queryGetPersonInfoSuccess(tx,results){
    var len = results.rows.length;
    var result = '';
    alert(len);
    var obj;
    for(var i = 0; i<len; i++){
        obj = JSON.parse(results.rows.item(i).data);
        alert(obj.ItemProductGroup);
        result += '<li class="ui-first-child"><a href="#viewIndividualItem" class="ui-btn ui-btn-icon-right ui-icon-carat-r" data-transition="slide"' + 'data-itemName="' + obj.Item +
        '" data-itemProductGroup="' +obj.ItemProductGroup +
        '" data-itemProductManufacturer="' +obj.ItemProductManufacturer +
        '" data-itemId="' + obj.ItemId  +'"' + '" style="font-style:oblique;color:lightslategray" class="ui-btn ui-btn-icon-right ui-icon-carat-r itemclickhere"' + '>' + obj.Item +'</a></li>'
    }
    $('#ulItemList').html(result);

    $('#ulItemList').find("a").click(function(e){
        console.log(JSON.stringify($(this).attr('data-itemName')));
        $('#itemTitleFromResponse').html($(this).attr('data-itemName'));
        $('#itemProductGroupFromResponse').html($(this).attr('data-itemProductGroup'));
        $('#itemManufacturerFromResponse').html($(this).attr('data-itemProductManufacturer'));
        $('#itemIdFromResponse').html($(this).attr('data-itemId'));
    });

}

function errorCB(err) {
    console.log("DW: Error processing SQL: "+ JSON.stringify(err));
}

function startScan() {
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            var s = "Result: " + result.text +
                "Format: " + result.format +
                "Cancelled: " + result.cancelled;
            alert(JSON.stringify(s));
            //resultDiv.innerHTML = s;
        },
        function (error) {
            alert("Scanning failed: " + error);
        }
    );
}


function successCB() {
    alert("success!");
}

function Login(e){

    console.log("AAMA: Processing LoginButton() of inside index.js");
    var isValid = false;
    var username = $("#username").val();
    var password = $("#password").val();

    if(username == "" || password == ""){
        alert("Please enter both email/username and password.");
        return;
    }
    $.getJSON( "users.json", function( data ) {
        var user_info = data.user;
        for(var i =0; i < user_info.length; i++){
            if((username == user_info[i].email || username == user_info[i].username) && password == user_info[i].password){
                window.localStorage.setItem("username",username);
                window.localStorage.setItem("role", user_info[i].role);
                window.localStorage.setItem("day",user_info[i].day);
                window.location.hash = '#homeScreen';
                //makeScrollableMenu();
                if(user_info[i].role == "patient"){
                    loadArticles();
                    scheduleNotifications();
                }else{
                    loadPatientsList();
                }

                return;
            }
        }
        alert("The username/email and password do not match.");
        return;

    });

}

function checkIfLoggedIn(){
    var username = window.localStorage.getItem('username');
    var role = window.localStorage.getItem('role');
    if(username != null && username != undefined && username != ""){
        if(window.localStorage.getItem('role') == 'patient'){
            loadArticles();
            window.location.hash = '#homeScreen';
        }else {
            loadPatientsList();
            window.location.hash = "#patientListPage";
        }
        //makeScrollableMenu();
        //loadIscroll();
        //loadArticles();
    }

}

function makeScrollableMenu(){
    var step = 1;
    var current = 0;
    var maximum = $(".categories ul li").size();
    var visible = 2;
    var speed = 500;
    var liSize = 120;
    var height = 60;
    var ulSize = liSize * maximum;
    var divSize = liSize * visible;

    $('.categories').css("width", "auto").css("height", height+"px").css("visibility", "visible").css("overflow", "hidden").css("position", "relative");
    $(".categories ul li").css("list-style","none").css("display","inline");
    $(".categories ul").css("width", ulSize+"px").css("left", -(current * liSize)).css("position", "absolute").css("white-space","nowrap").css("margin","0px").css("padding","5px");

    $(".categories").swipeleft(function(event){
        if(current + step < 0 || current + step > maximum - visible) {return; }
        else {
            current = current + step;
            $('.categories ul').animate({left: -(liSize * current)}, speed, null);
        }
        return false;
    });

    $(".categories").swiperight(function(){
        if(current - step < 0 || current - step > maximum - visible) {return; }
        else {
            current = current - step;
            $('.categories ul').animate({left: -(liSize * current)}, speed, null);
        }
        return false;
    });
}

function loadArticles(){
    toggleLoadingImage(true,$("#homepageLoading"));
    $("#content-bin").html('');
    var innerContent = '<ul id ="ularticles" class="dashboard">';
    var result = '';
    var articleDay = 0;
    var requiredArticleDay = '';
    var individualArticleNumber = 0;
    $.getJSON("info.json", function(data){

        $.each(data.data, function(i, obj){
            if(i%2 == 0) {
/*
                result += '<li class="icon-view-item"><a style="color:#496901;" href="#" data-transition="pop" data-id="' + obj.day + '">Day ' + obj.day + '</a></li>'
*/
                result += '<li class="icon-view-item"><a style="color:#496901;" href="#" data-transition="pop" data-id="' + obj.week + '"><div><img class="main-logo" src="img/W.png">' + obj.week + '</div></a></li>'

            }else{
                result += '<li class="icon-view-transaction"><a style="color:#496901;" href="#" data-transition="pop" data-id="' + obj.week + '"><div><img class="main-logo" src="img/W.png">'+obj.week+'</div></a></li>'
            }
        });
        innerContent += result + '</ul>';
        $("#content-bin").html(innerContent);

        $('#ularticles').find("a").click(function (e) {
            window.location.hash = "#articleList";
            var requiredResult = '';
            $("#ularticleByDayList").html('');
            articleDay = $(this).data('id');
            articleDay = Number(articleDay);
            requiredArticleDay = data.data[articleDay-1].articles;
            $.each(requiredArticleDay, function(i,obj){
                requiredResult = requiredResult + '<li class="ui-first-child"><a style="color:#496901;" href="#" class="ui-btn ui-btn-icon-right ui-icon-carat-r" data-transition="slide"  ' +
                'data-id="'+obj.id+'" >' + obj.title + '</a></li>';
            });
            $("#ularticleByDayList").html(requiredResult);

            $('#ularticleByDayList').find("a").click(function(e){
               window.location.hash = "#viewIndividualArticle";
                individualArticleNumber = $(this).data('id');
                individualArticleNumber = Number(individualArticleNumber);
                $("#individualarticletitle").html(data.data[articleDay-1].articles[individualArticleNumber].title);
                //$("#individualarticlenumber").html($(this).data('id'));
                $("#individualarticledescription").html(data.data[articleDay-1].articles[individualArticleNumber].description);
                //$("#individualarticleday").html(articleDay);
            });
        });


    });


    toggleLoadingImage(false,$("#homepageLoading"));


}


function toggleLoadingImage(show,identity){
    if(show){
        if(identity)
            identity.html('<div class="ui-loader-background" />');
        $.mobile.loading("show",{theme:"e", overlayTheme:"a"});

    }else {
        $.mobile.loading('hide');
        if(identity)
            identity.html('');
    }
}

function scheduleNotifications(){
    var day = window.localStorage.getItem('day');
    day = Number(day);
    var d = new Date();
    d.setHours(7,0, 0, 0);
    $.getJSON("info.json", function(data){
        $.each(data.data, function(i, obj){
            if(i>=day-1){
                /*$.each(obj.articles, function(j, articleObj){
                    alert(JSON.stringify(articleObj));
                   cordova.plugins.notofication.local.schedule({
                       id: i,
                       title:"AAMA Article Daily",
                       text:"Day " + i + "Article" + j,
                       date:d
                   }) ;
                    d.setHours(d.getHours() + 1);
*//*
                    d.setHours(d.getHours() + 1);
*//*
                });*/

                cordova.plugins.notification.local.schedule({
                    id: i,
                    title: "AAMA Article Daily",
                    text: "Week" + i + "Article",
                    date: d
                    //sound: isAndroid ? 'file://sound.mp3' : 'file://beep.caf',
                });
                d.setDate(d.getDate() + 1);
            }
        });


    });
}

function tryNotification(){
    alert("ready for notification?");
    cordova.plugins.notification.local.schedule({
        id: "1",
        text: 'Test Message 1'
    });
}



function loadIscroll () {
    console.log('bhishan bhandari');
    myScroll = new IScroll('#horizontalWrapper', { scrollX: true, scrollY: false});
    console.log('bhishan bhandari.');
}

function getDeviceHeight(){

    $(window).bind('resize', function () {
        if(!deviceHeightSet && (window.orientation === 0 || window.orientation === 180)){
            var headerSize = $('[data-role="header"]').first().height();
           // var footerSize = $('[data-role="footer"]').first().height();
            var deviceHeight = $('[data-role="page"]').first().height();
            deviceHeightSet = true;
            var divWrapperSize = deviceHeight - headerSize;
            //alert("Height: " + globalDetails.deviceHeight + " ,headerSize: " + headerSize + ", footerSize: " + footerSize)
            $(".page-content").css({"height": divWrapperSize-50});
            $("#content-bin").css({"height": divWrapperSize-50});
        }
    });

    $(window).trigger("resize");
}

function loadQuiz(){
    $("#content-bin").html('');
    $(".page-content").css({"background": 'black'});
    $("#ulmenu").css({"background": "black"});
    $("#load-articles").css({"color": "white !important"});
    $("#load-quiz").css({"color": "white !important"});
    $("#load-settings").css({"color": "white !important"});
    $("#load-my-baby").css({"color": "white !important"});
    $("#load-contact-us").css({"color": "white !important"});
    $("#load-important-numbers").css({"color": "white !important"});
    $("#load-messages-questions").css({"color": "white !important"});
    $("#load-community").css({"color": "white !important"});
    var result = '';
    var question = '<div style="overflow: auto;height: 50%; font-size: larger;" class="ui-content">Who is the best in the world?</div>'
    var multipleOptions = '<div style="overflow:auto;">' +
        '<ul id="ulquiz" class="dashboard"></ul></div>';
    $("#content-bin").html(question + multipleOptions);
  //  result += '<li class="icon-view-item"><a style="color:#496901;" href="#" data-transition="pop" data-id="' + obj.day + '"><div><img class="main-logo" src="img/e2day.png">' + obj.day + '</div></a></li>'
    result += '<button style="background-color: #f5f5f5 !important;" class="ui-btn ui-btn-active ui-btn-corner-all btnSubmit" id="option1"> <a style="color:#000000" href="#" data-answer="true">Bhishan</a></button>';
    result += '<button style="background-color: #f5f5f5 !important;" class="ui-btn ui-btn-active ui-btn-corner-all btnSubmit" id="option1"><a style="color:#000000" href="#" data-answer="false">Megh</a></button>';
    result += '<button style="background-color: #f5f5f5 !important;" class="ui-btn ui-btn-active ui-btn-corner-all btnSubmit" id="option1"><a style="color:#000000" data-answer="false" href="#">Ganga</a></button>';
    result += '<button style="background-color: #f5f5f5 !important;" class="ui-btn ui-btn-active ui-btn-corner-all btnSubmit" id="option1"><a style="color:#000000; font-size: large;" href="#" data-answer="false"> Renuka</a></button>';

    $("#ulquiz").html(result);

    $("#ulquiz").find("a").click(function(e){
        e.preventDefault();
        var userAnswer = $(this).data('answer');
        if (userAnswer == "true"){
            $(this).parent().css({"background":"green"});
        }
        alert("answered");
    });
}

function loadInitialCss(){
    $(".page-content").css({"background": '#8FEFF5'});
    $("#ulmenu").css({"background": "#8FEFF5"});
}

function cancelAllNotifications(){
    cordova.plugins.notification.local.cancelAll(function() {
        //alert("All the scheduled notifications has been removed.");
    }, this);
}

function logOut(){
    if(confirm("Are you sure you want to logout?")){
        window.localStorage.clear();
        cancelAllNotifications();
        window.location.hash = "#login";
    }
}

function loadQuizByDay(round, points){
    $('#quiz-content').html('');
    $('#quiz-content').html('<div style="margin-top: 50%;"> <p style="color: #008000;">Round' + round +'</p></div>');
    $('#quiz-content').html('');
    var result = '';
    var question = '  <div id="CountDownTimer" data-timer="25" style="height: 250px;"></div>';
    question += '<div style="overflow: auto;" class="ui-content"><p style="color:white; font-family: FontAwesome; font-size: x-large; font-weight: bold; justify-content: center;">Who is the best in the world?</p></div>'
    var multipleOptions = '<div style="height:50%;" id="ulquizs" style="bottom: 10px;">' +
        '</div>';
    $("#quiz-content").html(question + multipleOptions);
    //  result += '<li class="icon-view-item"><a style="color:#496901;" href="#" data-transition="pop" data-id="' + obj.day + '"><div><img class="main-logo" src="img/e2day.png">' + obj.day + '</div></a></li>'
    result += '<a class="clickDisable" href="#" data-answer="false"><button style="height:75px;background-color: #f5f5f5 !important;" class="ui-btn ui-btn-active ui-btn-corner-all btnSubmit" id="option1"> <div style="color:black;">Bhishan</div></button></a>' + '<div style="margin-top:10px;"></div>';
    result += '<a class="clickDisable" href="#" data-answer="correct"><button style="height:75px;background-color: #f5f5f5 !important;" class="ui-btn ui-btn-active ui-btn-corner-all btnSubmit" id="option1"><div style="color:black;">Megh</div></button></a>' + '<div style="margin-top:10px;"></div>';
    result += '<a class="clickDisable" href="#" data-answer="false"><button style="height:75px;background-color: #f5f5f5 !important;" class="ui-btn ui-btn-active ui-btn-corner-all btnSubmit" id="option1"><div style="color:black;">Ganga</div></button></a>' + '<div style="margin-top:10px;"></div>';
    result += '<a class="clickDisable" href="#" data-answer="false"><button style="height:75px;background-color: #f5f5f5 !important;" class="ui-btn ui-btn-active ui-btn-corner-all btnSubmit" id="option1"><div style="color:black;">Ganga</div></button></a>' + '<div style="margin-top:10px;"></div>';

    $("#ulquizs").html(result);

    $("#CountDownTimer").TimeCircles({ time: { Days: { show: false }, Hours: { show: false }, Minutes:{show:false} }}).start();

    $("#ulquizs").find("a").click(function(e){

        e.preventDefault();
        $(this).children("button").css({"background-color":"#008000"});
        if ($(this).data('answer') == "correct"){
            $("#progress-bar").css({"width": points + 20 + "%"});
        }else{
            $(this).children("button").css({"background-color":"red"});

        }
        //$('.clickDisable').prop("readonly",true);
        //sleep(2000);
        //loadQuizByDay(1);
    });
    /*$.getJSON("quiz.json", function(data){
        var requiredData = data.data[day-1].String(day-1);
        $.each(requiredData, function(obj){

        });

    });*/
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function lookUpQuestions(){
    var totalNotifications = 0;
    $.getJSON('queries.json', function(data){
        $.each(data.data, function(obj){
           if(obj.status == "unanswered"){
               totalNotifications += 1;
           }
        });

        if(totalNotifications>0){
            $('.requestCount').html(totalNotifications);
        }else{
            $('.requestCount').html(0);
        }

    });
}

function showUserQueries(){

}

function submitUserQuestion(){
    var question = $('#submitQuestion').val();
    //var questionDetails = ('#submitQuestionDescription').val();
    if (question == ''){
        alert("Enter question to proceed");
        return;
    }else{
        alert("Your question has been recorded, we will notify you as soon as someone answers.");
        window.location.hash = "#homeScreen";
    }
}

function getQuizQuestion(number, points){
    $("#progress-bar").css({"width": points   + "%"});
    $('#quiz-content').html('');
    $.getJSON("quiz.json", function(data){
        var result ='';
        var requiredData = data.data[0].one;
        if(number >= requiredData.length){
            window.location.hash = "#loadingForQuiz";
            return;
        }
        requiredData = requiredData[Number(number)];
        //var question = '<div id="CountDownTimer" data-timer="25" style="height: 200px;"></div>';
        var question = '<div style="overflow: auto;" class="ui-content"><p style="color:white; font-family: FontAwesome; font-size: x-large; font-weight: bold; justify-content: center;">' + requiredData.question +'</p></div>';
        var multipleOptions = '<div style="height:50%;" id="ulquizs" style="bottom: 10px;">' +
            '</div>';
        var answer = requiredData.answer;
        $("#quiz-content").html(question + multipleOptions);
        $("#CountDownTimer").TimeCircles({ time: { Days: { show: false }, Hours: { show: false }, Minutes:{show:false} }}).start();

        //  result += '<li class="icon-view-item"><a style="color:#496901;" href="#" data-transition="pop" data-id="' + obj.day + '"><div><img class="main-logo" src="img/e2day.png">' + obj.day + '</div></a></li>'
        $.each(requiredData.options, function(i, obj){
           if(obj == answer){
               result += '<a href="#" data-answer="correct"><button style="height:75px;background-color: #f5f5f5 !important;" class="ui-btn ui-btn-active ui-btn-corner-all btnSubmit right-answer" id="option1"> <div style="color:black;">' + JSON.stringify(obj) +'</div></button></a>' + '<div style="margin-top:10px;"></div>';
           }else{
               result += '<a href="#" data-answer="false"><button style="height:75px;background-color: #f5f5f5 !important;" class="ui-btn ui-btn-active ui-btn-corner-all btnSubmit" id="option1"> <div style="color:black;">' + JSON.stringify(obj) +'</div></button></a>' + '<div style="margin-top:10px;"></div>';
           }
        });
        $("#ulquizs").html(result);

        $("#CountDownTimer").TimeCircles({ time: { Days: { show: false }, Hours: { show: false }, Minutes:{show:false} }}).start();

        $("#ulquizs").find("a").click(function(e){

            e.preventDefault();
            //quizCheck(points, $(this));
            //quizCheck(points, $(this), number);
            $('.right-answer').css({"background-color": "green"});
            if ($(this).data('answer') == "correct"){
                $("#progress-bar").css({"width": points + 20 + "%"});
            }else{
                $(this).children("button").css({"background-color":"red"});
            }

            //getQuizQuestion(number + 1, points)
            //$('.clickDisable').prop("readonly",true);
            //sleep(2000);
            //loadQuizByDay(1);
        });
    });
}

function quizCheck(points, event, number){
    $('.right-answer').css({"background-color": "green"});
    if (event.data('answer') == "correct"){
        $("#progress-bar").css({"width": points + 25 + "%"}).done(getQuizQuestion(number+1, points));
        //getQuizQuestion(number+1, points);
    }else{
        event.children("button").css({"background-color":"red"}).done(getQuizQuestion(number+1, points));
        //getQuizQuestion(number+1, points);
    }
}

function checkForNotification(){
    var countOfNotification = 0;
    var role = window.localStorage.getItem('role');
    if(role == "patient"){
        $.getJSON('messageforpatient.json', function(data){
            $.each(data.data, function(i, obj){
                if(obj.read == "false"){
                    countOfNotification += 1;
                }
            });
            $('.requestCount').text(countOfNotification);
        });
    }else{
        $.getJSON('messagefordoctor.json', function(data){
            $.each(data.data, function(i, obj){
               if(obj.read == "false"){
                   countOfNotification += 1;
               }
            });
            $('.requestCount').text(countOfNotification);

        });
    }

}


function loadPatientsList(){
    var divContent = '';
    window.location.hash = '#patientListPage';
    var patientList = ['Sunita Ghising', 'Pavitra Wagle', 'Ranmaya Tamang', 'Sonu Bhujel', 'Namrata Shrestha', 'Subekshya Dhamala', 'Ashmita Kunwar', 'Nikita Gautam', 'Sneha Parajuli', 'Ruby Shrestha', 'Rojina Karki', 'Nisha Dhungana', 'Osheen Shrestha', 'Depika Humagain', 'Archana Paneru', 'Sulekha Acharya'];
    var patientRisk = ['red', 'yellow', 'yellow', 'green', 'red', 'yellow', 'yellow', 'green', 'green', 'green', 'yellow', 'red', 'green', 'green', 'green', 'green'];

    var result = '';
    $("#ulPatients").html('');
    $.each(patientList, function (i, obj){

        result += '<li style="height:75px;' + 'background-color:' + patientRisk[i] + ';" class="ui-first-child"><a data-name="'+ obj + '"data-risk="' + patientRisk[i] +'" href="#" class="ui-btn ui-btn-icon-right ui-icon-carat-r" data-transition="slide">' + obj + '</a></li>';
    });

    $("#ulPatients").html(result);

    $("#ulPatients").find("a").click(function(e){
        $("#messageArea").hide();
        var patientName = $(this).data("name");
        var patientRisk = $(this).data("risk");
        $("#patientName").html(patientName);
        if(patientRisk == "red"){
            $("#patientAge").html("37");
            $("#patientFirstPregnancy").html("No");
            $("#patientAnemia").html("No");
            $("#patientDiabetes").html("Yes");
            $("#patientPrematureBirth").html("Yes");
            $("#patientUltrasound").html("Abnormal");
        }else if(patientRisk == "yellow"){
            $("#patientAge").html("26");
            $("#patientFirstPregnancy").html("Yes");
            $("#patientAnemia").html("No");
            $("#patientDiabetes").html("Yes");
            $("#patientPrematureBirth").html("No");
            $("#patientUltrasound").html("Normal");
        }else{
            $("#patientAge").html("23");
            $("#patientFirstPregnancy").html("No");
            $("#patientAnemia").html("No");
            $("#patientDiabetes").html("No")
            $("#patientPrematureBirth").html("No");
            $("#patientUltrasound").html("Normal");
        }
        divContent = '';

       window.location.hash = "#patientDescription";
    });
}

function showMessage(){
    var role = window.localStorage.getItem('role');
    var result = '';
    $("#ulNotificationList").html('');
    if(role == "patient"){
        $.getJSON('messageforpatient.json', function(data){
            $.each(data.data, function(i, obj){
                result += '<li style="height:150px;" class="ui-first-child"><a data-about="' + obj.about + '" data-message="' + obj.message + '" href="#" class="ui-btn ui-btn-icon-right ui-icon-carat-r" data-transition="slide">' + obj.about  + '  (Dr. Ashim)' +'</a></li>'
            });
            $("#ulNotificationList").html(result);
            $("#ulNotificationList").find("a").click(function(){
               window.location.hash = "#viewNotificationContent" ;
                $("#replymessageArea").hide();
                $("#notifMessageAbout").html($(this).data("about"));
                $("#notifMessageAbout").html($(this).data("message"));
            });
        });
    }else{
        $.getJSON('messagefordoctor.json', function(data){
            $.each(data.data, function(i, obj){
                result += '<li style="height:150px;" class="ui-first-child"><a data-about="' + obj.about + '" data-message="' + obj.message + '" href="#" class="ui-btn ui-btn-icon-right ui-icon-carat-r" data-transition="slide">' + obj.about + ' (Namrata)' +'</a></li>'

            });
            $("#ulNotificationList").html(result);
            $("#ulNotificationList").find("a").click(function(){
                window.location.hash = "#viewNotificationContent" ;
                $("#replymessageArea").hide();
                $("#notifMessageAbout").html($(this).data("about"));
                $("#notifMessageAbout").html($(this).data("message"));
            });
        });
    }
}

