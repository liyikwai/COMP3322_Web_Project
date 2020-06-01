      var inbox = document.getElementById("inbox");
      var important = document.getElementById("important");
      var sent = document.getElementById("sent");
      var trash = document.getElementById("trash");
      var last = "Inbox";
      var current;
      var move = document.getElementById("move");
      var status = "index";
      var ID;
      var checklist = [];
      var refresh;
      var realID;

    	function showInbox(){
    		inbox.style.color = "red";
        important.style.color = "";
        sent.style.color = "";
        trash.style.color = "";
        status = "index";
        var xmlhttp = new XMLHttpRequest();     
        xmlhttp.onreadystatechange = function(){  
            if (xmlhttp.readyState == 4  && xmlhttp.status ==200){
              var emails = document.getElementById("e");
              emails.innerHTML = xmlhttp.responseText;    
            }  
          }
        xmlhttp.open("GET","retrievemaillist?show=inbox&value=Inbox" + "&status=" + status, true);
        xmlhttp.send();
        current = "Inbox";
        var list = "";
        var move = document.getElementById("move");
        move.innerHTML = "";
        list += "<a onclick = 'moveImportant()'' id = 'Important'>Important</a>";
        list += "<a onclick = 'moveSent()'' id = 'Sent'>Sent</a>";
        list += "<a onclick = 'moveTrash()'' id = 'Trash'>Trash</a>";
        move.innerHTML = list;
        last = "Inbox";
        checklist = [];
        document.getElementById("flipping").style.display = "";
        document.getElementById("moving").style.display = "";
    	}

      function showImportant(){
        inbox.style.color = "";
        important.style.color = "red";
        sent.style.color = "";
        trash.style.color = "";
        status = "index";
        var xmlhttp = new XMLHttpRequest(); 
        xmlhttp.onreadystatechange = function(){  
            if (xmlhttp.readyState == 4  && xmlhttp.status ==200){
              var emails = document.getElementById("e");
              emails.innerHTML = xmlhttp.responseText;    
            }  
          }
        xmlhttp.open("GET","retrievemaillist?show=important&value=Important" + "&status=" + status, true);
        xmlhttp.send();
        current = "Important";
        var list = "";
        var move = document.getElementById("move");
        move.innerHTML = "";
        list += "<a onclick = 'moveInbox()'' id = 'Inbox'>Inbox</a>";
        list += "<a onclick = 'moveSent()'' id = 'Sent'>Sent</a>";
        list += "<a onclick = 'moveTrash()'' id = 'Trash'>Trash</a>";
        move.innerHTML = list;
        last = "Important";
        checklist = [];
        document.getElementById("flipping").style.display = "";
        document.getElementById("moving").style.display = "";
      }

      function showSent(){
        inbox.style.color = "";
        important.style.color = "";
        sent.style.color = "red";
        trash.style.color = "";
        status = "index";
        var xmlhttp = new XMLHttpRequest(); 
        xmlhttp.onreadystatechange = function(){  
            if (xmlhttp.readyState == 4  && xmlhttp.status ==200){
              var emails = document.getElementById("e");
              emails.innerHTML = xmlhttp.responseText;    
            }  
          }
        xmlhttp.open("GET","retrievemaillist?show=sent&value=Sent" + "&status=" + status, true);
        xmlhttp.send();
        current = "Sent";
        var list = "";
        var move = document.getElementById("move");
        move.innerHTML = "";
        list += "<a onclick = 'moveInbox()'' id = 'Inbox'>Inbox</a>";
        list += "<a onclick = 'moveImportant()'' id = 'Important'>Important</a>";
        list += "<a onclick = 'moveTrash()'' id = 'Trash'>Trash</a>";
        move.innerHTML = list;
        last = "Sent";
        checklist = [];
        document.getElementById("flipping").style.display = "";
        document.getElementById("moving").style.display = "";
      }

      function showTrash(){
        inbox.style.color = "";
        important.style.color = "";
        sent.style.color = "";
        trash.style.color = "red";
        status = "index";
        var xmlhttp = new XMLHttpRequest(); 
        xmlhttp.onreadystatechange = function(){  
            if (xmlhttp.readyState == 4  && xmlhttp.status ==200){
              var emails = document.getElementById("e");
              emails.innerHTML = xmlhttp.responseText;    
            }  
          }
        xmlhttp.open("GET","retrievemaillist?show=trash&value=Trash" + "&status=" + status, true);
        xmlhttp.send();
        current = "Trash";
        var list = "";
        var move = document.getElementById("move");
        move.innerHTML = "";
        list += "<a onclick = 'moveInbox()'' id = 'Inbox'>Inbox</a>";
        list += "<a onclick = 'moveImportant()'' id = 'Important'>Important</a>";
        list += "<a onclick = 'moveSent()'' id = 'Sent'>Sent</a>";
        move.innerHTML = list;
        last = "Trash";
        checklist = [];
        document.getElementById("flipping").style.display = "";
        document.getElementById("moving").style.display = "";
      }

      function showPrevious(){
        var xmlhttp = new XMLHttpRequest(); 
        xmlhttp.onreadystatechange = function(){  
            if (xmlhttp.readyState == 4  && xmlhttp.status ==200){
              var emails = document.getElementById("e");
              emails.innerHTML = xmlhttp.responseText;    
            }  
          }
        xmlhttp.open("GET","retrievemaillist?show=previous&value=" + current + "&num=" + ID + "&status=" + status , true);
        xmlhttp.send();
        checklist = [];
      }

      function showNext(){
        var xmlhttp = new XMLHttpRequest(); 
        xmlhttp.onreadystatechange = function(){  
            if (xmlhttp.readyState == 4  && xmlhttp.status ==200){
              var emails = document.getElementById("e");
              emails.innerHTML = xmlhttp.responseText;    
            }  
          }
        xmlhttp.open("GET","retrievemaillist?show=next&value=" + current + "&num=" + ID + "&status=" + status, true);
        xmlhttp.send();
        checklist = [];
      }

      function moveTo() {
        move.classList.toggle("show");
      }

      function display(elem) {
        status = "content";
        var itemID = elem.getAttribute('id');
        realID = elem.parentNode.getAttribute('id');
        ID = itemID;
        var xmlhttp = new XMLHttpRequest(); 
        xmlhttp.onreadystatechange = function(){  
            if (xmlhttp.readyState == 4  && xmlhttp.status ==200){
              var emails = document.getElementById("e");
              emails.innerHTML = xmlhttp.responseText;    
            }  
          }
        xmlhttp.open("GET","getemail?show=content&value=" + current + "&num=" + ID + "&status=" + status, true);
        xmlhttp.send();
        checklist = [];
      }

      window.onclick = function(event) {
        if (!event.target.matches('.dropbtn')) {
          var dropdowns = document.getElementsByClassName("dropDownList");
          for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
              openDropdown.classList.remove('show');
            }
          }
        }
      }

      function moveImportant(){
        var newMailbox = "Important";
        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){  
        if (xmlhttp.readyState == 4  && xmlhttp.status ==200){
          showing();
          refresh;
          }  
        }
        xmlhttp.open("POST", "changemailbox", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 
        xmlhttp.send("newMailbox="+ newMailbox + "&checklist=" + checklist + "&status=" + status + "&ID=" + realID);
        checklist = [];
      }

      function moveSent(){
        var newMailbox = "Sent";
        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){  
        if (xmlhttp.readyState == 4  && xmlhttp.status ==200){
          showing();
          refresh;
          }  
        }
        xmlhttp.open("POST", "changemailbox", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 
        xmlhttp.send("newMailbox="+ newMailbox + "&checklist=" + checklist + "&status=" + status + "&ID=" + realID);
        checklist = [];
      }

      function moveTrash(){
        var newMailbox = "Trash";
        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){  
        if (xmlhttp.readyState == 4  && xmlhttp.status ==200){
          showing();
          refresh;
          }  
        }
        xmlhttp.open("POST", "changemailbox", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 
        xmlhttp.send("newMailbox="+ newMailbox + "&checklist=" + checklist + "&status=" + status + "&ID=" + realID);
        checklist = [];
      }

      function moveInbox(){
        var newMailbox = "Inbox";
        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){  
        if (xmlhttp.readyState == 4  && xmlhttp.status ==200){
          showing();
          refresh;
          }  
        }
        xmlhttp.open("POST", "changemailbox", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 
        xmlhttp.send("newMailbox="+ newMailbox + "&checklist=" + checklist + "&status=" + status + "&ID=" + realID);
        checklist = [];
      }

      function check(elem){
        var itemID = elem.parentNode.getAttribute('id');
        if (elem.checked === true){
          checklist.push(itemID);
        }
        else{
          var index = checklist.indexOf(itemID);
          if (index > -1) {
            checklist.splice(index, 1);
          }   
        }
      }

      function showing(){
        if (current === "Inbox"){
          refresh = new showInbox();
        }
        else if (current === "Important"){
          refresh = new showImportant();
        }
        else if (current === "Sent"){
          refresh = new showSent();
        }
        else if (current === "Trash"){
          refresh = new showTrash();
        }
      }

      function compose(){
        var emails = document.getElementById("e");
        var page = "";
        page += "<div>New Message<br>";
        page += "<form action='sendmail' method='post' id='myEmail' onsubmit='send()'>";
        page += "<table><tr>";
        page += "<th>To:</th><th><input type='email' id='to' name='to'></th></tr>";
        page += "<tr><th>Subject:</th><th><input type='text' id='subject' name='subject'></th>";
        page += "</tr></table>";
        page += "<br>";
        page += "<textarea class = 'wide high' id='message' name='message'></textarea><br>";
        page += "<br><input type='submit' value='Send'></form>";
        page += "</div>";
        emails.innerHTML = page;
        document.getElementById("flipping").style.display = "none";
        document.getElementById("moving").style.display = "none";
        checklist = [];
      }

      function send(){
        event.preventDefault();
        d = new Date();
        var datetext = d.toDateString();
        var timetext = d.toTimeString();
        var res = timetext.split(" ", 1);
        var to = document.getElementById("to").value;
        var subject = document.getElementById("subject").value;
        var message = document.getElementById("message").value;
        var time = res + " " + datetext;
        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){  
          if (xmlhttp.readyState == 4  && xmlhttp.status ==200){
            showing();
            refresh;
            checklist = [];
          }
        }
        xmlhttp.open("POST", "sendemail", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 
        xmlhttp.send("to="+ to + "&subject=" + subject + "&message=" + message + "&time=" + time);
        checklist = [];
      }
