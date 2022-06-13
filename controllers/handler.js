const util_1 = require("util");
const bycrypt = require("bcryptjs");
const user = require("../model/user");
const helper = require("../Helper/helper");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const config = require("../config/constant");

exports.checkLogin = async (req, res) => {
  //BODY SEND ONLY EMAIL AND PASSWORD FOR LOGIN
  // TRY CATCH BLOCK OF CODE
  try {
    //console.info("before");
    //EXCEPTIONAL HANDLING USING UTIL PACKAGE FOR NULL AND UNDEFINE VALUES
    if (
      !util_1.isNullOrUndefined(req.body.email) &&
      req.body.email !== "" &&
      !util_1.isNullOrUndefined(req.body.password) &&
      req.body.password !== ""
    ) {
      //console.info("before 2");
      let userData = await user.findOne(
        { email: req.body.email },
        { password: 1, role: 1, userName: 1 }
      );
      //console.info("after");
      if (!util_1.isNullOrUndefined(userData)) {
        //console.info("after 2 ");
        var data = await bycrypt.compareSync(
          req.body.password,
          userData.password
        );
        //console.info("before data");
        if (data) {
          //console.info("after data");
          req.body["role"] = userData.role;
          req.body["userName"] = userData.userName;
          let token = await helper.createToken(req.body);
          //console.info("after token data");

          if (!util_1.isNullOrUndefined(token)) {
            // console.log(token);
            userData = JSON.parse(JSON.stringify(userData));
            userData["token"] = token;
            // console.log(userData);
            res.status(200).json({
              status: "success",
              message: "Login Successfull",
              data: userData,
            });
          } else {
            res.status(200).json({
              status: "fail with token Parse",
              message: "Login fail with Token Parse",
              data: null,
            });
          }
        } else {
          res.status(200).json({
            status: "failed",
            message:
              "Incorrect Password Please Try Again with Correct Password",
            data: null,
          });
        }
      } else {
        res.status(200).json({
          status: "success",
          message:
            "Given User Login is Not Register With us Please register the user",
          data: null,
        });
      }
    }

    // console.log(sum)
  } catch (err) {
    //fail
    res.status(403).json({
      status: "fail",
      message: err,
      data: err,
    });
    console.error("fail error!!");
  }
};

exports.listUser = async (req, res) => {
  //BODY SEND FROM AND TO FOR DESIRE OUTPUT AND IF COUNT KNOW SEND THAT ALSO
  try {
    if (
      !util_1.isNullOrUndefined(req.body) &&
      !util_1.isNullOrUndefined(req.headerParams)
    ) {
      if (req.headerParams.role == "admin-sme") {
        let userCount = 0;
        let userData = [];
        if (!util_1.isNullOrUndefined(req.body.TotalCount)) {
          userCount = req.body.TotalCount;
        } else {
          userCount = await user.find().count();
        }
        if (
          !util_1.isNullOrUndefined(userCount) &&
          userCount > 0 &&
          !util_1.isNullOrUndefined(req.body.from) &&
          !util_1.isNullOrUndefined(req.body.to)
        ) {
          if (
            !util_1.isNullOrUndefined(req.body.from) &&
            !util_1.isNullOrUndefined(req.body.to)
          ) {
            userData = await user
              .find()
              .skip(Number(req.body.from))
              .limit(Number(req.body.to));
            // console.log(userData);
          } else {
            userData = await user.find().skip(0).limit(5);
          }
          userData = userData.map(function (row) {
            row = JSON.parse(JSON.stringify(row));
            delete row["password"];
            // console.log(row);
            return row;
          });
          // console.log(userData)
          res.status(200).json({
            status: "success",
            message: "successful retrival for Data",
            data: userData,
            count: userCount,
          });
        } else {
          res.status(200).json({
            status: "success",
            message: "user Data is not availble",
            data: null,
          });
        }
      } else {
        res.status(200).json({
          status: "success",
          message: "you are not authourized to view user Details",
          data: null,
        });
      }
    } else {
      res.status(200).json({
        status: "sucess",
        message: "Failed with undefined body / headerParams",
        data: null,
      });
    }
  } catch (err) {
    res.status(403).json({
      status: "fail",
      message: err,
      data: err,
    });
    console.error("fail error!!");
  }
};

exports.regesterUser = async (req, res) => {
  // sEND ALL THE REGISTER RELATED DATA IN BODY I.E PASSWORD , USERNAME , EMAIL , FIRSTNAME, LASTNAME ETC AS MENTION IN USER SCHEMA
  try {
    // console.log(req.body);
    if (!util_1.isNullOrUndefined(req.body)) {
      // console.log('Before userCount');
      let userCount = await user.find({ email: req.body.email }).count();
      // console.log(userCount);
      // console.log('outside userCount');
      if (userCount > 0) {
        // if(!util_1.isNullOrUndefined(req.body.isUpdate) && req.body.isUpdate == false){
        // console.log('inside userCount');
        res.status(200).json({
          status: "fail",
          message:
            "Given User Registration is already Present Duplicate Entry Found",
          data: null,
        });
      } else {
        // console.log('Hasssssh Password    0--- >> ',req.body.password);
        req.body.password = await bycrypt.hashSync(req.body.password);
        // console.log('Hasssssh Password    00--- >> ',req.body.password);
        let newUser = new user(req.body);
        const NewUser = await newUser.save();
        res.status(200).json({
          status: "success",
          message: "The User is Register SuccessFully",
          data: NewUser,
        });
      }
    } else {
      res.status(403).json({
        status: "fail",
        message: "Body is undefiend",
        data: null,
      });
    }
  } catch (err) {
    res.status(403).json({
      status: "fail",
      message: err,
      data: err,
    });
    console.error("fail error!!");
  }
};

exports.updateUser = async (req, res) => {
  // SEND ALL THE DATA INCLUDING UPDATED ONE ALSO
  try {
    // console.log(req.body);
    if (!util_1.isNullOrUndefined(req.body)) {
      // console.log('Before userCount');
      let userCount = await user
        .find({ _id: req.body._id, email: req.body.email })
        .count();
      // console.log(userCount);
      // console.log('outside userCount');
      if (userCount > 0) {
        // console.log('Hasssssh Password    0--- >> ',req.body.password);
        req.body.password = await bycrypt.hashSync(req.body.password);
        // console.log('Hasssssh Password    00--- >> ',req.body.password);
        let update = await user.findOneAndUpdate(
          { email: req.body.email, _id: ObjectId(req.body._id) },
          { $set: req.body }
        );
        res.status(200).json({
          status: "Success",
          message: "Updating Data is Successfull",
          data: update,
        });
      } else {
        res.status(200).json({
          status: "success",
          message:
            "Given User is Not Register With us Please register the user",
          data: null,
        });
      }
    } else {
      res.status(403).json({
        status: "fail",
        message: "Body is undefiend",
        data: null,
      });
    }
  } catch (err) {
    res.status(403).json({
      status: "fail",
      message: err,
      data: err,
    });
    console.error("fail error!!");
  }
};

exports.searchApi = async (req, res) => {
  // SEND SEARCHKEY AND SEARCHVAL AND FROM AND TO TO SEARCH API
  try {
    // console.log(req.body);
    let query = {};
    let userData = [];
    let searchVal = {};
    if (
      !util_1.isNullOrUndefined(req.body) &&
      !util_1.isNullOrUndefined(req.body.searchKey) &&
      !util_1.isNullOrUndefined(req.body.searchVal)
    ) {
      searchVal = {
        $regex: ".*" + req.body.searchVal + ".*",
        $options: "i",
      };
      // console.log(" Heekko  ",searchVal);
      query[req.body.searchKey] = searchVal;
    }
    // console.log(query);
    // console.log(req.headerParams);
    if (req.headerParams.role == "admin-sme") {
      let userCount = 0;
      if (!util_1.isNullOrUndefined(req.body.TotalCount)) {
        userCount = req.body.TotalCount;
      } else {
        userCount = await user.find({}).count();
        // console.log(userCount);
      }
      if (
        !util_1.isNullOrUndefined(userCount) &&
        userCount > 0 &&
        !util_1.isNullOrUndefined(req.body.from) &&
        !util_1.isNullOrUndefined(req.body.to)
      ) {
        if (
          !util_1.isNullOrUndefined(req.body.from) &&
          !util_1.isNullOrUndefined(req.body.to)
        ) {
          userData = await user
            .find(query)
            .skip(Number(req.body.from))
            .limit(Number(req.body.to));
        } else {
          userData = await user.find(query).skip(0).limit(5);
        }
        userData = userData.map(function (row) {
          row = JSON.parse(JSON.stringify(row));
          delete row["password"];
          // console.log(row);
          return row;
        });
        // console.log(userData)
        res.status(200).json({
          status: "success",
          message: "successful retrival for Data",
          data: userData,
          count: userCount,
        });
      } else {
        res.status(200).json({
          status: "success",
          message: "user Data is not availble",
          data: null,
        });
      }
    } else {
      res.status(200).json({
        status: "success",
        message: "you are not authourized to view user Details",
        data: null,
      });
    }
  } catch (err) {
    res.status(403).json({
      status: "fail",
      message: err,
      data: err,
    });
    console.error("fail error!!");
  }
};

/**
 * @param {string} id
 * @description returns a email id with respect to id.
 */
exports.searchById = (req, res) => {
  try {
    // Exceptional Handling
    let data = config.constasts; // Data Stored in the Constant File
    if (data[req.params.id]) {
      res.status(200).json({
        status: true,
        message: "Success",
        data: data[req.params.id],
      });
    } else {
      // Condition if No Data Found
      res.status(200).json({
        status: true,
        message: "No Data Found",
        data: null,
      });
    }
  } catch (err) {
    res.status(403).json({
      status: "fail",
      message: err,
      data: err,
    });
    console.error("fail error!!");
  }
};

/**
 * @param {string} str1
 * @param {string} str2
 * @description returns string with unmatched Values.
 */
exports.filterString = (req, res) => {
  try {
    // Exceptional Handling
    let str1 = req.params.str1;
    let str2 = req.params.str2;
    let finalstr1 = "";
    let finalstr2 = "";
    if (str1 && str2) {
      let unmatchedstr1 = str1.split("").filter((r) => {
        return str2.split("").indexOf(r) == -1 ? finalstr1 += r : r;
      });
      let unmatchedstr2 = str2.split("").filter((r) => {
        return str1.split("").indexOf(r) == -1 ? finalstr2 += r : r;
      });

      if (finalstr1) {
        finalstr1 = finalstr1.trim();
      }
      if (finalstr2) {
        finalstr2 = finalstr2.trim();
      }
      res.status(200).json({
        status: true,
        message: "Success",
        data: { opt1: finalstr1, opt2: finalstr2 },
      });
    } else {
      // Condition if No Data Found
      res.status(200).json({
        status: true,
        message: "No Data Found",
        data: null,
      });
    }
  } catch (err) {
    res.status(403).json({
      status: "fail",
      message: err,
      data: err,
    });
    console.error("fail error!!",err);
  }
};
