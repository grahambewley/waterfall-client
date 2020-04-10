import React, { Component} from 'react';
import { FacebookProvider, ShareButton } from 'react-facebook';
 
export default class Example extends Component {
  render() {
    return (
      <FacebookProvider appId="218439319569862">
        <ShareButton href="https://waterfall.beer">
          Share
        </ShareButton>
      </FacebookProvider>
    );
  }
}