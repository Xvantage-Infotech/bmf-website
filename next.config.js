// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' 
                https://www.google.com 
                https://www.gstatic.com 
                https://apis.google.com 
                https://www.googleapis.com;
              connect-src 'self' 
                https://*.googleapis.com 
                https://*.firebaseio.com 
                https://*.google.com;
              frame-src 'self' 
                https://*.google.com 
                https://*.firebaseapp.com;
              style-src 'self' 'unsafe-inline' 
                https://fonts.googleapis.com;
              font-src 'self' 
                https://fonts.gstatic.com;
              img-src 'self' 
                https://*.googleusercontent.com 
                data:;
            `.replace(/\n/g, '').replace(/\s+/g, ' ').trim()
          }
        ]
      }
    ]
  }
}