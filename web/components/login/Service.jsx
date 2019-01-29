import request from 'superagent';
import React from 'react';

export default class LoginService extends React.Component {
  constructor(props) {
    super(props);

    this.state = { service: location.pathname.split('/')[3] };

    this._createSession = this._createSession.bind(this);
  }

  /**
   * Check if user is logged in and linked to the service.
   */
  componentDidMount() {
    request.get('/api/service/' + this.state.service).end((err, res) => {
      if (!res.body.service) {
        location.href = '/';
      }
      // User is not logged in
      // After login user will be redirect back here
      else if (err && res.body.message == 'Not logged in') {
        location.replace(
          '/login?serviceName=' +
            encodeURIComponent(res.body.service.name) +
            '&serviceUrl=' +
            encodeURIComponent(res.body.service.url)
        );
      }
      // Create session
      else if (err && res.body.message.indexOf('already linked') > -1) {
        this._createSession();
      }
      // User hasn't linked service yet
      else {
        location.href = '/register/service/' + this.state.service;
      }
    });
  }

  /**
   * Creates a session linked to the user and service. Redirect the user to
   * the service's login route.
   */
  _createSession() {
    request
      .post(`/api/service/${this.state.service}/session`)
      .end((err, res) => !err && location.replace(res.body.redirect));
  }

  render() {
    return null;
  }
}