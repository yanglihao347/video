import React from 'react';
import videojs from 'video.js'

class Player extends React.Component {
  componentDidMount() {
    this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
      console.log('onPlayerReady', this)
    });
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
    }
  }

  render() {
    return (
      <div>	
        <div data-vjs-player>
          <video ref={ node => this.videoNode = node } className="video-js"></video>
        </div>
      </div>
    )
  }
}

export default class abc extends React.Component {
    render() {
        const videoJsOptions = {
            autoplay: true,
            controls: false,
            sources: [{
              src: './videos/Node.js 从零开发 web server博客项目 前端晋升全栈工程师必备/第02章 nodejs 介绍/2-6 总结.mp4',
              type: 'video/mp4'
            }]
          }
        return (
            <div>
                <Player {...videoJsOptions} />
            </div>
        )
    }
}