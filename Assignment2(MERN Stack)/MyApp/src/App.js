import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import $ from 'jquery';

class ContactPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: [],
      album: [],
      username: '',
      password: '',
      person: 0,
      cookie: 0,
      userid: 0,
      file: null,
      display: 0,
      photo: '',
      last: '',
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.handleMyAlbum = this.handleMyAlbum.bind(this);
    this.handleFriendsAlbum = this.handleFriendsAlbum.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.handlePhoto = this.handlePhoto.bind(this);
    this.handleCross = this.handleCross.bind(this);
  }

  componentDidMount() {
    this.loadContacts();
  }

  loadContacts() {
    $.ajax({
      url: "http://localhost:3002/init",
      dataType: 'json',
      type: 'GET',
      xhrFields: {
        withCredentials: true
      },
      success: function (data) {
        this.setState({
          user: data,
        });
        if (JSON.stringify(data) !== "[]") {
          var n = data[0].username;
          this.setState({
            cookie: 1, //cookie 1 for exist, 0 for not exist
            username: n,
          });
        }
      }.bind(this),
      error: function (xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
      }.bind(this)
    });
  }

  handleUsernameChange(username) {
    this.setState({
      username: username
    })
  }

  handlePasswordChange(password) {
    this.setState({
      password: password
    })
  }

  handleLogIn(e) {
    e.preventDefault(e);
    if (this.state.username === '' || this.state.password === '') {
      alert('You must enter username and password');
    }
    else {
      $.ajax({
        url: "http://localhost:3002/login",
        dataType: 'json',
        type: 'POST',
        data: { "Username": this.state.username, "Password": this.state.password },
        xhrFields: {
          withCredentials: true
        },
        success: function (data, status) {
          if (data.username !== 'Login failure') {
            this.setState({
              user: data,
              cookie: 1
            });
          } else {
            alert("Login failure");
          }
        }.bind(this),
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }.bind(this)
      });
    }
  }

  handleLogOut(e) {
    e.preventDefault(e);
    $.ajax({
      url: "http://localhost:3002/logout",
      type: 'GET',
      xhrFields: {
        withCredentials: true
      },
      success: function (data) {
        if (data === '') {
          this.setState({
            username: '',
            password: '',
            cookie: 0,
            album: [],
            last: '',
            person: 0,
          });
        }
      }.bind(this),
      error: function (xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
      }.bind(this)
    });
  }

  handleMyAlbum(e) {
    e.preventDefault(e);
    var select = '#' + e.target.id;
    $(select).addClass("color");
    $.ajax({
      url: "http://localhost:3002/getalbum/0",
      type: 'GET',
      success: function (data) {
        $(this.state.last).removeClass("color");
        this.setState({
          album: data,
          display: 0,
          person: 1,
          last: select,
        });
      }.bind(this),
      error: function (xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
      }.bind(this)
    });
  }


  handleFriendsAlbum(e) {
    e.preventDefault(e);
    var userid = e.target.id;
    var select = '#' + e.target.id;
    $(select).addClass("color");
    $.ajax({
      url: "http://localhost:3002/getalbum/" + userid,
      type: 'GET',
      success: function (data) {
        $(this.state.last).removeClass("color");
        this.setState({
          album: data,
          display: 0,
          person: 2,
          last: select,
        });
      }.bind(this),
      error: function (xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
      }.bind(this)
    });
  }

  handleFile(e) {
    this.setState({ file: e.target.files[0] });
  }

  handleUpload(e) {
    e.preventDefault(e);
    if (this.state.file === '') {
      alert('You must selete a photo');
    }
    else {
      $.ajax({
        url: "http://localhost:3002/uploadphoto",
        type: 'POST',
        data: this.state.file,
        processData: false,
        contentType: false,
        success: function (data, status) {
          this.setState({
            album: data,
          });
        }.bind(this),
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }.bind(this)
      });
    }
  }

  handleDelete(e) {
    e.preventDefault(e);
    var confirmation = window.confirm('Are you sure you want to delete this contact?');
    if (confirmation === true) {
      var id = e.target.id;
      $.ajax({
        url: "http://localhost:3002/deletephoto/" + id,
        type: 'DELETE',
        success: function (data) {
          this.setState({
            album: data,
            display: 0,
          });
        }.bind(this),
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }.bind(this)
      });
    }
  }

  handleLike(e) {
    e.preventDefault(e);
    var id = e.target.id;
    $.ajax({
      url: "http://localhost:3002/updatelike/" + id,
      type: 'PUT',
      success: function (data) {
        this.setState({
          album: data,
        });
      }.bind(this),
      error: function (xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
      }.bind(this)
    });

  }

  handlePhoto(e) {
    e.preventDefault(e);
    this.setState({
      display: 1,
      photo: e.target.id,
    });
  }

  handleCross(e) {
    e.preventDefault(e);
    this.setState({
      display: 0,
    });
  }


  render() {
    return (
      <div>
        <LogIn
          username={this.state.username}
          password={this.state.password}
          cookie={this.state.cookie}
          onUsernameChange={this.handleUsernameChange}
          onPasswordChange={this.handlePasswordChange}
          handleLogIn={this.handleLogIn}
          handleLogOut={this.handleLogOut}
        />
        <div class="left wide">
          <Album
            user={this.state.user}
            album={this.state.album}
            cookie={this.state.cookie}
            person={this.state.person}
            path={this.state.path}
            file={this.state.file}
            display={this.state.display}
            photo={this.state.photo}
            last={this.state.last}
            handleMyAlbum={this.handleMyAlbum}
            handleFriendsAlbum={this.handleFriendsAlbum}
            handleUpload={this.handleUpload}
            handleFile={this.handleFile}
            handleDelete={this.handleDelete}
            handleLike={this.handleLike}
            handlePhoto={this.handlePhoto}
            handleCross={this.handleCross}
          />
        </div>
      </div>
    );
  }
}

class Album extends React.Component {
  constructor(props) {
    super(props);
    this.handleMyAlbum = this.handleMyAlbum.bind(this);
    this.handleFriendsAlbum = this.handleFriendsAlbum.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.handlePhoto = this.handlePhoto.bind(this);
    this.handleCross = this.handleCross.bind(this);
  }

  handleMyAlbum(e) {
    e.preventDefault(e);
    this.props.handleMyAlbum(e);
  }

  handleFriendsAlbum(e) {
    e.preventDefault(e);
    this.props.handleFriendsAlbum(e);
  }

  handleUpload(e) {
    e.preventDefault(e);
    this.props.handleUpload(e);
  }

  handleFile(e) {
    e.preventDefault(e);
    this.props.handleFile(e);
  }

  handleDelete(e) {
    e.preventDefault(e);
    this.props.handleDelete(e);
  }

  handleLike(e) {
    e.preventDefault(e);
    this.props.handleLike(e);
  }

  handlePhoto(e) {
    e.preventDefault(e);
    this.props.handlePhoto(e);
  }

  handleCross(e) {
    e.preventDefault(e);
    this.props.handleCross(e);
  }


  render() {
    if (this.props.cookie === 1) {
      var user = this.props.user;
      var friends = user[0].friends;
      var album = this.props.album;
      var i = 0;
      var j = 0;
      var element;
      var button;
      var displayAlbum = [];
      button = (
        <div id="cross" class="right">
          <button onClick={this.handleCross}>X</button>
        </div>
      )

      if (this.props.person === 1 && this.props.display === 0) {
        element = (
          <div id="upload" class="right">
            <form encType="multipart/form-data" id="uploadForm">
              <input type="file" id="myFile" onChange={this.handleFile}></input>
              <button onClick={this.handleUpload}>Upload File</button>
            </form>
          </div>
        )
      }

      let rows = [];
      friends.map((friend) => {
        rows.push(
          <AlbumRow
            friend={friend}
            display={this.props.display}
            handleFriendsAlbum={this.handleFriendsAlbum}
          />
        );
      });

      if (this.props.display === 1) {
        for (var k = 0; k < album.length; k++) {
          if (album[k]._id === this.props.photo) {
            displayAlbum = [album[k]];
          }
        }
        let displayPhotos = [];
        displayAlbum.map((photo) => {
          displayPhotos.push(
            <PhotoRow
              photo={photo}
              album={album[j]}
              person={this.props.person}
              display={this.props.display}
              handleDelete={this.handleDelete}
              handleLike={this.handleLike}
              handlePhoto={this.handlePhoto}
            />
          );
          j++;
        });

        return (
          <div id="bottom">
            <div id="album" >
              <div class='album' id="me" onClick={this.handleMyAlbum}>My Album</div>
              {rows}
            </div>
            <div id="photo" >
              {button}
              {displayPhotos}
              {element}
            </div>
          </div>
        );
      }

      else {

        let photos = [];
        this.props.album.map((photo) => {
          photos.push(
            <PhotoRow
              photo={photo}
              album={album[i]}
              person={this.props.person}
              display={this.props.display}
              handleDelete={this.handleDelete}
              handleLike={this.handleLike}
              handlePhoto={this.handlePhoto}
            />
          );
          i++;
        });

        return (
          <div>
            <div id="album" >
              <div class='album' id="me" onClick={this.handleMyAlbum}>My Album</div>
              {rows}
            </div>
            <div id="photo" >
              {photos}
              {element}
            </div>
          </div>
        );
      }
    }
    else {
      return (
        <div>
          <div id="album" >
          </div>
          <div id="photo" >
          </div>
        </div>
      );
    }
  }

}
class AlbumRow extends React.Component {
  constructor(props) {
    super(props);
    this.handleMyAlbum = this.handleMyAlbum.bind(this);
    this.handleFriendsAlbum = this.handleFriendsAlbum.bind(this);
  }

  handleMyAlbum(e) {
    e.preventDefault(e);
    this.props.handleMyAlbum(e);
  }

  handleFriendsAlbum(e) {
    e.preventDefault(e);
    this.props.handleFriendsAlbum(e);
  }

  render() {
    const friend = this.props.friend;
    return (
      <div class='album' id={friend} onClick={this.handleFriendsAlbum} >
        {friend}'s Album
      </div>
    );
  }
}

class PhotoRow extends React.Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.handlePhoto = this.handlePhoto.bind(this);
  }

  handleDelete(e) {
    e.preventDefault(e);
    this.props.handleDelete(e);
  }

  handleLike(e) {
    e.preventDefault(e);
    this.props.handleLike(e);
  }

  handlePhoto(e) {
    e.preventDefault(e);
    this.props.handlePhoto(e);
  }

  render() {
    var photo = this.props.photo;
    var like = photo.likedby;
    var element;
    var width = '150';
    var height = '150';
    var likedby = '';
    var image = 'left';
    var likedClass = 'liked';
    var likedByClass = 'likedby';
    var likeClass = 'like';
    if (this.props.person === 1) {
      element = (
        <button id={photo._id} onClick={this.handleDelete}>Delete</button>
      )
    }

    if (this.props.person === 2) {
      element = (
        <button id={photo._id} onClick={this.handleLike}>Like</button>
      )
    }

    if (this.props.display === 1) {
      width = '500';
      height = '400';
      image = 'center';
      likedClass = 'default';
      likedByClass = 'default';
      likeClass = 'displayButton';
    }

    if (like.length === 0) {
      return (
        <div class={image}>
          <div class='photo'>
            <img src={photo.url} id={photo._id} onClick={this.handlePhoto} width={width} height={height}></img>
          </div><br />
          <div class={likedClass}>
            <div class={likeClass}>
              {element}
            </div>
          </div>
        </div>
      );
    }
    else {
      for (var i = 0; i < (like.length - 1); i++) {
        likedby += like[i];
        likedby += ', ';
      }
      likedby += like[like.length - 1];
      return (
        <div class={image}>
          <div class='photo'>
            <img src={photo.url} id={photo._id} onClick={this.handlePhoto} width={width} height={height}></img>
          </div><br />
          <div class={likedClass}>
            <div class={likedByClass}>
              <span class="friends">{likedby}</span> liked this photo!
            </div>
            <div class={likeClass}>
              {element}
            </div>
          </div>
        </div>
      )
    }
  }
}
class LogIn extends React.Component {
  constructor(props) {
    super(props);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  handleUsernameChange(e) {
    this.props.onUsernameChange(e.target.value);
  }

  handlePasswordChange(e) {
    this.props.onPasswordChange(e.target.value);
  }

  handleLogIn(e) {
    e.preventDefault(e);
    this.props.handleLogIn(e);
  }

  handleLogOut(e) {
    e.preventDefault(e);
    this.props.handleLogOut(e);
  }

  render() {
    if (this.props.cookie === 0) {
      return (
        <div class="left wide">
          <div id="title">
            <h1>iAlbum</h1>
          </div>
          <div id="loginIn">
            <fieldset >
              <div class="left">
                <span class="text">username</span>
                <input id="username"
                  type="text"
                  placeholder=""
                  value={this.props.username}
                  onChange={this.handleUsernameChange}
                />
              </div>

              <span class="text">password</span>
              <input id="password"
                type="text"
                placeholder=""
                value={this.props.password}
                onChange={this.handlePasswordChange}
              />
              <button onClick={this.handleLogIn} class="right">log in</button>
            </fieldset>
          </div>
        </div>
      );
    }

    else {
      return (
        <div class="left wide">
          <div id="title">
            <h1>iAlbum</h1>
          </div>
          <div id="loginIn">
            Hello {this.props.username}
            <button onClick={this.handleLogOut} class="right">log out</button>
          </div>
        </div>
      );
    }
  }
}

export default ContactPage;


