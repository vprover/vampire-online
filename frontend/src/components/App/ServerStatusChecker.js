import React, { Component } from 'react'
import { withSnackbar } from 'notistack';
import axios from 'axios';

const withServerStatusChecking = Component => {
  const snackbarOptions = {
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'center',
    },
    variant: 'error',
    persist: true,
    preventDuplicate: true,
  }
  return withSnackbar(class extends React.Component {

    componentDidMount() {
      axios.get(`${process.env.REACT_APP_API_HOST}/status`)
        .catch(error => {
          if (error.response) {
            this.props.enqueueSnackbar(error.response.data, snackbarOptions);
          }
          else {
            this.props.enqueueSnackbar(`The server is down! Come back later.`, snackbarOptions);
          }
        })
    }
    render() {
      return <Component {...this.props} />
    }
  });
}

export default withServerStatusChecking;