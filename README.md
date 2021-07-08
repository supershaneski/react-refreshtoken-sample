# react-refreshtoken-sample

A sample React project to demonstrate [JWToken](https://jwt.io) authentication using [Axios](https://www.npmjs.com/package/axios) as the main workhorse for the requests and using its **[interceptor](https://www.npmjs.com/package/axios#interceptors)** feature to implement refresh token. This project only includes the client-side application.

I have made a similar project before but using `fetch` and manually implementing the interceptor part to handle refresh token.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Description

**Note: This is just to demonstrate the operation flow in a way that a beginner might understand how things work.**

The first phase involves user authentication using an *apikey* in the header logging in.

```
Accept: application/json
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
x-api-key: <YOUR-API-KEY>
...
```

If successful, the server will return the tokens - main *access token* and a *refresh token* for when the access token expires.

```
{
    token: <ACESS-TOKEN>,
    rtoken: <REFRESH-TOKEN>,
    ...
}
```

Upon receipt, the tokens will be stored in *localStorage*.
There are other ways to store the tokens received and some warns about using localStorage.
However, for the purpose of this sample project, we will use localStorage for simplicity.

After login is successfully, we can now use the access token in the authorization header every time we request something from the server.

```
Accept: application/json
Content-Type: application/json
Authorization: Bearer <YOUR-ACCESS-TOKEN>
...
````

If the access token expires, designated by receiving 401 status, the code will automatically try to get a new token using the refresh token. We will send the refresh token in the post data and use the expired access token in the Authorization header.

If successful, we will update the stored tokens and send the original request now using the updated tokens. If not successful, we will just show the original error to the user.


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
