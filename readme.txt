The files basically fullfil the requirements of Assignment2.

There are 2 prerequisites to run the programme without error.

First, when the programme is run in the first time, any cookie of localhost should be cleared.

Second, it is not encouraged to insert a user data that his or her friend is not in the userlist.

For example, if we insert a user data

mongo 
use assignment2
db.userList.insert({'username': 'Jack', 'password': '123456', 'friends':['Tom']})

As indicated above, Jack has a friend named Tom. 
However, if Tom's data has not been inserted in the userlist, unpredictable errors will be incurred.

To better test the programme, we could insert the user datas

mongo 
use assignment2
db.userList.insert({'username': 'Eddie', 'password': '123456', 'friends':['Ken', 'Alice', 'Bill']})
db.userList.insert({'username': 'Ken', 'password': '123456', 'friends':['Eddie', 'Alice', 'Bill']})
db.userList.insert({'username': 'Alice', 'password': '123456', 'friends':['Ken', 'Eddie', 'Bill']})
db.userList.insert({'username': 'Bill', 'password': '123456', 'friends':['Ken', 'Alice', 'Eddie']})

Then, we could check the album function.
