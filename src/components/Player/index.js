import React from 'react';
import DPlayer from 'dplayer';

export default class Player extends React.Component {
  componentDidMount() {
    const dp = new DPlayer({
      container: document.getElementById('dplayer'),
      screenshot: true,
      video: {
        url: './videos/Node.js 从零开发 web server博客项目 前端晋升全栈工程师必备/第02章 nodejs 介绍/2-6 总结.mp4',
        // pic: 'demo.jpg',
        // thumbnails: 'thumbnails.jpg',
      },
      // subtitle: {
      //   url: 'webvtt.vtt',
      // },
      // danmaku: {
      //   id: 'demo',
      //   api: 'https://api.prprpr.me/dplayer/',
      // },
    });

  }

  render() {
    return ( <div>
        <div id = "dplayer"></div>
      </div>
    )
  }
}
