const path = require("path");
const { dirname } = require("path");
const jimp = require("jimp");
const fs = require("fs");
const { copyFile, unlink } = require("fs/promises");

const guest = require("../middlewares/guest");
const auth = require("../services/auth");
const authGuard = require("../middlewares/auth-guard");
const ownership = require("../middlewares/ownership");
const upload = require("../middlewares/upload");

const userRegexp = /^[^\s@]+@[^\s@]+$/i;
const publicPath = path.join(__dirname, "../..", "public", "images");

module.exports = (app, db) => {
  app.get("/users", (req, res) => {
    db.all("SELECT * FROM users")
      .then((data) => {
        res.status(200).type("application/json").send(data);
      })
      .catch((err) => {
        res.status(400).send(err.message);
      });
  });

  app.post("/signup", guest, (req, res) => {
    const { email, password, confirmPassword, name } = req.body;

    if (!email) {
      return res.status(400).send("Pls provide user email!");
    }

    if (!name) {
      return res.status(400).send("Pls provide user name!");
    }

    if (!userRegexp.test(email)) {
      return res.status(400).send("Pls provide correct email!");
    }

    if (!password || !confirmPassword) {
      return res
        .status(400)
        .send("Please provide password and confirm password");
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .send("Password and confirm password does not match");
    }

    auth
      .hashPassword(password)
      .then((hash) => {
        db.run(
          `INSERT INTO users (email, name, password) values("${email}", "${name}", "${hash}")`
        )
          .then((data) => {
            // send confirmation email service and activation link
            res.send(200, data.lastID);
          })
          .catch((err) => {
            console.log(err);
            if (err && err.errno == 19) {
              return res.send(400, "This email already exists");
            }
            return res.status(400).send(err.message);
          });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send("Internal server error");
      });
  });

  app.post("/signin", guest, (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email or password is not valid!");
    }

    if (!userRegexp.test(email)) {
      return res.status(400).send("Pls provide correct email!");
    }

    db.get(`SELECT * FROM users WHERE email="${email}"`)
      .then((user) => {
        if (!user) {
          return res.status(400).send("This user does not exists!");
        }

        const { password: dbPassword, ...userData } = user;

        auth
          .hashPassword(password)
          .then((hashedPassword) => {
            console.log(dbPassword, hashedPassword);
            if (hashedPassword !== dbPassword) {
              return res.status(400).send("Password is not correct!");
            }
            auth
              .encode(user)
              .then((token) => {
                return res
                  .status(200)
                  .type("application/json")
                  .send({ ...userData, token });
              })
              .catch((err) => {
                return res.status(500).send(err.message);
              });
          })
          .catch((err) => {
            return res.status(500).send(err.message);
          });
      })
      .catch((err) => {
        return res.status(500).send(err.message);
      });
  });

  app.put("/users", authGuard(db), ownership("users", db), (req, res) => {
    const { email, name, password, confirmPassword } = req.body;
    const { id } = req.entity;

    if (email && !userRegexp.test(email)) {
      return res.status(400).send("Pls provide correct email!");
    }

    if (name && name.length <= 3) {
      return res.status(400).send("Name should be at least 3 characters!");
    }

    if (password && password !== confirmPassword) {
      return res
        .status(400)
        .send("Password and confirm password does not match");
    }

    const promise = password
      ? auth.hashPassword(password)
      : Promise.resolve(null);

    promise
      .then((hash) => {
        const fields = [];
        if (hash) {
          fields.push(`password="${hash}"`);
        }

        if (email) {
          fields.push(`email="${email}"`);
        }

        if (name) {
          fields.push(`name="${name}"`);
        }

        db.run(`UPDATE users SET ${fields.join(",")} WHERE id="${id}"`)
          .then((data) => {
            console.log(data);
            res.status(204).send({ email, password, name });
          })
          .catch((err) => {
            console.log(err);
            return res.status(400).send(err.message);
          });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send("Internal server error");
      });
  });

  app.put(
    "/users/password",
    authGuard(db),
    ownership("users", db),
    (req, res) => {
      const { password, confirmPassword } = req.body;
      const { id } = req.entity;

      if (!password) {
        return res.status(400).send("Pls provide data to update!");
      }

      if (password !== confirmPassword) {
        return res
          .status(400)
          .send("Password and confirm password does not match");
      }

      auth
        .hashPassword(password)
        .then((hash) => {
          const fields = [];
          if (password) {
            fields.push(`password="${hash}"`);
          }
          db.run(`UPDATE users SET ${fields.join(",")} WHERE id="${id}"`)
            .then((data) => {
              console.log(data);
              res.send(204);
            })
            .catch((err) => {
              console.log(err);
              return res.status(400).send(err.message);
            });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).send("Internal server error");
        });
    }
  );

  app.put(
    "/users/avatar-upload",
    authGuard(db),
    ownership("users", db),
    upload.single("avatar"),
    (req, res) => {
      const file = req.file;
      const { id, avatar: currentAvatar } = req.entity;

      const tempFilePath = path.join(__dirname, "../..", file.path);

      if (!file) {
        return res.status(400).send("Missing file");
      }

      if (file.size && file.size >= 1048576) {
        return res.status(400).send("File size limit is 1Mb");
      }

      jimp
        .read(tempFilePath)
        .then((avatar) => {
          const newFileName = `${file.filename}.${avatar.getExtension()}`;
          const newFileNamePath = path.join(publicPath, newFileName);

          if (avatar.getHeight() > 1200 || avatar.getWidth() > 1200) {
            return res
              .status(400)
              .send("Image dimensions must not exceed 1200x1200 px");
          }

          if (!["jpeg", "png"].includes(avatar.getExtension())) {
            return res
              .status(400)
              .send("Only image format should be received (jpg, png)");
          }

          copyFile(tempFilePath, newFileNamePath)
            .then(() => {
              const fields = [`avatar="${newFileName}"`];

              db.run(`UPDATE users SET ${fields.join(",")} WHERE id="${id}"`)
                .then((data) => {
                  const unlinkOldFilePromise = unlink(
                    path.join(publicPath, currentAvatar)
                  );

                  const unlinkTempFilePromise = unlink(tempFilePath);

                  const promises = [unlinkTempFilePromise];

                  if (currentAvatar) {
                    promises.push(unlinkOldFilePromise);
                  }
                  return Promise.all(promises)
                    .then(() => {
                      return res.send(204);
                    })
                    .catch((err) => {
                      console.log(err);
                      if (err.code === "ENOENT") {
                        return res.send(204);
                      }
                      return res.status(500).send("Internal server error");
                    });
                })
                .catch((err) => {
                  console.log(err);
                  return res.status(400).send(err.message);
                });
            })
            .catch((err) => {
              console.log(err);
              return res.status(500).send("Unable to save file");
            });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).send("Internal server error");
        });
    }
  );

  app.get("/users/:id/avatar", (req, res) => {
    const { id } = req.params;

    db.get(`SELECT * FROM users WHERE id="${id}"`)
      .then((user) => {
        console.log(user);
        if (!user.avatar) {
          return res.status(200).send("This user does not set his avatar");
        }
        return (
          res
            // .status(200)
            // .type("application/text")
            .send(200, path.join(publicPath, user.avatar))
        );
      })
      .catch((err) => {
        return res.status(400).send(err.message);
      });
  });

  // app.put('/users', authGuard(db), ownership('users', db), (req, res) => {
  //   const { email, name } = req.body
  //   const { id } = req.entity

  //   if (!email || !name) {
  //     return res.status(400).send('Pls provide data to update!')
  //   }

  //   if (email && !userRegexp.test(email)) {
  //     return res.status(400).send('Pls provide correct email!')
  //   }

  //   if (name && name.length <= 3) {
  //     return res.status(400).send('Name should be at least 3 characters!')
  //   }

  //   const fields = []
  //   if (email) {
  //     fields.push(`email="${email}"`)
  //   }

  //   if (name) {
  //     fields.push(`name="${name}"`)
  //   }

  //   db.run(`UPDATE users SET ${fields.join(',')} WHERE id="${id}"`)
  //     .then((data) => {
  //       console.log(data)
  //       res.send(204)
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //       return res.status(400).send(err.message)
  //     })
  // })
};
