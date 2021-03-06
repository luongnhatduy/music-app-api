const express = require("express");
const mongoose = require("mongoose");
const cache = require("memory-cache");
var bodyParser = require("body-parser");

const app = express();
const port = 4000;
const listSong = require("./models/listSong");
const account = require("./models/account");
const favoriteSong = require("./models/favoriteSong");
const listSongCrawl = require("./models/listSongCrawl");
const category = require("./models/category");
const listBanner = require("./models/listBanner");
const comment = require("./models/comment");

const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;

mongoose.connect(
  "mongodb+srv://luongduy:duychelsea123@musicapp-8lijj.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: "313855513316412",
      clientSecret: "2ad7bfe836adb55454be095f2d846155",
      callbackURL: "/auth/facebook/callback",
      profileFields: [
        "id",
        "displayName",
        "name",
        "gender",
        "picture.type(large)",
      ],
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log("profile", profile._json);
      console.log("accessToken", accessToken);

      return cb(null, profile._json);
    }
  )
);

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    authType: "reauthenticate",
  })
);
// app.get(
//   "/auth/facebook/callback",
//   passport.authenticate("facebook", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//   }),
//   function (req, res) {
//     res.redirect("/");
//   }
// );

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  // Redirect user back to the mobile app using Linking with a custom protocol OAuthLogin
  (req, res) => {
    console.log("req___________", req.user);
    // res.redirect("OAuthLogin://login?user=" + JSON.stringify(req.user));
    res.redirect(`?userId=${11111}`);
  }
);

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

//2773082216292435
app.get("/all_list", async (req, res) => {
  let rest = await listSong.find();
  res.json(rest);
});

app.get("/all_banner", async (req, res) => {
  let rest = await listBanner.find();
  res.json(rest);
});

app.get(
  "/list_top/:accountId/:categoryId",
  async (req, res) => {
    const rest = await listSong.find({ categoryId: req.params.categoryId });
    const data = await Promise.all(
      rest.slice(0, 20).map(async (item) => {
        const song = await favoriteSong.findOne({
          accountId: req.params.accountId,
          songId: item._id,
        });
        if (song) {
          return { item, statusLike: true };
        } else {
          return { item, statusLike: false };
        }
      })
    );
    res.json(data);
  },
  []
);

app.get("/list_favorite/:accountId", async (req, res) => {
  let rest = await favoriteSong.find({
    accountId: req.params.accountId,
  });
  res.json(rest);
});

app.post("/add_song", function (req, res) {
  console.log(req.body, "reqbody");
  listSong.insertMany(req.body).then(function (respon) {
    res.send(respon);
  });
});

app.post("/add_banner", function (req, res) {
  listBanner.insertMany(req.body).then(function (respon) {
    res.send(respon);
  });
});

app.post("/category", function (req, res) {
  category.insertMany(req.body).then(function (respon) {
    res.send(respon);
  });
});

app.get("/fetchCategory", async (req, res) => {
  const rest = await category.find();
  res.send(rest);
});

app.post("/login", async (req, res) => {
  try {
    const user = await account.findOne({ facebookId: req.body.facebookId });
    if (user) {
      res.json(user);
    } else {
      account.insertMany(req.body).then(function (respon) {
        res.send(respon[0]);
      });
    }
  } catch (error) {
    res.send(error);
  }
});

function xoa_dau(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  str = str.toLowerCase();
  return str;
}

app.post(
  "/search",
  async (req, res) => {
    if (cache.get("list") == null) {
      let list = await listSong.find();
      cache.put("list", list);
      setInterval(async () => {
        let list = await listSong.find();
        cache.put("list", list);
      }, 600000);
    }
    let namesong = xoa_dau(req.body.name_song);

    const nameSongArray = namesong.toLowerCase().split(" ");

    const rest = cache.get("list").reduce((array, item) => {
      let countKeyWord = 0;
      nameSongArray.forEach((i) => {
        if (
          item.name_song &&
          item.name_singer &&
          (xoa_dau(item.name_song).indexOf(i) !== -1 ||
            xoa_dau(item.name_singer).indexOf(i) !== -1) &&
          i !== ""
        ) {
          countKeyWord = countKeyWord + 1;
        }
      });
      if (countKeyWord > 0) {
        const newitem = { ...item._doc, countKeyWord };
        newitem.countKeyWord = countKeyWord;
        array.push(newitem);
      }
      return array;
    }, []);
    rest.sort(function (a, b) {
      return b.countKeyWord - a.countKeyWord;
    });
    res.json(rest);
  },
  []
);

app.post(
  "/likeSong",
  async (req, res) => {
    try {
      const song = await favoriteSong.findOne({
        accountId: req.body.accountId,
        songId: req.body.songId,
      });
      if (song) {
        console.log("delete", song);
        favoriteSong
          .deleteOne({
            accountId: req.body.accountId,
            songId: req.body.songId,
          })
          .then(function (respon) {
            res.send({ ...song, ...{ status: "delete" } });
          });
      } else {
        console.log("create", song);

        favoriteSong.insertMany(req.body).then(function (respon) {
          console.log(respon, "respon");
          res.send({ ...respon[0], ...{ status: "create" } });
        });
      }
    } catch (error) {
      res.send(error);
    }
  },
  []
);

app.post("/sendComment", function (req, res) {
  comment.insertMany(req.body).then(function (respon) {
    console.log(respon);
    res.send(respon);
  });
});

app.post("/deleteComment", function (req, res) {
  comment
    .deleteOne({
      _id: req.body.id,
    })
    .then(function (respon) {
      console.log(respon);
      res.send(respon);
    });
});

app.get("/fetchComment/:songId", function (req, res) {
  comment
    .find({
      songId: req.params.songId,
    })
    .then(async (respon) => {
      const result = await Promise.all(
        respon.map(async (item) => {
          const user = await account.findOne({ facebookId: item.accountId });
          return { item, user: user };
        })
      );
      console.log(result, "result");
      res.send(result);
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const axios = require("axios");

// axios
//   .get("https://nhac.vn/bai-hat/mua-cua-ngay-xua-ho-quang-hieu-sobYoOj")
//   .then(response => {
//     getlink(response);
//   });

// async function getlink(response) {
//   const songInfo = response.data.slice(
//     response.data.indexOf(`stretching: 'fill',`),
//     response.data.indexOf(`timeSliderAbove`)
//   );
//   let link = songInfo.slice(
//     songInfo.indexOf(`},{"file":"`) + 11,
//     songInfo.indexOf(`","label":"320K"}`)
//   );
//   let newlink = []
//   for (var i = 0; i < link.split('').length; i++) {
//     if (link.split('')[i] !== "\\"){
//       newlink = [...newlink,link.split('')[i]]
//     }
//   }

//   const newSong = {
//     name_song: songInfo.slice(
//       songInfo.indexOf(`title:'`) + 7,
//       songInfo.indexOf(`description`) - 19
//     ),
//     name_singer: songInfo.slice(
//       songInfo.indexOf(`description:'`) + 13,
//       songInfo.indexOf(`tracks`) - 19
//     ),
//     link: newlink.join(""),
//     img: songInfo.slice(
//       songInfo.indexOf(`thumb : '`) + 9,
//       songInfo.indexOf(`.jpg',`) + 4
//     )
//   };

//   let item = undefined
//   item = await listSongCrawl.findOne({ name_song: newSong[`name_song`] });
//   if (!item) {
//     listSongCrawl.insertMany(newSong).then(function(respon) {
//       console.log(respon)
//     });
//   }

//   const suggestList = [];
//   let $ = cheerio.load(response.data);
//   let obj = $("div.box_content > ul.box_items_list > li.autoPlayItem > a");
//   for (var i = 0; i < Object.keys(obj).length - 5; i++) {
//     if (obj[i].attribs["href"]) {
//       suggestList.push(obj[i].attribs["href"]);
//     }
//   }

//   _repeat(suggestList);
// }
// function _repeat(arr) {
// for (var i = 0; i < arr.length; i++) {
//   axios.get(arr[i]).then(response => {
//     getlink(response);
//   });
// }
// }
