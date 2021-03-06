var sock = io.connect(host, {transports: ["websocket"], upgrade: false});

function playGame() {
  $("#title").text("選單");
  $("#nidform").hide();
  $("#nickform").hide();
  $("#gogame").fadeIn(500);
}

sock.on("connect", () => {
    $("#sid").removeAttr("disabled");
    $("#start").removeAttr("disabled");
});

sock.on("login", data => {
        if (!data.ok) { //if 登入失敗
            alertify.error(`登入失敗<br>${data.mesg}`);
            return
        }
        if (!data.registered) { //要 setName
            $("#nidform").hide();
            $("#nickform").fadeIn(500); //nickname 顯示
            $("#title").text("請設定暱稱");
            localStorage.setItem("token", data.token);
        }
        else { //不用setName
          playGame();
          localStorage.setItem("token", data.token);
        }

});

sock.on("setName", data => {
    if (!data.ok){
        alertify.error("SetNameError.");
    }
    else {
        playGame();
    }
});

$(() => {
    var token = localStorage.getItem("token");
    $("#gogame").hide();
    $("#nickform").hide();
    //使用bot listiner
    $("#use_bot").change(e => {
        var use_bot = $(e.currentTarget).prop("checked");
        localStorage.setItem("use_bot", use_bot);
    });
    //送出學號
    $("#sid").on("click", () => {
        var nid = $("#nid").val() //data 接
        var reS = /^[demp]{1}[0-9]{7}$/i;
        var reT = /^[t]{1}[0-9]{5}$/i;
        if (!reS.test(nid) && !reT.test(nid)) {
            alertify.error("NID格式錯誤<br>請重新輸入");
        }
        else if (nid === "") {
            alertify.error("請輸入NID。");
        }
        else {
            sock.emit("login", {
                username: nid
            })
            //  把字改掉
            //  var token = document.querySelector('[name=token]').value//接token
            //  localStorage.setItem("token", token);//存token
            //  setName nickname token
        }
    });

    $("#start").on("click", function() {
        var nickname = $("#nickname").val() //data 接
        sock.emit("setName", {
            nickname: nickname,
            token: localStorage.getItem("token")
        })
        //把字改掉
        //  setName nickname token
    });
    $("#gstart").on("click", function() {
      location.href = "/game.html";
    });

    $("#resettoken").on("click", function() {
      localStorage.removeItem("token");
      $("#nidform").fadeIn(500);
      $("#gogame").hide();
      $("#title").text("請先註冊");
      sock.disconnect()
      sock.connect();
      //window.location.reload();
    });
    //如果已經有token
    if (token != null && token != "undefined") {
        playGame();
    }
    if (localStorage.getItem("use_bot") === null) {
        localStorage.setItem("use_bot", false);
    }
    var use_bot = localStorage.getItem("use_bot")==="false" ? false : true;
    $("#use_bot").prop("checked",use_bot);
});

/*
    document.querySelector('#submit').addEventListener('click', function(ev){
    var data = document.querySelector('[name=name]').value //data 接
    sock.emit("login", {username: data}) //把字改掉

    var token = document.querySelector('[name=token]').value//接token
    localStorage.setItem("token", token);//存token


    sock.on('result', data => {
    if(data.to === "login"){
    if(data.registered === false){ //要 setName
    document.getElementById("nickname").style = "" //nickname 顯示

    var nick = document.querySelector('[name=nickname]').value
    sock.emit("setName", {nickname: nick, token: data.token},function(startgame){})
    document.cookie=data.token

    location.href = "/game.html"


    }
    else{ //不用setName
    alert("是否直接進入遊戲")
    location.href = "/game.html"
    }
    }

    })
    })
*/
