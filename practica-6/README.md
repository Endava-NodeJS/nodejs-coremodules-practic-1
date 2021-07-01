### File uploading

In this lesson we'll learn how to implement file uploading functionality for our API.
It will be based on the previously created API (notes CRUD + Auth + DB).

#### Here’s what we have to implement during the session:
 - Create PUT /avatar-upload authorized endpoint, that we can use to upload avatar image and store it for the related user (image should be scaled to not be more than 120px on both sides).

 - We have to validate the uploaded image, sending appropriate validation errors as a response, so the user would know which rules weren't taken into consideration while uploading the image. **Here are the validation criteria:**
    - Only image format should be received (jpg, png)
    - Image dimensions must not exceed 1200x1200 px
    - Image size must not exceed 1mb
    - Only one image should be received

 - We have to expose the uri to the avatar with other info within user object (except the password field) as a response body for GET /user

---
1) To test the implementation you have to make PUT /avatar-upload request with form data that includes "avatar" file field. (Including the Authorization header)
2) To do the GET /user request
---

#### Here are some useful links:
- You can use [Jimp](https://www.npmjs.com/package/jimp) to scale the avatar image before storing it.
- To simplify the file upload handling process you can use [Multer](https://www.npmjs.com/package/multer) .