var express  = require('express');
var app = express();

var monk = require('monk');
var db = monk('localhost:27017/assignment1');

var j = 0;
var k = j + 5;
var l = 0;
var m = 0;

app.use(express.static('public'), function(req,res,next){	
    req.db = db;
    next();
}) 

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})

app.get('/retrievemaillist', function(req, res){
    var db = req.db;
    var collection = db.get('emailList');
    var show = req.query.show;
    var value = req.query.value;
    var num = req.query.num;
    var status = req.query.status;
    var i = Number(num);
	if (show == "inbox"){
		collection.find({mailbox:value}, {}, function(err, docs){
			j = 0;
			k = j + 5;
			if (k > docs.length){
				k = docs.length;
			}
	    	if (err === null){
             	res.send(ResHTML(docs));
	    	} 
	    	else{ 
	    		res.send(err);
	    	}
		});
	}

	else if (show == "important"){
		collection.find({mailbox:value}, {}, function(err, docs){
			j = 0;
			k = j + 5;
			if (k > docs.length){
				k = docs.length;
			}
	    	if (err === null){
             	res.send(ResHTML(docs));
	    	} 
	    	else{ 
	    		res.send(err);
	    	}
		});
	}

	else if (show == "sent"){
		collection.find({mailbox:value}, {}, function(err, docs){
			j = 0;
			k = j + 5;
			if (k > docs.length){
				k = docs.length;
			}
	    	if (err === null){
             	res.send(ResSent(docs));
	    	} 
	    	else{ 
	    		res.send(err);
	    	}
		});
	}

	else if (show == "trash"){
		collection.find({mailbox:value}, {}, function(err, docs){
			j = 0;
			k = j + 5;
			if (k > docs.length){
				k = docs.length;
			}
	    	if (err === null){
             	res.send(ResHTML(docs));
	    	} 
	    	else{ 
	    		res.send(err);
	    	}
		});
	}

	else if (show == "previous"){
		collection.find({mailbox:value}, {}, function(err, docs){
			j -= 5;
			k = j + 5;
			if (j <= 0){
				j = 0;
				k = j + 5;
			}
			if (k >= docs.length){
				k = docs.length;
			}
	    	if (err === null){
	    		if (status === "index"){
	    			if (value == "Sent"){
	    				res.send(ResSent(docs));
	    			}
	    			else{
	    				res.send(ResHTML(docs));
	    			}
	    		}
             	else if (status === "content"){            		
             		if (l <= 0){
             			l = 0;
             		}
             		else {
             			m -= 1 ;
             			l = i + m; 
             		}
             		res.send(ResContent(docs));
             	}
	    	} 
	    	else{ 
	    		res.send(err);
	    	}
		});
	}

	else if (show == "next"){
		collection.find({mailbox:value}, {}, function(err, docs){
			j += 5;
			k = j + 5;
			if (j >= docs.length){
				j -= 5;
			}
			if (k >= docs.length){
				k = docs.length;
			}
	    	if (err === null){
	    		if (status === "index"){
	    			if (value == "Sent"){
	    				res.send(ResSent(docs));
	    			}
	    			else{
	    				res.send(ResHTML(docs));
	    			}
	    		}
             	else if (status === "content"){
             		if (l >= docs.length - 1){
             			l = docs.length - 1;
             		}
             		else{
             			m += 1 ;
             			l = i + m;
             		}
             		res.send(ResContent(docs));
             	}
	    	} 
	    	else{ 
	    		res.send(err);
	    	}
		});
	}
});

app.get('/getemail', function(req, res){
    var db = req.db;
    var collection = db.get('emailList');
    var show = req.query.show;
    var value = req.query.value;
    var num = req.query.num;
    var status = req.query.status;
    var i = Number(num);
    m = 0;
	if (show == "content"){
		collection.find({mailbox:value}, {}, function(err, docs){
			j = 0;
			k = j + 5;
			l = num;
			if (k > docs.length){
				k = docs.length;
			}
	    	if (err === null){
             	res.send(ResContent(docs));
	    	} 
	    	else{ 
	    		res.send(err);
	    	}
		});
	}
});

app.post('/changemailbox', express.urlencoded({ extended: true }), function (req, res) {
	var collection = db.get('emailList');
	var checklist = req.body.checklist;
	var newMailbox = req.body.newMailbox;
	var status = req.body.status;
	var array = checklist.split(",");
	var ID = req.body.ID;
	if (status === "index"){
	    for (var i in array){
		    collection.update({"_id":array[i]}, {$set:{'mailbox':newMailbox}}, function(err, docs){
			})
	    }
	}
	else if (status === "content"){
		collection.update({"_id":ID}, {$set:{'mailbox':newMailbox}}, function(err, docs){
		})
	}
	req.body.checklist = "";
    array = [];
    res.send(newMailbox);
})

app.post('/sendemail', express.urlencoded({ extended: true }), function (req, res) {
	var collection = db.get('emailList');
	var to = req.body.to;
	var subject = req.body.subject;
	var message = req.body.message;
	var time = req.body.time;
	collection.insert({sender: "john@cs.hku.hk", recipient: to, title: subject, time: time, content: message, mailbox: "Sent"},function(err, result){
		res.send("inserted");
	}); 
})

function ResHTML(docs) {
	var sort_list = Sort(docs);
	var response_string = "";
	
	response_string += "<table class = 'wide'>";
	for (var i = j; i < k; i++) {
		l = i;
		var email = sort_list[i];
		response_string += "<tr id=" + email['_id'] + ">";
		response_string += "<th id=" + email['_id'] + ">" + "<input type='checkbox' id='myCheck' onclick='check(this)'></th><td onclick=\"display(this)\" id=" + l + "><b>";
		response_string += i+1 + ".</b></td><td onclick=\"display(this)\" id=" + l + "><b>Sender:</b> " + email['sender'] + "</td><td onclick=\"display(this)\" id=" + l + "><b>Title:</b>" + email['title'] + "</td><td onclick=\"display(this)\" id=" + l + "><b>Time:</b>" + email['time'];
		response_string += "</td>";
		response_string += "</tr>";
	}
	response_string += "</table>";

	return response_string;
}

function ResSent(docs) {
	var sort_list = Sort(docs);
	var response_string = "";

	response_string += "<table class = 'wide'>";
	for (var i = j; i < k; i++) {
		l = i;
		var email = sort_list[i];
		response_string += "<tr id=" + email['_id'] + ">";
		response_string += "<th id=" + email['_id'] + ">" + "<input type='checkbox' id='myCheck' onclick='check(this)'></th><td onclick=\"display(this)\" id=" + l + "><b>";
		response_string += i+1 + ".</b></td><td onclick=\"display(this)\" id=" + l + "><b>Recipient:</b> " + email['recipient'] + "</td><td onclick=\"display(this)\" id=" + l + "><b>Title:</b>" + email['title'] + "</td><td onclick=\"display(this)\" id=" + l + "><b>Time:</b>" + email['time'];
		response_string += "</td>";
		response_string += "</tr>";
	}
	response_string += "</table>";

	return response_string;
}

function ResContent(docs) {
	var sort_list = Sort(docs);
	var response_string = "";
	i = Number(l);
	var num = i + 1;
	var email = sort_list[i];

	response_string += "<div><span class = 'left'><b>" + num + ". Title:</b>" + " " + email['title'] + "</span>";
	response_string += "<span class = 'right'><b>Time:</b>" + " " + email['time'] + "</span></div><br>";
	response_string += "<table><tr><th>Sender:</th><td>" + email['sender'] + "</td></tr>";
	response_string += "<tr><th>Receiver:</th><td>" + email['recipient'] + "</td></tr>";
	response_string += "<tr><th>Content:</th><td>" + email['content'] + "</td></tr></table>";

	return response_string;
}

function Sort(docs){
	var sort_list = [];
	var date_string = "";

	for (var i = 0; i < docs.length; i++) {
		var email = docs[i];
		var array = email['time'].split(" ");
		date_string = array[4] + "-" + array[3] + "-" + array[2] + "T" + array[0] + "Z";
		var ISOdate = new Date(date_string);
		sort_list.push({_id:email['_id'], sender:email['sender'], recipient:email['recipient'], title:email['title'], time:email['time'], content:email['content'], mailbox:email['mailbox'], date:ISOdate});
	}
	
	sort_list.sort(function(a, b) {
    	return (a.date < b.date) ? 1 : ((a.date > b.date) ? -1 : 0);
	});

	return sort_list;
}