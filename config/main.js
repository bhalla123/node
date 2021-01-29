const timeSecuredUrl = 'http://localhost:3003/' ; // Local URL
module.exports = {
     
     // JWT Passport
     JWT_SECRET: 'petrolPump',

     // base Url
     baseUrl: timeSecuredUrl,

     // Image Url
     imageUrl : `${timeSecuredUrl}assets/images/`,

     // File Url
     fileUrl : `${timeSecuredUrl}uploads/vaults/`,

    // Image thumbnail Url
    thumbnailUrl : `${timeSecuredUrl}uploads/thumbnails/`,

};    
